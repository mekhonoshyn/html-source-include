import fs from 'fs';
import path from 'path';

const INCLUSION_REGEXP = /<include src="((?:[\w/.-]+))"><\/include>/g;

export {transformSource};

function transformSource(context, source) {
    const inclusions = getInclusions(source);

    inclusions.forEach(getFilePath.bind(null, context));

    inclusions.forEach(getFileContent);

    return inclusions.reduce((accumulator, inclusion) => accumulator.split(inclusion.placeholder).join(inclusion.fileContent), source);
}

function getInclusions(source) {
    let match = null;
    const inclusions = [];

    while ((match = INCLUSION_REGEXP.exec(source)) && match) {
        const [placeholder, relativePath] = match;

        inclusions.push({placeholder, relativePath});
    }

    return inclusions;
}

function getFilePath(context, inclusion) {
    const absolutePath = path.resolve(context, inclusion.relativePath);

    Object.assign(inclusion, {absolutePath});
}

function getFileContent(inclusion) {
    const context = path.parse(inclusion.absolutePath).dir;
    const fileContent = readFileSync(inclusion.absolutePath);
    const transformedFileContent = transformSource(context, fileContent);

    Object.assign(inclusion, {fileContent: transformedFileContent});
}

function readFileSync(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}
