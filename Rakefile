require 'rake'
require 'yui/compressor'

desc 'Compress all JavaScript files'
task :compress do
  output_file = ENV.include?('output') ? ENV['output'] : 'ajax-solr.min.js'

  File.open(output_file, 'w') do |output|
    compressor = YUI::JavaScriptCompressor.new(:munge => true)
    files = Dir['**/*.js']
    files.each do |file|
      next if file == output_file
      puts "Compressing #{file}"
      input = ''
      File.open(file, 'r') { |f| input = f.read }
      output.write(compressor.compress(input))
    end
  end
end
