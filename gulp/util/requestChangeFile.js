import path from 'path';
import request from 'request';
import * as fs from 'fs';
import resolveFileParentFolder from './resolveFileParentFolder';
import getConfigFile from './getConfigFile';

export default function(file) {
    var config = getConfigFile();
    var conf = config.serverOptions,
        name = path.basename(file.path),
        dirName = path.dirname(file.path),
        relativePath = path.relative(global.rootPath, dirName),
        pathFolder = resolveFileParentFolder(file),
        prom = new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve();
            }, 600);
            let url = [conf.server,
                conf.uploadScriptPath,
                '?user=',
                config.user.login,
                '&password=',
                config.user.password,
                '&script=',
                conf.tenant,
                conf.name,
                '/',
                pathFolder,
                '&sc_database=master&apiVersion=media&scriptDb=master'
            ].join('');
            var formData = {
                file: fs.createReadStream(relativePath + '/' + name),
            };
            var a = request.post({
                url: url,
                formData: formData
            }, function(err, httpResponse, body) {
                resolve();
                if (err) {
                    return console.log(('upload failed:' + err).red);
                }
                if (httpResponse.statusCode !== 200) {
                    console.log(('Status code:' + httpResponse.statusCode).red);
                    console.log(('Answer:' + httpResponse.body).red);
                    return
                } else {
                    return console.log(('Uploading of ' + name + ' was successful!').green);
                }
            });
        });
    return prom;
}