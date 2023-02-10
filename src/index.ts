// Reactivity in Vue 3 - How does it work?: https://www.youtube.com/watch?v=NZfNS4sJ8CI

type TrackedMarkers = {
  /**
   * wasTracked
   */
  w: number
  /**
   * newTracked
   */
  n: number
}

type Dep = Set<ReactiveEffect> & TrackedMarkers

// The main WeakMap that stores {target -> key -> dep} connections.
// それぞれのプロパティに依存するオブジェクトのストア。
// k: reactive オブジェクトのプロパティ名
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

// effect: https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts
class ReactiveEffect<T = any> {
  active = true
  /**
   * 値の変化に応じて再実行されるはずの、effectの集合
   */
  deps: Dep[] = []
  parent: ReactiveEffect | undefined = undefined

  constructor(public fn: () => T) {}

  run(): T {
    this.parent = activeEffect
    activeEffect = this
    return this.fn()
  }
}

let activeEffect: ReactiveEffect | undefined

/**
 * 追跡しているプロパティの購読者である作用を探してSetに追加する
 * @param target 
 * @param key 
 */
const track = (target: any, key: unknown) => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  const dep = depsMap.get(key)
  // TODO: サブスクライブするDepがなければ ReactiveEffect　の Set を生成する
  dep.add(activeEffect)
  activeEffect.deps.push(dep)

}

/**
 * プロパティの購読者である作用(Effect)を探して作用を実行する
 * @param target 
 * @param key 
 */
const trigger = (target: object, key: unknown) => {
  // プロパティの購読者である作用を探して、作用を実行する
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  dep.forEach((d) => d.run())
}

export const reactive = <T extends object>(obj: T) => {
  const handler: ProxyHandler<any> = {
    // target[key]とReflect.get(target, key)は外側から見ると等価
    get: (target: T, key: string | symbol, receiver) => {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set: (target: T, key: string | symbol, newValue: unknown, receiver): boolean => {
      Reflect.set(target, key, newValue)
      trigger(target, key)
      return Reflect.set(target, key, newValue, receiver)
    }
  }
  return new Proxy(obj, handler)
}

export function ref<T>(value: T): Ref<T>
export function ref<T = any>(): Ref<T | undefined>
export function ref(value?: unknown) {
  return new Ref(value)
}

class Ref<T> {
  constructor (private _value: T) {}

  get value(): T {
    track(this, 'value')
    return this._value
  }

  set value(newValue: T) {
    trigger(this, newValue)
  }
}

export const effect = <T = any>(fn: () => T) => {
  new ReactiveEffect(fn).run()
}
