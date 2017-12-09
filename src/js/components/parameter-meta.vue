<template>
  <div class="parameter-meta__container row">
    <div class="parameter-meta__container-revisions col-xs-6 col-sm-3">
      <button type="button" @click="showLogs()" class="parameter-meta__button-show-logs btn btn-default rounded-btn">
      <i class="fa fa-book"></i>
      {{lang('parameter_meta_button_revisions')}}: {{countLogs}}
      </button>
      <span v-if="hasLogs">
        <div class="parameter-meta__logs-container hidden">
          <ul class="parameter-meta__logs-list list-group break-word">
            <li v-for="log in reverseLogs" class="parameter-meta__logs-list-item list-group-item">
              <div class="parameter-meta__log-container row">
                <div class="col-xs-6"><b>{{lang('parameter_meta_log_date')}}:</b>{{log.date}}</div>
                <div class="col-xs-6"><b>{{lang('parameter_meta_log_field')}}:</b>{{log.field}}</div>
                <div class="col-xs-6"><b>{{lang('parameter_meta_log_old')}}:</b>{{parseValue(log.old)}}</div>
                <div class="col-xs-6"><b>{{lang('parameter_meta_log_new')}}:</b>{{parseValue(log.new)}}</div>
                <div class="col-xs-12"><b>{{lang('parameter_meta_log_diff')}}:</b><span v-html="getDiff(log)"></span></div>
  </div>
  </li>
  </ul>
  </div>
  </span>
  </div>
  <div class="parameter-meta__container-category col-xs-6 col-sm-3">
    <button type="button" @click="changeCategory()" class="parameter-meta__button parameter-meta__button-change-category btn btn-default rounded-btn">
      {{lang('parameter_meta_button_category')}}
      <i class="fa fa-bookmark"></i>
      </button>
  </div>
  <div v-if="showPHPCode" class="parameter-meta__container-code col-xs-6 col-sm-3">
    <input class="parameter-meta__input parameter-meta__input--code form-control" onclick="this.select();" readonly="" v-on:input="preventChange" :value="getPHPCode">
  </div>
  <div class="parameter-meta__container-timestamps col-xs-6 col-sm-3">
    <i class="glyphicon glyphicon-calendar"></i>
    <span class="meta-label">
        {{lang('parameter_meta_humanized_updatedAt')}}
        {{parameter.humanizedUpdatedAt}}
      </span>
  </div>
  </div>
</template>

<script>

import configurableMixin from './mixins/common/configurable'

export default {
  mixins: [configurableMixin],
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
      if (!this.hasLogs) return this.alert(this.lang('parameter_meta_revisions_not_found'), 'warning')

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
          .find('.parameter-meta__logs-container')
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