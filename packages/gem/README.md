# social_login_buttons

Version 0.1.0 · Ruby >=3.1 · no runtime dependencies beyond standard-library JSON.
Kakao, NAVER, Apple and Google buttons with HTML identical to
`@ai-dico/social-login-buttons` for the same options.

```ruby
gem 'social_login_buttons', '~> 0.1.0'
```

```erb
<%= stylesheet_link_tag 'social_login_buttons' %>
<%= social_login_button :kakao, purpose: :continue %>
<%= social_login_button :naver, type: :submit, attrs: { 'name' => 'provider', 'value' => 'naver' } %>
```

The Railtie registers the helper with ActionView and the stylesheet directory with
an available Rails asset pipeline. No Rails installation is needed for plain Ruby:

```ruby
require 'social_login_buttons'
html = SocialLoginButtons.render(provider: :naver, lang: :en)
```

Plain render returns a String. Only the helper calls `html_safe` when available.
Options accept symbol or string keys and values, and both `logoColor`/`logo_color`
and `appleLogoSrc`/`apple_logo_src`. Attribute maps use string keys and string values.

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

Attributes are sorted by ASCII name after canonical attributes and all values escape
`& < > " '`. Invalid options, invalid attribute names, event handler attributes and
overrides of `type`, `class`, `style`, `aria-label` raise `ArgumentError`.
For boolean HTML attributes use e.g. `attrs: { 'disabled' => '' }`.

Official height resolves to the provider's web height; unified text always uses
`max(14, round(height / 3))`, weight 500. Brand text uses the official size or rounded
height ratio and weight. Explicit corners are applied without adjustment.
Custom borders use background/page contrast <1.3; an explicit border overrides it.
Custom brand logos choose the white-tone palette at relative luminance >0.5.
The `.slb-stack` and `.slb-row` classes arrange groups. Override the system font with
`.slb { font-family: inherit; }` after the stylesheet. OAuth is the application's responsibility.

Apple artwork is not distributed. Get the official file from
[Apple Design Resources](https://developer.apple.com/design/resources/#sign-in-with-apple)
and supply `apple_logo_src`. Files are never tinted; missing URLs produce no logo slot,
so full-layout text stays centered (icon layout shows the short text "Apple" instead of an empty square).

Regenerate from the repository root: `node tools/gen-packages.mjs`.
Test without Rails:

```sh
ruby -Ilib -Itest -e 'Dir["test/*_test.rb"].each{|f| require File.expand_path(f)}'
gem build social_login_buttons.gemspec
```

Code/tokens/docs: MIT. Provider logos and names are their respective owners' trademarks
and are excluded from the MIT grant. This package is not affiliated with those companies.
