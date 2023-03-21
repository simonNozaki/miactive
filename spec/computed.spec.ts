import { computed, ComputedRefImpl } from "../src/computed"
import { ref } from "../src/ref"

describe('computed spec', () => {
  it('should be ComputedRef instance', () => {
    const price = ref(100)
    const quantity = ref(5)
    const x = computed(() => (price.value * quantity.value))
    expect(x).toBeInstanceOf(ComputedRefImpl)
  })

  it('should recompute ref', () => {
    const price = ref(100)
    const quantity = ref(5)

    const total = computed(() => (price.value * quantity.value))
    expect(total.value).toBe(500)
    price.value = 150
    expect(total.value).toBe(750)
  })
})
