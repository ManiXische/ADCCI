import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import path from 'path';
import rimraf  from 'rimraf';
import lookups from './lookups';
import fs from 'fs';

import getArguments from './getArguments';

// export default (docxFileName)=>{
//         return docx4js.load(docxFileName).then(docx=>{
               
//                 //you can change content on docx.officeDocument.content, and then save
//                 docx.officeDocument.content("w\\:t").text("hello")
//                 docx.save("./changed.docx")
        
//         })
        
        
// }
const constants = lookups.constants;

function getUrl(args , url = ''){
        return url.replace(constants.extConstant , args.isExtension ? `${args.path}` : args.path )
        .replace(constants.versionConstant , args.version)
        .replace('_template' , `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}\\${args.isExtension ? `${args.path.indexOf("ex-") != -1 ? "" : constants.extensionPrefix}${args.path}` : args.path}`)
        .replace("\\", "/")
        ;
}

export default (sourceDocxFileName) => {
        //Load the docx file as a binary
        if (sourceDocxFileName) {
                let args = getArguments();
                let fileName = path.basename(sourceDocxFileName);                
                let destDocxFileName = getUrl(args , sourceDocxFileName);
               
                let tempFileToRemove  = sourceDocxFileName.replace('_template' , `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}\\${args.isExtension ? `${args.path.indexOf("ex-") != -1 ? "" : constants.extensionPrefix}${args.path}` : args.path}`)

                var content = fs.readFileSync(sourceDocxFileName, 'binary');

                var zip = new PizZip(content);

                var doc = new Docxtemplater();
                doc.loadZip(zip);

                //set the template variables
                doc.setData({
                        project_name : args.isExtension ? `${args.path.indexOf("ex-") != -1 ? "" : constants.extensionPrefix}${args.path}` : args.path,
                        version : args.version,
                        owner : args.owner ? (args.owner.charAt(0).toUpperCase() + args.owner.slice(1)) : '',
                        component_name : args.path ? (args.path.charAt(0).toUpperCase() + args.path.slice(1)) : '',
                        component_id: '1',
                        date : new Date().toLocaleDateString()
                });

                try {
                        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                        doc.render()
                }
                catch (error) {
                        var e = {
                                message: error.message,
                                name: error.name,
                                stack: error.stack,
                                properties: error.properties,
                        }
                        console.log(JSON.stringify({ error: e }));
                        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                        throw error;
                }

                var buf = doc.getZip()
                        .generate({ type: 'nodebuffer' });

                console.log("destDocxFileName" , destDocxFileName);
                
                // remove temp file 
                rimraf.sync(tempFileToRemove);                

                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                return fs.writeFileSync(destDocxFileName, buf);

        }

        return null;
}