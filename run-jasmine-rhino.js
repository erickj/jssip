load('lib/envjs/env.rhino.1.2.js');
load('lib/jasmine-1.3.1/jasmine.js');
load('lib/jasmine-1.3.1/jasmine-html.js');
load('jasmine-console-runner.js');

var dir = 'build/test_out/rhino';
load(dir + '/AllRhinoSpecs.rhino.js');

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 0;

  var htmlReporter = new jasmine.HtmlReporter();
  //      jasmineEnv.addReporter(htmlReporter);

  // Use the trivial reporter for tie in with the run-jasmine.js script
//  jasmineEnv.addReporter(new jasmine.TrivialReporter());

  // Use the console reporter for printing results directly to console for
  // headless testing
  var consoleReporter = new jasmine.ConsoleReporter();
  jasmineEnv.addReporter(consoleReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  jasmineEnv.execute();
  quit(consoleReporter.failCount() > 0 ? 1 : 0);
})();
