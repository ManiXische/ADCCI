import {getParam } from './fetchParams';
import lookups from './lookups';

const constants = lookups.constants;

export default (args = {}) =>{
    let themePath = args.path || getParam("path");
    let isExtension = args.isExtension || getParam("extension") || (themePath.indexOf("ex-") != -1);
    let parent = `${isExtension ? constants.extensionsFolder : constants.themesFolder}/${themePath}/`;
    return parent;            
}