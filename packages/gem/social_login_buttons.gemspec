require_relative 'lib/social_login_buttons/version'

Gem::Specification.new do |spec|
  spec.name = 'social_login_buttons'
  spec.version = SocialLoginButtons::VERSION
  spec.authors = ['Dico (AI-Dico)']
  spec.summary = 'Token-based social login buttons for Ruby and Rails'
  spec.description = 'Render Kakao, NAVER, Apple and Google buttons with HTML identical to the companion npm package.'
  spec.homepage = 'https://github.com/AI-Dico/social-login-buttons'
  spec.license = 'MIT'
  spec.required_ruby_version = '>= 3.1'
  spec.files = Dir.chdir(__dir__) { Dir['lib/**/*.rb', 'lib/**/*.json', 'app/assets/stylesheets/*.css', 'README.md', 'LICENSE'] }.sort
  spec.require_paths = ['lib']
  spec.metadata['source_code_uri'] = spec.homepage
end
