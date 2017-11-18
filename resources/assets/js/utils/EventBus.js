window.EventBus = new class {
  constructor() {
    this.vue = new Vue({ methods: this.methods, data: this.data })
    return this.vue
  }

  get data() {
    return {
      fireHistory: [],
      listenHistory: []
    }
  }

  get methods() {
    return {
      fire(event, data = null) {
        this.recordFire(event, data)
        this.$emit(event, data)
      },

      listen(event, callback) {
        this.recordListen(event, callback)
        this.$on(event, callback)
      },

      recordFire(event, data = null) {
        var recordedEvent = {}
        recordedEvent[event] = data
        this.fireHistory.push(recordedEvent)
      },

      getFireHistory() {
        var res = []
        this.fireHistory.forEach(item => {
          res.push(_.keys(item)[0])
        })
        return res
      },

      recordListen(event, data = null) {
        var recordedEvent = {}
        recordedEvent[event] = data
        this.listenHistory.push(recordedEvent)
      },

      getListenHistory() {
        var res = []
        this.listenHistory.forEach(item => {
          res.push(_.keys(item)[0])
        })
        return res
      },

      clearHistory() {
        this.$off()
        this.listenHistory = []
        this.fireHistory = []
      }
    }
  }
}()
