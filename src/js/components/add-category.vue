<style scoped>
</style>
<template>
  <div class="add-category__container">
    <form method="POST" role="form" class="add-category__form" v-on:submit.prevent="submit">
      <div class="add-category__form-group form-group">
        <label class="add-category__form-label">New Category?</label>
        <input type="text" class="add-category__input form-control" v-model="newCategoryName">
      </div>
      <button type="submit" :disabled="!validCategoryName" class="btn btn-primary add-category__button add-category__button--action add-category__button--submit">Add+</button>
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