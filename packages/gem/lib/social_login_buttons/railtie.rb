module SocialLoginButtons
  class Railtie < Rails::Railtie
    initializer 'social_login_buttons.helpers' do
      ActiveSupport.on_load(:action_view) { include SocialLoginButtons::Helper }
    end

    initializer 'social_login_buttons.assets' do |app|
      if app.config.respond_to?(:assets)
        app.config.assets.paths << File.expand_path('../../app/assets/stylesheets', __dir__)
        if app.config.assets.respond_to?(:precompile)
          app.config.assets.precompile += ['social_login_buttons.css']
        end
      end
    end
  end
end
