## vue-lazylaod 源码解析

### 需求

> 项目需要实现一个组件 image 组件， 要求需要  有图片的懒加载，根据网络适配  不同的图片资源

### 源码解析

 ![vue-lazylaod 流程图](/assets/vue-lazyload.png)

#### vue-lazyload 重要做的工作

1.  vue-lazyload 是通过  指令的方式实现的，在 install 注册定义指令 v-lazy、v-lazy-container
2.  指令被 bind 时  会创建 listener，并将其添加到 listener queue 里面，并且  搜索 target dom 节点，为其注册 dom 事件
3.  上面的 dom 事件回调中，会判断 listener queue 里的 listener，判断此 listener 绑定的 dom 是否处于 preload 的位置，如果处于则异步加载图片资源
4.  同时 listener 会在当前图片加载过程中的 loading、loaded、error 三种状态出发当前 dom 的函数，分别渲染三种状态下的 dom 的内容

#### lazyload/index.js 源码解析

```javascript
  install (Vue, options = {}) {
    const LazyClass = Lazy(Vue)
    // 实例化lazy对象
    const lazy = new LazyClass(options)
    const lazyContainer = new LazyContainer({ lazy })
    //  判断vue的版本
    const isVue2 = Vue.version.split('.')[0] === '2'
    // 在Vue实例上扩充 $Lazyload
    Vue.prototype.$Lazyload = lazy

    if (options.lazyComponent) {
      Vue.component('lazy-component', LazyComponent(lazy))
    }

    if (isVue2) {
      // vue 2.0 自定义指令
      Vue.directive('lazy', {
        bind: lazy.add.bind(lazy),
        update: lazy.update.bind(lazy),
        componentUpdated: lazy.lazyLoadHandler.bind(lazy),
        unbind: lazy.remove.bind(lazy)
      })
      Vue.directive('lazy-container', {
        bind: lazyContainer.bind.bind(lazyContainer),
        update: lazyContainer.update.bind(lazyContainer),
        unbind: lazyContainer.unbind.bind(lazyContainer)
      })
    } else {
      Vue.directive('lazy', {
        bind: lazy.lazyLoadHandler.bind(lazy),
        update (newValue, oldValue) {
          assign(this.vm.$refs, this.vm.$els)
          lazy.add(this.el, {
            modifiers: this.modifiers || {},
            arg: this.arg,
            value: newValue,
            oldValue: oldValue
          }, {
            context: this.vm
          })
        },
        unbind () {
          lazy.remove(this.el)
        }
      })

      Vue.directive('lazy-container', {
        update (newValue, oldValue) {
          lazyContainer.update(this.el, {
            modifiers: this.modifiers || {},
            arg: this.arg,
            value: newValue,
            oldValue: oldValue
          }, {
            context: this.vm
          })
        },
        unbind () {
          lazyContainer.unbind(this.el)
        }
      })
    }
  }
```

#### 操作 el 元素的 error load

vue-lazyload 真正操作的是 listener.js

```

```

### 参考的文档

[vue 自定义组件](https://cn.vuejs.org/v2/guide/custom-directive.html)

[Vue 原理解析之 observer 模块](https://segmentfault.com/a/1190000008377887)

[Vue-lazyload 原理详解之源码解析](https://blog.csdn.net/u010014658/article/details/73477232)
