import { reactive } from './index'

const product = reactive({ price: 100, quantity: 2 })
let total = 0
let effect = () => {
  total = product.price * product.quantity
}
effect()
// 200になるはず
console.log(total)
// setterが呼ばれるたびにtrigerが実行され、effectを再実行する => totalが変わる
// reactive effect
product.quantity = 5
// 500になるはず
console.log(total)
