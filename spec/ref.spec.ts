import { effect } from "../src/effect"
import { ref } from "../src/ref"

describe('ref spec', () => {
  it('should reassign ref', () => {
    const x = ref(0)
    x.value = 10
    expect(x.value).toBe(10)
  })

  it('should recalculate total with an effect', () => {
    const price = ref(100)
    const quantity = ref(5)

    let total: number = 0
    effect(() => {
      total = price.value * quantity.value
    })
    quantity.value = 10
    expect(total).toBe(1000)
  })
})
