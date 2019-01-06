http_path = "/"

css_dir = "css"
sass_dir = "_sass"
images_dir = "images"
javascripts_dir = "js"
environment = :development
relative_assets = true

# output_style = :expanded

output_style = :compressed

# line_comments = true

# don't touch this
preferred_syntax = :scss

require 'autoprefixer-rails'

on_stylesheet_saved do |file|
  css = File.read(file)
  map = file + '.map'

  if File.exists? map
    result = AutoprefixerRails.process(css,
      from: file,
      to:   file,
      map:  { prev: File.read(map), inline: false })
    File.open(file, 'w') { |io| io << result.css }
    File.open(map,  'w') { |io| io << result.map }
  else
    File.open(file, 'w') { |io| io << AutoprefixerRails.process(css) }
  end
end
