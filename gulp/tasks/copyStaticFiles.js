import gulp from "gulp";
import staticFilesBuilder from '../util/staticFilesBuilder';
import lookups from '../util/lookups';
import getArguments from '../util/getArguments';
import configUtils from '../util/setThemePath';
import callbackTask from '../util/callbackTask';

let configuration = configUtils.getConf() || {};
let prerequisites = configuration.prerequisites || [];

gulp.task(`copyStaticFiles` , ()=>{
    try{
        let args = getArguments();
        if(args.dest){
            return staticFilesBuilder(args).on("end", function(){
                // handle depenedencies copying  
                callbackTask(args , "static"); 
            });
        }else if(!args.isExtension && args.compileAll){
            callbackTask(args , "static"); 
        }
    }catch(err){
        console.log("copyStaticFiles error: ", err);
    }
});


