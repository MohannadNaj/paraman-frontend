<style scoped>
</style>
<template>
  <div class="remove-parameter__container container-fluid">
    <div class="jumbotron">
      <p class="remove-parameter__text remove-parameter__text--confirm" v-html="lang('remove_parameter_confirmation', parameter.name)"></p>
      <div class="remove-parameter__button remove-parameter__button--cancel btn btn-default" @click="cancel">
        {{lang('remove_parameter_no')}}
      </div>
      <div class="remove-parameter__button remove-parameter__button--remove btn btn-primary" @click="remove">
        {{lang('remove_parameter_yes')}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      parameter: []
    }
  },
  mounted() {},
  methods: {
    cancel() {
      EventBus.fire('cancel-removeParameter', this.parameter)
    },
    remove() {
      EventBus.fire('confirmed-removeParameter', this.parameter)
    }
  }
}

</script>