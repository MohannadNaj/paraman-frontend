<style scoped>

</style>
<template>
  <div  :class="[summaryView ? '': 'card installer-box', 'installer-header--steps', step.isDone ? 'installer-header--steps__done':'']">
    <div class="card-body">
      <h4 class="card-title installer-step--title text-center">
        <div class="installer-step--icon--container">
            <i :class="'installer-header--steps__icon fa ' + step.icon"></i>
        </div>
        {{step.title}}
      </h4>
      <div v-if="! summaryView" class="card-text">
        <div class="installer-header--steps__text">
            {{step.text}}
            <code class="code hide-if-empty display-block text-left" v-if="typeof step['codeProperty'] !== 'undefined'" v-text="getProperty(step.codeProperty)"></code>            
        </div>
        <button href="#" @click="getProperty(step.action, step)" class="btn btn-outline-primary">{{step.actionText}}</button>
        <hr>
        <div v-text="step.response" class="installer-header--steps__responseText"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        step: {default: () => {} },
        summaryView: {default: false},
    },
    data() {
        return {
            
        }
    },
    methods: {
        getProperty(property, data = null) {
          property = this.$parent[property]

          if (typeof property === 'function') {
            // execute then return
            return property(data)            
          }

          return property
        },
    }
}
</script>