import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// La subida por pedazos (rupload, instagram.mjs) nunca anduvo en GitHub Actions: los Shorts van por video_url del release.
test('Shorts a Instagram: por URL del release, solo pestaña Reels, sin subida por pedazos', () => {
  const s = readFileSync('scripts/instagram-shorts.mjs', 'utf8');
  assert.match(s, /publicarUrl\(archivo, rel\.nombreAsset\(id, 'short'\)\)/);
  assert.match(s, /video_url: videoUrl/);
  assert.match(s, /share_to_feed: 'false'/);
  assert.doesNotMatch(s, /'scripts\/instagram\.mjs'|upload_type/);
});
