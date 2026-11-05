import { tokens, logos } from './logos.js';

export { tokens };

const choices = {
  purpose: ['login', 'continue', 'signup', 'short'], lang: ['ko', 'en'],
  tone: ['brand', 'white', 'black', 'custom'], theme: ['light', 'dark'],
  font: ['unified', 'brand'], logoColor: ['brand', 'mono'],
  layout: ['full', 'icon'], align: ['center', 'logo-left'], type: ['button', 'submit'],
};
const defaults = {
  purpose: 'continue', lang: 'ko', tone: 'brand', theme: 'light', corner: 'official',
  height: 48, font: 'unified', logoColor: 'brand', layout: 'full', align: 'center', type: 'button',
};
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const color = value => {
  if (typeof value !== 'string' || value.length !== 7 || !/^#[\da-f]{6}$/i.test(value)) throw new TypeError('Expected #RRGGBB color');
  return value.toUpperCase();
};
const luminance = hex => {
  const channels = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

export function renderButton(options = {}) {
  const o = { ...defaults, ...options };
  if (!Object.hasOwn(tokens.providers, o.provider)) throw new TypeError('Invalid provider');
  for (const [key, values] of Object.entries(choices)) {
    if (!values.includes(o[key])) throw new TypeError(`Invalid ${key}`);
  }
  const p = tokens.providers[o.provider];
  const h = o.height === 'official' ? (p.officialHeight.web ?? p.officialHeight) : o.height;
  if (typeof h !== 'number' || !Number.isFinite(h) || h <= 0) {
    throw new TypeError('Height must be a positive finite number');
  }
  const corner = ['0', '4', '8', '12'].includes(o.corner) ? Number(o.corner) : o.corner;
  if (!['official', 0, 4, 8, 12, 'pill'].includes(corner)) throw new TypeError('Invalid corner');
  const r = corner === 'official' ? p.officialRadius : corner === 'pill' ? h / 2 : corner;
  const fs = o.font === 'unified' ? Math.max(14, Math.round(h / 3))
    : p.officialFont.size ?? Math.round(h * p.officialFont.sizeRatio);
  const fw = o.font === 'unified' ? 500 : p.officialFont.weight;
  let bg, fg, bd;
  if (o.tone === 'custom') {
    bg = color(o.bg); fg = color(o.fg);
    const a = luminance(bg), b = o.theme === 'light' ? 1 : 0;
    bd = o.border != null ? color(o.border)
      : (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) < 1.3
        ? (o.theme === 'light' ? '#DADCE0' : '#3A3A3A') : 'transparent';
  } else {
    const palette = o.tone === 'brand' ? p.brand[o.theme] : tokens.tone[o.tone][o.theme];
    bg = color(palette.bg); fg = color(palette.fg); bd = palette.border ? color(palette.border) : 'transparent';
  }
  let logo = fg;
  if (o.logoColor === 'brand') {
    const tone = o.tone === 'custom' ? (luminance(bg) > 0.5 ? 'white' : 'black') : o.tone;
    const candidate = tone === 'brand' ? p.brand[o.theme].logo : tokens.tone.brandLogoOnTone[o.provider][tone];
    if (candidate && candidate !== 'full-color') logo = color(candidate);
  }
  const label = p.label[o.lang][o.purpose];
  const classes = ['slb', `slb--${o.provider}`, `slb--tone-${o.tone}`, `slb--${o.theme}`, `slb--${o.layout}`, `slb--${o.align}`];
  if (o.logoColor === 'mono') classes.push('slb--logo-mono');
  const style = `--slb-h:${h}px;--slb-r:${r}px;--slb-fs:${fs}px;--slb-fw:${fw};--slb-bg:${bg};--slb-fg:${fg};--slb-bd:${bd};--slb-logo:${logo}`;
  let extra = '';
  if (o.attrs != null) {
    if (typeof o.attrs !== 'object' || Array.isArray(o.attrs)) throw new TypeError('attrs must be a string map');
    for (const key of Object.keys(o.attrs).sort()) {
      if (!/^[A-Za-z_:][A-Za-z0-9_.:-]*$/.test(key) || /\s/.test(key) || /^(type|class|style|aria-label)$/i.test(key) || /^on/i.test(key)) {
        throw new TypeError(`Invalid or reserved attribute: ${key}`);
      }
      if (typeof o.attrs[key] !== 'string') throw new TypeError('Attribute values must be strings');
      extra += ` ${key}="${escapeHTML(o.attrs[key])}"`;
    }
  }
  let artwork = '';
  if (o.provider === 'apple') {
    if (o.appleLogoSrc != null && o.appleLogoSrc !== '') {
      if (typeof o.appleLogoSrc !== 'string') throw new TypeError('appleLogoSrc must be a string');
      artwork = `<img src="${escapeHTML(o.appleLogoSrc)}" alt="">`;
    }
  } else if (o.provider === 'google') artwork = `<img src="${escapeHTML(logos.google)}" alt="">`;
  else artwork = logos[o.provider];
  const logoHTML = artwork ? `<span class="slb__logo" aria-hidden="true">${artwork}</span>` : '';
  // Without a logo (Apple with no appleLogoSrc) an icon button would be an empty square, so show the short name.
  let labelHTML = '';
  if (o.layout !== 'icon') labelHTML = `<span class="slb__label">${escapeHTML(label)}</span>`;
  else if (!artwork) labelHTML = `<span class="slb__label slb__label--short">${escapeHTML(p.name[o.lang])}</span>`;
  return `<button type="${o.type}" class="${classes.join(' ')}" style="${style}" aria-label="${escapeHTML(label)}"${extra}>${logoHTML}${labelHTML}</button>`;
}

// The HTMLElement subclass is created only on registration, so imports are SSR-safe.
export function defineSocialLoginButton() {
  if (typeof globalThis.customElements === 'undefined' || typeof globalThis.HTMLElement === 'undefined') return;
  if (customElements.get('social-login-button')) return;
  const attributes = {
    provider: 'provider', purpose: 'purpose', lang: 'lang', tone: 'tone', theme: 'theme',
    corner: 'corner', height: 'height', font: 'font', 'logo-color': 'logoColor',
    layout: 'layout', align: 'align', bg: 'bg', fg: 'fg', border: 'border',
    'apple-logo-src': 'appleLogoSrc', type: 'type', disabled: 'disabled', name: 'name', value: 'value', form: 'form',
  };
  customElements.define('social-login-button', class extends HTMLElement {
    static get observedAttributes() { return Object.keys(attributes); }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const options = {}, attrs = {};
      for (const [attr, key] of Object.entries(attributes)) {
        if (!this.hasAttribute(attr)) continue;
        const value = this.getAttribute(attr);
        if (['disabled', 'name', 'value', 'form'].includes(key)) attrs[key] = value;
        else options[key] = key === 'height' && value !== 'official' ? Number(value) : value;
      }
      this.innerHTML = renderButton({ ...options, attrs });
    }
  });
}
