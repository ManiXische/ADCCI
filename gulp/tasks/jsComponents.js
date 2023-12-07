import gulp from "gulp";
import jscomponentsBuilder from '../util/jsComponentsBuilder';
import getArguments from '../util/getArguments';
import lookups from '../util/lookups';
import configUtils from '../util/setThemePath';
import callbackTask from '../util/callbackTask';

let configuration = configUtils.getConf() || {};
let prerequisites = configuration.prerequisites || [];


gulp.task(`jsComponents` , ()=>{
    try{
        let args = getArguments();
        if(args.dest || (!args.isExtension && args.compileAll)){
            return jscomponentsBuilder(args).on("end", function(){
                // handle depenedencies copying  
                callbackTask(args , "js"); 
            });
        }
    }catch(err){
        console.log("jsComponents error: ", err);
    }
});


