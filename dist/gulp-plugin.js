'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _pluginError = require('plugin-error');

var _pluginError2 = _interopRequireDefault(_pluginError);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = htmlSourceIncludePlugin;


var PLUGIN_NAME = 'gulp-html-source-include';

function htmlSourceIncludePlugin() {
    return _through2.default.obj(function (fileObject, encoding, callback) {
        if (!fileObject.isBuffer()) {
            return callback(new _pluginError2.default(PLUGIN_NAME, 'Non-Buffer content is not supported'));
        }

        try {
            var content = (0, _helper.transformSource)(_path2.default.parse(fileObject.path).dir, fileObject.contents.toString());

            fileObject.contents = Buffer.from(content);

            this.push(fileObject);

            return callback();
        } catch (error) {
            return callback(new _pluginError2.default(PLUGIN_NAME, error));
        }
    });
}