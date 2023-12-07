import gulp from 'gulp';
import watch from 'gulp-watch';
import fileActionResolver from '../util/fileActionResolver';
import getConfigFile from '../util/getConfigFile';
import login from './login';


gulp.task('watch-css',  () => {
    var config = getConfigFile();
    var conf = config.css;
    setTimeout(function() {
        console.log('Watching CSS files started...'.green);
    }, 0);
    return watch(conf.path, function(file) {
        fileActionResolver(file);
    })
});

gulp.task('css-watch', 
    function() {
        global.isWatching = true;
        gulp.run('watch-css')
    })