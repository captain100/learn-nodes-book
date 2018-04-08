### 实现类型mapState的方法
> 在vuex 里有这个样的写法 ...mapState(['selectedSeats'，'projectType'])

```javascript

function mapToArray(map) {
    Array.isArray(map) ? map.map(item => {
        return {key: item.key, val: item.val}
    }): Object.keys(map).map(item => {
        return {key: item, val: map[item]}
    })
}