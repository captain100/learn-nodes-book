var gulp = require('gulp');
var git = require('gulp-git');
var runSequence = require('run-sequence');

gulp.task('commit-all', function() {
    gulp.src('./*').pipe(gitgit.add());
    console.log('------git add ------');
    console.log('------git commit ------');
    git.commit();
    console.log('------git push ------');
    git.push();
});
gulp.task('git:add', function() {
    return gulp.src('.').pipe(git.add());
});

gulp.task('git:commit', function() {
    return gulp.src('.').pipe(git.commit('commit'));
});

gulp.task('git:push', function(){
    return git.push('origin', 'master', {args: " -f"}, function(err) {
        if (err) throw err;
    })
})

gulp.task('commit-auto', function() {
    runSequence('git:add', 'git:commit', 'git:push')
})