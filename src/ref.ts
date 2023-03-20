import { track, trigger } from "./effect"

export function ref<T>(value: T): Ref<T>
export function ref<T = any>(): Ref<T | undefined>
export function ref(value?: unknown) {
  return new Ref(value)
}

export class Ref<T> {
  constructor (private _value: T) {}

  get value(): T {
    track(this, 'value')
    return this._value
  }

  set value(newValue: T) {
    this._value = newValue
    trigger(this, 'value')
  }
}
