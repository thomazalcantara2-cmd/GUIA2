// POST /api/save-restaurants
// Body: { password: string, restaurants: array, content: object }
// Same auth/commit pattern as save-content.js, but writes two files —
// restaurants.json (the "Onde Comer?" card list: photo, map, order) and
// content.json (the translatable text those cards reference by eid) —
// so /editor.html can add, edit or remove a restaurant in one save.
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

async function commitFile(path, jsonValue, ghHeaders) {
  const apiBase = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

  const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(BRANCH)}`, { headers: ghHeaders });
  if (!getRes.ok) {
    const t = await getRes.text();
    throw new Error(`Falha ao ler ${path} no GitHub: ${getRes.status} ${t}`);
  }
  const getData = await getRes.json();
  const sha = getData.sha;

  const jsonStr = JSON.stringify(jsonValue, null, 2);
  const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Editor: atualiza restaurantes (${new Date().toISOString()})`,
      content: base64Content,
      sha,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    const t = await putRes.text();
    throw new Error(`Falha ao salvar ${path} no GitHub: ${putRes.status} ${t}`);
  }

  const putData = await putRes.json();
  return putData.commit && putData.commit.sha;
}

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

  const ghHeaders = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    // content.json first: if this succeeds but restaurants.json fails, the
    // worst case is a handful of unused text entries — never a broken page.
    await commitFile('content.json', content, ghHeaders);
    const commitSha = await commitFile('restaurants.json', restaurants, ghHeaders);
    res.status(200).json({ ok: true, commit: commitSha });
  } catch (err) {
    res.status(500).json({ error: 'Erro inesperado: ' + (err && err.message) });
  }
};
