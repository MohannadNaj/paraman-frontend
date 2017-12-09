expectEvent = (
  eventName,
  component = null,
  eventType = 'Fire',
  expectPresent = true
) => {
  if (component == null) component = window.vm

    var expectedEvent = eventName

    var eventInHistory = EventBus[`get${eventType}History`]().filter(
      e => e == expectedEvent
    )

    if (expectPresent) return expect(expectedEvent).toEqual(eventInHistory[0])

    return expect(eventInHistory).toEqual([])
}

notExpectEvent = (eventName, component = null, eventType = 'Fire') => {
  return expectEvent(eventName, component, eventType, false)
}
expectListenEvent = (eventName, component = null) => {
  return expectEvent(eventName, component, 'Listen')
}

createVue = (props = null, component = null) => {
  if (component == null) component = window.specComponent

  let Ctor = Vue.extend(component)

  window.vm = new Ctor({
    propsData: props
  }).$mount()

  window.vm.then = then

  return window.vm
}

then = (callback,  component = null) => {
  if (component == null) component = window.vm

  component.$nextTick(() => {
    callback()
  })
  return { then: then }
}

next = (callback, timeout = 0) => {
  return setTimeout(callback, timeout)
}

spy = (method, component = null) => {
  if (component == null) component = window.vm

  return window.sinonSandbox.spy(component, method)
}

submitFailedRequest = (response, target = 'parameters') => {
  moxios.stubRequest(window.Paraman.base_url + target, {
    status: 422,
    response: response
  })

  window.vm.submit()

  return {
    then: callback => {
      then(() => {
        moxios.wait(() => {
          callback()
        })
      })
    }
  }
}

commonBeforeEach = (arg = null) => {
  if (window.vm) {
    window.vm.$destroy()
  }

  window.moxios.install()
  window.EventBus.clearHistory()
  window.sinonSandbox = sinon.createSandbox()
  if (window.vm) window.vm.notificationStore.state = []

  __resolveCommonEachArg(arg)
}

commonAfterEach = (arg = null) => {
  window.moxios.uninstall()
  window.sinonSandbox.restore()

  __resolveCommonEachArg(arg)
}

__resolveCommonEachArg = (arg) => {
  if(arg !== null) {
    if(typeof arg == 'object')
      window.specComponent = arg
    else if(typeof arg == 'function')
      arg()
  }  
}

log =(...args) => {
  console.log(...args)
}
