import { effect } from './effect'
import { ref } from './ref'

console.log('tiny script loaded')


const currentStock = document.getElementById('current-stock') as HTMLInputElement
const stockAdjustments = document.getElementById('stock-adjustments') as HTMLInputElement
const adjustmentsType = document.getElementById('adjustments-type') as HTMLInputElement
const totalStock = document.getElementById('total-stock')
const adjustmentsResult = document.getElementById('adjustments-result')

const currentStockInput = ref(0)
const stockAdjustmentsInput = ref(0)
const adjustmentTypeInput = ref('')

// ---------------------------------------
// 入力イベントハンドラ、refを更新
// ---------------------------------------
currentStock.addEventListener('input', (e) => {
  const { target } = e
  if (target instanceof HTMLInputElement) {
    // input eventを受信するたびにrefの更新
    currentStockInput.value = Number.parseInt(target.value)
  }
})

stockAdjustments.addEventListener('input', (e) => {
  const { target } = e
  if (target instanceof HTMLInputElement) {
    // input eventを受信するたびにrefの更新
    stockAdjustmentsInput.value = Number.parseInt(target.value)
  }
})

adjustmentsType.addEventListener('input', (e) => {
  const { target } = e
  if (target instanceof HTMLInputElement) {
    // input eventを受信するたびにrefの更新
    adjustmentTypeInput.value = target.value
  }
})

// ---------------------------------------
// リアクティブレンダリング, refの更新を追跡してDOMを更新
// ---------------------------------------
effect(() => {
  if (totalStock) {
    totalStock.textContent = (currentStockInput.value + stockAdjustmentsInput.value).toString()
  }
})

effect(() => {
  if (adjustmentsResult) {
    adjustmentsResult.textContent = adjustmentTypeInput.value
  }
})
