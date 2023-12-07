import gitusername from 'git-user-name';
import configUtils from '../util/setThemePath';
import {getParam} from '../util/fetchParams';
import lookups from '../util/lookups';


let configuration = configUtils.getConf() || {};
let options = configuration.options || {};


export default (compilationType = lookups.compilationType.extension)=>{
    if(!configuration){
        console.log("Configuration is empty");
        return;
    }
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
    let isNew = getParam("create");
    let dest = getParam("dest");
    let version = getParam('version');
    let compileAll = getParam('all');

    return {
        isExtension,
        path : themePath,
        new : isNew,
        dest,
        version : version || options.version || '1.0.0',
        owner : options.owner || gitusername(),
        compilationType,
        compileAll
    };
}