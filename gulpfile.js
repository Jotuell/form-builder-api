const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
// const gulpMocha = require('gulp-mocha');
// const env = require('gulp-env');
// const supertest = require('supertest');

gulp.task('default', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      'PORT': 3030
    },
    ignore: ['/node_modules/**']
  })
  .on('restart', () => {
    console.log('Restarting...');
  });
});

// gulp.task('test', () => {
//   env({vars: {ENV: 'Test'}});
//   gulp.src('tests/*.js', {read: false})
//       .pipe(gulpMocha({reporter: 'nyan'}));
// });
