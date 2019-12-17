'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transformSource = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INCLUSION_REGEXP = /([^\n]*)<include src="((?:[\w/.-]+))"><\/include>/g;

exports.transformSource = transformSource;


function transformSource(context, source) {
    var inclusions = getInclusions(source);

    inclusions.forEach(getFilePath.bind(null, context));

    inclusions.forEach(getFileContent);

    return inclusions.reduce(function (accumulator, inclusion) {
        return accumulator.split(inclusion.placeholder).join(inclusion.fileContent);
    }, source);
}

function getInclusions(source) {
    var match = null;
    var inclusions = [];

    while ((match = INCLUSION_REGEXP.exec(source)) && match) {
        var _match = match,
            _match2 = _slicedToArray(_match, 3),
            placeholder = _match2[0],
            indentation = _match2[1],
            relativePath = _match2[2];

        inclusions.push({ placeholder: placeholder, indentation: indentation, relativePath: relativePath });
    }

    return inclusions;
}

function getFilePath(context, inclusion) {
    var absolutePath = _path2.default.resolve(context, inclusion.relativePath);

    Object.assign(inclusion, { absolutePath: absolutePath });
}

function getFileContent(inclusion) {
    var context = _path2.default.parse(inclusion.absolutePath).dir;
    var fileContent = readFileSync(inclusion.absolutePath);
    var transformedFileContent = transformSource(context, fileContent).split(/\n/).map(function (lineContent) {
        return '' + inclusion.indentation + lineContent;
    }).join('\n');

    Object.assign(inclusion, { fileContent: transformedFileContent });
}

function readFileSync(filePath) {
    return _fs2.default.readFileSync(filePath, 'utf-8');
}