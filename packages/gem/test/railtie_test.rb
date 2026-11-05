require 'minitest/autorun'
require 'ostruct'
require 'social_login_buttons'

# Rails-free contract test: run the initializer blocks against small API doubles.
class RailtieTest < Minitest::Test
  def test_helpers_and_asset_path_with_and_without_an_asset_pipeline
    rails = Module.new
    base = Class.new do
      def self.initializers = (@initializers ||= [])
      def self.initializer(_name, &block) = initializers << block
    end
    rails.const_set(:Railtie, base)
    Object.const_set(:Rails, rails)
    support = Module.new
    view = Class.new
    support.define_singleton_method(:on_load) do |name, &block|
      raise 'wrong hook' unless name == :action_view
      view.class_eval(&block)
    end
    Object.const_set(:ActiveSupport, support)
    load File.expand_path('../lib/social_login_buttons/railtie.rb', __dir__)
    initializers = SocialLoginButtons::Railtie.initializers
    initializers[0].call
    assert_includes view.ancestors, SocialLoginButtons::Helper
    assets = OpenStruct.new(paths: [], precompile: [])
    initializers[1].call(OpenStruct.new(config: OpenStruct.new(assets: assets)))
    expected = File.expand_path('../app/assets/stylesheets', __dir__)
    assert_includes assets.paths, expected
    assert File.exist?(File.join(expected, 'social_login_buttons.css'))
    assert_includes assets.precompile, 'social_login_buttons.css'
    initializers[1].call(OpenStruct.new(config: Object.new))
  ensure
    SocialLoginButtons.send(:remove_const, :Railtie) if SocialLoginButtons.const_defined?(:Railtie, false)
    Object.send(:remove_const, :Rails) if Object.const_defined?(:Rails)
    Object.send(:remove_const, :ActiveSupport) if Object.const_defined?(:ActiveSupport)
  end
end
