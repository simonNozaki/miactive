import { track, trigger } from "./effect"

/**
 * Proxyでラップされたリアクティブオブジェクトのコピーを生成する
 * @param {T} obj オリジナルのオブジェクト、これをProxyでラップする
 * @param T 型パラメータ
 */
export const reactive = <T extends object>(obj: T): T => {
  const handler: ProxyHandler<any> = {
    // target[key]とReflect.get(target, key)は外側から見ると等価
    get: (target: T, key: string | symbol, receiver: typeof Proxy) => {
      track(target, key)
      // receiverを設定することで参照するthisをreciver(のproxy)に束縛する
      return Reflect.get(target, key, receiver)
    },
    set: (target: T, key: string | symbol, newValue: unknown, receiver: typeof Proxy): boolean => {
      Reflect.set(target, key, newValue)
      trigger(target, key)
      return Reflect.set(target, key, newValue, receiver)
    }
  }
  return new Proxy(obj, handler)
}
