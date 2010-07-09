require 'rake'
require 'yui/compressor'

desc 'Compress all JavaScript files'
task :compress do
  output_file = ENV.include?('output') ? ENV['output'] : 'ajax-solr.min.js'

  core = [
    'Core',
    'AbstractManager',
    'ParameterStore',
    'AbstractWidget',
    'AbstractFacetWidget'
  ]

  dirs = [
    'core',
    'helpers',
    'managers',
    'widgets'
  ]

  File.open(output_file, 'w') do |output|
    compressor = YUI::JavaScriptCompressor.new(:munge => true)

    files = core.map{ |name| "core/#{name}.js" } + dirs.map{ |dir| Dir["#{dir}/**/*.js"] }.flatten
    files.uniq!

    files.each do |file_name|
      puts "Compressing #{file_name}"
      input = File.open(file_name, 'r') { |f| f.read }
      output.write(compressor.compress(input))
    end
  end
end
