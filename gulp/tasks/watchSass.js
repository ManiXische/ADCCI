import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import watch from 'gulp-watch';
import path from 'path';
import fs from 'fs';
import prompt from 'gulp-prompt';
import sassGrapher from 'gulp-sass-grapher';
import filter from "gulp-filter";
import bulkSass from 'gulp-sass-bulk-import';
import sassVariables from 'gulp-sass-variables';
import gulpif from 'gulp-if';
import colors from 'colors'
//
import destPath from '../util/destPath';

import stylesBuilder from '../util/sassStyleBuilder';
import componentsBuilder from '../util/sassComponentsBuilder';
import updateFromDependency from '../util/sassUpdateFromDependency';
import removeTargetCss from '../util/removeTargetCss';
import startTask from '../util/startTask';
import { getParam } from '../util/fetchParams';
import configUtils from '../util/setThemePath';
import resolveIncludes from "../util/resolveIncludes";
import lookups from '../util/lookups';
import resolveDestFolder from '../util/resolveDestFolder';
import login from './login';
import getConfigFile from '../util/getConfigFile';


let configuration = configUtils.getConf() || {};
let options = configuration.options || {};
const constants = lookups.constants;


function getSassPath (){
    var config = getConfigFile();
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
    var conf = config.sass;
    var sassPath = `${isExtension ? constants.extensionsFolder : constants.themesFolder}/${themePath}/${conf.root}`;
    return sassPath;
}
gulp.task('watch-styles', () => {
    return watch(getSassPath(), function (file) {
        stylesBuilder(file);
    })

})

gulp.task('watch-base', () => {
    return watch(getSassPath(), function (file) {
        stylesBuilder(file);
        componentsBuilder(file);
    })
})

gulp.task('watch-component', () => {
    var config = getConfigFile();
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
    let dest = getParam("dest");
    let isWatching = getParam("watch");

    if (!themePath) {
        console.log("Please specify which adge/extension are you working on --path 'adge'".red);
        if(isWatching){
            console.log("Watching sass files skipped'".blue);
        }
        return;
    }


    let args = {
        isExtension,
        path: themePath,
        dest,
        version : options.version,
        owner : options.owner,
    };

    return watch(getSassPath(), {})
        .on('unlink', function (file) {
            removeTargetCss(file);
        })
        .pipe(sassVariables({
            $ProjectName: args.path,
            $ProjectVersion : '',
            $ProjectOwner: '',
        }))
        .pipe(gulpif(function (file) {

            return file.event == 'change' || file.event == 'add';
        }, bulkSass()))
        .pipe(gulpif(function () {
            return config.sassSourceMap;
        }, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [
                'shared', // public vars
                ...resolveIncludes(args), // specific vars
            ]
        }).on('error', function (error) {
            startTask('watch-component', 0)
            sass.logError.call(this, error);
        }))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(rename({ dirname: '' }))
        .pipe(gulpif(function () {
            return config.sassSourceMap;
        }, sourcemaps.write()))
        .pipe(gulp.dest(function (file) {
            return destPath({ file: file }, resolveDestFolder(args,  "styles"));
        }));
});

gulp.task('watch-dependency', () => {
    var config = getConfigFile();
    let conf = config.stylesConfig;
    return watch('sass/styles/**/*.scss', {  }, function (file) {
        let dirName = file.dirname.match('[a-z\-]*$')[0],
            fileName = conf[dirName];
        if (fileName) {
            updateFromDependency(file, fileName);
        }

    })
})


gulp.task('sass-watch',
    function () {
        setTimeout(function () {
            console.log('Watching SASS files started...'.green);
        }, 0);
        global.isWatching = true;
        gulp.run('watch-component')
        gulp.run('watch-base')
        gulp.run('watch-styles')
        gulp.run('watch-dependency')
    })