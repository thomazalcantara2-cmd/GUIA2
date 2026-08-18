// POST /api/translate
// Body: { text: string, target: 'EN-US' | 'ES', source?: 'PT' }
// Thin proxy to DeepL's translation API — kept server-side so the API key
// never reaches the browser. Used by /editor.html to auto-fill EN/ES
// whenever the Portuguese text of an editable span changes.
//
// Required environment variable (set in Vercel → Settings → Environment
// Variables — NEVER hard-code it in the repo):
//   DEEPL_API_KEY   from deepl.com/pro-api. Free-tier keys end in ":fx"
//                   and use a different host — detected automatically.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text, target, source } = req.body || {};

  if (!process.env.DEEPL_API_KEY) {
    res.status(500).json({ error: 'DEEPL_API_KEY não configurada no servidor.' });
    return;
  }
  if (!text || typeof text !== 'string' || !target) {
    res.status(400).json({ error: 'Parâmetros inválidos.' });
    return;
  }

  const key = process.env.DEEPL_API_KEY;
  const base = key.trim().endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';

  try {
    const params = new URLSearchParams();
    params.set('text', text);
    params.set('target_lang', target);
    if (source) params.set('source_lang', source);
    // Keeps the <b> tags added by the editor's Bold button in place
    // instead of DeepL mangling or dropping them.
    params.set('tag_handling', 'xml');

    const r = await fetch(base + '/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: 'DeepL-Auth-Key ' + key,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(502).json({ error: `DeepL ${r.status}: ${t}` });
      return;
    }

    const data = await r.json();
    const translated = data.translations && data.translations[0] && data.translations[0].text;
    res.status(200).json({ text: translated || '' });
  } catch (err) {
    res.status(500).json({ error: 'Erro inesperado: ' + (err && err.message) });
  }
};
