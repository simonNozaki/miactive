import { effect } from './effect'
import { reactive } from './reactive'

console.log('completed script load')

const price = document.getElementById('price') as HTMLInputElement
const quantity = document.getElementById('quantity') as HTMLInputElement
const tax = document.getElementById('tax') as HTMLInputElement
const totalPrice = document.getElementById('totalPrice')

const product = reactive({
  price: price.valueAsNumber,
  quantity: quantity.valueAsNumber,
  tax: tax.valueAsNumber
})
let total = 0

// inputイベントを受信してreactive要素を更新
price.addEventListener('input', () => {
  product.price = price.valueAsNumber
})
quantity.addEventListener('input', () => {
  product.quantity = quantity.valueAsNumber
})
tax.addEventListener('input', () => {
  product.tax = tax.valueAsNumber
})

// DOM要素の変化に応じて合計額を計算する
effect(() => {
  total = product.price * product.quantity * (1 + (product.tax / 100))
  // effectと描画は分けたほうがいいが、便宜的にeffectに含めておく
  totalPrice.textContent = `¥${total}`
})
