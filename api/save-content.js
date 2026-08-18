// POST /api/save-content
// Body: { password: string, content: object }
// Validates the editor password, backs up the CURRENT content.json into
// content.backup.json (see _github.js), then commits the updated
// content.json straight to GitHub via the Contents API. Vercel's Git
// integration picks up the new commit and redeploys automatically.
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

  const { password, content } = req.body || {};

  if (!process.env.EDITOR_PASSWORD) {
    res.status(500).json({ error: 'EDITOR_PASSWORD não configurada no servidor.' });
    return;
  }
  if (!password || password !== process.env.EDITOR_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta.' });
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
    const commitSha = await saveWithBackup('content.json', content, `Editor: atualiza textos do guia (${new Date().toISOString()})`);
    res.status(200).json({ ok: true, commit: commitSha });
  } catch (err) {
    res.status(500).json({ error: 'Erro inesperado: ' + (err && err.message) });
  }
};
