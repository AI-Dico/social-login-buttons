require 'json'

module SocialLoginButtons
  class Renderer
    DATA_PATH = File.expand_path('data', __dir__)
    TOKENS = JSON.parse(File.read(File.join(DATA_PATH, 'tokens.json')))
    LOGOS = JSON.parse(File.read(File.join(DATA_PATH, 'logos.json')))
    DEFAULTS = {
      'purpose' => 'continue', 'lang' => 'ko', 'tone' => 'brand', 'theme' => 'light',
      'corner' => 'official', 'height' => 48, 'font' => 'unified', 'logoColor' => 'brand',
      'layout' => 'full', 'align' => 'center', 'type' => 'button'
    }.freeze
    CHOICES = {
      'purpose' => %w[login continue signup short], 'lang' => %w[ko en],
      'tone' => %w[brand white black custom], 'theme' => %w[light dark],
      'font' => %w[unified brand], 'logoColor' => %w[brand mono],
      'layout' => %w[full icon], 'align' => %w[center logo-left], 'type' => %w[button submit]
    }.freeze

    def self.render(options = {})
      new.render(options)
    end

    def render(options)
      normalized = options.to_h.transform_keys { |key| key.to_s.gsub(/_([a-z])/) { Regexp.last_match(1).upcase } }
      o = DEFAULTS.merge(normalized).transform_values { |v| v.is_a?(Symbol) ? v.to_s : v }
      p = TOKENS['providers'][o['provider']]
      raise ArgumentError, 'Invalid provider' unless p
      CHOICES.each { |key, values| raise ArgumentError, "Invalid #{key}" unless values.include?(o[key]) }
      h = o['height'] == 'official' ? p['officialHeight'] : o['height']
      h = h['web'] if h.is_a?(Hash)
      unless h.is_a?(Numeric) && h.finite? && h.positive?
        raise ArgumentError, 'Height must be a positive finite number'
      end
      corner = o['corner']
      corner = corner.to_i if corner.is_a?(String) && /\A(?:0|4|8|12)\z/.match?(corner)
      raise ArgumentError, 'Invalid corner' unless ['official', 0, 4, 8, 12, 'pill'].include?(corner)
      r = corner == 'official' ? p['officialRadius'] : corner == 'pill' ? h / 2.0 : corner
      fs = if o['font'] == 'unified'
             [14, (h / 3.0).round].max
           else
             p['officialFont']['size'] || (h * p['officialFont']['sizeRatio']).round
           end
      fw = o['font'] == 'unified' ? 500 : p['officialFont']['weight']
      if o['tone'] == 'custom'
        bg = color(o['bg'])
        fg = color(o['fg'])
        a = luminance(bg)
        b = o['theme'] == 'light' ? 1 : 0
        bd = if o['border']
               color(o['border'])
             elsif ([a, b].max + 0.05) / ([a, b].min + 0.05) < 1.3
               o['theme'] == 'light' ? '#DADCE0' : '#3A3A3A'
             else
               'transparent'
             end
      else
        palette = o['tone'] == 'brand' ? p['brand'][o['theme']] : TOKENS['tone'][o['tone']][o['theme']]
        bg = color(palette['bg'])
        fg = color(palette['fg'])
        bd = palette['border'] ? color(palette['border']) : 'transparent'
      end
      logo = fg
      if o['logoColor'] == 'brand'
        tone = o['tone'] == 'custom' ? (luminance(bg) > 0.5 ? 'white' : 'black') : o['tone']
        candidate = tone == 'brand' ? p['brand'][o['theme']]['logo'] : TOKENS['tone']['brandLogoOnTone'][o['provider']][tone]
        logo = color(candidate) if candidate && candidate != 'full-color'
      end
      label = p['label'][o['lang']][o['purpose']]
      classes = ['slb', "slb--#{o['provider']}", "slb--tone-#{o['tone']}", "slb--#{o['theme']}", "slb--#{o['layout']}", "slb--#{o['align']}"]
      classes << 'slb--logo-mono' if o['logoColor'] == 'mono'
      style = "--slb-h:#{number(h)}px;--slb-r:#{number(r)}px;--slb-fs:#{number(fs)}px;--slb-fw:#{number(fw)};--slb-bg:#{bg};--slb-fg:#{fg};--slb-bd:#{bd};--slb-logo:#{logo}"
      extra = ''
      unless o['attrs'].nil?
        raise ArgumentError, 'attrs must be a string map' unless o['attrs'].is_a?(Hash) && o['attrs'].keys.all? { |key| key.is_a?(String) }
        o['attrs'].sort.each do |key, value|
          if !/\A[A-Za-z_:][A-Za-z0-9_.:-]*\z/.match?(key) || /\A(?:type|class|style|aria-label)\z/i.match?(key) || /\Aon/i.match?(key)
            raise ArgumentError, "Invalid or reserved attribute: #{key}"
          end
          raise ArgumentError, 'Attribute values must be strings' unless value.is_a?(String)
          extra += " #{key}=\"#{escape(value)}\""
        end
      end
      artwork = ''
      if o['provider'] == 'apple'
        src = o['appleLogoSrc']
        unless src.nil? || src == ''
          raise ArgumentError, 'appleLogoSrc must be a string' unless src.is_a?(String)
          artwork = "<img src=\"#{escape(src)}\" alt=\"\">"
        end
      elsif o['provider'] == 'google'
        artwork = "<img src=\"#{escape(LOGOS['google'])}\" alt=\"\">"
      else
        artwork = LOGOS[o['provider']]
      end
      logo_html = artwork.empty? ? '' : "<span class=\"slb__logo\" aria-hidden=\"true\">#{artwork}</span>"
      # Without a logo (Apple with no appleLogoSrc) an icon button would be an empty square, so show the short name.
      label_html = if o['layout'] != 'icon'
                     "<span class=\"slb__label\">#{escape(label)}</span>"
                   elsif artwork.empty?
                     "<span class=\"slb__label slb__label--short\">#{escape(p['name'][o['lang']])}</span>"
                   else
                     ''
                   end
      "<button type=\"#{o['type']}\" class=\"#{classes.join(' ')}\" style=\"#{style}\" aria-label=\"#{escape(label)}\"#{extra}>#{logo_html}#{label_html}</button>"
    end

    private

    def number(value)
      return value.to_i.to_s if value.to_i == value && value.abs <= 9_007_199_254_740_991
      result = value.to_f.to_s.sub(/\.0e/, 'e').sub(/e(-?)0+/, 'e\1')
      return result unless result.include?('e')
      mantissa, exponent = result.split('e')
      exponent = exponent.to_i
      return "#{mantissa}e#{exponent >= 0 ? '+' : ''}#{exponent}" if exponent < -6 || exponent >= 21
      digits = mantissa.delete('.')
      point = exponent + 1
      return "0.#{'0' * -point}#{digits}" if point <= 0
      point >= digits.size ? digits.ljust(point, '0') : "#{digits[0...point]}.#{digits[point..]}"
    end

    def escape(value)
      value.to_s.gsub(/[&<>"']/) { |c| { '&' => '&amp;', '<' => '&lt;', '>' => '&gt;', '"' => '&quot;', "'" => '&#39;' }[c] }
    end

    def color(value)
      raise ArgumentError, 'Expected #RRGGBB color' unless value.is_a?(String) && /\A#[\da-f]{6}\z/i.match?(value)
      value.upcase
    end

    def luminance(hex)
      c = hex[1..].scan(/../).map { |v| v.to_i(16) / 255.0 }.map { |v| v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055)**2.4 }
      c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722
    end
  end
end
