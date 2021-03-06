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
TMP_BUILD_DIR = BUILD_DIR + '/tmp'

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
SPECRUNNER_HTML_TPL = '_specrunner.erb'
PHANTOMJS_RUNNER = 'phantomjs run-jasmine.js'
JASMINE_ROOT_PATH = THIRD_PARTY_DIR + '/jasmine-1.3.1'

NAMESPACE = 'jssip'
DEFAULT_TARGET = 'jssip.Endpoint'

GJSLINT = '/usr/local/bin/gjslint'
GJSLINT_EXCLUDES = BASE_DIR + '/.gjslintexcludes'

GRAMMAR_DIR = JS_DIR + '/sip/grammar'
PEGJS = 'pegjs'

task :default => [:'build:concat']

desc 'Init the build workspace'
task :init do
  FileUtils.mkdir(BUILD_DIR) unless File.directory?(BUILD_DIR)
  FileUtils.mkdir(TEST_BUILD_DIR) unless File.directory?(TEST_BUILD_DIR)
  FileUtils.mkdir(TMP_BUILD_DIR) unless File.directory?(TMP_BUILD_DIR)
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

  desc 'Build PEGJS Grammars'
  task :grammar do
    ns = 'jssip.sip.grammar';
    file_overview_banner = <<EOS
/**
 * @fileoverview This is an autogenerated file. Please do not edit.
 * @see Rake task ':build:grammar'
 */
EOS
    banners = [file_overview_banner]
    goog_deps = ['jssip.sip.grammar.pegutil.SyntaxError']
    goog_provide_banner = "goog.provide('%s');\\n\\n"
    goog_require_banner = "goog.require('%s');\\n"
    goog_type_annotation = "\\/** @type {{parse: function(string, string)}} *\\/\\n"

    Dir.glob(File.join(GRAMMAR_DIR, '*.pegjs')).each do |f|
      basename = File.basename(f, '.pegjs')
      provided_ns = '%s.%s'%[ns, basename]
      output_file = GRAMMAR_DIR + '/%s.autogen.js'%basename

      # Make sure this PEG grammar is older than than the output_file
      begin
        if File.mtime(output_file) > File.mtime(f)
          puts "Output File is newer than PEG grammar"
          puts "Skipping build for: %s"%[f]
          next
        end
      rescue Errno::ENOENT
        # just continue, output_file doesn't exist
      end

      cmd = '%s -e %s %s %s'%[PEGJS, provided_ns, f, output_file]
      puts cmd
      %x{#{cmd}}

      # Prepends one line to a file
      sed_cmd = 'sed -i -e "1s/^/%s/" %s'
      %x{#{sed_cmd%[goog_type_annotation, output_file]}}

      # Adds some whitespace
      %x{#{sed_cmd%["\\n\\n", output_file]}}

      # Add goog.require
      goog_deps.reverse_each do |goog_require_ns|
        tmp = goog_require_banner%goog_require_ns
        %x{#{sed_cmd%[tmp, output_file]}}
      end

      # Add goog.provide
      goog_provide_exp = goog_provide_banner%[provided_ns]
      tmp_cmd = sed_cmd%[goog_provide_exp, output_file]
      %x{#{tmp_cmd}}

      # Adds autogen statement
      banners.reverse_each do |banner|
        banner << "\n"
        banner = banner.gsub(/(\/)/,'\\/').gsub(/\n/, '\\n')
        %x{#{sed_cmd%[banner.gsub(/(\/)/,'\\/').gsub(/\n/, '\\n'), output_file]}}
      end

      # Fixup closure compiler error with pegjs parsers, the #toSource method is
      # added and returns {@code this._source}, but _source is never defined.
      # The compiler complains about this.
      sed_match = '\(\\/\\* Returns the parser source code. \\*\\/\)'
      sed_replace = '\1\\n_source: \'\', \\/\\/ Fixup for closure-compiler'
      sed_exp = "s/%s/%s/g"%[sed_match, sed_replace]
      sed_cmd = 'sed -i -e "%s" %s'%[sed_exp, output_file]
      %x{#{sed_cmd}}

      # Fixup problems with declaration of SyntaxError
      sed_match = 'result\.SyntaxError\s='
      sed_replace = 'var SyntaxError ='
      sed_exp = "s/%s/%s/g"%[sed_match, sed_replace]
      sed_cmd = 'sed -i -e "%s" %s'%[sed_exp, output_file]
      %x{#{sed_cmd}}

      # Fixup problems with declaration of SyntaxError
      sed_match = 'result\.SyntaxError'
      sed_replace = 'SyntaxError'
      sed_exp = "s/%s/%s/g"%[sed_match, sed_replace]
      sed_cmd = 'sed -i -e "%s" %s'%[sed_exp, output_file]
      %x{#{sed_cmd}}

      sed_match = 'this\.SyntaxError'
      sed_replace = 'jssip.sip.grammar.pegutil.SyntaxError'
      sed_exp = "s/%s/%s/g"%[sed_match, sed_replace]
      sed_cmd = 'sed -i -e "%s" %s'%[sed_exp, output_file]
      %x{#{sed_cmd}}

      sed_match = '\(SyntaxError\.prototype\s=\)'
      sed_replace = '\\/\\/\1'
      sed_exp = "s/%s/%s/g"%[sed_match, sed_replace]
      sed_cmd = 'sed -i -e "%s" %s'%[sed_exp, output_file]
      %x{#{sed_cmd}}

      # TODO(erick): Remove this once the compiler stops optimizing
      # the peg grammar out of the binary.
      goog_export = 'goog.exportSymbol(\'%s\', %s);'%[provided_ns, provided_ns]
      File.open(output_file, 'a') do |export_f|
        export_f << goog_export
      end
    end
  end

  task :common_deps do
    Rake::Task[:init].invoke
    Rake::Task[:'build:grammar'].invoke
    Rake::Task[:'build:stupid_jssip_deps'].invoke
  end

  desc 'Compile JS in WHITESPACE_ONLY mode for [target]'
  task :concat, [:target] => [:'build:common_deps'] do |t, args|
    target = args[:target] || DEFAULT_TARGET
    path = File.join(BUILD_DIR, Utils.get_js_script_name(target))
    Utils.build_script(path, target)
  end

  desc 'Compile JS for Rhino'
  task :rhino => :'build:concat' do
    # Rhino does not support argument.callee.caller, so need to revise
    # how goog.base and all calls to it are implemented.
    src = File.join(BUILD_DIR, Utils.get_js_script_name(DEFAULT_TARGET))
    dest = "build/endpoint.rhino.js"
    Utils.rhinoize_js(src, dest)
  end

  desc 'Compile JS in SIMPLE_OPTIMIZATION mode for [target]'
  task :simple, [:target] => [:'build:common_deps'] do |t, args|
    target = args[:target] || DEFAULT_TARGET
    Utils.build_compiled(Utils.get_js_script_name(target, 'min'), target)
  end

  desc 'Compile JS in ADVANCED_OPTIMIZAION mode for [target]'
  task :compile, [:target] => [:'build:common_deps'] do |t, args|
    target = args[:target] || DEFAULT_TARGET
    Utils.build_compiled(Utils.get_js_script_name(target, 'opt'), target, true)
  end

  desc 'Generate a deps file'
  task :stupid_jssip_deps => [:init] do
    Utils.write_deps(JSSIP_DEPS, ['--root="src"'])
  end

  desc 'Generate spec runner for [target]'
  task :spec, :target do |t, args|
    target = args[:target]
    target = Utils.specize_target_name(Utils.normalize_target_name(target))
    unless Utils.is_target_spec?(target)
      raise 'Unable to generate spec runner for non spec target'
    end

    Utils.build_specrunner(target)
  end

  desc 'Generate spec runners for [namespace] or jssip'
  task :specs, :namespace do |t, args|
    ns = args[:namespace] || ''

    puts "Generating specs for namespace [#{ns}]"
    Utils.find_spec_targets(ns).each do |target|
      Utils.build_specrunner(target)
    end
  end

  desc 'Generate specs for rhino'
  task :rhinospecs do
    Utils.build_specrunner_rhino
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
    f.match(/^\s*#/) ? nil : File.join(BASE_DIR, f)
  end.compact.join(',') rescue ''
  cmd_opts = [
              "--closurized_namespaces=#{NAMESPACE}",
              "--strict",
              "--exclude_files=#{excludes}",
              "--unix_mode",
              "--time",
              "-r #{dir}"
             ]
  cmd = "#{GJSLINT} " + cmd_opts.join(' ')
  puts "Running gjslint with:"
  puts cmd
  puts %x{#{cmd}}
end


# Note: test:specs calls an explicit exit, any tests added after test:specs
# won't run
desc 'Run tests and build'
task :test => [:clean,
               :init,
               :'test:rhino',
               :'build:rhinospecs',
               :'test:rhinospecs_noexit',
               :'build:specs',
               :'test:specs']

namespace :test do
  desc 'Load endpoint.js into Rhino to check for warnings and fatal errors'
  task :rhino => [:'build:concat', :'build:simple', :'build:compile'] do |t, args|
    targets = [Utils.get_js_script_name(DEFAULT_TARGET),
               Utils.get_js_script_name(DEFAULT_TARGET, 'min'),
               Utils.get_js_script_name(DEFAULT_TARGET, 'opt')]
    targets.each do |target|
      target_path = BUILD_DIR + '/' + target
      puts("test loading into rhino: " + target_path)
      %x{java -jar #{RHINO_JS} -w -fatal-warnings -f #{target_path} -opt -1}
      raise "Rhino: failed to load #{target_path}" unless $? == 0
    end
  end

  desc 'Run spec for [target]'
  task :spec, :target do |t, args|
    target = args[:target]
    target = Utils.specize_target_name(Utils.normalize_target_name(target))
    exitstatus = Utils.run_spec(target, :html)
    puts
    if exitstatus > 0
      puts '!!! Spec failed: %s'%target
    else
      puts '=== Horray! \o/ All specs passed ==='
    end
    puts
    exit exitstatus
  end

  desc 'Run all specs for [namespace] or jssip'
  task :specs, :namespace do |t, args|
    ns = Utils.normalize_target_name(args[:namespace] || NAMESPACE, { :no_cap => true })
    specs_dir = File.join(TEST_BUILD_DIR, 'html')
    puts specs_dir

    failed_test_targets = []
    puts "Running specs for namespace [#{ns}]"
    puts
    Dir.glob(File.join(specs_dir, ns + "*.html")) do |file|
      target = file.split('/').last.gsub('.html','')
      if Utils.run_spec(target, :html) > 0
        failed_test_targets << target
      end
    end

    puts
    unless failed_test_targets.empty?
      puts '!!! Specs failed: %s'%[failed_test_targets.join("\n")]
    else
      puts '=== Horray! \o/ All specs passed ==='
    end
    puts
    # TODO: this will break things if other tests include this as a dependency
    # (I think it's ok for the default test case since this runs last)
    exit failed_test_targets.length
  end

  desc 'Runs all specs in Rhino'
  task :rhinospecs do
    puts %x{java -jar #{RHINO_JS} -w -fatal-warnings -f run-jasmine-rhino.js -opt -1}
    exit $?.exitstatus
  end

  task :rhinospecs_noexit do
    puts %x{java -jar #{RHINO_JS} -w -fatal-warnings -f run-jasmine-rhino.js -opt -1}
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
  # Rhino can't and will never handle arguments.caller.callee (I lost the URL
  # telling me this, try searching again on the bugzilla or issue tracker for
  # rhino).  This removes all arguments.callee.caller references from a script
  # with lots of `sed` hackery
  def self.rhinoize_js(src_path, dest_path)
    puts "Rhinoizing File: Removes references to arguments.callee.caller from goog.base"
    sed_cmd = 'sed -e "s/goog.base(/rhino\.base\(arguments.callee, /" %s > %s'%[src_path, dest_path]
    puts sed_cmd
    %x{#{sed_cmd}}

    tmp = File.read(dest_path);
    File.open(dest_path, 'w') do |f|
      f.puts File.read(BASE_DIR + '/rhino.fixups.js');
      f.puts tmp
    end
  end

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

    build_specrunner_html(target, script_names)
  end

  def self.build_specrunner_html(target, script_names)
    template_obj = SpecRunnerBindingProvider.new
    template_obj.target = target
    template_obj.scripts = script_names.map { |s| TEST_PROTOCOL + s }
    template_obj.jasmine_root = TEST_PROTOCOL + JASMINE_ROOT_PATH
    template_obj.base_root = TEST_PROTOCOL + BASE_DIR

    template = File.read(SPECRUNNER_HTML_TPL)

    output_file = target + '.html'
    test_dir = File.join(TEST_BUILD_DIR, 'html')
    FileUtils.mkdir(test_dir) unless File.directory?(test_dir)
    path = File.join(test_dir, output_file)

    File.open(path, 'w') do |f|
      f.write(ERB.new(template).result(template_obj.get_binding))
    end
    puts "Wrote html spec file: #{path}"
  end

  def self.build_specrunner_rhino
    rhino_dir = File.join(TEST_BUILD_DIR, 'rhino')
    rhino_build_dir = File.join(rhino_dir, 'build')
    FileUtils.mkdir(rhino_dir) unless File.directory?(rhino_dir)
    FileUtils.mkdir(rhino_build_dir) unless File.directory?(rhino_build_dir)

    target = 'AllRhinoSpecs'
    spec_targets = find_spec_targets
    all_specs_path = File.join(rhino_build_dir, 'all_rhino_specs.js')
    File.open(all_specs_path, 'w') do |f|
      f.write('goog.provide(\'' + target + '\');' + "\n\n");
      spec_targets.each do |spec_target|
        f.write('goog.require(\'' + spec_target + '\');' + "\n")
      end
    end

    output_file = target + '.rhino.js'
    tmp_path = File.join(TMP_BUILD_DIR, output_file)
    path = File.join(rhino_dir, output_file)

    build_script(tmp_path, target, ['--root=%s'%rhino_build_dir])
    rhinoize_js(tmp_path, path)

    puts "Wrote rhino spec file: #{path}"
  end

  def self.build_script(path, js_target, opt_args=[])
    puts "Creating #{path} for namespace #{js_target}..."

    args = ['--output_mode=compiled', "--compiler_jar=#{CLSR_COMPILER}"].concat(opt_args)
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
  def self.run_spec(target, env)
    spec_url = TEST_PROTOCOL + File.join(TEST_BUILD_DIR, env.to_s, "#{target}.html")
    puts "Running Spec for #{target}"
    puts "#{PHANTOMJS_RUNNER} #{spec_url}"
    puts %x{#{PHANTOMJS_RUNNER} #{spec_url}}
    $?.exitstatus
  end

  def self.write_deps(path, build_args)
    file_warning = <<EOS
/******************************************************************************
//
// ATTENTION: This file was generated with 'rake build:stupid_jssip_deps' It is generally
// unusable for running standard closure DEBUG mode - use 'rake build:concat' or
// run the 'rake build:specs' task to autogenerate test files.
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
