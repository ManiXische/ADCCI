import gulp from "gulp";
import gulpif from 'gulp-if';
import replace from 'gulp-batch-replace';
import rename from 'gulp-rename';
import path from 'path';
import rimraf  from 'rimraf';
import pathExists from 'path-exists';
import gitusername from 'git-user-name';
import {getParam} from '../util/fetchParams';
import lookups from '../util/lookups';
import generateDocs from '../util/generateDocs';

gulp.task(`create` , ()=>{
    try{
        let themePath = getParam("path");
        let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
        let version = getParam("version") || '1.0.0';
        let docxFileName = '';
        const constants = lookups.constants;

        if(!themePath || typeof themePath != 'string'){
            console.log("You should provide new template name after --new".red);
            return;
        }
        let destFolder = `${isExtension ? constants.extensionsFolder : constants.themesFolder }/${isExtension ? `${themePath}` : themePath}`;

        let exists = pathExists.sync(destFolder);
        if(exists){
            console.log("This project is exists, please choose another path or remove the existed one".red);
            return ;
        }

        return gulp.src(['_template/**/*'])

        .pipe(gulpif((file) => {
            var fileName = path.basename(file.path);
            if(path.extname(file.path) == '.docx'){
                docxFileName = file.path;
            }

            if(fileName.indexOf(constants.extConstant)){
                return true;
            }
            return false
        }, rename(function (file) {
            file.basename = file.basename.replace(constants.extConstant , themePath);
            file.basename = file.basename.replace(constants.versionConstant , version);
        })))
        .pipe(replace([
            [ constants.projectNameConstant, isExtension ? `\\\\${(themePath.indexOf("ex-") != -1 ? ""  : constants.extensionPrefix) + themePath}` : `\\\\${themePath}` ],
            [ constants.tenantConstant, isExtension ? '\\\\Extension Themes' : `\\\\Themes\\\\${themePath}\\\\${themePath}` ],
            [ constants.extConstant, themePath ],
            [ constants.ownerConstant, gitusername() ],
            [ constants.versionConstant, version ],
        ]))
        .pipe(gulp.dest(destFolder))
        .on("end", function(){
            // clean theme 
            if(isExtension){
                rimraf.sync(`${destFolder}/vars/_override.scss`);                
                rimraf.sync(`${destFolder}/vars/_branding.scss`);                
            }
            if(docxFileName){
                generateDocs(docxFileName);
            }

            console.log("Your project has been created".yellow);
        });
    }catch(err){
        console.log("creating template failed error: ", err);
    }
});


