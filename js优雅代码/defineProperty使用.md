### defineProperty 使用
```javascript
Object.defineProperty(obj, prop, descriptor)

```


configurable 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
enumerable 当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。


数字描述符 descriptor
value 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。

writable 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。

```javascript
    // 不可枚举 不可重写
    var obj = {}
    var descritpor = {
        configurable: true,
        enumerable: false,
        writable: false,
        value: '邱实'
    }
    Object.defineProperty(obj, 'name', descritpor)
```

存取描述符 descriptor

get 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。

set 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。

```javascript
var obj = {}
var _age;
var descriptor = {
    configurable: true,
    enumerable: true,
    get: function() {
        return _age
    },
    set: function(value) {
        _age = value;
    }
}
Object.defineProperty(obj, 'age', descriptor)

```


数字描述符和存取描述符区别

| configurable |	enumerable |	value	| writable |	get	|set|
|---|---|---|---|---|---|
|数据描述符	|Yes|	Yes|	Yes|	Yes|	No|	No|
|存取描述符|	Yes|	Yes|	No|	No|	Yes|	Yes|
