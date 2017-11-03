<style>
</style>
<template>
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-3">
          Paraman {{ version }}
        </h1>
        <p class="lead">
          <strong>Hello!</strong> Paraman couldn't find a database to work on it.
          <a href="#" class="btn btn-success btn-lg">Create the file</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import _package from '../../../../package.json'

export default {
  data() {
    return {
      version: _package.version
    }
  },
  components: {
  },
  mounted() {
    this.registerEvents()
  },
  props: {

  },
  methods: {
    registerEvents() {
    },
  }
}

</script>