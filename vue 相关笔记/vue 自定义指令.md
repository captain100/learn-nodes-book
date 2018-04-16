### vue自定义指令
一般在需要扩展一些方法的时候使用

一个指令对象可以提供如下的钩子方法
- bind 只调用一次,指令第一次绑定在元素上调用.在这里可以进行一次性初始化。
- inserted bei 


```javascript
Vue.directive('fetch', {
    bind
})

```