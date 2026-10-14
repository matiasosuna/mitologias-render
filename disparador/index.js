// Disparador del workflow `publicar` (GitHub saltea muchos crons programados): Cloudflare Cron Trigger cada hora
// llama a workflow_dispatch. El workflow decide qué toca en el turno y nunca repite lo ya hecho (scripts/nube.mjs).
export default {
  async scheduled(_evento, env) {
    const r = await fetch('https://api.github.com/repos/matiasosuna/mitologias-render/actions/workflows/publicar.yml/dispatches', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'moc-disparador', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: 'main' }),
    });
    if (r.status !== 204) throw new Error(`dispatch ${r.status} ${await r.text()}`);
  },
};
