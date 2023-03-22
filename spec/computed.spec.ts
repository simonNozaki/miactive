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

  it('should set values to computed properties', () => {
    const firstName = ref('Harry')
    const lastName = ref('Potter')

    const fullName = computed({
      get() {
        return firstName.value + ' ' + lastName.value
      },
      set(newValue: string) {
        [firstName.value, lastName.value] = newValue.split(' ')
      }
    })
    expect(fullName.value).toBe('Harry Potter')
    firstName.value = 'James'
    expect(fullName.value).toBe('James Potter')
  })
})
