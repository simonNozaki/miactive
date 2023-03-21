import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('effect spec', () => {
  interface Product {
    price: number
    quantity: number
  }

  it('should track deps in reactive', () => {
    const product = reactive<Product>({
      price: 5,
      quantity: 2
    })
    let total = 0
    effect(() => (total = product.price * product.quantity))
    expect(total).toBe(10)
    product.price = 7
    expect(total).toBe(14)
  })
})
