# typeof

`typeof` 一般被用于判断一个变量的类型，我们可以利用 `typeof` 来判断 `number` `string` `boolean` `function` `undefined` `object` `symbol` 和 `bigint`。
在判断不是 `object` 类型的时候，`typeof` 能比较清楚的告诉我们具体的类型，在判断 `object` 数据则不行

```javascript
const s = []

typeof s === 'object' // true
typeof s === 'array' // false
```

## 原理
JavaScript 在底层存储变量的时候，会在变量的机器码的低位 1-3 位存储其类型信息

- 000: 对象
- 010: 浮点数
- 100: 字符串
- 110: 布尔值
- 1  : 整数 

但是对于 `undefined` 和 `null` 来说有点特殊

- null: 所有机器码均为 0
- undefined: 用 -2^30 整数来表示

所以 `typeof` 在判断 `null` 的时候就被当成 `object` 来看待

然而 `null instanceof null` 却不成立，这也是 `JavaScript` 的历史遗留问题

```javascript
null instanceof null
// Uncaught TypeError: Right-hand side of 'instanceof' 
// is not an object at <anonymous>:1:6
```

因此 `typeof` 最好用来判断基本数据类型，避免对 `null` 的判断出现问题

## 实现
`typeof` 是 JS 底层存储的逻辑，我们可以实现一个更完美的判断类型方法，即 `Object.prototype.toString`

```javascript
const isType = (type) => {
    return (ctx) => {
        return Object.prototype.toString.call(ctx) === `[object ${type}]`
    }
}
const isNumber = isType('Number")
const isArray = isType('Array')

isNumber(1) // true
isArray([]) // true
```