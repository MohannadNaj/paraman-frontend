<template>
  <div class="row parameter-meta--container">
    <div class="col-xs-6">
      <button type="button" @click="showLogs()" class="btn btn-default parameter-meta--showLogs-button">
      <i class="fa fa-book"></i>
      Revisions: {{countLogs}}
      </button>
      <span v-if="hasLogs">
        <div class="logs-list hidden">
          <ul class="list-group break-word">
            <li v-for="log in reverseLogs" class="list-group-item">
              <div class="row">
                <div class="col-xs-6"><b>Date:</b>{{log.date}}</div>
                <div class="col-xs-6"><b>Field:</b>{{log.field}}</div>
                <div class="col-xs-6"><b>Old:</b>{{parseValue(log.old)}}</div>
                <div class="col-xs-6"><b>New:</b>{{parseValue(log.new)}}</div>
                <div class="col-xs-12"><b>Diff:</b><span v-html="getDiff(log)"></span></div>
              </div>
            </li>
          </ul>
        </div>
      </span>
    </div>
    <div class="col-xs-6">
      <button type="button" @click="changeCategory()" class="btn btn-default parameter-meta--changeCategory-button">
      Category
      <i class="fa fa-bookmark"></i>
      </button>
    </div>
    <div class="col-xs-6">
      <input class="form-control" onclick="this.select();" readonly="" v-on:input="preventChange" :value="getPHPCode">
    </div>
    <div class="col-xs-6">
      <i class="glyphicon glyphicon-calendar"></i>
      <span class="meta-label">
        updated
        {{parameter.humanizedUpdatedAt}}
      </span>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  props: {
    parameter: {
      default: {
        function() {
          return {}
        }
      }
    }
  },
  methods: {
    changeCategory() {
      EventBus.fire('change-paramCategory', this.parameter)
    },
    showLogs() {
      if (!this.hasLogs) return this.alert('No Revisions found', 'warning')

      this.mapLogsHtmlData(this.getModal())

      this.getModal().data_showFooter = false
      this.getModal().showModal()
    },
    getModal() {
      return Helper.modal
    },
    mapLogsHtmlData(component) {
      ;(component.data_title = this.parameter.label + ' logs'),
        (component.data_html = $(this.$el)
          .find('.logs-list')
          .html())
    },
    parseValue(val, logField = 'value') {
      val = val == null ? '' : val.toString()
      if (this.parameter.type == 'boolean' && logField == 'value')
        return this.parseBooleanValue(val)
      return val
    },
    parseBooleanValue(val) {
      if (val == '0') val = 'false'
      if (val == '1') val = 'true'
      return val
    },
    getDiff(log) {
      var oldVal = log.old,
        newVal = log.new,
        color = '',
        span = null
      oldVal = this.parseValue(oldVal, log.field)
      newVal = this.parseValue(newVal, log.field)
      var diff = JsDiff.diffChars(oldVal, newVal),
        fragment = ''
      diff.forEach(function(part) {
        color = part.added ? 'green' : part.removed ? 'red' : 'grey'
        span = document.createElement('span')
        span.style.color = color
        span.appendChild(document.createTextNode(part.value))
        fragment = fragment + span.outerHTML
      })
      return fragment
    },
    preventChange(e) {
      e.target.innerHTML = this.getPHPCode
    }
  },
  computed: {
    reverseLogs() {
      return this.parameter.meta.logs.reverse()
    },
    countLogs() {
      if (
        this.parameter.meta != undefined &&
        this.parameter.meta.logs != undefined
      )
        return this.parameter.meta.logs.length
      return 0
    },
    hasLogs() {
      return this.countLogs > 0
    },
    getPHPCode() {
      if (this.parameter == undefined) return ''
      return "param('" + this.parameter.name + "')"
    }
  }
}

</script>