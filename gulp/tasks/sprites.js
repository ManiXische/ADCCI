import gulp from "gulp";
import spritesmith from 'gulp.spritesmith';
import getConfigFile from '../util/getConfigFile';


gulp.task('sprite-flag', function() {
    var config = getConfigFile();
    let conf = config.sprites.flags,
        spriteData = gulp.src(conf.flagsFolder).pipe(spritesmith(conf.spritesmith));
    spriteData.img.pipe(gulp.dest(conf.imgDest));
    return spriteData.css.pipe(gulp.dest(conf.cssDest));
});