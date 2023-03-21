// 本家: https://github.com/vuejs/core/blob/main/packages/reactivity/src/computed.ts
import { Ref } from './ref'
import { ReactiveEffect } from './effect'

// https://github.com/vuejs/core/blob/main/packages/shared/src/index.ts#L59
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export interface ComputedRef<T> extends WritableComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = (...any: any[]) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

export class ComputedRefImpl<T> {
  readonly effect: ReactiveEffect<T>
  private _value!: T

  constructor (
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>
  ) {
    this.effect = new ReactiveEffect(getter)
  }

  get value (): T {
    this._value = this.effect.run()
    return this._value
  }

  set value (newValue: T) {
    this._setter(newValue)
  }
}

/**
 * 超シンプルに書くなら。 `effect` のラッパ。
 * ```
 * const computed = (getter) {
 *   const r = ref()
 *   effect(() => (r.value = getter()))
 *   return r
 * }
 * ```
 */
export function computed <T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed <T>(options: WritableComputedOptions<T>): WritableComputedRef<T>
export function computed <T>(getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    // NOOP: https://github.com/vuejs/core/blob/main/packages/shared/src/index.ts#L22
    setter = () => {}
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter) as any
}
