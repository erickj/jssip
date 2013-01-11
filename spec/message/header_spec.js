goog.provide('jssip.message.HeaderSpec');

goog.require('jssip.message.Header');

describe('SIP Message Header', function() {
  it('should have a gettable name', function() {
    var header = new jssip.message.Header('a name', 'a value');
    expect(header.getName()).toBe('a name');
  });

  it('should have a gettable value', function() {
    var header = new jssip.message.Header('a name', 'a value');
    expect(header.getValue()).toBe('a value');
  });
});