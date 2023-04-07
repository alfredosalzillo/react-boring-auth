import mit from "./mit";

describe('a mit event emitter', () => {
  it('should have a subscribe function', () => {
    const emitter = mit()
    expect(emitter.subscribe).toBeInstanceOf(Function)
  })
  it('should have an emit function', () => {
    const emitter = mit()
    expect(emitter.emit).toBeInstanceOf(Function)
  })
  it('should allow to dispose listeners', () => {
    const emitter = mit()
    const listener = jest.fn()
    const dispose = emitter.subscribe(listener)
    expect(dispose).toBeInstanceOf(Function)
  })
  it('should not call listeners if disposed', () => {
    const emitter = mit()
    const listener = jest.fn()
    const dispose = emitter.subscribe(listener)
    dispose()
    emitter.emit(1)
    expect(listener).not.toBeCalledWith(1)
  })
  it('should emit a value', () => {
    const emitter = mit()
    const listener = jest.fn()
    emitter.subscribe(listener)
    emitter.emit(1)
    expect(listener).toBeCalledWith(1)
  })
  it('should emit the last emitted value when a new listener is added', () => {
    const emitter = mit()
    const listener = jest.fn()
    emitter.emit(1)
    emitter.subscribe(listener)
    expect(listener).toBeCalledWith(1)
  })
  it('should not throw if a lister throw error', () => {
    const emitter = mit()
    const listener = () => {
      throw new Error()
    }
    emitter.subscribe(listener)
    emitter.emit(1)
    expect(() => emitter.emit(1)).not.toThrow()
  })
})