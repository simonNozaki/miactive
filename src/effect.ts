type Dep = Set<ReactiveEffect>

// The main WeakMap that stores {target -> key -> dep} connections.
// それぞれのプロパティに依存するオブジェクトのストア。
// k: reactive オブジェクトのプロパティ名
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

/**
 * track, trigger時に処理をインターセプトするオプション
 */
interface ReactiveEffectOption {
  onTrack(): void
  onTrigger(): void
}

// effect: https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts
export class ReactiveEffect<T = any> {
  /**
   * 値の変化に応じて再実行されるはずの、effectの集合
   */
  deps: Dep[] = []

  constructor(fn: () => T, _option?: ReactiveEffectOption)
  constructor(private fn: () => T, private _option?: ReactiveEffectOption) {}

  get option(): ReactiveEffectOption | null {
    return this._option
  }

  run(): T {
    activeEffect = this
    const r = this.fn()
    activeEffect = null
    return r
  }
}

/**
 * 実行時に指定される、アクティブなeffect。
 */
let activeEffect: ReactiveEffect | undefined

/**
 * 追跡しているプロパティの購読者であるeffectを探してSetに追加する
 * @param target 
 * @param key 
 */
export const track = (target: any, key: unknown) => {
  // オブジェクトから、プロパティと購読しているeffectのマップを引く(なければ追跡に追加)
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // プロパティを追跡しているeffectのマップを引く(なければ追加)
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set<ReactiveEffect>()))
  }

  // 現在のeffectが指定されていて、かつ依存しているリアクティビティがない場合にセットする
  if (activeEffect && !dep.has(activeEffect)) {
    activeEffect.option?.onTrack()
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

/**
 * プロパティの購読者であるeffectを探して実行する
 * @param target 
 * @param key 
 */
export const trigger = (target: object, key: unknown) => {
  // プロパティの購読者であるeffectを探して、実行する
  const dep = targetMap.get(target)?.get(key)
  if (dep) {
    dep.forEach((d) => {
      d.option?.onTrigger()
      d.run()
    })
  }
}

/**
 * アクティブなeffectを指定して実行する
 */
export const effect = <T = any>(fn: () => T, option?: ReactiveEffectOption) => {
  new ReactiveEffect(fn, option).run()
}
