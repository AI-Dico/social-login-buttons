require 'minitest/autorun'
require 'social_login_buttons'

class RendererTest < Minitest::Test
  ROOT = File.expand_path('../../..', __dir__)
  CASES = JSON.parse(File.read(File.join(ROOT, 'fixtures/cases.json')))

  CASES.each do |entry|
    define_method("test_fixture_#{entry['file'].tr('.-', '__')}") do
      expected = File.binread(File.join(ROOT, 'fixtures/html', entry['file']))
      actual = SocialLoginButtons.render(entry['options'])
      assert_equal expected, actual.b, entry['options'].inspect
    end
  end

  def test_every_html_fixture_is_checked
    assert_equal Dir[File.join(ROOT, 'fixtures/html/*.html')].map { |f| File.basename(f) }.sort, CASES.map { |e| e['file'] }.sort
    assert_operator CASES.length, :>=, 60
  end

  def test_symbol_string_camel_and_snake_options
    expected = SocialLoginButtons.render('provider' => 'apple', 'logoColor' => 'mono', 'appleLogoSrc' => '/apple.svg', 'purpose' => 'signup')
    assert_equal expected, SocialLoginButtons.render(provider: :apple, logo_color: :mono, apple_logo_src: '/apple.svg', purpose: :signup)
    assert_equal expected, SocialLoginButtons.render('provider' => :apple, :logoColor => :mono, 'apple_logo_src' => '/apple.svg', :purpose => :signup)
  end

  def test_escape_url_attributes_and_labels
    label = SocialLoginButtons::Renderer::TOKENS['providers']['apple']['label']['ko']
    original = label['continue']
    label['continue'] = %q{&<>"'}
    html = SocialLoginButtons.render(provider: :apple, apple_logo_src: %q{/&<>"'}, attrs: { 'title' => %q{&<>"'}, 'data-a' => '한글' })
    escaped = '&amp;&lt;&gt;&quot;&#39;'
    assert_includes html, "aria-label=\"#{escaped}\" data-a=\"한글\" title=\"#{escaped}\""
    assert_includes html, "<img src=\"/#{escaped}\" alt=\"\">"
    assert_includes html, "<span class=\"slb__label\">#{escaped}</span>"
  ensure
    label['continue'] = original
  end

  def test_errors
    invalid = [{}, { provider: :bad }, { provider: :kakao, height: 0 }, { provider: :kakao, height: Float::INFINITY },
               { provider: :kakao, corner: 3 }, { provider: :kakao, purpose: :auto },
               { provider: :kakao, tone: :custom }, { provider: :kakao, tone: :custom, bg: "#ffffff\n", fg: '#000000' },
               { provider: :kakao, attrs: { 'type' => 'submit' } }, { provider: :kakao, attrs: { 'onclick' => 'x' } },
               { provider: :kakao, attrs: { 'x"' => 'x' } }, { provider: :kakao, attrs: { 'disabled' => true } }]
    invalid.each { |options| assert_raises(ArgumentError) { SocialLoginButtons.render(options) } }
  end

  def test_plain_render_and_helper_safe_boundary
    raw = SocialLoginButtons.render(provider: :kakao)
    assert_instance_of String, raw
    context = Object.new.extend(SocialLoginButtons::Helper)
    assert_equal raw, context.social_login_button(:kakao)
    safe_class = Class.new(String) { def html_safe = :marked_safe }
    original_render = SocialLoginButtons.method(:render)
    SocialLoginButtons.define_singleton_method(:render) { |_options| safe_class.new(raw) }
    assert_equal :marked_safe, context.social_login_button(:kakao)
  ensure
    SocialLoginButtons.define_singleton_method(:render, original_render) if original_render
  end
end
