import gulp from 'gulp';
import watch from 'gulp-watch';
import eslint from 'gulp-eslint';
import lookups from '../util/lookups';
import fileActionResolver from '../util/fileActionResolver';
import getConfigFile from '../util/getConfigFile';
import { getParam } from '../util/fetchParams';
import login from './login';


gulp.task('watch-js', () => {
    var config = getConfigFile();
    var conf = config.js;
    const constants = lookups.constants;
    let themePath = getParam("path");
    let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);

    var jsPath = `${isExtension ? constants.extensionsFolder : constants.themesFolder}/${themePath}/${conf.path}`;

    setTimeout(function() {
        console.log('Watching JS files started...'.green);
    }, 0);
    return watch(jsPath, { verbose: 0 }, function(file) {
        var stream = gulp.src(file.path)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.results(results => {
                // Called once for all ESLint results.
                if (results.errorCount == 0 || conf.esLintUploadOnError) {
                    fileActionResolver(file);
                } else {
                    console.log('Please fix errors before uploading or set esLintUploadOnError:true'.yellow);
                }
            }));


        return stream;
    })
});

gulp.task('js-watch', 
    function() {
        global.isWatching = true;
        gulp.run('watch-js')
    })