import gulp from "gulp";
import sass from 'gulp-sass';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import sassVariables from 'gulp-sass-variables';
import bulkSass from 'gulp-sass-bulk-import';
import gulpif from 'gulp-if';
import rename from 'gulp-rename';
import destPath from '../util/destPath';
import lookups from './lookups';
import resolveIncludes from "./resolveIncludes";
import resolveDestFolder from "./resolveDestFolder";
import resolveParent from "./resolveParent";
import getConfigFile from "./getConfigFile";

const constants = lookups.constants;

export default function (args) {
    var config = getConfigFile();

    var conf = config.sass.components;
    var sassPaths = [];
    if(conf.sassPath && Array.isArray(conf.sassPath)){
        conf.sassPath.map((sassPath) =>{
            var customPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${sassPath}`;

            if(sassPath.indexOf("!") != -1){
                customPath = `!${customPath}`;
            }
            sassPaths.push(customPath);
        });
    }else {
        var sassPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${conf.sassPath}`;
        sassPaths.push(sassPath);
    }
    // await new Promise((resolve, reject) => {
    return gulp.src(sassPaths)
        .pipe(sassVariables({
            $ProjectName: args.path,
            $ProjectVersion:'',
            $ProjectOwner: '',
        }))
        .pipe(bulkSass())
        .pipe(gulpif(function () {
            return config.sassSourceMap;
        }, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [
                'shared', // public vars
                ...resolveIncludes(args), // specific vars
            ],
        }).on('error', function (error) {
            sass.logError.call(this, error);
        }))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulpif(function () {
            return config.sassSourceMap;
        }, sourcemaps.write()))
        .pipe(gulpif((file) => {

            return false
        }, rename({
            suffix: "-1.0.0",
            prefix: ''
        })))
        .pipe(gulp.dest(function (file) {
            let filename = path.basename(file.path) ,
            dirname = resolveParent(args);
            if(filename.split(".").length >= 4 || filename.indexOf("ignore") != -1){
                return dirname + "styles";
            }
            return destPath({ file: file }, resolveDestFolder(args , "styles"));
        })
    )
    // });
};