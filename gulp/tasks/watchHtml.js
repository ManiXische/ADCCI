import gulp from 'gulp';
import watch from 'gulp-watch';
import fileActionResolver from '../util/fileActionResolver';
import getConfigFile from '../util/getConfigFile';
import login from './login';


gulp.task('watch-html',  () => {
    var config = getConfigFile();
    var conf = config.html;
    setTimeout(function() {
        console.log('Watching HTML files started...'.green);
    }, 0);
    return watch(conf.path, function(file) {
        fileActionResolver(file);
    })
});

gulp.task('html-watch', 
    function() {
        global.isWatching = true;
        gulp.run('watch-html')
    })