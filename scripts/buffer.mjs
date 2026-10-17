// Cliente de la API GraphQL de Buffer (api.buffer.com) para publicar en Instagram sin la Graph API de Meta.
// Desde 2026-10-15 @mythsonclay está conectado a Buffer por Instagram Login (sin Facebook): la clave de página de Meta
// (MOC_PAGE_TOKEN) quedó invalidada por el bloqueo de la cuenta de Facebook.
// Lo usan scripts/instagram-reels.mjs (partes de episodio, a la grilla) e instagram-shorts.mjs (Shorts, solo Reels).
// Elegir la vía: IG_VIA=buffer | graph; sin IG_VIA, Buffer si la clave de Meta falta o no es válida.

export const ORG = '6acc932a96c596c8b8c17194';
export const CANAL_IG = '6ad1da90778b240e2f266bfc'; // instagram: mythsonclay
export const CANAL_TIKTOK = '6acc93d8778b240e2fe40471'; // tiktok: mythsonclay (el otro TikTok de la cuenta NO es de este proyecto)
export const CANALES_AJENOS = ['6ad12860778b240e2f1d9c4e', '6ad3219a778b240e2f368ecb']; // tiktok: matias.osuna2 y hermestarot444 — NUNCA
/** Estados de Buffer que cuentan como "ya está o va a estar en Instagram" (un borrador o un error no). */
export const ESTADOS_VIVOS = ['sent', 'sending', 'scheduled', 'needs_approval'];

export function cliente(clave, fetchFn = fetch) {
  if (!clave) throw new Error('falta BUFFER_API_KEY');
  return async (query, variables) => {
    const r = await fetchFn('https://api.buffer.com', { method: 'POST', headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
    const j = await r.json();
    if (j.errors) throw new Error(`Buffer: ${JSON.stringify(j.errors).slice(0, 300)}`);
    return j.data;
  };
}

export const primeraDe = (texto) => String(texto ?? '').split('\n')[0];

/** Entrada de createPost para un Reel. alFeed: también en la grilla (partes de episodio) o solo en la pestaña Reels (Shorts).
 *  Tapa = el cuadro en `thumbOffset` ms (Buffer rechaza thumbnailUrl: las redes no aceptan una imagen de tapa propia).
 *  borrador: solo valida (saveToDraft, no publica). */
export function entradaReel({ texto, videoUrl, thumbOffset, alFeed, borrador = false, canal = CANAL_IG }) {
  if (!texto || !videoUrl) throw new Error('falta texto o video');
  if (canal !== CANAL_IG) throw new Error(`canal de Instagram inesperado: ${canal}`);
  const video = { url: videoUrl, ...(thumbOffset != null ? { metadata: { thumbnailOffset: thumbOffset } } : {}) };
  return {
    channelId: canal, text: texto, schedulingType: 'automatic',
    mode: borrador ? 'addToQueue' : 'shareNow', ...(borrador ? { saveToDraft: true } : {}),
    assets: [{ video }],
    metadata: { instagram: { type: 'reel', shouldShareToFeed: Boolean(alFeed) } },
  };
}

/** Entrada de createPost para TikTok: publica ya, tapa = primer cuadro (la portada va pegada adelante del video).
 *  Solo el canal de Myths on Clay: cualquier otro (matias.osuna2…) es un error. */
export function entradaTiktok({ texto, videoUrl, canal = CANAL_TIKTOK, thumbOffset = 100 }) {
  if (!texto || !videoUrl) throw new Error('falta texto o video');
  if (canal !== CANAL_TIKTOK || CANALES_AJENOS.includes(canal)) throw new Error(`canal de TikTok inesperado: ${canal}`);
  return { channelId: canal, text: texto, schedulingType: 'automatic', mode: 'shareNow', assets: [{ video: { url: videoUrl, metadata: { thumbnailOffset: thumbOffset } } }] };
}
/** ¿El rechazo es por límite / demasiadas publicaciones? (entonces TikTok frena a 2 por turno) */
export const esLimite = (mensaje) => /limit|too many|rate|quota|exceed|spam|frequen|daily|maximum/i.test(String(mensaje ?? ''));

const CAMPOS = 'id status text dueAt sentAt externalLink error { message }';
const CREAR = `mutation($input: CreatePostInput!) { createPost(input: $input) { ... on PostActionSuccess { post { ${CAMPOS} } } ... on MutationError { message } } }`;
const UNO = `query($input: PostInput!) { post(input: $input) { ${CAMPOS} } }`;
const BORRAR = 'mutation($input: DeletePostInput!) { deletePost(input: $input) { ... on DeletePostSuccess { id } ... on MutationError { message } } }';
const LISTA = `query($input: PostsInput!, $after: String) { posts(first: 100, after: $after, input: $input) { edges { node { ${CAMPOS} } } pageInfo { hasNextPage endCursor } } }`;

/** Posts del canal (por defecto: publicados, publicándose o en cola). El estado se filtra acá: el filtro `status` de
 *  Buffer devuelve vacío si incluye needs_approval. */
export async function postsDelCanal(gql, { canal = CANAL_IG, estados = ESTADOS_VIVOS, paginas = 20 } = {}) {
  const out = []; let after = null;
  for (let i = 0; i < paginas; i++) {
    const d = await gql(LISTA, { after, input: { organizationId: ORG, filter: { channelIds: [canal] } } });
    out.push(...(d.posts.edges ?? []).map((e) => e.node));
    if (!d.posts.pageInfo?.hasNextPage) break;
    after = d.posts.pageInfo.endCursor;
  }
  return out.filter((p) => estados.includes(p.status));
}
/** El primer post vivo del canal cuya 1.ª línea cumple `esIgual`. */
export const buscarPorPrimeraLinea = (posts, esIgual) => posts.find((p) => ESTADOS_VIVOS.includes(p.status) && esIgual(primeraDe(p.text)));

export async function crear(gql, input) {
  const p = (await gql(CREAR, { input })).createPost;
  if (!p?.post) throw new Error(`Buffer createPost: ${p?.message ?? 'sin respuesta'}`);
  return p.post;
}
export const leer = async (gql, id) => (await gql(UNO, { input: { id } })).post;
export async function borrar(gql, id) {
  const r = (await gql(BORRAR, { input: { id } })).deletePost;
  if (!r?.id) throw new Error(`Buffer deletePost: ${r?.message ?? 'sin respuesta'}`);
  return r.id;
}
/** Espera a que Buffer termine de mandarlo. Devuelve el post (status sent, o sending si se acabó el tiempo); error → excepción. */
export async function esperarEnvio(gql, post, { intentos = 40, pausa = 15000 } = {}) {
  let p = post;
  for (let i = 0; i < intentos && p.status !== 'sent'; i++) {
    if (p.status === 'error') throw new Error(`Buffer no pudo publicar: ${p.error?.message ?? 'error'}`);
    await new Promise((r) => setTimeout(r, pausa));
    p = await leer(gql, p.id);
  }
  if (p.status === 'error') throw new Error(`Buffer no pudo publicar: ${p.error?.message ?? 'error'}`);
  return p;
}

/** ¿Publicar Instagram por Buffer? IG_VIA manda; si no, Buffer cuando la clave de Meta falta o Meta la rechaza. */
export async function igPorBuffer(env, procEnv = process.env, fetchFn = fetch) {
  const via = (procEnv.IG_VIA ?? env.IG_VIA ?? '').toLowerCase();
  if (via === 'buffer') return true;
  if (via === 'graph') return false;
  if (!env.MOC_PAGE_TOKEN || !env.MOC_IG_USER_ID) return true;
  try {
    const r = await fetchFn(`https://graph.facebook.com/v21.0/${env.MOC_IG_USER_ID}?${new URLSearchParams({ fields: 'id', access_token: env.MOC_PAGE_TOKEN })}`);
    const j = await r.json();
    return Boolean(j.error);
  } catch { return true; }
}
