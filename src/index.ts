import { effect } from './effect'
import { reactive } from './reactive'

console.log('completed script load')

const name = document.getElementById('name') as HTMLInputElement
const price = document.getElementById('price') as HTMLInputElement
const quantity = document.getElementById('quantity') as HTMLInputElement
const tax = document.getElementById('tax') as HTMLInputElement
const totalPrice = document.getElementById('totalPrice')
const productName = document.getElementById('productName')

interface Product {
  name: string,
  price: number,
  quantity: number,
  tax: number
}

const product = reactive<Product>({
  name: name.value,
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
name.addEventListener('input', () => {
  product.name = name.value
})

// DOM要素の変化に応じて合計額を計算する
effect(() => {
  total = product.price * product.quantity * (1 + (product.tax / 100))
  // effectと描画は分けたほうがいいが、便宜的にeffectに含めておく
  totalPrice.textContent = `¥${total}`
}, {
  onTrack() {
    console.log('tracked!')
  },
  onTrigger() {
    console.log('triggered!')
  },
})

// 複数effectがあれば、activeEffectで切り替わる
effect(() => {
  productName.textContent = product.name
})
