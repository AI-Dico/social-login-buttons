require_relative 'social_login_buttons/version'
require_relative 'social_login_buttons/renderer'
require_relative 'social_login_buttons/helper'

module SocialLoginButtons
  def self.render(options = {})
    Renderer.render(options)
  end
end

require_relative 'social_login_buttons/railtie' if defined?(Rails::Railtie)
