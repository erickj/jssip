require 'erb'
require 'fileutils'
require 'open3'
require 'yaml'

BASE_DIR = File.realpath(FileUtils.pwd)
JS_DIR = BASE_DIR + '/src'
SPEC_DIR = BASE_DIR + '/spec'
BUILD_DIR = BASE_DIR + '/build'
THIRD_PARTY_DIR = BASE_DIR + '/lib'

TEST_BUILD_DIR = BUILD_DIR + '/test_out'

CLSR_BUILD_DIR = 'lib/closure-library/bin/build'
CLSR_BUILDER = CLSR_BUILD_DIR + '/closurebuilder.py'
CLSR_BUILDER_ROOTS = '--root=lib/closure-library --root=lib/closure-library-third-party --root=src'
CLSR_BUILDER_ROOTS_SPEC = CLSR_BUILDER_ROOTS + ' --root=spec'
CLSR_DEPSWRITER = CLSR_BUILD_DIR + '/depswriter.py'
CLSR_COMPILER = 'lib/closure-compiler/compiler.jar'
CLSR_DEPS = 'lib/closure-library/goog/deps.js'

RHINO_JS = THIRD_PARTY_DIR + '/rhino/js.jar'

JSSIP_DEPS = BUILD_DIR + '/this-is-stupid_see-note-in-file.deps.js'

TEST_PROTOCOL = 'file://'
SPECRUNNER_TPL = '_specrunner.erb'
PHANTOMJS_RUNNER = 'phantomjs run-jasmine.js'
JASMINE_ROOT_PATH = THIRD_PARTY_DIR + '/jasmine-1.3.1'

NAMESPACE = 'jssip'
DEFAULT_TARGET = 'jssip.Endpoint'

GJSLINT = '/usr/local/bin/gjslint'
GJSLINT_EXCLUDES = BASE_DIR + '/.gjslintexcludes'

task :default => [:'build:concat']

desc 'Init the build workspace'
task :init do
  FileUtils.mkdir(BUILD_DIR) unless File.directory?(BUILD_DIR)
  FileUtils.mkdir(TEST_BUILD_DIR) unless File.directory?(TEST_BUILD_DIR)
end

desc 'Clean any generated files'
task :clean do
  FileUtils.rm_r(BUILD_DIR, :force => true)
  FileUtils.rm_r(TEST_BUILD_DIR, :force => true)
  Rake::Task[:init].invoke
end

namespace :build do
  desc 'Show help for the JS compiler'
  task :help do
    puts %x{java -jar #{CLSR_COMPILER} --help 2>&1}
  end

  desc 'Compile JS in WHITESPACE_ONLY mode for [target]'
  task :concat, [:target] => [:init] do |t, args|
    target = args[:target] || DEFAULT_TARGET
    Utils.build_script(Utils.get_js_script_name(target), target)
  end

  desc 'Compile JS for Rhino'
  task :rhino => :'build:concat' do
    # Rhino does not support argument.callee.caller, so need to revise
    # how goog.base and all calls to it are implemented.
    path = File.join(BUILD_DIR, Utils.get_js_script_name(DEFAULT_TARGET))
    rhino_target = "build/endpoint.rhino.js"

    sed_cmd = 'sed -e "s/goog.base(/goog\.base\(arguments.callee, /" %s'%path
    puts %x{#{sed_cmd} > #{rhino_target}}

    sed_cmd2 = 'sed -i -e "s/goog.base = function(/goog.base = function(caller, /" %s'%rhino_target
    puts %x{#{sed_cmd2}}

    match = '  var caller = arguments.callee.caller'
    sed_cmd3 = 'sed -i -e "s/%s/\/\/%s/" %s'%[match, match, rhino_target]
    puts %x{#{sed_cmd3}}
  end

  desc 'Compile JS in SIMPLE_OPTIMIZATION mode for [target]'
  task :simple, [:target] => [:init, :'build:stupid_jssip_deps'] do |t, args|
    target = args[:target] || DEFAULT_TARGET
    Utils.build_compiled(Utils.get_js_script_name(target, 'min'), target)
  end

  desc 'Compile JS in ADVANCED_OPTIMIZAION mode for [target]'
  task :compile, [:target] => [:init, :'build:stupid_jssip_deps'] do |t, args|
    target = args[:target] || DEFAULT_TARGET
    Utils.build_compiled(Utils.get_js_script_name(target, 'opt'), target, true)
  end

  desc 'Generate a deps file'
  task :stupid_jssip_deps => [:init] do
    Utils.write_deps(JSSIP_DEPS, ['--root="src"'])
  end
end

desc 'Lists build dependencies for [target]'
task :deps, [:target] do |t, args|
  puts Utils.get_script_deps(args[:target] || DEFAULT_TARGET)
end

desc 'Run gjslint on the js directory'
task :lint, [:dir] do |t, args|
  dir = JS_DIR
  dir += "/#{args[:dir]}" if args[:dir]
  excludes = File.read(GJSLINT_EXCLUDES).split("\n").map do |f|
    f.match(/^\s*#/) ? nil : File.join(JS_DIR, f)
  end.compact.join(',') rescue ''
  puts %x{#{GJSLINT} --strict --exclude_files=#{excludes} -r #{dir}}
end


desc 'Run tests and build'
task :test => [:init, :lint, :'test:rhino', :'test:genspecs', :'test:specs']

namespace :test do
  desc 'Load endpoint.js into Rhino to check for warnings and fatal errors'
  task :rhino => [:'build:concat', :'build:simple', :'build:compile'] do |t, args|
    targets = [Utils.get_js_script_name(DEFAULT_TARGET),
               Utils.get_js_script_name(DEFAULT_TARGET, 'min'),
               Utils.get_js_script_name(DEFAULT_TARGET, 'opt')]
    targets.each do |target|
      target_path = BUILD_DIR + '/' + target
      puts("Rhino test: " + target_path)
      %x{java -jar #{RHINO_JS} -w -fatal-warnings -f #{target_path}}
      raise "Rhino: failed to load #{target_path}" unless $? == 0
    end
  end

  desc 'Run spec for [target]'
  task :spec, :target do |t, args|
    target = args[:target]
    target = Utils.specize_target_name(Utils.normalize_target_name(target))
    Utils.run_spec(target)
  end

  desc 'Run all specs for [namespace] or jssip'
  task :specs, :namespace do |t, args|
    ns = Utils.normalize_target_name(args[:namespace] || NAMESPACE, { :no_cap => true })
    specs_dir = TEST_BUILD_DIR
    puts specs_dir

    puts "Running specs for namespace [#{ns}]"
    puts
    Dir.glob(File.join(specs_dir, ns + "*.html")) do |file|
      target = file.split('/').last.gsub('.html','')
      Utils.run_spec(target)
    end
  end

  desc 'Generate spec runner for [target]'
  task :genspec, :target do |t, args|
    target = args[:target]
    target = Utils.specize_target_name(Utils.normalize_target_name(target))
    unless Utils.is_target_spec?(target)
      raise 'Unable to generate spec runner for non spec target'
    end

    Utils.build_specrunner(target)
  end

  desc 'Generate spec runners for [namespace] or jssip'
  task :genspecs, :namespace do |t, args|
    ns = args[:namespace] || ''

    puts "Generating specs for namespace [#{ns}]"
    Utils.find_spec_targets(ns).each do |target|
      Utils.build_specrunner(target)
    end
  end
end

##
# Class needed for the ERB template. See Util.build_specrunner
class SpecRunnerBindingProvider
  attr_accessor :target, :scripts, :jasmine_root, :base_root
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
    [get_script_prefix(target, type), 'js'].join('.')
  end

  def self.get_script_prefix(target, type='')
    script_name = target.downcase.gsub(/^#{NAMESPACE}\./,'')
    script_name.prepend('test_') if is_target_spec?(target)
    type.empty? ? script_name : script_name << '.' << type
  end

  def self.get_script_deps(js_target)
    puts "Listing dependencies for target: #{js_target}"
    build_args = []
    build_args << '--output_mode=list'
    deps = build_js(js_target, build_args)
    deps.split.map do |f|
      project_dir = File.realpath(BASE_DIR + '/..')
      file_path = File.realpath(f);
      File.join(project_dir, file_path.gsub(/^#{project_dir}\/?/, ''))
    end
  end

  def self.build_specrunner(target)
    puts
    puts "Building specrunner for target: #{target}"
    script_names = Utils.get_script_deps(target)

    template_obj = SpecRunnerBindingProvider.new
    template_obj.target = target
    template_obj.scripts = script_names.map { |s| TEST_PROTOCOL + s }
    template_obj.jasmine_root = TEST_PROTOCOL + JASMINE_ROOT_PATH
    template_obj.base_root = TEST_PROTOCOL + BASE_DIR

    template = File.read(SPECRUNNER_TPL)

    output_file = target + '.html'
    path = File.join(TEST_BUILD_DIR, output_file)
    File.open(path, 'w') do |f|
      f.write(ERB.new(template).result(template_obj.get_binding))
    end
    puts "Wrote spec file: #{path}"
  end

  def self.build_script(filename, js_target)
    path = File.join(BUILD_DIR, filename)
    puts "Creating #{path} for namespace #{js_target}..."

    args = ['--output_mode=compiled', "--compiler_jar=#{CLSR_COMPILER}"]
    args.push('-f "--compilation_level=WHITESPACE_ONLY"')
    args.push('-f "--flagfile=compiler.flags"')
    args.push('-f "--formatting=PRETTY_PRINT"')

    # Running into this problem w/ popen3, see note in #build_js
    # File.open(path, 'w') do |f|
    #   content = build_js(js_target, args)
    #   f.write(content)
    # end
    build_js(js_target, args, path)

    puts "Wrote file #{path}"
  end

  def self.build_compiled(filename, js_target, advanced=false)
    path = File.join(BUILD_DIR, filename)
    puts "Creating compiled #{path} for namespace #{js_target}..."

    args = ['--output_mode=compiled', "--compiler_jar=#{CLSR_COMPILER}"]

    args.push('-f "--js=%s"'%CLSR_DEPS)
    args.push('-f "--js=%s"'%JSSIP_DEPS)
    args.push('-f "--compilation_level=ADVANCED_OPTIMIZATIONS"') if advanced
    args.push('-f "--flagfile=compiler.flags"')


    # Running into this problem w/ popen3, see note in #build_js
    # File.open(path, 'w') do |f|
    #   content = build_js(js_target, args)
    #   f.write(content)
    # end
    build_js(js_target, args, path)

    puts "Wrote file #{path}"
  end

  ##
  # Runs the closure builder with the build arguments for a target. Useful for:
  # - concating source
  # - compiling source
  # - listing target dependencies
  def self.build_js(js_target, build_args, path=nil)
    build_roots = is_target_spec?(js_target) ? CLSR_BUILDER_ROOTS_SPEC : CLSR_BUILDER_ROOTS
    cmd = <<EOS
    #{CLSR_BUILDER} \
      #{build_roots} \
      --namespace="#{js_target}" %s \
      #{build_args.join(' ')}
EOS
    cmd = cmd%[path ? "--output_file=#{path}" : ""]

    # Running into the problem discussed here w/ regard to popen3:
    # see http://www.ruby-forum.com/topic/158476
    # When stdout/stderr can fill up and block the ruby process until
    # they are read, some crazy shit with threads needs to read them
    # For the time being just use "--output_file"
    stdin, stdout, stderr, wait_thrd = Open3.popen3 cmd

    err = stderr.read
    if wait_thrd.value.exitstatus > 0
      $stderr.puts "Error running #{CLSR_BUILDER}:"
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
  def self.find_spec_targets(ns='')
    dir = File.join('spec',ns)
    specs = %x{find #{dir} -name "*_spec.js" | xargs -I{} grep -e "goog.provide(\'.*Spec\')" {} | cut -d: -f2 | cut -d\\\' -f2}
    specs.split
  end

  ##
  # Run the spec in phantomjs
  def self.run_spec(target)
    spec_url = TEST_PROTOCOL + File.join(TEST_BUILD_DIR, "#{target}.html")
    puts "Running Spec for #{target}"
    puts %x{#{PHANTOMJS_RUNNER} #{spec_url}}
  end

  def self.write_deps(path, build_args)
    file_warning = <<EOS
/******************************************************************************
//
// ATTENTION: This file was generated with 'rake build:stupid_jssip_deps' It is generally
// unusable for running standard closure DEBUG mode - use 'rake build:concat' or
// run the 'rake test:genspecs' task to autogenerate test files.
//
// This file is only here to avoid unnecessary goog.require statements in the jssip
// library during compilation. See here for more information:
// http://code.google.com/p/closure-library/wiki/FrequentlyAskedQuestions#When_I_compile_with_type-checking_on,_I_get_warnings_about_"
//
******************************************************************************/

EOS
    cmd_opts = build_args.join(' ')
    cmd = "#{CLSR_DEPSWRITER} #{cmd_opts}"
    puts "Building deps with command:"
    puts cmd
    File.open(path, 'w') do |f|
      f.puts file_warning
    end
    %x{#{cmd} >> #{path}}
  end
end
