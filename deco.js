// Decorações tropicais SVG reutilizáveis (palmeiras, folhas, sol, ondas)
// Carregadas inline para serem coloríveis via currentColor.

window.Deco = {
  // Folha de monstera estilizada
  monstera: (props = {}) => `<svg viewBox="0 0 120 120" fill="none" ${attrs(props)}>
    <path d="M60 8c-22 4-40 24-40 50 0 26 18 46 40 50 22-4 40-24 40-50 0-26-18-46-40-50z" fill="currentColor" opacity=".18"/>
    <path d="M60 14c-18 0-34 16-34 38 0 12 6 24 14 32-6-10-8-22-4-34 6-2 12 0 16 6-2-10 4-20 14-22-2 8 4 16 12 18-8-2-14 4-12 12 8-4 18 0 22 10-2-22-18-40-28-60z" fill="currentColor"/>
    <path d="M60 14v100" stroke="currentColor" stroke-width="1.2" opacity=".5"/>
  </svg>`,

  // Folha de palmeira
  palm: (props = {}) => `<svg viewBox="0 0 140 140" fill="none" ${attrs(props)}>
    <g fill="currentColor">
      <path d="M70 130c-2-30-2-60 0-86 8 8 14 18 18 30-2-12-6-22-12-30 14 4 26 14 32 28-4-14-12-26-22-32 14-2 30 4 38 16-6-12-18-22-32-26 12-8 28-10 42-4-12-8-26-12-40-10 8-12 22-20 36-22-14-2-30 4-40 14-2-14 4-30 16-40-14 6-24 20-26 36-8-12-22-20-38-22 14 6 26 18 30 32-12-6-26-6-38 0 12-2 24 0 34 6-12 4-22 14-26 26 8-10 20-16 32-16-10 8-16 18-18 30 4-12 12-22 22-28-4 14-2 30 4 42-4-14-2-30 4-42v86h-8c2 0 4 2 4 4s-2 4-4 4h20c-2 0-4-2-4-4s2-4 4-4h-6z"/>
    </g>
  </svg>`,

  // Folha simples (banana / philodendron)
  leaf: (props = {}) => `<svg viewBox="0 0 80 120" fill="none" ${attrs(props)}>
    <path d="M40 8c-22 16-32 40-32 60s10 36 32 44c22-8 32-24 32-44s-10-44-32-60z" fill="currentColor"/>
    <path d="M40 12v100M40 30c-8 4-14 12-18 22M40 30c8 4 14 12 18 22M40 56c-10 4-18 14-22 26M40 56c10 4 18 14 22 26M40 80c-8 4-14 10-16 18M40 80c8 4 14 10 16 18" stroke="rgba(255,255,255,.45)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  </svg>`,

  // Sol estilizado
  sun: (props = {}) => `<svg viewBox="0 0 120 120" fill="none" ${attrs(props)}>
    <circle cx="60" cy="60" r="22" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <path d="M60 16v12M60 92v12M16 60h12M92 60h12M28 28l9 9M83 83l9 9M28 92l9-9M83 37l9-9"/>
    </g>
  </svg>`,

  // Onda
  wave: (props = {}) => `<svg viewBox="0 0 200 40" fill="none" ${attrs(props)}>
    <path d="M0 20 Q 25 0, 50 20 T 100 20 T 150 20 T 200 20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M0 32 Q 25 12, 50 32 T 100 32 T 150 32 T 200 32" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
  </svg>`,

  // Coração
  heart: (props = {}) => `<svg viewBox="0 0 24 24" fill="currentColor" ${attrs(props)}>
    <path d="M12 21s-7-4.5-9.5-9C.8 9 1.5 5 5 4c2.3-.7 4.5.5 6 2.5C12.5 4.5 14.7 3.3 17 4c3.5 1 4.2 5 2.5 8-2.5 4.5-9.5 9-9.5 9z"/>
  </svg>`,

  // Estrela (avaliação)
  star: (props = {}) => `<svg viewBox="0 0 24 24" fill="currentColor" ${attrs(props)}>
    <path d="M12 2l2.9 6.7 7.1.7-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.4l7.1-.7L12 2z"/>
  </svg>`,

  // Hibisco / flor tropical
  flower: (props = {}) => `<svg viewBox="0 0 80 80" fill="none" ${attrs(props)}>
    <g fill="currentColor">
      <ellipse cx="40" cy="20" rx="11" ry="16"/>
      <ellipse cx="40" cy="60" rx="11" ry="16"/>
      <ellipse cx="20" cy="40" rx="16" ry="11"/>
      <ellipse cx="60" cy="40" rx="16" ry="11"/>
    </g>
    <circle cx="40" cy="40" r="9" fill="#F4C430"/>
    <circle cx="40" cy="40" r="4" fill="#1F2D3D"/>
  </svg>`,

  // Casa
  home: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" ${attrs(props)}>
    <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11z"/>
  </svg>`,

  wifi: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ${attrs(props)}>
    <path d="M2 9c5.5-5.5 14.5-5.5 20 0M5 12c4-4 10-4 14 0M8 15c2.5-2.5 5.5-2.5 8 0"/>
    <circle cx="12" cy="19" r="1.4" fill="currentColor"/>
  </svg>`,

  key: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" ${attrs(props)}>
    <circle cx="8" cy="15" r="4"/>
    <path d="M11 12l9-9M16 7l3 3M14 9l3 3"/>
  </svg>`,

  pin: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" ${attrs(props)}>
    <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>`,

  phone: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" ${attrs(props)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z"/>
  </svg>`,

  fork: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${attrs(props)}>
    <path d="M6 2v8a3 3 0 0 0 6 0V2M9 13v9M16 2c-2 0-3 2-3 5s1 5 3 5v10"/>
  </svg>`,

  car: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${attrs(props)}>
    <path d="M5 13l1.7-5a2 2 0 0 1 1.9-1.4h6.8a2 2 0 0 1 1.9 1.4L19 13"/>
    <path d="M3 17v-3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v2h-2v-2H7v2H5v-2H4a1 1 0 0 1-1-1z"/>
    <circle cx="7.5" cy="15.5" r="1" fill="currentColor"/>
    <circle cx="16.5" cy="15.5" r="1" fill="currentColor"/>
  </svg>`,

  sparkle: (props = {}) => `<svg viewBox="0 0 24 24" fill="currentColor" ${attrs(props)}>
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/>
  </svg>`,

  alert: (props = {}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${attrs(props)}>
    <path d="M12 2L1 22h22L12 2z"/>
    <path d="M12 9v5M12 18v.5"/>
  </svg>`,
};

function attrs(p) {
  return Object.entries(p).map(([k,v]) => `${k}="${v}"`).join(' ');
}
