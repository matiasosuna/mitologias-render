// Instagram por Buffer: la entrada de createPost, el anti-duplicados por 1.ª línea y la elección de la vía.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entradaReel, buscarPorPrimeraLinea, postsDelCanal, igPorBuffer, esperarEnvio, CANAL_IG, CANAL_TIKTOK, ORG } from '../scripts/buffer.mjs';

const URL = 'https://github.com/matiasosuna/mitologias-render/releases/download/media/x.parte-1.mp4';

test('parte de episodio: Reel a la grilla, publica ya, tapa por cuadro', () => {
  const e = entradaReel({ texto: 'Línea 1\n\nresto', videoUrl: URL, thumbOffset: 1000, alFeed: true });
  assert.deepEqual(e, {
    channelId: CANAL_IG, text: 'Línea 1\n\nresto', schedulingType: 'automatic', mode: 'shareNow',
    assets: [{ video: { url: URL, metadata: { thumbnailOffset: 1000 } } }],
    metadata: { instagram: { type: 'reel', shouldShareToFeed: true } },
  });
});

test('Short: solo pestaña Reels; nunca thumbnailUrl (Buffer lo rechaza)', () => {
  const e = entradaReel({ texto: 't', videoUrl: URL, thumbOffset: 1500, alFeed: false });
  assert.equal(e.metadata.instagram.shouldShareToFeed, false);
  assert.equal(e.assets[0].video.thumbnailUrl, undefined);
  assert.equal(e.assets[0].video.metadata.thumbnailOffset, 1500);
});

test('borrador: saveToDraft sin shareNow', () => {
  const e = entradaReel({ texto: 't', videoUrl: URL, alFeed: true, borrador: true });
  assert.equal(e.saveToDraft, true);
  assert.notEqual(e.mode, 'shareNow');
  assert.equal(e.assets[0].video.metadata, undefined);
});

test('solo el canal de Instagram; sin texto o video no arma nada', () => {
  assert.throws(() => entradaReel({ texto: 't', videoUrl: URL, canal: CANAL_TIKTOK }));
  assert.throws(() => entradaReel({ texto: '', videoUrl: URL }));
  assert.throws(() => entradaReel({ texto: 't', videoUrl: '' }));
});

test('anti-duplicados: por 1.ª línea, solo posts vivos (no borradores ni errores)', () => {
  const posts = [
    { id: 'a', status: 'draft', text: 'Hola 🏺\n\nx' },
    { id: 'b', status: 'error', text: 'Hola 🏺\n\ny' },
    { id: 'c', status: 'sending', text: 'Hola 🏺\n\nz' },
  ];
  assert.equal(buscarPorPrimeraLinea(posts, (l) => l === 'Hola 🏺').id, 'c');
  assert.equal(buscarPorPrimeraLinea(posts.slice(0, 2), (l) => l === 'Hola 🏺'), undefined);
  assert.equal(buscarPorPrimeraLinea([{ id: 'd', status: 'sent', text: 'Otra' }], (l) => l === 'Hola 🏺'), undefined);
});

test('posts del canal: pagina, filtra por canal y deja afuera borradores', async () => {
  const pedidos = [];
  const gql = async (_q, v) => {
    pedidos.push(v);
    return v.after ? { posts: { edges: [{ node: { id: '2', status: 'scheduled' } }, { node: { id: '3', status: 'draft' } }], pageInfo: { hasNextPage: false } } }
      : { posts: { edges: [{ node: { id: '1', status: 'sent' } }], pageInfo: { hasNextPage: true, endCursor: 'c1' } } };
  };
  const p = await postsDelCanal(gql);
  assert.deepEqual(p.map((x) => x.id), ['1', '2']);
  assert.equal(pedidos[1].after, 'c1');
  assert.equal(pedidos[0].input.organizationId, ORG);
  assert.deepEqual(pedidos[0].input.filter.channelIds, [CANAL_IG]);
  assert.equal(pedidos[0].input.filter.status, undefined); // con needs_approval Buffer devuelve vacío
});

test('vía: IG_VIA manda; sin IG_VIA, Buffer si la clave de Meta falta o es inválida', async () => {
  const ok = async () => ({ json: async () => ({ id: '1' }) }), mal = async () => ({ json: async () => ({ error: { code: 190 } }) });
  const meta = { MOC_PAGE_TOKEN: 't', MOC_IG_USER_ID: '1' };
  assert.equal(await igPorBuffer(meta, { IG_VIA: 'buffer' }, ok), true);
  assert.equal(await igPorBuffer({}, { IG_VIA: 'graph' }, mal), false);
  assert.equal(await igPorBuffer({}, {}, ok), true);
  assert.equal(await igPorBuffer(meta, {}, ok), false);
  assert.equal(await igPorBuffer(meta, {}, mal), true);
});

test('esperar envío: sigue hasta sent; error → excepción', async () => {
  const estados = ['sending', 'sent'];
  const gql = async () => ({ post: { id: 'p', status: estados.shift(), externalLink: 'https://www.instagram.com/reel/x/' } });
  const p = await esperarEnvio(gql, { id: 'p', status: 'sending' }, { pausa: 0 });
  assert.equal(p.status, 'sent');
  await assert.rejects(esperarEnvio(async () => ({ post: { id: 'p', status: 'error', error: { message: 'no' } } }), { id: 'p', status: 'sending' }, { pausa: 0 }), /no/);
});
