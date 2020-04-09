require 'nokogiri'

module Jekyll
  module RemoveFromRSS
    def remove_from_rss(raw)
      doc = Nokogiri::HTML.fragment(raw.encode('UTF-8', :invalid => :replace, :undef => :replace, :replace => ''))
      exclude = %w{hide-from-rss}
      for block in ['p', 'ol', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] do
        doc.css(block).each do |ele|
          classes = (ele['class'] || '').split(/\s+/)
          if((classes & exclude).length > 0)
            ele.remove
          end
        #   ele.remove if (ele['id'] == 'hide-from-rss') # Works
        # class_name = 'hide-from-rss'
        # ele.remove if (ele.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' #{class_name} ')]"))
        end
      end
      doc.inner_html
    end
  end
end

Liquid::Template.register_filter(Jekyll::RemoveFromRSS)
