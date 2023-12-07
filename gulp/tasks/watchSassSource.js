import gulp from 'gulp';
import watch from 'gulp-watch';
import fileActionResolver from '../util/fileActionResolver';
import getConfigFile from '../util/getConfigFile';
import login from './login';


gulp.task('watch-source-sass', () => {
    var config = getConfigFile();
    var conf = config.sass;
    return watch(conf.root, function(file) {
        fileActionResolver(file);
    })
});

gulp.task('sass-source-watch', 
    function() {
        global.isWatching = true;
        gulp.run('watch-source-sass')
    })