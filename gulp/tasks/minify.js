import gulp from "gulp";
import minifyCSS from '../util/minifyCSS';
import minifyJS from '../util/minifyJS';
import getArguments from '../util/getArguments';



gulp.task('minifyCSS' , ()=>{
    try{
        let args = getArguments();
        return minifyCSS(args).on('end',function(){
            console.log("CSS minification done".green);
        });
    }catch(err){
        console.log("CSS minification error: ", err);
    }
});
gulp.task('minifyJS' , ()=>{
    try{
        let args = getArguments();
        return minifyJS(args).on('end',function(){
            console.log("JS minification done".green);
        });
    }catch(err){
        console.log("JS minification error: ", err);
    }
});


gulp.task('minify',
    function() {
        gulp.run('minifyCSS');
        gulp.run('minifyJS');
});
