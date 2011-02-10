require 'rake'
require 'yui/compressor'

desc 'Aggregate all javascript files'
task :aggregate, :compress do |t, args|
  args.with_defaults(:compress => false)
  output_file = ENV['output'] || 'ajax-solr.min.js'

  core = [
    'Core',
    'AbstractManager',
    'ParameterStore',
    'Parameter',
    'AbstractWidget',
    'AbstractFacetWidget'
  ]

  dirs = [
    'core',
    'helpers',
    'managers',
    'widgets'
  ]

  compressor = YUI::JavaScriptCompressor.new(:munge => true) if args[:compress]

  files = core.map{ |name| "core/#{name}.js" } + dirs.map{ |dir| Dir["#{dir}/**/*.js"] }.flatten
  files.uniq!

  action = args[:compress] ? "Compressing" : "Aggregating"

  File.open(output_file, 'w') do |output|
    files.each do |file_name|
      puts "#{action} #{file_name}"
      input = File.read(file_name)
      output.write(args[:compress] ? compressor.compress(input) : input)
    end
  end
end

desc 'Compress all javascript files'
task :compress do
  Rake::Task[:aggregate].invoke(true)
end
