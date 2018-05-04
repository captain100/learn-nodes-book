### webpack 优化 （Loader篇）
#### Loader 用法
webpack 将一切文件看成模块 所以需要对模块进行加载
```javascript
    const path = require('path');
    module.exports = {
        entry: './main.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, './dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/
                    // minimize 告诉css-loader 开启css压缩
                    use: ['style-loader', 'css-loader?minimize']
                }
            ]
        }
    }
```

#### Loader 配置
rules 配置模块的读取和解析规则，通常用来配置Loader。

- 条件匹配： 通过test 、include、exclude 三个配置项来选中Loader要应用的规则文件
- 应用规则： 对选中的文件通过use 配置项来应用Loader ，可以只应用一个loader或者从后向前顺序执行一组Loader， 同事可以分别向loader传入参数
- 重置顺序： 一组loader的执行顺序是从右向左执行的，通过enforce选项可以将其中的一个loader执行的顺序放到最前或者最后

```javascript
module.exports = {
    module: {
        rules: [
            {
                // 命中的js文件
                test: /\.js$/,
                // 
                use: ['babel-loader?cacheDirectory'],
                include: path.resolve(__dirname, './src')
            },
            {
                // 命中scss文件
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                // 对非法文本文件
                test: /\.(gif|png|jpe?g|eot|ttf|svg|pdf)$/,
                use: ['file-loader']
            }
        ]
    }
}
```
在loader 需要传入的参数很多时通过options 传入
```javascript
    module.exports = {
        module: {
            rules: [
                {
                    loader: 'babel-loader'，
                    options: {
                        cacheDirectory: true,
                    },
                    // enforce 'post' 将loader执行的顺序放在最后 ‘pre’ 将loader执行的顺序放在最前
                    enforce: 'post'
                }
            ]
        }
    }

```



#### 优化Loader

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                // babel-loader 支持缓存转换出的结果，通过cacheDirectory选项配置
                use: ['babel-loader?cacheDirectory'],
                // 只对根目录下的 src 文件进行babel-loader
                include: path.resolve(__dirname, 'src')
            }
        ]
    }
}
```