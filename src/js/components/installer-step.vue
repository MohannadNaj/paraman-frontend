<style scoped>
</style>
<template>
  <div :class="['installer-step__container', summaryView ? '': 'installer-step__container--detailed', step.isDone ? 'installer-step__container--done':'']">
    <div class="card-body">
      <h4 class="installer-step__title card-title">
        <div class="installer-step__icon-container">
          <i :class="'installer-step__icon fa ' + step.icon"></i>
        </div>
        {{step.title}}
      </h4>
      <div v-if="! summaryView" class="card-text">
        <div class="installer-step__text">
          {{step.text}}
          <code class="code hide-if-empty display-block text-left" v-if="typeof step['codeProperty'] !== 'undefined'" v-text="getProperty(step.codeProperty)"></code>
        </div>
        <button href="#" @click="getProperty(step.action, step)" class="installer-step__button installer-step__button--action btn btn-outline-primary">{{step.actionText}}</button>
        <hr>
        <div v-text="step.response" class="installer-step__text--response"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    step: {
      default: () => {}
    },
    summaryView: {
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    getProperty(property, data = null) {
      property = this.$parent[property]

      if (typeof property === 'function') {
        // execute then return
        return property(data)
      }

      return property
    }
  }
}

</script>