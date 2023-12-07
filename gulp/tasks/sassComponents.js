import gulp from "gulp";
import componentsBuilder from '../util/sassComponentsBuilder';
import lookups from '../util/lookups';
import getArguments from '../util/getArguments';
import configUtils from '../util/setThemePath';
import callbackTask from '../util/callbackTask';

gulp.task('sassComponents' , ()=>{
    try{
        let args = getArguments();
        return componentsBuilder(args).on('end',function(){
            callbackTask(args , "sass"); 
        });
    }catch(err){
        console.log("sassComponents error: ", err);
    }
});

