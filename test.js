function mapToArray(map) {
    Array.isArray(map) ? map.map(item => {
        return {key: item.key, val: item.val}
    }): Object.keys(map).map(item => {
        return {key: item, val: map[item]}
    })
}