<style scoped>
</style>
<template>
  <div class="add-category__container">
    <form  v-if="showAddParameter" method="POST" role="form" class="add-category__form" v-on:submit.prevent="submit">
      <div class="add-category__form-group form-group">
        <label class="add-category__form-label">{{lang('add_category_label')}}</label>
        <input type="text" class="add-category__input form-control" v-model="newCategoryName">
      </div>
      <button type="submit" :disabled="!validCategoryName" class="add-category__button add-category__button--action add-category__button--submit btn btn-primary rounded-btn">{{lang('add_category_button_add')}}</button>
    </form>
  </div>
</template>

<script>
import configurableMixin from './mixins/common/configurable'
export default {
  mixins: [configurableMixin],
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
        .post(this.route('add_category'), {
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
          var errorMessage = this.lang('add_category_error')
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