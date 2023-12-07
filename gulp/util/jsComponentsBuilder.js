import gulp from "gulp";
import gulpif from 'gulp-if';
import rename from 'gulp-rename';
import destPath from '../util/destPath';
import configUtils from '../util/setThemePath';
import lookups from './lookups';
import getConfigFile from "./getConfigFile";

const constants = lookups.constants;

export default function (args) {
    var config = getConfigFile();
    var conf = config.js;

    var jsPaths = [];
    if(conf.path && Array.isArray(conf.path)){
        conf.path.map((jsPath) =>{
            var customPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${jsPath.replace("!" , "")}`;

            if(jsPath.indexOf("!") != -1){
                customPath = `!${customPath}`;
            }
            jsPaths.push(customPath);
        });
    }else {
        var jsPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${conf.path}`;
        jsPaths.push(jsPath);
    }

    var jsPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${conf.path}`;

    return gulp.src(jsPaths)

        .pipe(gulpif((file) => {
            // renaming feature for later
            return false
        }, rename({
            suffix: "-1.0.0",
            prefix: ''
        })))
        .pipe(gulp.dest(function (file) {
            let folderPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/scripts`;
            if (args.dest) {
                folderPath = `${constants.themesFolder}/${args.dest}/scripts/${constants.extensionsFolder}/${args.path}`;
            }
            return destPath({ file: file }, folderPath);
        })
        ).on("end", function(){
            configUtils.appendConfig(args.path);
        })

};