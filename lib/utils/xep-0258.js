/* @flow */
'use strict';

var NS = exports.NS = 'urn:xmpp:sec-label:0'

exports.parse = function(stanza, data) {
    if (!stanza.getChild('securitylabel', NS)) return
    var secel = stanza.getChild('securitylabel', NS)
    var securitylabel = {
      displaymarking: secel.getChild('displaymarking').getText(),
      fgcolor: secel.getChild('displaymarking').attrs.fgcolor,
      bgcolor: secel.getChild('displaymarking').attrs.bgcolor,
      labeless: secel.getChild('label').getChild('esssecuritylabel').getText()
    }
    data.securitylabel = securitylabel;
    return
}

exports.build = function(stanza, data) {
    if (!data.securitylabel) return
    var attrs = { xmlns: NS }
    var colours = { fgcolor: data.securitylabel.fgcolor, bgcolor: data.securitylabel.bgcolor }
    var label = stanza.c('securitylabel', attrs)
    label.c('displaymarking', colours).t(data.securitylabel.displaymarking)
    label.c('esssecuritylabel', {xmlns: 'urn:xmpp:secv-label:ess:0'}).t(labeless)
}
