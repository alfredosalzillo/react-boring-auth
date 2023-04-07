export type Listener<Value> = (value: Value) => void
export type Dispose = () => void
export type Emitter<Value> = {
  readonly lastEmittedValue?: Value
  subscribe(listener: Listener<Value>): Dispose,
  emit(value: Value): void
}
export type MitOptions<Value> = {
  initialValue?: Value,
}
const mit = <Value>(options?: MitOptions<Value>): Emitter<Value>  => {
  const listeners: Listener<Value>[] = []
  let lastEmittedValue = options?.initialValue
  return {
    get lastEmittedValue() {
      return lastEmittedValue
    },
    emit(value) {
      lastEmittedValue = value
      listeners.forEach((listener) => {
        try {
          listener(value)
        } catch (e) {
          console.error(e)
        }
      })
    },
    subscribe(listener: Listener<Value>) {
      try {
        listener(lastEmittedValue)
      } catch (e) {
        console.error(e)
      }
      listeners.push(listener)
      return () => {
        listeners.splice(listeners.indexOf(listener), 1)
      }
    }
  }
}

export default mit