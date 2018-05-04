### raw-loader 使用
> 将svg的文件内容引入HTML文件中，但不将css的svg引入
```javascript
module.exports = {
    module: {
        rules:[
            {
                test: /\.svg$/,
                use:['raw-loader']
            }
        ]

    }
}
```
### svg-inline-loader
> 去除svg内容中不必要的部分，对svg进行压缩
```javascript
    module.exports = {
        module: {
            rules: [
                test: /\.svg$/,
                use: ['svg-inline-loader']
            ]
        }
    }
```
### source-map
|devtool|含义|
|-|-|
|eval|用eval语句包裹source-map|
|source-map|生成独立的source-map文件|
|hidden-source-map|和source-map相似但不会在javascript文件后追加注释//#source-mappingUrl=bundle.js.map|
|inline-source-map|不会有source-map文件，将source-map文件生成Base64文件添加在javascript文件中|
|eval-source-map|将source-map文件base64之后追加到javascript末尾的注释//#上|
|cheap-source-map|生成的source-map文件没有列表信息，生成的速度快|
|cheap-module-source-map|会包含loader生成的source map|
