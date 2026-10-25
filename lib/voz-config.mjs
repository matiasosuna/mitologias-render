// Qué voz usa motor-narrar.mjs y con qué binario de Modal, tanto en la Mac como en la nube (Linux, sin `say` ni .venv).
// Funciones puras (se prueban en test/voz-config.test.mjs).

/** Lee un .env (texto) a objeto. */
export const leerEnv = (texto = '') => Object.fromEntries(texto.split('\n').filter((l) => l.includes('=') && !l.trimStart().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));

/** El entorno del proceso manda sobre el .env (en la nube no hay .env). */
export const variable = (nombre, env = {}, dotenv = {}) => env[nombre] ?? dotenv[nombre];

/** Inglés con Chatterbox (Modal) si VOZ_EN=chatterbox. */
export const usaChatterbox = (env, dotenv) => variable('VOZ_EN', env, dotenv) === 'chatterbox';

/** Binario de Modal: MODAL_BIN, si no .venv/bin/modal (Mac), si no `modal` del PATH (nube). */
export function binModal(env = {}, existe = () => false) {
  if (env.MODAL_BIN) return env.MODAL_BIN;
  return existe('.venv/bin/modal') ? '.venv/bin/modal' : 'modal';
}

/** Motor para un idioma: chatterbox | eleven | say. `say` solo existe en macOS: en otro sistema, error claro. */
export function motorDeVoz(idioma, { chatter, eleven, plataforma }) {
  if (idioma === 'en' && chatter) return 'chatterbox';
  if (idioma === 'en' && eleven) return 'eleven';
  if (plataforma !== 'darwin') throw new Error(`sin voz para "${idioma}" en ${plataforma}: la voz de macOS (say) no existe acá. Narrá solo en inglés con VOZ_EN=chatterbox (node scripts/motor-narrar.mjs <id> en).`);
  return 'say';
}

/** Dónde corre Chatterbox: 'github' (CPU del repo público, gratis; por defecto desde 2026-10-25) o 'modal' (GPU, crédito). */
export const dondeChatterbox = (env, dotenv) => (variable('VOZ_MOTOR', env, dotenv) === 'modal' ? 'modal' : 'github');
