### 实现一个Git 一键提交

```javascript
// 引入gulp
var gulp = require('gulp');
// git 指令封装
var git = require('gulp-git');
// 顺序执行
var runSequence = require('run-sequence');

gulp.task('git:add', function() {
    return gulp.src('.').pipe(git.add());
});

gulp.task('git:commit', function() {
    return gulp.src('.').pipe(git.commit('auto commit'));
});

gulp.task('git:push', function(){
    return git.push('origin', 'master', {args: " -f"}, function(err) {
        if (err) throw err;
    })
})

gulp.task('commit-auto', function() {
    runSequence('git:add', 'git:commit', 'git:push')
})
// 默认指令执行
gulp.task('default', ['commit-auto'])
```