// POST /api/save-restaurants
// Body: { password: string, restaurants: array, content: object }
// Same auth pattern as save-content.js, but writes two files —
// restaurants.json (the "Onde Comer?" card list: photo, map, order) and
// content.json (the translatable text those cards reference by eid) —
// so /editor.html can add, edit or remove a restaurant in one save. Each
// file is backed up (content.backup.json / restaurants.backup.json)
// before being overwritten — see _github.js — which is also what the
// editor's "Restaurar versão anterior" reads from.
//
// Required environment variables (set in Vercel → Settings → Environment
// Variables — NEVER hard-code these in the repo):
//   EDITOR_PASSWORD   the password the editor UI must send
//   GITHUB_TOKEN      fine-grained PAT, Contents: Read and write, on this repo only

const { saveWithBackup } = require('./_github');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password, restaurants, content } = req.body || {};

  if (!process.env.EDITOR_PASSWORD) {
    res.status(500).json({ error: 'EDITOR_PASSWORD não configurada no servidor.' });
    return;
  }
  if (!password || password !== process.env.EDITOR_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta.' });
    return;
  }
  if (!Array.isArray(restaurants)) {
    res.status(400).json({ error: 'Lista de restaurantes inválida.' });
    return;
  }
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    res.status(400).json({ error: 'Conteúdo inválido.' });
    return;
  }
  if (!process.env.GITHUB_TOKEN) {
    res.status(500).json({ error: 'GITHUB_TOKEN não configurado no servidor.' });
    return;
  }

  try {
    const ts = new Date().toISOString();
    // content.json first: if this succeeds but restaurants.json fails, the
    // worst case is a handful of unused text entries — never a broken page.
    await saveWithBackup('content.json', content, `Editor: atualiza restaurantes (${ts})`);
    const commitSha = await saveWithBackup('restaurants.json', restaurants, `Editor: atualiza restaurantes (${ts})`);
    res.status(200).json({ ok: true, commit: commitSha });
  } catch (err) {
    res.status(500).json({ error: 'Erro inesperado: ' + (err && err.message) });
  }
};
