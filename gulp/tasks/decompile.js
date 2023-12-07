import gulp from "gulp";
import deCompile from '../util/deCompile';
import lookups from '../util/lookups';
import getArguments from '../util/getArguments';
import configUtils from '../util/setThemePath';
import callbackTask from '../util/callbackTask';

let configuration = configUtils.getConf() || {};
let prerequisites = configuration.prerequisites || [];

gulp.task(`decompile` , ()=>{
    try{
        let args = getArguments();
        deCompile(args);
    }catch(err){
        console.log("copyStaticFiles error: ", err);
    }
});


