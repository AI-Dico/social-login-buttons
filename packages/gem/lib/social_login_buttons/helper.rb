module SocialLoginButtons
  module Helper
    def social_login_button(provider, **options)
      html = SocialLoginButtons.render(options.merge(provider: provider))
      html.respond_to?(:html_safe) ? html.html_safe : html
    end
  end
end
