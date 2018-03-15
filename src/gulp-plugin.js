import path from 'path';
import through2 from 'through2';
import PluginError from 'plugin-error';
import {transformSource} from './helper';

export default htmlSourceIncludePlugin;

const PLUGIN_NAME = 'gulp-html-source-include';

function htmlSourceIncludePlugin() {
    return through2.obj(function (fileObject, encoding, callback) {
        if (!fileObject.isBuffer()) {
            return callback(new PluginError(PLUGIN_NAME, 'Non-Buffer content is not supported'));
        }

        try {
            const content = transformSource(path.parse(fileObject.path).dir, fileObject.contents.toString());

            fileObject.contents = Buffer.from(content);

            this.push(fileObject);

            return callback();
        } catch (error) {
            return callback(new PluginError(PLUGIN_NAME, error));
        }
    });
}
