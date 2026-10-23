// Marca un capítulo de la Biblia como revisado: VERIFICADO = huella del guion+timeline actuales (nube.mjs › verificadoVigente).
// Si después cambia el guion o el timeline, la marca deja de valer y el capítulo no sale hasta volver a correr esto.
//   node scripts/verificado.mjs <id> [<id>…]
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { huella } from './nube.mjs';

for (const id of process.argv.slice(2)) { writeFileSync(join('src/videos', id, 'VERIFICADO'), huella(id) + '\n'); console.log(`${id}: VERIFICADO ${huella(id)}`); }
