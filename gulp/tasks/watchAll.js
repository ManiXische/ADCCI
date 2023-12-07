import gulp from 'gulp';
import login from './login';
import server from './server';

 
gulp.task('all-watch',
    function() {
        global.isWatching = true;
        gulp.run('sass-watch')
        gulp.run('js-watch')
        gulp.run('css-watch')
        gulp.run('img-watch')
        gulp.run('watch-source-sass')
        gulp.run('html-watch')
    })

// gulp.task('default', ['all-watch'])

gulp.task('default', ['server', 'all-watch']);