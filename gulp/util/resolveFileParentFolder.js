import path from 'path';
import {getParam } from './fetchParams';

export default (file , args = {}) =>{
    if(file){
        let themePath = getParam("path");
        let pathFolder = path.dirname(file.path);
        pathFolder = pathFolder.split(`${args.path || themePath}`)[1];
        return pathFolder;
    }
    return '';
}
