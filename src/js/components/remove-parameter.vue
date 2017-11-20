<style scoped>
</style>
<template>
  <div class="container-fluid">
    <div class="jumbotron">
      <p>
        Are you sure you want to remove parameter: <b>{{ parameter.name }}</b>?
      </p>
      <div class="btn btn-default" @click="cancel">
        No
      </div>
      <div class="btn btn-primary" @click="remove">
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