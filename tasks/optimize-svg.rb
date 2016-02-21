#!/usr/bin/env ruby

# put all new SVG-filled directories at the end of this list
svg_paths = %w[
  front/common/public/symbols
  front/main/app/symbols
]

# main script
svg_paths.each do |path|
  files = Dir.glob("#{path}/**/*.svg")
  count = files.count

  puts "Optimizing SVGs in #{path} (found #{count} SVGs)"

  files.each_with_index do |file, index|
    puts "\t[#{index+1}/#{count}] #{file}"

    `./node_modules/.bin/svgo --config=#{Dir.pwd}/.svgo.yml --pretty -i #{file}`
  end

  puts "\n"
end
