'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.raw = exports.default = undefined;

var _helper = require('./helper');

var IS_RAW = true;

exports.default = htmlSourceIncludeLoader;
exports.raw = IS_RAW;


function htmlSourceIncludeLoader(source) {
    this.cacheable();

    return (0, _helper.transformSource)(this.context, source.toString());
}