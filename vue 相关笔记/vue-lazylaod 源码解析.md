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
    // 构造一个lazy的类
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

#### lazy 的  构造函数

```javascript
// lazy的构造函数 解析options里的数据
 constructor ({ preLoad, error, throttleWait, preLoadTop, dispatchEvent, loading, attempt, silent = true, scale, listenEvents, hasbind, filter, adapter, observer, observerOptions }) {
      this.version = '__VUE_LAZYLOAD_VERSION__'
      this.mode = modeType.event
      this.ListenerQueue = []
      this.TargetIndex = 0
      this.TargetQueue = []
      this.options = {
        silent: silent,
        dispatchEvent: !!dispatchEvent,
        throttleWait: throttleWait || 200,
        // 0.3的距离是 当前dom距离页面底部的高度时就开始加载图片了
        preLoad: preLoad || 1.3,
        preLoadTop: preLoadTop || 0,
        error: error || DEFAULT_URL,
        loading: loading || DEFAULT_URL,
        // 图片加载失败，最多重试的次数
        attempt: attempt || 3,
        scale: scale || getDPR(scale),
        // 给dom注册dom的事件，在这些事件回调中会触发加载图片的方法
        ListenEvents: listenEvents || DEFAULT_EVENTS,
        hasbind: false,
        supportWebp: supportWebp(),
        filter: filter || {},
        adapter: adapter || {},
        observer: !!observer,
        observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS
      }
      // 初始化事件处理器 (实现同理 vue的事件机制)
      this._initEvent()

      this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)

      this.setMode(this.options.observer ? modeType.observer : modeType.event)
    }
```

 懒加载函数

```javascript
 _lazyLoadHandler () {
      let catIn = false
      this.ListenerQueue.forEach((listener, index) => {
        // 如果已经加载不执行
        if (listener.state.loaded) return
        // 检测是否在视口内
        catIn = listener.checkInView()
        // 不在视口内不执行
        if (!catIn) return
        // 进入视口内进行加载
        listener.load(() => {
          // 已经加载完成从队列中移除
          if (!listener.error && listener.loaded) {
            this.ListenerQueue.splice(index, 1)
          }
        })
      })
    }
```

lazy  中 add()方法是如何实现的

```javascript
 /*
     * add image listener to queue
     * @param  {DOM} el
     * @param  {object} binding vue directive binding
     * @param  {vnode} vnode vue directive vnode
     * @return
     */
    add (el, binding, vnode) {
      // 判断当前监听队列里面是否含有当前dom的监听事件
      if (some(this.ListenerQueue, item => item.el === el)) {
        // 如果存在更新
        this.update(el, binding)
        // 执行懒加载
        return Vue.nextTick(this.lazyLoadHandler)
      }
      // 解析指令参数 详情见vue自定义指令
      let { src, loading, error } = this._valueFormatter(binding.value)

      Vue.nextTick(() => {
        src = getBestSelectionFromSrcset(el, this.options.scale) || src
        // 
        this._observer && this._observer.observe(el)

        const container = Object.keys(binding.modifiers)[0]
        let $parent

        if (container) {
          $parent = vnode.context.$refs[container]
          // if there is container passed in, try ref first, then fallback to getElementById to support the original usage
          $parent = $parent ? $parent.$el || $parent : document.getElementById(container)
        }

        if (!$parent) {
          $parent = scrollParent(el)
        }
        // 
        const newListener = new ReactiveListener({
          bindType: binding.arg,
          $parent,
          el,
          loading,
          error,
          src,
          elRenderer: this._elRenderer.bind(this),
          options: this.options
        })

        this.ListenerQueue.push(newListener)

        if (inBrowser) {
          this._addListenerTarget(window)
          this._addListenerTarget($parent)
        }

        this.lazyLoadHandler()
        Vue.nextTick(() => this.lazyLoadHandler())
      })
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
