import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('effect spec', () => {
  it('should track deps', () => {
    const product = reactive({
      price: 5,
      quantity: 2
    })
    let total = 0
    effect(() => (total = product.price * product.quantity))
  })
})
