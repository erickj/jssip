require 'erb'
require 'fileutils'
require 'open3'
require 'yaml'

BUILD_DIR = 'build'
TEST_OUT_DIR = 'test_out'

CLOSURE_BUILDER = 'lib/closure-library/bin/build/closurebuilder.py'
CLOSURE_BUILDER_ROOTS = '--root=lib/closure-library --root=lib/closure-library-third-party --root=src'
CLOSURE_BUILDER_ROOTS_SPEC = CLOSURE_BUILDER_ROOTS + ' --root=spec'
CLOSURE_COMPILER = 'lib/closure-compiler/compiler.jar'
SPECRUNNER_TPL = '_specrunner.erb'

PHANTOMJS = 'phantomjs'
SPEC_RUNNER_URL_ROOT = 'http://localhost/workspace/jssip/build'

NAMESPACE = 'jssip'
DEFAULT_TARGET = 'jssip.Endpoint'

task :default => [:concat]

desc 'Init the build workspace'
task :init do
  FileUtils.mkdir(BUILD_DIR) unless File.directory?(BUILD_DIR)
  FileUtils.mkdir(TEST_OUT_DIR) unless File.directory?(TEST_OUT_DIR)
end

desc 'Clean any generated files'
task :clean do
  FileUtils.rm_r(BUILD_DIR, :force => true)
  FileUtils.rm_r(TEST_OUT_DIR, :force => true)
  Rake::Task[:init].invoke
end

namespace :compiler do
  task :help do
    puts %x{java -jar #{CLOSURE_COMPILER} --help 2>&1}
  end
end

desc 'Lists build dependencies for [target]'
task :deps, [:target] do |t, args|
  puts Utils.get_script_deps(args[:target] || DEFAULT_TARGET)
end

desc 'Concat files to sip.js'
task :concat, [:target] => [:init] do |t, args|
  target = args[:target] || DEFAULT_TARGET
  Utils.build_script(Utils.get_js_script_name(target), target)
end

desc 'Minify Javascript for [target]'
task :minify, [:target] => [:init] do |t, args|
  target = args[:target] || DEFAULT_TARGET
  Utils.build_compiled(Utils.get_js_script_name(target, 'min'), target)
end

desc 'Compile Javascript for [target]'
task :compile, [:target] => [:init] do |t, args|
  target = args[:target] || DEFAULT_TARGET
  Utils.build_compiled(Utils.get_js_script_name(target, 'opt'), target, true)
end

namespace :test do
  desc 'Run spec for [target]'
  task :spec, :target do |t, args|
    target = args[:target]
    target = Utils.specize_target_name(Utils.normalize_target_name(target))
    Utils.run_spec(target)
  end

  desc 'Run all specs for [target_namespace]'
  task :specs, :namespace do |t, args|
    ns = Utils.normalize_target_name(args[:namespace] || NAMESPACE, { :no_cap => true })
    specs_dir = File.join(FileUtils.pwd, BUILD_DIR)

    puts "Running specs for namespace [#{ns}]"
    puts
    Dir.glob(File.join(specs_dir, ns + "*.html")) do |file|
      target = file.split('/').last.gsub('.html','')
      Utils.run_spec(target)
    end
  end

  desc 'Generate spec runner for [target]'
  task :genspecrunner, :target do |t, args|
    target = args[:target]
    target = Utils.specize_target_name(Utils.normalize_target_name(target))
    unless Utils.is_target_spec?(target)
      raise 'Unable to generate spec runner for non spec target'
    end

    Utils.build_specrunner(target)
  end

  desc 'Generate spec runners for all test targets'
  task :genspecrunners do
    Utils.find_spec_targets.each do |target|
      Utils.build_specrunner(target)
    end
  end
end

class SpecRunnerBindingProvider
  attr_accessor :target, :scripts

  def get_binding
    binding
  end
end

class Utils
  ##
  # Cleans up lazy target names like message.header into jssip.message.Header
  # Options:
  # - :no_cap - don't capitalize the final target
  def self.normalize_target_name(target, opts={})
    ns = target.split('.')
    ns.last.capitalize! unless ns.last[0].match(/[A-Z]/) || opts[:no_cap]
    ns.unshift(NAMESPACE) unless ns[0] == NAMESPACE
    ns.join('.')
  end

  ##
  # Appends "Spec" onto a target if its not there
  def self.specize_target_name(target)
    target.match(/Spec$/) ? target : target << "Spec"
  end

  def self.is_target_spec?(target)
    !!target.match(/.*Spec/)
  end

  def self.get_js_script_name(target, type='')
    get_script_prefix(target, type) << '.js'
  end

  def self.get_script_prefix(target, type='')
    script_name = target.downcase.gsub(/^#{NAMESPACE}\./,'')
    script_name.prepend('test_') if is_target_spec?(target)
    type.empty? ? script_name : script_name << '.' << type
  end

  def self.get_script_deps(js_target)
    build_js(js_target, '--output_mode=list')
  end

  def self.build_specrunner(target)
    puts
    puts "Building specrunner for target: #{target}"
    script_names = Utils.get_script_deps(target).split
    output_file = target + '.html'

    template_obj = SpecRunnerBindingProvider.new
    template_obj.target = target
    template_obj.scripts = script_names
    template = File.read(SPECRUNNER_TPL)

    path = File.join(BUILD_DIR, output_file)
    File.open(path, 'w') do |f|
      f.write(ERB.new(template).result(template_obj.get_binding))
    end
    puts "Wrote file #{path}"
  end

  def self.build_script(filename, js_target)
    path = File.join(BUILD_DIR, filename)
    puts "Creating #{path} for namespace #{js_target}..."

    args = ['--output_mode=compiled', "--compiler_jar=#{CLOSURE_COMPILER}"]
    args.push('-f "--flagfile=compiler.warning.flags"')
    args.push('-f "--formatting=PRETTY_PRINT"')

    File.open(path, 'w') do |f|
      content = build_js(js_target, args)
      f.write(content)
    end
    puts "Wrote file #{path}"
  end

  def self.build_compiled(filename, js_target, advanced=false)
    path = File.join(BUILD_DIR, filename)
    puts "Creating compiled #{path} for namespace #{js_target}..."

    args = ['--output_mode=compiled', "--compiler_jar=#{CLOSURE_COMPILER}"]

    args.push('-f "--compilation_level=ADVANCED_OPTIMIZATIONS"') if advanced
    args.push('-f "--flagfile=compiler.flags"')

    File.open(path, 'w') do |f|
      content = build_js(js_target, args)
      f.write(content)
    end
    puts "Wrote file #{path}"
  end

  ##
  # Runs the closure builder with the build arguments for a target. Useful for:
  # - concating source
  # - compiling source
  # - listing target dependencies
  def self.build_js(js_target, *build_args)
    build_roots = is_target_spec?(js_target) ? CLOSURE_BUILDER_ROOTS_SPEC : CLOSURE_BUILDER_ROOTS
    stdin, stdout, stderr, wait_thrd = Open3.popen3 <<EOS
    #{CLOSURE_BUILDER} \
      #{build_roots} \
      --namespace="#{js_target}" \
      #{build_args.join(' ')}
EOS

    err = stderr.read
    if wait_thrd.value.exitstatus > 0
      $stderr.puts "Error running #{CLOSURE_BUILDER}:"
      $stderr.puts
      $stderr.puts err
    elsif err.length > 0
      $stderr.puts err
    end

    ret = stdout.read

    stdin.close
    stdout.close
    stderr.close

    ret
  end

  ##
  # Greps through the spec directory for goog.provide target names.
  # returns Array
  def self.find_spec_targets
    specs = %x{find spec -name "[a-z0-9]*js" | xargs -I{} grep -e "goog.provide(\'.*Spec\')" {} | cut -d: -f2 | cut -d\\\' -f2}
    specs.split
  end

  ##
  # Run the spec in phantomjs
  def self.run_spec(target)
    specs_dir = File.join(FileUtils.pwd, BUILD_DIR)
    puts "Running Spec for #{target}"
    puts %x{phantomjs run-jasmine.js file:///#{specs_dir}/#{target}.html}
  end

end
