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

function sortObjectEntries(obj) {
    let sortedList = [],
    length = Object.keys(obj).length;
    sortedList = Object.entries(obj).sort((a, b) => {
        if (!a[1].order) {
            a[1].order = length;
        }
        if (!b[1].order) {
            b[1].order = length;
        }
        if (b[1].order < a[1].order) return 1;
        else if (b[1].order > a[1].order) return -1;
        else {
            if (a[0].order < b[0].order) return 1;
            else if (a[0].order > b[0].order) return -1;
            else return 0
        }
    });
    // return first n values from sortedList
    return sortedList.map(el => {
        return {
            name : el[0],
            ...el[1]
        } 
    });
}

function getPaths(args) {
    var config = getConfigFile();
    var conf = config.js;
    let paths = [];
    let basePath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/`

    // order files for each extension 
    let configURL = `${basePath}/gulp/serverConfig.json`;
    let configuration = configUtils.getConf(configURL) || {};
    let modules = configuration.modules || {};
    let sortedModules = sortObjectEntries(modules);

    for (let i = 0 ; i < sortedModules.length ; i ++) {
        let jsOrders = sortedModules[i].jsOrders || [];
        jsOrders.map((file) => {
            paths.push(`${basePath}scripts/extensions/${sortedModules[i].name}/${file}`);
        });

        // add the extension as a sorted folder 
        paths.push(`${basePath}scripts/extensions/${sortedModules[i].name}/**/*.js`);
    }

    // basic one 
    if (conf.path && Array.isArray(conf.path)) {
        conf.path.map((p) => {
            var jsPath = `${basePath}${p}`;
            jsPath = jsPath.replace("scripts", "scripts/extensions");
            if(jsPath.indexOf("!") !=  -1){
                jsPath = "!" +jsPath.replace("!",  "");
            }
            paths.push(jsPath);
        });
    } else {
        var jsPath = `${basePath}${conf.path}`;
        jsPath = jsPath.replace("scripts", "scripts/extensions");
        if(jsPath.indexOf("!") !=  -1){
            jsPath = "!" +jsPath.replace("!",  "");
        }
        paths.push(jsPath);
    }
    return paths;
}


export default function (args) {
    var outputFileName = 'ext-components-scripts.js';

    return gulp.src(getPaths(args))
        .pipe(concat(outputFileName))
        .pipe(minifyJS({
            noSource: false
        }))
        .pipe(gulp.dest(function (file) {
            return destPath({ file: file }, resolveDestFolder(args, "scripts"));
        })
            .on("end", function () {
                rimraf.sync(resolveDestFolder(args, `scripts/${outputFileName}`));
            }))
};