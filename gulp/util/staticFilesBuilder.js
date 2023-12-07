import gulp from "gulp";
import gulpif from 'gulp-if';
import rename from 'gulp-rename';
//
import destPath from '../util/destPath';
import getConfigFile from '../util/getConfigFile';

import lookups from './lookups';
import resolveFileParentFolder from './resolveFileParentFolder';


const constants = lookups.constants;

export default function (args) {
    var config = getConfigFile();
    var basePath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/`;
    var imagesPath = `${basePath}/${config.img.path}`;
    var fontsPath = `${basePath}/${config.fonts.path}`;

    return gulp.src([fontsPath , imagesPath])
        .pipe(gulpif((file) => {
            // renaming feature for later
            return false
        }, rename({
            suffix: "-1.0.0",
            prefix: ''
        })))
        .pipe(gulp.dest(function (file) {
            let folder = resolveFileParentFolder(file, args);
            folder = folder.replace("fonts", "fonts$#*82").split("$#*82")[0];
            let folderPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${folder}`;
            if(args.dest || (!args.isExtension && args.compileAll)){
                // folderPath = `${constants.themesFolder}/${args.dest}/${folder}/${constants.extensionsFolder}/${args.path}`;
                folderPath = `${constants.themesFolder}/${args.dest}/${folder}`;
            }
            return destPath({ file: file }, folderPath);
        })
        )

};