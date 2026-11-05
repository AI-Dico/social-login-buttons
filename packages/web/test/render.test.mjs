import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { renderButton, tokens, defineSocialLoginButton } from '../dist/index.js';

const fixtureURL = new URL('../../../fixtures/', import.meta.url);
const cases = JSON.parse(await readFile(new URL('cases.json', fixtureURL), 'utf8'));
for (const { file, options } of cases) {
  test(`fixture ${file}`, async () => {
    assert.equal(renderButton(options), await readFile(new URL(`html/${file}`, fixtureURL), 'utf8'));
  });
}

test('fixtures cover every enum and every generated HTML file', async () => {
  assert.ok(cases.length >= 60);
  assert.deepEqual((await readdir(new URL('html/', fixtureURL))).sort(), cases.map(c => c.file).sort());
  for (const [key, expected] of Object.entries({
    provider: tokens.order, purpose: ['login', 'continue', 'signup', 'short'], lang: ['ko', 'en'],
    tone: ['brand', 'white', 'black', 'custom'], theme: ['light', 'dark'], corner: ['official', 0, 4, 8, 12, 'pill'],
  })) {
    for (const value of expected) assert.ok(cases.some(c => c.options[key] === value), `${key}=${value}`);
  }
});

test('canonical default HTML and fixed attribute/style ordering', () => {
  const html = renderButton({ provider: 'kakao' });
  assert.ok(html.startsWith('<button type="button" class="slb slb--kakao slb--tone-brand slb--light slb--full slb--center" style="--slb-h:48px;--slb-r:8px;--slb-fs:16px;--slb-fw:500;--slb-bg:#FEE500;--slb-fg:#191919;--slb-bd:transparent;--slb-logo:#191919" aria-label="카카오로 계속하기">'));
  assert.ok(html.includes('fill="currentColor"'));
  assert.ok(html.endsWith('<span class="slb__label">카카오로 계속하기</span></button>'));
});

test('escapes all five characters in labels, URL and sorted attributes', () => {
  const original = tokens.providers.apple.label.ko.continue;
  tokens.providers.apple.label.ko.continue = `&<>"'`;
  try {
    const html = renderButton({ provider: 'apple', appleLogoSrc: `/&<>"'`, attrs: { title: `&<>"'`, 'data-a': '한글' } });
    const escaped = '&amp;&lt;&gt;&quot;&#39;';
    assert.ok(html.includes(`aria-label="${escaped}" data-a="한글" title="${escaped}"`));
    assert.ok(html.includes(`<img src="/${escaped}" alt="">`));
    assert.ok(html.includes(`<span class="slb__label">${escaped}</span>`));
  } finally { tokens.providers.apple.label.ko.continue = original; }
});

test('Apple never reserves an empty logo slot or tints its image', () => {
  for (const appleLogoSrc of [undefined, '']) assert.ok(!renderButton({ provider: 'apple', appleLogoSrc, align: 'logo-left' }).includes('slb__logo'));
  const html = renderButton({ provider: 'apple', appleLogoSrc: '/apple.svg', logoColor: 'mono' });
  assert.ok(html.includes('<img src="/apple.svg" alt="">'));
  assert.ok(!html.includes('filter'));
});

test('icon is accessible, omits text span, embeds Google PNG', () => {
  const html = renderButton({ provider: 'google', layout: 'icon', logoColor: 'mono' });
  assert.ok(html.includes('slb--icon'));
  assert.ok(html.includes('slb--logo-mono'));
  assert.ok(html.includes('aria-label="Google 계정으로 계속하기"'));
  assert.ok(!html.includes('slb__label'));
  assert.ok(html.includes('src="data:image/png;base64,'));
});

test('custom borders use strict contrast threshold and explicit override', () => {
  const render = (bg, theme = 'light', border) => renderButton({ provider: 'kakao', tone: 'custom', bg, fg: '#ffffff', theme, border });
  assert.ok(render('#e2e2e2').includes('--slb-bd:#DADCE0;'));
  assert.ok(render('#e1e1e1').includes('--slb-bd:transparent;'));
  assert.ok(render('#202020', 'dark').includes('--slb-bd:#3A3A3A;'));
  assert.ok(render('#212121', 'dark').includes('--slb-bd:transparent;'));
  assert.ok(render('#ffffff', 'light', '#ab23cd').includes('--slb-bd:#AB23CD;'));
});

test('custom brand-logo color uses background luminance, mono uses foreground', () => {
  const render = (bg, logoColor = 'brand') => renderButton({ provider: 'naver', tone: 'custom', bg, fg: '#ab23cd', logoColor });
  assert.ok(render('#ffffff').includes('--slb-logo:#03A94D'));
  assert.ok(render('#000000').includes('--slb-logo:#05AC4F'));
  assert.ok(render('#000000', 'mono').includes('--slb-logo:#AB23CD'));
});

test('official sizes, explicit corners and unified/brand fonts', () => {
  assert.ok(renderButton({ provider: 'apple', height: 'official', font: 'brand' }).includes('--slb-h:44px;--slb-r:6px;--slb-fs:19px;--slb-fw:500'));
  assert.ok(renderButton({ provider: 'google', height: 'official', font: 'brand' }).includes('--slb-h:40px;--slb-r:4px;--slb-fs:14px'));
  for (const provider of tokens.order) assert.ok(renderButton({ provider, corner: 12, height: 49.5 }).includes('--slb-r:12px;--slb-fs:17px;--slb-fw:500'));
});

test('rejects invalid enums, heights, colors and unsafe or reserved attribute names', () => {
  for (const options of [
    {}, { provider: 'bad' }, { provider: '__proto__' }, { provider: null },
    ...['purpose', 'lang', 'tone', 'theme', 'font', 'layout', 'align', 'type', 'logoColor', 'corner'].map(k => ({ provider: 'kakao', [k]: 'bad' })),
    ...[0, -1, Infinity, NaN, '48'].map(height => ({ provider: 'kakao', height })),
    { provider: 'kakao', tone: 'custom' },
    { provider: 'kakao', tone: 'custom', bg: '#ffffff\n', fg: '#000000' },
    ...['class', 'STYLE', 'aria-label', 'type', 'onclick', 'x"', 'x\n'].map(key => ({ provider: 'kakao', attrs: { [key]: 'x' } })),
    { provider: 'kakao', attrs: { disabled: true } }, { provider: 'kakao', attrs: [] },
  ]) assert.throws(() => renderButton(options), TypeError);
});

test('CSS and distributed tokens are byte-identical across packages and root', async () => {
  const root = new URL('../../../', import.meta.url);
  assert.deepEqual(await readFile(new URL('packages/web/dist/social-login-buttons.css', root)), await readFile(new URL('packages/gem/app/assets/stylesheets/social_login_buttons.css', root)));
  for (const file of ['packages/web/dist/tokens.json', 'packages/gem/lib/social_login_buttons/data/tokens.json']) {
    assert.deepEqual(await readFile(new URL(file, root)), await readFile(new URL('tokens.json', root)));
  }
});

test('registration is SSR-safe and idempotent; component redraws observed kebab attributes', () => {
  defineSocialLoginButton();
  const registry = new Map();
  class Element {
    constructor() { this.attributes = new Map(); this.isConnected = true; }
    hasAttribute(name) { return this.attributes.has(name); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    setAttribute(name, value) { this.attributes.set(name, String(value)); this.attributeChangedCallback(name); }
    removeAttribute(name) { this.attributes.delete(name); this.attributeChangedCallback(name); }
  }
  globalThis.HTMLElement = Element;
  globalThis.customElements = { get: name => registry.get(name), define: (name, element) => registry.set(name, element) };
  try {
    defineSocialLoginButton();
    const Component = registry.get('social-login-button');
    defineSocialLoginButton();
    assert.equal(registry.get('social-login-button'), Component);
    assert.ok(Component.observedAttributes.includes('apple-logo-src'));
    const element = new Component();
    element.setAttribute('provider', 'naver');
    element.setAttribute('logo-color', 'mono');
    element.setAttribute('height', '52');
    element.setAttribute('type', 'submit');
    element.setAttribute('name', 'provider');
    element.setAttribute('value', 'naver');
    element.setAttribute('form', 'login');
    element.setAttribute('disabled', '');
    element.connectedCallback();
    assert.equal(element.innerHTML, renderButton({ provider: 'naver', logoColor: 'mono', height: 52, type: 'submit', attrs: { name: 'provider', value: 'naver', form: 'login', disabled: '' } }));
    element.removeAttribute('disabled');
    element.setAttribute('purpose', 'signup');
    assert.ok(element.innerHTML.includes('네이버로 가입하기'));
    assert.ok(!element.innerHTML.includes(' disabled='));
  } finally { delete globalThis.HTMLElement; delete globalThis.customElements; }
});
