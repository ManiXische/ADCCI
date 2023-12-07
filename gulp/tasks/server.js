import gulp from "gulp";
import gulpOpen from "gulp-open";
import gulpif from 'gulp-if';
import connect from "gulp-connect";
import {getParam} from '../util/fetchParams';
import lookups from '../util/lookups';

const constants = lookups.constants;


function getFolderPath(){
  let themePath = getParam('path');
  let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
  if(themePath){
    return `${isExtension ? constants.extensionsFolder : constants.themesFolder}/${themePath}`;
  }
  return null;
}

function getFilesPath(fileName){
  var themePath = getFolderPath();
  let port = getParam('port') || 8080;
  let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
  var baseURL = `http://localhost`;
  // var baseURL = `http://10.250.106.139`;
  if(themePath){
    console.log(`${baseURL}:${port}/${themePath}/${isExtension ? 'templates' : ''}/`)
    return `${baseURL}:${port}/${themePath}/${isExtension ? 'templates' : ''}/`;
  }
  return `${baseURL}:${port}`;
}
function getIncludes(){
  var themePath = getFolderPath();
  let isExtension = getParam("extension") || (themePath.indexOf("ex-") != -1);
  if(themePath && isExtension){
    return `${themePath}/templates/*.html`;
  }
  if(isExtension){
    return `${themePath}/`;
  }
  return './**/**/*.html';
}
 
gulp.task('connect', function() {
  connect.server({
    name: 'Components Server',
    root: '.',
    // host : '10.250.106.139',
    host : 'localhost',
    port: 8080,
    livereload: true
  });
});
 
gulp.task('html', function () {
  gulp.src(getIncludes())
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([getIncludes()], ['html']);
});

gulp.task('open',['connect'],function(){
  var opened = false;
  return gulp.src(getIncludes() )
  .pipe(gulpif(function () {
    if(!opened){
      opened = true;
      return opened;
    }
  }, gulpOpen({uri: getFilesPath()})));
});

gulp.task('server' , ['connect' , 'html']);
 
gulp.task('server',
  function() {
      global.isWatching = true;
      gulp.run('html');
      gulp.run('open');
      gulp.run('watch');
})

