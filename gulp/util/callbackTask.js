import gulp from "gulp";
import sassComponentsBuilder from '../util/sassComponentsBuilder';
import jsComponentsBuilder from '../util/jsComponentsBuilder';
import staticFilesBuilder from '../util/staticFilesBuilder';
import lookups from '../util/lookups';
import getArguments from '../util/getArguments';
import configUtils from '../util/setThemePath';

let configuration = configUtils.getConf() || {};
let prerequisites = configuration.prerequisites || [];

let factory = {
    "sass" : sassComponentsBuilder,
    "js" : jsComponentsBuilder,
    "static" : staticFilesBuilder
};

function compileDependencies(name,factoryType, taskName , taskargs = {}){
    // compile each name inside this extension 
    let args = getArguments();
    args.path = name;
    args = Object.assign(args , taskargs);

    gulp.task(taskName, ()=>{
        return factory[factoryType] &&  factory[factoryType](args);
    });

}

export default function(args , factoryType) {
    var tasks = [];
    if(args.dest && args.isExtension){
        // recursive the task for each adge branding extension
        let taskargs = getArguments(lookups.compilationType.theme);
        
        let taskName = `${factoryType}-${taskargs.dest}-${taskargs.path}`;
        compileDependencies(taskargs.path , factoryType ,taskName, {compilationType : lookups.compilationType.theme});

        tasks.push(taskName);

        
        if(prerequisites && prerequisites.length){
            for (let i = 0; i < prerequisites.length; i++) {
                const prerequisite = prerequisites[i];

                // for ext
                let taskName = `${factoryType}-${prerequisite}`;
                compileDependencies(prerequisite , factoryType ,taskName, {compilationType : lookups.compilationType.extension});
                tasks.push(taskName);      

                // for website 
                taskName = `${factoryType}-${taskargs.dest}-${prerequisite}`;
                compileDependencies(prerequisite , factoryType ,taskName , {compilationType : lookups.compilationType.theme});
                tasks.push(taskName);  
            }
        }

    }
    if(!args.isExtension && args.compileAll){
        // this is a website , compile the dependencies one by one
        for(let name in configuration.modules || {}){
            // first task to compile related extension
            let taskName = `${factoryType}-${args.path}-${name}`;
            compileDependencies(name , factoryType ,taskName , {isExtension : true , dest : args.path, compilationType : lookups.compilationType.extension});
            tasks.push(taskName);

            // second task to compile related theme
            taskName = `${factoryType}-for-${args.path}-${name}`;
            compileDependencies(name , factoryType ,taskName , {isExtension : true , dest : args.path, compilationType : lookups.compilationType.theme});
            tasks.push(taskName);

        }
    }
    
    tasks.length && gulp.run(tasks);

};