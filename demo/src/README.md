    本文是webpack5+vue2的项目搭建

    npm i -y 初始化项目
    1、 npm i -y

    下载相关依赖 webpack、webpack-cli
    2、npm i webpack webpack-cli -D

    创建项目相关文件目录(具体可以参考项目的源码)
    3、src文件夹和webpack.config.js、和

    4、src目录中创建webpack的入口文件main.js和存放样式的style目录、公共资源public等目录

    以上是准备阶段

    接下来我们介绍配置阶段

    1、webpack.config.js中增加入口文件,出口文件，以及模式

    const path = require("path")

    modules.export = {
        entry: './src/main.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].js'
        },
        mode: 'development',
    }
    
    这个时候一个最基本的 打包器已经生成，在package.json的script当中添加命令"build": "webpack --config webpack.config.js"，这个时候，我们运行npm run build就可以打包出一个dist文件。


    2、使用html-webpack-plugin插件将打包的js都引入到该html中。

    安装依赖：npm i --save-dev html-webpack-plugin

    在webpack.config.js中修改对应的配置

        const HtmlWebpackPlugin = require('html-webpack-plugin')
        module.export = {
            ...
            plugins: [ // 添加对应插件
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, './src/public/index.html')
                })
            ]
        }
    
        并且这时候修改入口文件。添加document.write('hello webpack'),

        添加完毕之后，运行打包命令。npm run build(每次运行之前先清掉之前的dist文件)，接着就能看到dist中有对应的html文件，打开文件，就能看到已经将打包之后的js引入到该文件中，页面上也能显示对应的hello webpack。

        因为每次打包的时候都需要清除当前的dist文件，因此为了减少手动操作，我们可以使用clean-webpack-plugin这个插件进行帮忙处理

            同样的安装依赖：npm install --save-dev clean-webpack-plugin
        
            并在webpack.config.js文件中配置对应插件

            const { CleanWebpackPlugin } = require('clean-webpack-plugin')
            module.export = {
                ...
                plugins: [ // 添加对应插件
                    new HtmlWebpackPlugin({
                        template: path.join(__dirname, './src/public/index.html')
                    }),
                    new CleanWebpackPlugin()
                ]
            }
        
        每次修改都需要进行打包，这样太麻烦。这个时候我们可以使用webpack-dev-server的HMR来解决

        在webpack.config.js
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9001,
            hot: true,
            open: true, // 自动打开浏览器  https://webpack.docschina.org/configuration/dev-server/#devserveropen
        }

        并在package.josn增加命令："start": "webpack serve --config webpack.config.js"

        配置完之后，启动npm run start 之后，修改main文件的输出，即可不用刷新浏览器同步更新了。

        3、html和js搞定之后，就剩css了。css比较简单，只需要添加两个loader即可，并且在配置文件中配置下即可。
            npm i -D style-loader css-loader

            webpack.config.js中配置
            module.exports = {
                ...,
                module: {
                    rules: [
                        {
                            test: /\.css$/,
                            use: ['style-loader', 'css-loader']
                        }
                    ]
                },
            }
            
            配置完成之后，只需要在入口文件中main.js引入对应的css文件就可以了。
        
        4、安装配置并结合vue文件使用vue （参考：https://vue-loader.vuejs.org/zh/）

            要能像vue-cli一样使用vue的话。需要安装vue-loader vue-template-compiler以及vue
            vue-loader: 用于解析.vue文件
            vue-template-compiler： 用于编译模板

            npm i -D vue-loader vue-template-compiler
            npm i -S vue

            在使用模板编译的时候遇到问题。比如APP.vue中，使用<style></style>写对应样式，如果不写scoped的情况下，并且不指定对应css预处理器的时候，能正常编译对应样式，如果加上scoped,编译结束后，会出现<style scoped></style>内的样式不生效的情况（回退之后不管用了）。查看vue-loader的官方文档，发现，只需要添加postcss-loader即可

                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader','postcss-loader']
                },
            在加上预处理器之后，这里以less为介绍：

                npm i less less-loader -D

                {
                    test: /\.less$/,
                    use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                    ]
                },
            即可使用less文件和<style lang="less" scoped></style>

            在打包的时候，我们如果想将css分离出来，就需要使用到mini-css-extract-plugin 插件。
            npm install -D mini-css-extract-plugin

            //{ // 未分离css前
               // test: /\.css$/,
               // use: ['style-loader', 'css-loader','postcss-loader']
            //},
            { // 分离css后
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            { // 未分离css前
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            { // 分离css后
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            对loader做对应修改，并且在plugins中增加

                new MiniCssExtractPlugin({
                    filename: "css/[name].[hash:8].css",
                    chunkFilename: "[id].css",
                })

            至此。一个vue的项目已经搭建完毕。

            接下来我们添加vue-router和xuex



引入postcss之后，会出现 You did not set any plugins, parser, or stringifier. Right now, PostCSS does nothing. Pick plugins for your case on https://www.postcss.parts/ and use them in postcss.config.js.

出现这个问题的原因是因为没有创建对应的postcss.config.js文件引起的。

接下来我们创建postcss.config.js并添加配置（postcss如果需要浏览器自动补全css兼容前缀，需要autoprefixer这个插件）
npm i autoprefixer -D
```
const autoprefixer = require('autoprefixer');
module.exports = {
    plugins: [
        autoprefixer({
            browsers:['>0%']
        })
    ]
};
```
这个时候重新启动项目。会出现 Replace Autoprefixer browsers option to Browserslist config.
  Use browserslist key in package.json or .browserslistrc file.这个错误

按照错误在package.json中加入配置后重启。
```
"browserslist": [
    "last 1 version",
    "> 1%",
    "IE 10"
  ]
```
还会出现上述错误。

Replace Autoprefixer browsers option to Browserslist config.
  Use browserslist key in package.json or .browserslistrc file.

  Using browsers option can cause errors. Browserslist config can
  be used for Babel, Autoprefixer, postcss-normalize and other tools.

  If you really need to use option, rename it to overrideBrowserslist.

需要将postcss.config.js中之前使用的browsers更改为overrideBrowserslist 即可。



```
const autoprefixer = require('autoprefixer');
module.exports = {
    plugins: [
        autoprefixer({
            overrideBrowserslist:['>0%']
        })
    ]
};
```

这个时候发现，热更新失效了。。。。（一个坑结束之后，另一个坑又起。查了下原因，发现这个https://github.com/webpack/webpack-dev-server/issues/2758）
因为webpack5的target默认配置为web
告知 webpack 为目标(target)指定一个环境。默认值为 "browserslist"，如果没有找到 browserslist 的配置，则默认为 "web"

解决办法：
1、将在package.json中配置的browserslist删除即可（显然不可能这么干，要不然上面的错误怎么解决呢）
2、在webpack.config.js文件中加入target: "web"即可

    这里根据当前环境来target: process.env.NODE_ENV === "development" ? "web" : "browserslist",

    1、配置环境变量。
    2、安装cross-env依赖（npm install cross-env -D）
    3、在package.json的启动修改为"start": "cross-env NODE_ENV=development webpack serve --config webpack.config.js"

    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || {})
    })

这个时候去修改单独的css文件（本例子中的styles目录下的文件），会发现，虽然会热更新起效果，但是修改后的样式并没有生效。
查了资料发现：https://www.jianshu.com/p/362a193645d6

然后再webpack.config.js中的loader、css和less修改即可
```
process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
// {
//     loader: MiniCssExtractPlugin.loader
// },
```

打包优化： 
https://www.bilibili.com/video/BV1jy4y1S7fy
https://blog.csdn.net/qq398577351/article/details/111525731

下面进行webpack优化部分：

1、性能分析

2、编译体积的优化

3、编译时间优化

4、运行优化

### 1、性能分析
#### 1.1[日志美化](https://www.npmjs.com/package/friendly-errors-webpack-plugin)

    需要使用到以下两个插件(感觉挺鸡肋。还不如直接看控制面板的报错更直观)
    friendly-errors-webpack-plugin // 
    node-notifier // 添加桌面通知

#### 2.1[文件体积监控](https://www.npmjs.com/package/webpack-bundle-analyzer)

    需要使用到以下插件(使用可以看npm文档)
    webpack-bundle-analyzer 
    并在package.json加入打包命令
    "dev": "webpack --profile"。然后运行npm run dev 就能看到

#### 3 编译时间优化

>3.1 减少要处理的文件（时间 34:25）
>> 3.1.1 extensions(指定文件扩展名)

>> 3.1.2 alias(指定查找别名)

>> 3.1.3 modules 告诉 webpack 解析模块时应该搜索的目录
```
resolve:{
    alias:{
        'vue$':'vue/dist/vue.runtime.esm.js',
        '@':path.join(__dirname,'src')
    },
    extensions: ['.js', '.vue', '.json'],
},
```
>> 3.1.4 [oneof](https://webpack.docschina.org/configuration/module/#ruleoneof) rule.oneOf 规则匹配时，只使用匹配的第一个规则
```
在这个css和less的loader中，使用oneOf。打包的时间反而更长了。
```
>> 3.1.5 [externals 37:37](https://webpack.docschina.org/configuration/externals/#root) 使用外部引用[从输出的 bundle 中排除依赖，重而减小体积。可以将引入的echarts、vue、vuex、axios、element-ui等等]。

```
使用了echarts之后，启动的速度是43秒。使用外链之后，时间变为8秒。如果上述东西全部使用的话。最后时间
其中在配置VueRouter的时候，会报Uncaught TypeError: Cannot redefine property: $router（无法重新定义属性：$ router）的错误

这是因为我们在安装VueRouter的时候，与cdn引入造成重复引入

解决办法是：在使用cdn的时候npm uninstall vue-router即可

externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    Vuex: 'vuex',
    ElementUI: 'element-ui',
}
```
>> 3.1.6 [module.noParse](https://webpack.docschina.org/concepts/#mode) 阻止webpack解析与给定正则表达式匹配的任何文件。被忽略的文件不应该有来电import，require，define或任何其他进口机制。忽略大型库时，这可以提高构建性能。

>> 3.1.7 [new webpack.IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin/#root) IgnorePlugin阻止生成与正则表达式或过滤器函数匹配的模块import或require调用：

>> 3.1.7 [thread-loader 多进程](https://www.npmjs.com/package/thread-loader) IgnorePlugin阻止生成与正则表达式或过滤器函数匹配的模块import或require调用：


>3.2缩小查找的范围
>>3.2.1 [options中的cache](https://webpack.js.org/configuration/other-options/#cachecachedirectory) 缓存配置（loader中的options可配置，根目录下也可以）
    
>>3.2.2 [cache-loader](https://www.npmjs.com/package/cache-loader) 可以将一些性能开销较大的  缓存在磁盘中。默认帮寸在node_modules/.cache/cache_modules目录下

>>3.2.3 hard-source-webpack-plugin 已在webpack5中内置了模块缓存，因此不需要使用。


#### 4 编译体积优化

> 压缩js、html、css、图片

> [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin) 优化和压缩css资源的插件

>[terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin) 多进程/多实例 优化和压缩js资源的插件（webpack4需要安装，webpack5内置了）

>[image-webpack-loader](https://www.npmjs.com/package/image-webpack-loader) 优化和压缩图片资源的插件

>[html-webpack-plugin] 可以配置去空格等。

> [purgecss-webpack-plugin](https://www.npmjs.com/package/purgecss-webpack-plugin) 干掉无用的css

> [tree shaking](https://webpack.docschina.org/guides/tree-shaking/#root) 通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)

>> 

> [Scope hoisting](https://webpack.docschina.org/plugins/module-concatenation-plugin/#root)
### 5 mode(默认是production) 区分环境 93:34的讲解

在webpack.config.js(node环境的) process.env.NODE_ENV 默认是undefined

在代码中（比如main.js中打印）process.env.NODE_ENV 的默认值是production(和mode值一样)

#### 5.1 mode的配置 [--mode和--env具体配置方法和说明](https://webpack.docschina.org/api/cli/#environment-options)

    --mode： 定义 webpack 所需的 mode

    这里有个取mode的值的优先级：在命令行配置的--mode > 在webpack.config.js配置的mode > 默认的mode(production)

> webpack的默认值为production

> webpack serve的默认值是development

> 可以在模块内通过，process.env.NODE_ENV获取当前环境变量，无法在webpack配置文件中获取此变量

```
// 在package.json中的
script: {
    "testMode": "webpack",
    "testMode1": "webpack --mode=development"
}
// 在webpack.config.js中加入打印
console.warn('webpack.config.js的环境变量=', process.env.NODE_ENV)
// 不论执行哪个npm run testMode或者npm run testMode1打印结果都一样
// 打印结果：webpack.config.js的环境变量=, undefined

// 在main.js中（入口文件）中加入打印
console.warn('main=', process.env.NODE_ENV)
// 打印结果为 npm run testMode 的打印结果为默认值production（如果配置文件没配mode的话,配了取配置的值）

// 执行 npm run testMode1的打印结果为development（不论配置文件是否配置mode值，都取命令行的development）
```
    Warning
    注意，命令行接口（Command Line Interface）参数的优先级，高于配置文件参数。例如，如果将 --mode="production" 传入 webpack CLI，而配置文件使用的是 development，最终会使用 production。

#### 5.2 [--env的配置和使用方法](https://webpack.docschina.org/guides/environment-variables/)

    --env： 当它是一个函数时，传递给配置的环境变量

    该配置和--mode一样，无法改变webpack.config.js中打印的process.env.NODE_ENV的值。
    只能在回调中使用

    修改 package: "testDev": "webpack --env NODE_ENV=local --env TEST=test"

    修改webpack.config.js配置

    module.exports = env => {
        console.log('--dev', env)
        // 执行npm run testDev
        // --dev { WEBPACK_BUNDLE: true, NODE_ENV: 'local', TEST: 'test' }
        return {
            
        };
    };

#### 5.3 [定义全局变量](https://webpack.docschina.org/plugins/define-plugin/):  允许在 **编译时** 创建配置的全局常量
    new webpack.DefinePlugin({ 
        // 定义在编译阶段使用的全局变量，在浏览器运行阶段就只是个值
        'test': JSON.stringify('test')
    })

    同样的，该配置只能配置打包过程中的变量，对于webpack.config.js中依旧是访问不到的

#### 5.4 [cross-env插件](https://www.npmjs.com/package/cross-env): 跨操作系统设置环境变量

    "start": "cross-env NODE_ENV=development TEST=test webpack serve --config webpack.config.js",
    

    这个只会影响webpack.config.js文件内的process.env的值。

    console.log(process.evn.NODE_ENV, process.evn.TEST) // development, test


### 6 代码分割

6.1 入口点分割（多入口文件配置）

6.2 懒加载（动态import）

> 用户需要什么功能就只加载这个功能对应代码，也就是所谓的按需加载，在给单页面应用做按需加载优化时一般采用以下原则：

>> 1、对网站功能进行划分，每一个类一个chunk

>> 2、对于首次打开页面需要的功能直接加载，某些依赖大量代码的功能点可以按需加载

>> 3、被分割出去的代码需要一个按需加载的时间

6.3 prefetch

> 使用预先拉取，表示该模块可能以后会用到。浏览器会在空闲的时候下载该模块。

> prefetch 的作用就是告诉浏览器未来可能会用到该资源，

prefetch 预获取（浏览器空闲加载。没用性能问题）

preload 预加载（预加载，肯定会用到，需要提前获取。在首页慎用，会引起性能隐患）

6.4 split chunks plugins 79:00



### 7 babel

@babel/preset-env默认只转化新的javascript语法，而不转化新的api,比如Iterator、Generator、Set、Map、Proxy、Reflect、Symbol、Promise,以及一些在全剧对象上的方法Object.assign

比如ES6在Array对象上新增Array.form方法。babel不会转化这个，需要使用babel-polyfill（polyfill：垫片）来转化

@babel-polyfill 会污染全局变量。

@babel-runtime 解决全局空间污染的问题， 提供编译模块的工具函数
更像一种按需加载的实现

polyfill service