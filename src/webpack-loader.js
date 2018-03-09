import {transformSource} from './helper';

const IS_RAW = true;

export {
    htmlSourceIncludeLoader as default,
    IS_RAW as raw
};

function htmlSourceIncludeLoader(source) {
    this.cacheable();

    return transformSource(this.context, source.toString());
}
