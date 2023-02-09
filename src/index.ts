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
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

let shouldTrack = true

// effect: https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts
class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []
  parent: ReactiveEffect | undefined = undefined

  constructor(public fn: () => T) {}

  run(): T {
    this.parent = activeEffect
    activeEffect = this
    shouldTrack = true
    return this.fn()
  }
}

let activeEffect: ReactiveEffect

/**
 * 追跡しているプロパティの購読者である作用を探してSetに追加する
 * @param target 
 * @param key 
 */
const track = (target: any, key: unknown) => {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  dep.add(activeEffect)
  activeEffect.deps.push(dep)

  // TODO: サブスクライブするDepがなければ ReactiveEffect　の Set を生成する

  // (たぶん)同じことやってる
  // if (activeEffect) {
  //   const effects = getSubscribersForProperty(target, key)
  //   effects.add(activeEffect)
  // }
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

const reactive = <T extends object>(obj: T) => {
  return new Proxy(obj, {
    get: (target: object, key: string | symbol) => {
      track(target, key)
      return Reflect.get(target, key)
    },
    set: (target: object, key: string | symbol, newValue: unknown): boolean => {
      Reflect.set(target, key, newValue)
      trigger(target, key)
      return true
    }
  })
}

const ref = (value?: unknown) => {
  return createRef(value)
}

const createRef = (rawValue?: unknown) => {
  return new Ref(rawValue)
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

const effect = <T = any>(fn: () => T) => {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

/**
 * 作用(引数となる関数/処理)を依存している変数(関数内で使う変数)のサブスクライバにする: 変数の変更通知を受け取って作用を再実施
 * @param update 
 */
const whenDepsChange = (update: () => void) => {
  const effect = () => {
    // activeEffect = effect()
    update()
    activeEffect = null
  }
  effect()
}
