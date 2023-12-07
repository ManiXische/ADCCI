import gulp from "gulp";
import concat from 'gulp-concat';
import minifyCSS from 'gulp-clean-css';
import destPath from '../util/destPath';
import lookups from './lookups';
import resolveDestFolder from "./resolveDestFolder";
import getConfigFile from "./getConfigFile";
import configUtils from '../util/setThemePath';

const constants = lookups.constants;

function getPaths(args){
    var config = getConfigFile();
    var conf = config.css;
    let paths = [];
    let basePath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/`
    var cssPath = `${basePath}${conf.path}`;
    cssPath = cssPath.replace("styles" , "styles/extensions");
   
    // order files for each extension 
    let configURL = `${basePath}/gulp/serverConfig.json`;
    let configuration = configUtils.getConf(configURL) || {};
    let modules = configuration.modules || {};

    for(let name in modules){
        let cssOrders = modules[name].cssOrders || [];
        cssOrders.map((file)=>{
            paths.push(`${basePath}styles/extensions/${name}/${file}`);
        });
    }
    // basic one 
    paths.push(cssPath);

    return paths;
}

export default function (args) {
    var outputFileName = 'ext-components-styles-min.css';


        return gulp.src(getPaths(args))
        .pipe(minifyCSS({compatibility: 'ie8'}))
        .pipe(concat(outputFileName))
        .pipe(gulp.dest(function (file) {
            return destPath({ file: file }, resolveDestFolder(args , "styles"));
            })
        )
};