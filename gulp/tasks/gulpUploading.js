import gulp from 'gulp';
import watch from 'gulp-watch';
import path from 'path';
import fileActionResolver from '../util/fileActionResolver';
import lookups from '../util/lookups';
import resolveParent from '../util/resolveParent';
import { getParam } from '../util/fetchParams';
import login from './login';


function srcFolders(){

    // Included folders
    let includes = lookups.includes.map((folder)=>{
        let execluded = lookups.excludes.some((exd)=> `${exd.indexOf(folder)}` != -1);
        folder = execluded ? folder : `${folder}/**`;
        return `${resolveParent()}${folder}/*.*`;
    });
    // excluded folders 
    let excludes = lookups.excludes.map((folder) =>{
        return `!${resolveParent()}${folder}/*`;
    });
    // on demand ignored folders 
    let ignored = getParam("ignore");
    let ignoredList = [];
    if(ignored){
        ignoredList = ignored.split(",").map((name) =>{
            if(name.indexOf(".") != -1){
                // file 
                return `!${resolveParent()}${name}`;
            }else {
                // folder
                return `!${resolveParent()}${name}/**/*`;
            }
        });
    }
    
    // on demand upload 
    let files = getParam("files");
    if(files){
        // return on demanded files only 
        let filesList = files.split(",").map((name) =>{
            if(name.indexOf(".") != -1){
                // file 
                return `${resolveParent()}${name}`;
            }else {
                // folder
                // check if this file in execludes list 
                let exists = lookups.excludes.some((folder) => folder.indexOf(name) != -1);
                if(exists) {
                    // append only the direct childs
                    return `${resolveParent()}${name}/*`;
                }else {
                    // append the folder with its content 
                    return `${resolveParent()}${name}/**/*`;
                }
            }
        });

        return [...filesList ,...excludes];
    }

    return [...includes , ...excludes , ...ignoredList];
}

function findDestFolder (folders = []){
    let includes = lookups.includes;
    const constants = lookups.constants;
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
    let destPath = "";
    // check extension
    if(isExtension){
        destPath += `${constants.extensionsFolder}/`;
    }else{
        destPath += `${constants.themesFolder}/`;
    }
    // append theme path 
    destPath += `${themePath}/`;
    // find direct parent folder 
    for(let i = folders.length ; i > 0   ; i--){
        let folder = folders[i];
        if(includes.some((itf)=> itf == folder)){
            destPath += `${folder}/`;
            break;
        }
    }

    return destPath;
}
gulp.task('upload-gulp', async () => {
     await new Promise((resolve, reject) => {
    return gulp.src(srcFolders())
        .pipe(gulp.dest(function(file) {
            let folders = file.path.split(path.sep);
            let destPath = findDestFolder(folders);
            fileActionResolver(file, true);
            return destPath;
        }));
    });
});

gulp.task('watch-gulp', () => {
    return watch(['gulp/**/*.js', 'gulp/**/*.json'], function(file) {
        fileActionResolver(file);
    })
});