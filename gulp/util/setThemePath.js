//Used in post init
let path = require('path');
let fs = require('fs');
import {getParam , setParam} from './fetchParams';
import lookups from './lookups';

const constants = lookups.constants;

var getConfigFilePath = () => {
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
    let isNew = getParam("create");
    let isWatching = getParam("watch");
    if(!isNew && !isWatching){
        if(!themePath ){
            console.log((`Theme path is ${themePath} should be provided, add --path 'anything' to your command`).red);
            return null;
        }else {
            return `${isExtension ? constants.extensionsFolder : constants.themesFolder}/${themePath}/gulp/serverConfig.json`;
        }
    }
}
var appendConfig = (extName) => {
    let themeDest = getParam("dest");
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);;
    if(themeDest && isExtension){
        let themeURL = `${constants.themesFolder}/${themeDest}/gulp/serverConfig.json`;
        let extensionThemeURL = `${constants.extensionsFolder}/${extName}/gulp/serverConfig.json`;
        let extensionConfig = getConf(extensionThemeURL),
        themeConfig = getConf(themeURL);
        if(!themeConfig){
            console.log("Wrong config path");
            return
        }
        !themeConfig.modules && (themeConfig.modules = {});
        
        // add this extension to theme config
        themeConfig.modules[extName] = {
            "version" : extensionConfig.options.version,
            "order" : extensionConfig.order,
            "jsOrders" : extensionConfig.jsOrders || [],
            "cssOrders" : extensionConfig.cssOrders || [],
            "prerequisites" :  extensionConfig.prerequisites || []
        };

        try {
            fs.writeFileSync(themeURL, JSON.stringify(themeConfig));
        }catch(err){
            console.log("Wrong config settings");
        }
    }
}
var removeFromConfig = (extName) => {
    let themeDest = getParam("dest");
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
    let compileAll = getParam("all");

    if((themeDest && isExtension && extName) || (themePath && compileAll && !isExtension)){
        let themeURL = `${constants.themesFolder}/${themeDest}/gulp/serverConfig.json`;
        if(themePath && compileAll && !isExtension){
            themeURL = `${constants.themesFolder}/${themePath}/gulp/serverConfig.json`;
        }
        let themeConfig = getConf(themeURL);
        if(!themeConfig){
            console.log("Wrong config path");
            return
        }
        if(themePath && compileAll && !isExtension){
            // empty all modules 
            themeConfig.modules = {};
        }else if(extName){
            delete themeConfig.modules[extName];
        }

        console.log("themeConfig.modules" , themeConfig.modules);
        
        try {
            fs.writeFileSync(themeURL, JSON.stringify(themeConfig));
        }catch(err){
            console.log("Wrong config settings");
        }
    }
}
var getConf = (url) => {
    try {
        let configFile = url || getConfigFilePath();
        if(configFile){
            let fileContent = fs.readFileSync(configFile)
            return JSON.parse(fileContent)    
        }
    }catch(err){
        console.log("Wrong configuration path".red , err);
    }
}
let setConfig = (content) => {
    try {
        fs.writeFileSync(getConfigFilePath(), JSON.stringify(content));
    }catch(err){
        console.log("Wrong config settings");
    }
}
module.exports = {
    "getConf": getConf,
    "appendConfig" : appendConfig,
    "removeFromConfig" : removeFromConfig,
    "updateConfig": function () {
        let currPath = path.join(__dirname, '../..'),
            mediaLibPath = currPath.split('-' + path.sep + 'media'),
            isCreativeExchange = mediaLibPath.length > 1,
            themePath,
            projPath;
        if (isCreativeExchange) {
            try {
                let config = getConf(),
                    pathSep = path.sep == "\\" ? path.sep + path.sep : path.sep,
                    pathReg = new RegExp(pathSep + "[\\w\\d\\. ]*$", "i");
                themePath = mediaLibPath[1].match(pathReg)[0];
                projPath = mediaLibPath[1].replace(pathReg, '');
                config.serverOptions.tenant = projPath;
                config.serverOptions.name = themePath;
                setConfig(config);
            } catch (e) {
                console.log(e);
            }
        }
    }
}