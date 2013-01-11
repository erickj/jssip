goog.provide('jssip.message.MessageSpec');

goog.require('jssip.message.Message');
//goog.require('jssip.message.Message.Builder');

describe("SIP Message", function() {

  it("should return case insensitive raw header values", function() {
    var message = new jssip.message.Message([
      "to", "homer"
    ]);

    expect(message.getHeader("to").getValue()).toBe("homer");
    expect(message.getHeader("To")).toBe("homer");
    expect(message.getHeader("foo")).toBe(null);
  });

  it("should set headers in the order provided", function() {
    var message = new jssip.message.Message([
      "first", 1,
      "second", 2,
      "third", 3
    ]);

    var headers = message.getHeaders();
    expect(headers[0].getName()).toBe("first");
    expect(headers[1].getName()).toBe("second");
    expect(headers[2].getName()).toBe("third");
  });

  it("should append new headers to the end", function() {
    var message = new jssip.message.Message(["to", "homer"]);
    message.appendHeaders(["from", "marge", "call-id", "abc"]);

    var headers = message.getHeaders();
    expect(headers[0]).toEqual({ to: "homer" });
    expect(headers[1]).toEqual({ from: "
  });
});