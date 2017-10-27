<style scoped>
</style>
<template>
  <div>
    <form method="POST" role="form" v-on:submit.prevent="submit">
      <div class="form-group">
        <label>New Category?</label>
        <input type="text" class="form-control" v-model="newCategoryName">
      </div>
      <button type="submit" :disabled="!validCategoryName" class="btn btn-primary addCategory--button__submit">Add+</button>
    </form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      newCategoryName: ''
    }
  },
  methods: {
    submit() {
      if (!this.validCategoryName) return null
      EventBus.fire('start-addCategory')

      axios
        .post(window.Laravel.base_url + 'parameters/addCategory', {
          value: this.newCategoryName
        })
        .then(response => {
          var data = response.data
          EventBus.fire('created-category', data.parameter)
          EventBus.$nextTick(x => {
            this.newCategoryName = ''
          })
          EventBus.fire('end-addCategory')
        })
        .catch(error => {
          var errorMessage = 'Error in adding category'
          var errorData = error.response.data
          Helper.checkCommonErrors(errorData, errorMessage)
          EventBus.fire('end-addCategory')
        })
    }
  },
  computed: {
    validCategoryName() {
      return this.newCategoryName.length != 0
    }
  }
}

</script>