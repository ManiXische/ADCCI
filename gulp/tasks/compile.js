import gulp from 'gulp';
import login from './login';
import getArguments from '../util/getArguments';


gulp.task('compile', () => {
        let args = getArguments();
        gulp.run('sassComponents');
        if(!args.isExtension){
                gulp.run('minify');             
        }
        gulp.run('jsComponents');
        gulp.run('copyStaticFiles');
});
