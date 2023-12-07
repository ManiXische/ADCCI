import path from 'path';

var getLogMessage = function(files, filePath) {
    var message = 'Action: ';
    if (typeof files.origFile !== 'undefined') {
        message += files.origFile.event;
    } else if (typeof files.file !== 'undefined' && files.file.event) {
        message += files.file.event;
    }
    message += '. File: ';
    message += filePath;
    message += '/';
    message += path.basename(files.file.path);
    return message;
}

export default function(files, folder = 'styles') {
    console.log(getLogMessage(files, folder).yellow);
    return folder;
};