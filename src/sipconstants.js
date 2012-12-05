goog.provide("JsSip.SipConstants");

JsSip.SipConstants.ALNUM;
JsSip.SipConstants.RESERVED = ";/?:@&=+$,";
JsSip.SipConstants.MARK = "-_.!~*'()";
JsSip.SipConstants.UNRESERVED =
  JsSip.SipConstants.ALNUM + JsSip.SipConstants.MARK;
JsSip.SipConstants.ESCAPED = "%";
JsSip.SipConstants.USER_UNRESERVED = "&=+$,;?/";
JsSip.SipConstants.PASS = "&=+$,";
// '=' was removed for parsing param
JsSip.SipConstants.TOKEN = "-.!%*_`'~+";
JsSip.SipConstants.HOST	= "_-.";
JsSip.SipConstants.HEX_DIGIT = "abcdefABCDEF";
JsSip.SipConstants.PARAM_CHAR = "[]/:&+$" +
  JsSip.SipConstants.UNRESERVED + JsSip.SipConstants.ESCAPED;
JsSip.SipConstants.HNV_UNRESERVED = "[]/?:+$";
JsSip.SipConstants.HDR_CHAR = JsSip.SipConstants.HNV_UNRESERVED +
  JsSip.SipConstants.UNRESERVED + JsSip.SipConstants.ESCAPED;

/* A generic URI can consist of (For a complete BNF see RFC 2396):
     #?;:@&=+-_.!~*'()%$,/
 */
JsSip.SipConstants.GENERIC_URI_CHARS = "#?;:@&=+-_.!~*'()%$,/%";
