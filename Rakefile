require 'fileutils'
require 'open3'
require 'yaml'

BUILD_DIR = 'build'
TEST_OUT_DIR = 'test_out'

CLOSURE_BUILDER = 'lib/closure-library/bin/build/closurebuilder.py'
CLOSURE_BUILDER_ROOTS = '--root=lib/closure-library --root=lib/closure-library-third-party --root=src'
CLOSURE_BUILDER_ROOTS_SPEC = CLOSURE_BUILDER_ROOTS + ' --root=spec'
CLOSURE_COMPILER = 'lib/closure-compiler/compiler.jar'

NAMESPACE = 'jssip'
DEFAULT_TARGET = 'jssip.Endpoint'

task :default => [:package]

desc 'Init the build workspace'
task :init do
  FileUtils.mkdir(BUILD_DIR) unless File.directory?(BUILD_DIR)
end

desc 'Clean any generated files'
task :clean do
  FileUtils.rm_r(BUILD_DIR, :force => true)
  FileUtils.mkdir(BUILD_DIR)
  FileUtils.rm_r(TEST_OUT_DIR, :force => true)
end

desc 'Lists build dependencies for [target]'
task :deps, [:target] do |t, args|
  puts get_script_deps(args[:target] || DEFAULT_TARGET)
end

desc 'Concat files to sip.js'
task :concat, [:target] => [:init] do |t, args|
  target = args[:target] || DEFAULT_TARGET
  build_script(get_js_script_name(target), target)
end

desc 'Minify Javascript for [target]'
task :minify, [:target] => [:init] do |t, args|
  target = args[:target] || DEFAULT_TARGET
  build_compiled(get_js_script_name(target, 'min'), target)
end

desc 'Compile Javascript for [target]'
task :compile, [:target] => [:init] do |t, args|
  target = args[:target] || DEFAULT_TARGET
  build_compiled(get_js_script_name(target, 'opt'), target, true)
end

def is_target_spec(target)
  !!target.match(/.*spec/i)
end

def get_js_script_name(target, type='')
  script_name = target.downcase.gsub(/^#{NAMESPACE}\./,'')
  script_name << '_test' if is_target_spec(target)
  script_name << type
  script_name << '.js'
end

def get_script_deps(js_target)
  build_js(js_target, '--output_mode=list')
end

def build_script(filename, js_target)
  path = File.join(BUILD_DIR, filename)
  puts "Creating #{path} for namespace #{js_target}..."

  File.open(path, 'w') do |f|
    content = build_js(js_target, '--output_mode=script')
    f.write(content)
  end
  puts "Wrote file #{path}"
end

def build_compiled(filename, js_target, advanced=false)
  path = File.join(BUILD_DIR, filename)
  puts "Creating compiled #{path} for namespace #{js_target}..."

  args = ['--output_mode=compiled', "--compiler_jar=#{CLOSURE_COMPILER}"]

  # TODO(erick): This seems to be broken in closurebuilder.py currently, it
  # passes the compiler flags after the --js flags.  The compiler complains
  # about this.
  # args.push('-f "--compilation_level ADVANCED_OPTIMIZATIONS"') if advanced

  File.open(path, 'w') do |f|
    content = build_js(js_target, args)
    f.write(content)
  end
  puts "Wrote file #{path}"
end

def build_js(js_target, *build_args)
  build_roots = is_target_spec(js_target) ? CLOSURE_BUILDER_ROOTS_SPEC : CLOSURE_BUILDER_ROOTS
  stdin, stdout, stderr, wait_thrd = Open3.popen3 <<EOS
    #{CLOSURE_BUILDER} \
      #{build_roots} \
      --namespace="#{js_target}" \
      #{build_args.join(' ')}
EOS

  if wait_thrd.value.exitstatus > 0
    $stderr.puts "Error running #{CLOSURE_BUILDER}:"
    $stderr.puts
    $stderr.puts stderr.read
  end

  ret = stdout.read

  stdin.close
  stdout.close
  stderr.close

  ret
end
