import gulp from "gulp";
import styleBuilder from '../util/sassStyleBuilder';

gulp.task('sassStyles', function() {
    return styleBuilder();
});