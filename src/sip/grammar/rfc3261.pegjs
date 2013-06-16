/**
 * Thanks to https://github.com/versatica/JsSIP
 *
 * For Parser documentation and syntax:
 * @see http://pegjs.majda.cz/documentation#grammar-syntax-and-semantics-parsing-expression-types
 * @see https://github.com/dmajda/pegjs
 *
 * Note: Rules which only consist of a single expression will be optimized away
 * by when the pegjs parser is built.  For instance:
 *
 * A_Rule = non_terminal
 *
 * A_Rule won't exist in the final parser, a quick hack is to add a label to the
 *  rule:
 *
 * A_Rule = a_rule: non_terminal
 */
// ABNF BASIC

CRLF    = "\r\n"
DIGIT   = [0-9]
ALPHA   = [a-zA-Z]
HEXDIG  = [0-9a-fA-F]
WSP     = SP / HTAB
OCTET   = [\u0000-\u00FF]
DQUOTE  = ["]
SP      = " "
HTAB    = "\t"


// BASIC RULES

alphanum    = [a-zA-Z0-9]
reserved    = ";" / "/" / "?" / ":" / "@" / "&" / "=" / "+" / "$" / ","
unreserved  = alphanum / mark
mark        = "-" / "_" / "." / "!" / "~" / "*" / "'" / "(" / ")"
escaped     = "%" HEXDIG HEXDIG

/* RFC3261 25: A recipient MAY replace any linear white space with a single SP
 * before interpreting the field value or forwarding the message downstream
 */
LWS = ( WSP* CRLF )? WSP+ {return " "; }

SWS = LWS?

HCOLON  = ( SP / HTAB )* ":" SWS {return ':'; }

TEXT_UTF8_TRIM  = TEXT_UTF8char+ ( LWS* TEXT_UTF8char)*

TEXT_UTF8char   = [\x21-\x7E] / UTF8_NONASCII

UTF8_NONASCII   = [\u0080-\uFFFF]

UTF8_CONT       = [\x80-\xBF]

LHEX            = DIGIT / [\x61-\x66]

token           = (alphanum / "-" / "." / "!" / "%" / "*"
                  / "_" / "+" / "`" / "'" / "~" )+ { return input.substring(pos, offset); }

token_nodot     = ( alphanum / "-"  / "!" / "%" / "*"
                  / "_" / "+" / "`" / "'" / "~" )+ { return input.substring(pos, offset); }

separators      = "(" / ")" / "<" / ">" / "@" / "," / ";" / ":" / "\\"
                  / DQUOTE / "/" / "[" / "]" / "?" / "=" / "{" / "}"
                  / SP / HTAB

word            = (alphanum / "-" / "." / "!" / "%" / "*" /
                  "_" / "+" / "`" / "'" / "~" /
                  "(" / ")" / "<" / ">" /
                  ":" / "\\" / DQUOTE /
                  "/" / "[" / "]" / "?" /
                  "{" / "}" )+ { return input.substring(pos, offset); }

STAR        = SWS "*" SWS   {return "*"; }
SLASH       = SWS "/" SWS   {return "/"; }
EQUAL       = SWS "=" SWS   {return "="; }
LPAREN      = SWS "(" SWS   {return "("; }
RPAREN      = SWS ")" SWS   {return ")"; }
RAQUOT      = ">" SWS       {return ">"; }
LAQUOT      = SWS "<"       {return "<"; }
COMMA       = SWS "," SWS   {return ","; }
SEMI        = SWS ";" SWS   {return ";"; }
COLON       = SWS ":" SWS   {return ":"; }
LDQUOT      = SWS DQUOTE    {return "\""; }
RDQUOT      = DQUOTE SWS    {return "\""; }

comment     = LPAREN (ctext / quoted_pair / comment)* RPAREN

ctext       = [\x21-\x27] / [\x2A-\x5B] / [\x5D-\x7E] / UTF8_NONASCII / LWS

quoted_string = SWS DQUOTE ( qdtext / quoted_pair )* DQUOTE { return input.substring(pos, offset); }

quoted_string_clean = SWS DQUOTE ( qdtext / quoted_pair )* DQUOTE { return input.substring(pos, offset); }

qdtext  = LWS / "\x21" / [\x23-\x5B] / [\x5D-\x7E] / UTF8_NONASCII

quoted_pair = "\\" ( [\x00-\x09] / [\x0B-\x0C] / [\x0E-\x7F] )


//=======================
// SIP URI
//=======================

SIP_URI_noparams  = uri_scheme ":"  userinfo ? hostport { return input.substring(pos, offset); }

SIP_URI         = uri_scheme ":"  userinfo ? hostport uri_parameters headers ? { return input.substring(pos, offset); }

uri_scheme      = ( "sips"i / "sip"i )

userinfo        = user (":" password)? "@"

user            = ( unreserved / escaped / user_unreserved )+ { return input.substring(pos, offset); }


user_unreserved = "&" / "=" / "+" / "$" / "," / ";" / "?" / "/"

password        = ( unreserved / escaped / "&" / "=" / "+" / "$" / "," )* { return input.substring(pos, offset); }

hostport        = host ( ":" port )?

host            = ( hostname / IPv4address / IPv6reference ) { return input.substring(pos, offset); }

hostname        = ( domainlabel "." )* toplabel  "." ?

domainlabel     = domainlabel: ( [a-zA-Z0-9_-]+ )

toplabel        = toplabel: ( [a-zA-Z_-]+ )

IPv6reference   = "[" IPv6address "]"

IPv6address     = ( h16 ":" h16 ":" h16 ":" h16 ":" h16 ":" h16 ":" ls32
                  / "::" h16 ":" h16 ":" h16 ":" h16 ":" h16 ":" ls32
                  / "::" h16 ":" h16 ":" h16 ":" h16 ":" ls32
                  / "::" h16 ":" h16 ":" h16 ":" ls32
                  / "::" h16 ":" h16 ":" ls32
                  / "::" h16 ":" ls32
                  / "::" ls32
                  / "::" h16
                  / h16 "::" h16 ":" h16 ":" h16 ":" h16 ":" ls32
                  / h16 (":" h16)? "::" h16 ":" h16 ":" h16 ":" ls32
                  / h16 (":" h16)? (":" h16)? "::" h16 ":" h16 ":" ls32
                  / h16 (":" h16)? (":" h16)? (":" h16)? "::" h16 ":" ls32
                  / h16 (":" h16)? (":" h16)? (":" h16)? (":" h16)? "::" ls32
                  / h16 (":" h16)? (":" h16)? (":" h16)? (":" h16)? (":" h16)? "::" h16
                  / h16 (":" h16)? (":" h16)? (":" h16)? (":" h16)? (":" h16)? (":" h16)? "::"
                  )


h16             = HEXDIG HEXDIG? HEXDIG? HEXDIG?

ls32            = ( h16 ":" h16 ) / IPv4address


IPv4address     = dec_octet "." dec_octet "." dec_octet "." dec_octet

dec_octet       = "25" [\x30-\x35]          // 250-255
                / "2" [\x30-\x34] DIGIT     // 200-249
                / "1" DIGIT DIGIT           // 100-199
                / [\x31-\x39] DIGIT         // 10-99
                / DIGIT                     // 0-9

port            = port: (DIGIT ? DIGIT ? DIGIT ? DIGIT ? DIGIT ?)

// URI PARAMETERS

uri_parameters    = ( ";" uri_parameter)*

uri_parameter     = transport_param / user_param / method_param
                    / ttl_param / maddr_param / lr_param / other_param

transport_param   = "transport="i transport: ( "udp"i / "tcp"i / "sctp"i
                    / "tls"i / other_transport)

other_transport   = token

user_param        = "user="i user:( "phone"i / "ip"i / other_user)

other_user        = token

method_param      = "method="i method: Method

ttl_param         = "ttl="i ttl: ttl

maddr_param       = "maddr="i maddr: host

lr_param          = "lr"i ('=' token)?

other_param       = param: pname value: ( "=" pvalue )?

pname             = pname: paramchar +

pvalue            = pvalue: paramchar +

paramchar         = param_unreserved / unreserved / escaped

param_unreserved  = "[" / "]" / "/" / ":" / "&" / "+" / "$"


// HEADERS

headers           = "?" header ( "&" header )*

header            = hname: hname "=" hvalue: hvalue

hname             = ( hnv_unreserved / unreserved / escaped )+

hvalue            = ( hnv_unreserved / unreserved / escaped )*

hnv_unreserved    = "[" / "]" / "/" / "?" / ":" / "+" / "$"


// FIRST LINE

Request_Response  = Status_Line / Request_Line


// REQUEST LINE

Request_Line      = Method SP Request_URI SP SIP_Version

Request_URI       = SIP_URI / absoluteURI

absoluteURI       = scheme ":" ( hier_part / opaque_part )

hier_part         = ( net_path / abs_path ) ( "?" query )?

net_path          = "//" authority  abs_path ?

abs_path          = "/" path_segments

opaque_part       = uric_no_slash uric *

uric              = reserved / unreserved / escaped

uric_no_slash     = unreserved / escaped / ";" / "?" / ":" / "@" / "&" / "="
                    / "+" / "$" / ","

path_segments     = segment ( "/" segment )*

segment           = pchar * ( ";" param )*

param             = pchar *

pchar             = unreserved / escaped /
                    ":" / "@" / "&" / "=" / "+" / "$" / ","

scheme            = ( ALPHA ( ALPHA / DIGIT / "+" / "-" / "." )* )

authority         = srvr / reg_name

srvr              = ( ( userinfo "@" )? hostport )?

reg_name          = ( unreserved / escaped / "$" / ","
                    / ";" / ":" / "@" / "&" / "=" / "+" )+

query             = uric *

SIP_Version       = "SIP"i "/" DIGIT + "." DIGIT +

// SIP METHODS

INVITEm           = "\x49\x4E\x56\x49\x54\x45" // INVITE in caps

ACKm              = "\x41\x43\x4B" // ACK in caps

OPTIONSm          = "\x4F\x50\x54\x49\x4F\x4E\x53" // OPTIONS in caps

BYEm              = "\x42\x59\x45" // BYE in caps

CANCELm           = "\x43\x41\x4E\x43\x45\x4C" // CANCEL in caps

REGISTERm         = "\x52\x45\x47\x49\x53\x54\x45\x52" // REGISTER in caps

SUBSCRIBEm        = "\x53\x55\x42\x53\x43\x52\x49\x42\x45" // SUBSCRIBE in caps

NOTIFYm           = "\x4E\x4F\x54\x49\x46\x59" // NOTIFY in caps

Method            = ( INVITEm / ACKm / OPTIONSm / BYEm / CANCELm / REGISTERm
                    / SUBSCRIBEm / NOTIFYm / extension_method )

extension_method  = token


// STATUS LINE

Status_Line     = SIP_Version SP Status_Code SP Reason_Phrase

Status_Code     = status_code: extension_code

extension_code  = DIGIT DIGIT DIGIT

Reason_Phrase   = (reserved / unreserved / escaped
                  / UTF8_NONASCII / UTF8_CONT / SP / HTAB)*


//=======================
// HEADERS
//=======================

// Allow

Allow  =  Method (COMMA Method)*

// Allow-Events

Allow_Events = event_type (COMMA event_type)*

// Authorization

Authorization     =  authorization: credentials

credentials       =  ("Digest"i LWS digest_response) / other_response

digest_response   =  dig_resp (COMMA dig_resp)*

dig_resp          =  username / realm / nonce / digest_uri
                      / dresponse / algorithm / cnonce
                      / opaque / message_qop
                      / nonce_count / auth_param

username          =  "username"i EQUAL username_value

username_value    =  quoted_string

digest_uri        =  "uri"i EQUAL LDQUOT digest_uri_value RDQUOT

digest_uri_value  =  rquest_uri // Equal to request_uri as specified by HTTP/1.1

rquest_uri        =  SIP_URI_noparams

message_qop       =  "qop"i EQUAL qop_value

cnonce            =  "cnonce"i EQUAL cnonce_value

cnonce_value      =  nonce_value

nonce_count       =  "nc"i EQUAL nc_value

nc_value          =  lhex8

dresponse         =  "response"i EQUAL request_digest

request_digest    =  LDQUOT lhex32 RDQUOT

lhex32            =  lhex16 lhex16

lhex16            =  lhex8 lhex8

lhex8             =  lhex4 lhex4

lhex4             =  lhex2 lhex2

lhex2             =  LHEX LHEX

auth_param        =  auth_param_name EQUAL
                     ( token / quoted_string )

auth_param_name   =  token

other_response    =  auth_scheme LWS auth_param
                     (COMMA auth_param)*

auth_scheme       =  token


// CALL-ID

Call_ID  =  word ( "@" word )?

// CONTACT

Contact             = ( STAR / (contact_param (COMMA contact_param)*) )

contact_param       = (addr_spec / name_addr) (SEMI contact_params)*

name_addr           = ( display_name )? LAQUOT SIP_URI RAQUOT

addr_spec           = addr_spec: SIP_URI_noparams

display_name        = display_name: (token ( LWS token )* / quoted_string)

contact_params      = c_p_q / c_p_expires / contact_extension

c_p_q               = "q"i EQUAL q: qvalue

c_p_expires         = "expires"i EQUAL expires: delta_seconds

contact_extension   = generic_param

delta_seconds       = delta_seconds: DIGIT+ { return input.substring(pos, offset); }

qvalue              = "0" ( "." DIGIT? DIGIT? DIGIT? )? { return input.substring(pos, offset); }

generic_param       = param: token  value: ( EQUAL gen_value )? {
  return (value instanceof Array) ? [param, value[0], value[1]] : [param]; }

gen_value           = token / host / quoted_string


// CONTENT-DISPOSITION

Content_Disposition     = disp_type ( SEMI disp_param )*

disp_type               = "render"i / "session"i / "icon"i / "alert"i / disp_extension_token

disp_param              = handling_param / generic_param

handling_param          = "handling"i EQUAL ( "optional"i / "required"i / other_handling )

other_handling          = token

disp_extension_token    = token


// CONTENT-ENCODING

Content_Encoding    = content_coding (COMMA content_coding)*

content_coding      = token


// CONTENT-LENGTH

Content_Length      = length: (DIGIT +)

// CONTENT-TYPE
// adds the "content_type:"" label so that the PEG parser rules don't optimize
// away Content_Type

Content_Type        = content_type: media_type

media_type          = m_type SLASH m_subtype (SEMI m_parameter)*

m_type              = discrete_type / composite_type

discrete_type       = "text"i / "image"i / "audio"i / "video"i / "application"i
                    / extension_token

composite_type      = "message"i / "multipart"i / extension_token

extension_token     = ietf_token / x_token

ietf_token          = token

x_token             = "x-"i token

m_subtype           = extension_token / iana_token

iana_token          = token

m_parameter         = m_attribute EQUAL m_value

m_attribute         = token

m_value             = token / quoted_string


// CSEQ

CSeq          = CSeq_value LWS CSeq_method

CSeq_value    = cseq_value: DIGIT +

CSeq_method   = Method


// EXPIRES

Expires     = expires: delta_seconds


Event             = event_type: event_type ( SEMI event_param )*

event_type        = event_package ( "." event_template )*

event_package     = token_nodot

event_template    = token_nodot

event_param       = generic_param

// FROM

From        = ( addr_spec / name_addr ) ( SEMI from_param )*

from_param  = tag_param / generic_param

tag_param   = "tag"i EQUAL tag: token


//MAX-FORWARDS

Max_Forwards  = forwards: DIGIT+


// MIN-EXPIRES

Min_Expires  = min_expires: delta_seconds

// Name_Addr

Name_Addr_Header =  ( display_name )* LAQUOT SIP_URI RAQUOT ( SEMI generic_param )*


// PROXY-AUTHENTICATE

Proxy_Authenticate  = proxy_authenticate: challenge

challenge           = ("Digest"i LWS digest_cln (COMMA digest_cln)*)
                      / other_challenge

other_challenge     = auth_scheme LWS auth_param (COMMA auth_param)*

auth_scheme         = token

auth_param          = auth_param_name EQUAL ( token / quoted_string )

auth_param_name     = token

digest_cln          = realm / domain / nonce / opaque / stale / algorithm
                      / qop_options / auth_param

realm               = "realm"i EQUAL realm_value

realm_value         = realm: quoted_string_clean

domain              = "domain"i EQUAL LDQUOT URI ( SP+ URI )* RDQUOT

URI                 = absoluteURI / abs_path

nonce               = "nonce"i EQUAL nonce_value

nonce_value         = nonce: quoted_string_clean

opaque              = "opaque"i EQUAL opaque: quoted_string_clean

stale               = "stale"i EQUAL ( "true"i / "false"i )

algorithm           = "algorithm"i EQUAL algorithm: ( "MD5"i / "MD5-sess"i
                      / token )

qop_options         = "qop"i EQUAL LDQUOT (qop_value ("," qop_value)*) RDQUOT

qop_value           = qop_value: ( "auth-int"i / "auth"i / token )


// PROXY-REQUIRE

Proxy_Require  = option_tag (COMMA option_tag)*

option_tag     = token


// RECORD-ROUTE

Record_Route  = rec_route (COMMA rec_route)*

rec_route     = name_addr ( SEMI rr_param )*

rr_param      = generic_param


// REQUIRE

Require       = option_tag (COMMA option_tag)*


// ROUTE

Route        = route_param (COMMA route_param)*

route_param  = name_addr ( SEMI rr_param )*

// SERVER

Server           =  server_val ( LWS server_val )*

server_val       =  product / comment

product          =  token ( SLASH product_version )?

product_version  =  token

// SUBSCRIPTION-STATE

Subscription_State   = substate_value ( SEMI subexp_params )*

substate_value       = ( "active"i / "pending"i / "terminated"i
                       / extension_substate )

extension_substate   = token

subexp_params        = ("reason"i EQUAL reason: event_reason_value)
                       / ("expires"i EQUAL expires: delta_seconds)
                       / ("retry_after"i EQUAL retry_after: delta_seconds)
                       / generic_param

event_reason_value   = "deactivated"i
                       / "probation"i
                       / "rejected"i
                       / "timeout"i
                       / "giveup"i
                       / "noresource"i
                       / "invariant"i
                       / event_reason_extension

event_reason_extension = token


// SUBJECT

Subject  = ( TEXT_UTF8_TRIM )?


// SUPPORTED

Supported  = ( option_tag (COMMA option_tag)* )?


// TO

To         = ( addr_spec / name_addr ) ( SEMI to_param )*

to_param   = tag_param / generic_param

// USER-AGENT

User_Agent  =  server_val ( LWS server_val )*

// VIA

Via               = via_parm (COMMA via_parm)*

via_parm          = sent_protocol LWS sent_by ( SEMI via_params )*

via_params        = via_ttl / via_maddr / via_received / via_branch / response_port / via_extension

via_ttl           = "ttl"i EQUAL via_ttl_value: ttl

via_maddr         = "maddr"i EQUAL via_maddr: host

via_received      = "received"i EQUAL via_received: (IPv4address / IPv6address)

via_branch        = "branch"i EQUAL via_branch: token

response_port     = "rport"i (EQUAL response_port: (DIGIT*) )?

via_extension     = generic_param

sent_protocol     = protocol_name SLASH protocol_version SLASH transport

protocol_name     = via_protocol: ( "SIP"i / token )

protocol_version  = token

transport         = via_transport: ("UDP"i / "TCP"i / "TLS"i / "SCTP"i / other_transport)

sent_by           = via_host ( COLON via_port )?

via_host          = ( hostname / IPv4address / IPv6reference )

via_port          = via_sent_by_port: (DIGIT ? DIGIT ? DIGIT ? DIGIT ? DIGIT ?)

ttl               = ttl: (DIGIT DIGIT ? DIGIT ?)


// WWW-AUTHENTICATE

WWW_Authenticate  = www_authenticate: challenge


// EXTENSION-HEADER

extension_header  = extension_header: header_name HCOLON header_value: header_value

header_name       = token

header_value      = (TEXT_UTF8char / UTF8_CONT / LWS)*

message_body      = OCTET*


// STUN URI (draft-nandakumar-rtcweb-stun-uri)

stun_URI          = stun_scheme ":" stun_host_port

stun_scheme       = scheme: ("stuns"i / "stun"i)

stun_host_port    = stun_host ( ":" port )?

stun_host         = host: (IPv4address / IPv6reference / stun_reg_name)

stun_reg_name          = ( stun_unreserved / escaped / sub_delims )*

stun_unreserved   = ALPHA / DIGIT / "-" / "." / "_" / "~"

sub_delims        = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="


// TURN URI (draft-petithuguenin-behave-turn-uris)

turn_URI          = turn_scheme ":" stun_host_port ( "?transport=" transport )?

turn_scheme       = scheme: ("turns"i / "turn"i)

turn_transport    = transport ("udp"i / "tcp"i / unreserved*)
