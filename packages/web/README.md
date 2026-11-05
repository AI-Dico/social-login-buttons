# @ai-dico/social-login-buttons

Version 0.1.0 · ESM · Node >=18 · no runtime dependencies.
Kakao, NAVER, Apple and Google buttons generated from the repository's `tokens.json`.
The companion `social_login_buttons` gem renders byte-identical HTML for identical options.

```sh
npm install @ai-dico/social-login-buttons
```

```js
import { renderButton, tokens, defineSocialLoginButton } from '@ai-dico/social-login-buttons';
import '@ai-dico/social-login-buttons/css'; // with a CSS-aware bundler

document.querySelector('#login').innerHTML = renderButton({ provider: 'kakao' });
defineSocialLoginButton();
```

```html
<form method="post" action="/sessions">
  <social-login-button provider="naver" purpose="login" type="submit"
    name="provider" value="naver" logo-color="brand"></social-login-button>
</form>
```

Registration is optional, idempotent and safe during SSR. The element uses light DOM,
redraws when options change, and contains a native button supporting form submission.
Use kebab-case attributes (`logo-color`, `apple-logo-src`); numeric `height` is parsed.
`disabled`, `name`, `value` and `form` are forwarded to the native button.
`attrs` is available through `renderButton`, rather than a serialized component attribute.

| Option | Values | Default |
| --- | --- | --- |
| provider | kakao, naver, apple, google | required |
| purpose | login, continue, signup, short | continue |
| lang | ko, en | ko |
| tone | brand, white, black, custom | brand |
| theme | light, dark | light |
| corner | official, 0, 4, 8, 12, pill | official |
| height | official or a positive finite pixel number | 48 |
| font | unified, brand | unified |
| logoColor | brand, mono | brand |
| layout | full, icon | full |
| align | center, logo-left | center |
| bg, fg, border | #RRGGBB; bg/fg required for custom, border optional | none |
| appleLogoSrc | URL to your own official Apple logo file | no logo (icon layout shows the text "Apple") |
| type | button, submit | button |
| attrs | string attribute names and string values | none |

Additional attributes follow the canonical attributes in ASCII name order; values and
labels escape `& < > " '`. Invalid option values, invalid attribute names, event handlers,
and overrides of `type`, `class`, `style`, `aria-label` raise `TypeError`.
Use `attrs: { disabled: '' }` for a boolean HTML attribute.

`official` height uses the web height (Google: 40px). Unified text is
`max(14, round(height / 3))`, weight 500, including official-height mode.
Brand text uses the provider's size or rounded size ratio and official weight.
Explicit corners are never adjusted; pill is half the resolved height.
Custom borders appear when background/page contrast is below 1.3 unless explicitly set.
Custom brand logo selection uses relative luminance >0.5 for the white-tone palette.
Google mono uses a clipped, zero-blur CSS drop shadow to match foreground color exactly.

`.slb-stack` provides a full-width vertical group; `.slb-row` arranges icons horizontally.
Override the system font after the stylesheet with `.slb { font-family: inherit; }`.
Rendering does not implement authentication or OAuth.

Apple artwork is not included. Obtain an appropriate file from
[Apple Design Resources](https://developer.apple.com/design/resources/#sign-in-with-apple),
host it in your project and pass `appleLogoSrc`. The file is never tinted; without a URL
the logo element is omitted and text stays centered (icon layout shows the short text "Apple" instead of an empty square).

Build from the repository root: `node tools/gen-packages.mjs`.
Test here: `node --test`. `src/index.js` is maintained by hand; `dist` is generated.
The npm tarball includes `dist`, README, LICENSE and the required package.json;
source, fixtures and tests are excluded.

Code/tokens/docs: MIT. Provider logos and names are their respective owners' trademarks
and are excluded from the MIT grant. This package is not affiliated with those companies.
