import gulp from 'gulp';
import login from './login';


gulp.task('deploy', ['login'],
    function() {
        // gulp.run('sassComponents');
        // gulp.run('minify');
        gulp.run('upload-gulp');
});
