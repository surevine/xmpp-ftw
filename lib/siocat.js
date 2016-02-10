/* @flow */
'use strict';

var builder = require('ltx'),
    Base    = require('./base'),
    sio = require('./utils/xep-0258')

var SioCat = function() {}

SioCat.prototype = new Base()

SioCat.prototype.NS = 'urn:xmpp:sec-label:catalog:2'

SioCat.prototype._events = {
    'xmpp.siocat.get': 'get'
}

SioCat.prototype.handles = function(stanza) {
    return !!(stanza.is('iq') &&
        (stanza.getChild('catalog', this.NS)))
}

SioCat.prototype.handle = function(stanza) {
    return false
}

SioCat.prototype.get = function(data, callback) {
    if (typeof callback !== 'function')
        return this._clientError('Missing callback')
    var self   = this
    var stanza = new builder.Element(
        'iq',
        { from: this.manager.jid.split('/')[0], type: 'get', id: this._getId() }
    ).c('catalog', {xmlns: this.NS, to: data.target}).up()

    this.manager.trackId(stanza, function(stanza) {
        self.handleResult(stanza, callback)
    })
    this.client.send(stanza)
}

SioCat.prototype.handleResult = function(stanza, callback) {
    var self  = this
    var items = []
    if ('error' === stanza.attrs.type)
        return callback(this._parseError(stanza), null)
    stanza.getChild('catalog').getChildren('item').forEach(function(item) {
        var entry = {
            selector: item.attrs.selector
        }
        sio.parse(item, entry)
        items.push(entry)
    })
    callback(null, items)
}

module.exports = SioCat
