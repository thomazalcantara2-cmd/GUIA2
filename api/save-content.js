// POST /api/save-content
// Body: { password: string, content: object }
// Validates the editor password, then commits the updated content.json
// straight to GitHub via the Contents API. Vercel's Git integration picks
// up the new commit and redeploys automatically.
//
// Required environment variables (set in Vercel → Settings → Environment
// Variables — NEVER hard-code these in the repo):
//   EDITOR_PASSWORD   the password the editor UI must send
//   GITHUB_TOKEN      fine-grained PAT, Contents: Read and write, on this repo only
// Optional (defaults match this project):
//   GITHUB_OWNER      default "thomazalcantara2-cmd"
//   GITHUB_REPO       default "GUIA2"
//   GITHUB_BRANCH     default "claude/ecstatic-brown-4u7bma"

const OWNER = process.env.GITHUB_OWNER || 'thomazalcantara2-cmd';
const REPO = process.env.GITHUB_REPO || 'GUIA2';
const BRANCH = process.env.GITHUB_BRANCH || 'claude/ecstatic-brown-4u7bma';
const FILE_PATH = 'content.json';

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

  const apiBase = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    // 1) Get current file sha (required by GitHub to update an existing file).
    const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(BRANCH)}`, { headers: ghHeaders });
    if (!getRes.ok) {
      const t = await getRes.text();
      res.status(502).json({ error: `Falha ao ler content.json no GitHub: ${getRes.status} ${t}` });
      return;
    }
    const getData = await getRes.json();
    const sha = getData.sha;

    // 2) Commit the updated content.
    const jsonStr = JSON.stringify(content, null, 2);
    const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Editor: atualiza textos do guia (${new Date().toISOString()})`,
        content: base64Content,
        sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) {
      const t = await putRes.text();
      res.status(502).json({ error: `Falha ao salvar no GitHub: ${putRes.status} ${t}` });
      return;
    }

    const putData = await putRes.json();
    res.status(200).json({ ok: true, commit: putData.commit && putData.commit.sha });
  } catch (err) {
    res.status(500).json({ error: 'Erro inesperado: ' + (err && err.message) });
  }
};
