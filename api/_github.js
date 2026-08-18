// Shared GitHub Contents API helpers used by every /api/save-* endpoint.
//
// Required environment variables (set in Vercel → Settings → Environment
// Variables — NEVER hard-code these in the repo):
//   GITHUB_TOKEN      fine-grained PAT, Contents: Read and write, on this repo only
// Optional (defaults match this project):
//   GITHUB_OWNER      default "thomazalcantara2-cmd"
//   GITHUB_REPO       default "GUIA2"
//   GITHUB_BRANCH     default "claude/ecstatic-brown-4u7bma"

const OWNER = process.env.GITHUB_OWNER || 'thomazalcantara2-cmd';
const REPO = process.env.GITHUB_REPO || 'GUIA2';
const BRANCH = process.env.GITHUB_BRANCH || 'claude/ecstatic-brown-4u7bma';

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function apiBaseFor(path) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
}

// Returns { sha, json } for an existing file, or null if it doesn't exist
// (404) — anything else (auth, network…) still throws.
async function getFile(path) {
  const res = await fetch(`${apiBaseFor(path)}?ref=${encodeURIComponent(BRANCH)}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Falha ao ler ${path} no GitHub: ${res.status} ${t}`);
  }
  const data = await res.json();
  const text = Buffer.from(data.content, 'base64').toString('utf-8');
  return { sha: data.sha, json: JSON.parse(text) };
}

// Creates or updates `path`. Pass `sha` from a prior getFile() when
// updating an existing file; omit it to create a new one.
async function putFile(path, jsonValue, message, sha) {
  const jsonStr = JSON.stringify(jsonValue, null, 2);
  const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');
  const body = { message, content: base64Content, branch: BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(apiBaseFor(path), {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Falha ao salvar ${path} no GitHub: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data.commit && data.commit.sha;
}

// Backs up whatever is CURRENTLY live at `path` into a sibling
// "<name>.backup.<ext>" file, then commits `newValue` to `path` itself.
// Used by every save endpoint so the editor's "Restaurar versão anterior"
// button always has a real, persisted (not just in-memory) copy of what
// was there right before the most recent save — it survives closing and
// reopening the editor, since it lives in the repo, not the browser tab.
async function saveWithBackup(path, newValue, message) {
  const backupPath = path.replace(/(\.[^./]+)$/, '.backup$1');
  const [current, existingBackup] = await Promise.all([
    getFile(path),
    getFile(backupPath),
  ]);
  if (current) {
    await putFile(backupPath, current.json, `Backup automático antes de: ${message}`, existingBackup ? existingBackup.sha : undefined);
  }
  return putFile(path, newValue, message, current ? current.sha : undefined);
}

module.exports = { OWNER, REPO, BRANCH, ghHeaders, getFile, putFile, saveWithBackup };
