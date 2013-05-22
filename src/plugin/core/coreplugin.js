goog.provide('jssip.plugin.core.CorePlugin');



/**
 * Do shit
 * @constructor
 * @implements {jssip.plugin.Plugin}
 */
jssip.plugin.core.CorePlugin = function() {
};


/** @override */
jssip.plugin.core.CorePlugin.prototype.load = function(endpoint) {
  var parserRegistry = endpoint.getParserRegistry;


  // Register header parsers
  for (var key in jssip.plugin.core.HeaderParser.HEADERS) {
    parserRegistry.registerHeaderParserFactory(
        jssip.plugin.core.HeaderParser.HEADERS[key],
        jssip.plugin.core.HeaderParserFactory);
  }

  for (var key in jssip.plugin.core.URI_SCHEMES_) {
  }
};