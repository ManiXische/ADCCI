import gulp from "gulp";
import rimraf from 'rimraf';
import concat from 'gulp-concat';
import minifyJS from 'gulp-minify';
import destPath from '../util/destPath';
import lookups from './lookups';
import resolveDestFolder from "./resolveDestFolder";
import getConfigFile from "./getConfigFile";
import configUtils from '../util/setThemePath';

const constants = lookups.constants;

function removePath(targetPath){
    if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath)
    }
}


export default function (args) {
    try{
        if(args.dest){
            rimraf.sync(`themes/${args.dest}/scripts/extensions/${args.path}`);
            rimraf.sync(`themes/${args.dest}/styles/extensions/${args.path}`);
            configUtils.removeFromConfig(args.path);
            return true;
        }else if(!args.isExtension && args.compileAll){
            rimraf.sync(`themes/${args.path}/scripts/extensions`);
            rimraf.sync(`themes/${args.path}/styles/extensions`);    
            configUtils.removeFromConfig();
            return true;
        }
    }catch(ex){
        return false
    }
};