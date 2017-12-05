<style scoped>
</style>
<template>
  <div class="remove-parameter__container container-fluid">
    <div class="jumbotron">
      <p class="remove-parameter__text remove-parameter__text--confirm">
        Are you sure you want to remove parameter: <b>{{ parameter.name }}</b>?
      </p>
      <div class="remove-parameter__button remove-parameter__button--cancel btn btn-default" @click="cancel">
        No
      </div>
      <div class="remove-parameter__button remove-parameter__button--remove btn btn-primary" @click="remove">
        Yes
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