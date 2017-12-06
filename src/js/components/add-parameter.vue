<style scoped>
</style>
<template>
  <div class="add-parameter">
    <form class="form-horizontal add-parameter__form" role="form" v-on:submit.prevent="submit">
      <div class="add-parameter__form-group form-group">
        <label class="add-parameter__form-label control-label col-sm-3">Name</label>
        <div class="col-sm-6">
          <input type="text" class="add-parameter__form-input add-parameter__form-input--for-name form-control" v-model="data.name" placeholder="parameter_name">
          <div v-if="showErrors" class="help-block">
            <ul>
              <li v-for="message in errors.name_errors">{{message}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="add-parameter__form-group form-group">
        <label class="add-parameter__form-label control-label col-sm-3">Label</label>
        <div class="col-sm-6">
          <input type="text" class="add-parameter__form-input add-parameter__form-input--for-label form-control" v-model="data.label" placeholder="parameter_label">
          <div v-if="showErrors" class="help-block">
            <ul>
              <li v-for="message in errors.label_errors">{{message}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="add-parameter__form-group form-group">
        <label class="add-parameter__form-label control-label col-sm-3">
							Type
						</label>
        <div class="col-sm-6">
          <select v-model="data.type" class="add-parameter__form-input add-parameter__form-input--for-type add-parameter__form-select form-control">
								<option v-for="(type,index) in parametersTypes" v-text="type" :value="type"></option>
							</select>
          <div v-if="showErrors" class="help-block">
            <ul>
              <li v-for="message in errors.type_errors">{{message}}</li>
            </ul>
          </div>
        </div>
      </div>
      <button type="submit" class="add-parameter__button add-parameter__button--action add-parameter__button--submit col-sm-offset-1 btn btn-primary rounded-btn">Add</button>
    </form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      data: {
        name: '',
        label: '',
        type: 'textfield'
      },
      showErrors: false,
      errors: {},
      data_category_id: '',
      parametersTypes: []
    }
  },
  props: {
    category_id: ''
  },
  mounted() {
    this.parametersTypes = window.Laravel.parametersTypes

    _.each(_.keys(this.data), x => {
      this.errors[x + '_errors'] = []
    })
    this.showErrors = true
    EventBus.listen('opening-category', x => {
      this.$nextTick(y => {
        this.mapPropsToData()
      })
    })
    this.mapPropsToData()
  },
  watch: {
    category_id(newValue) {
      this.$nextTick(x => {
        this.mapPropsToData()
      })
    }
  },
  methods: {
    mapPropsToData() {
      this.data_category_id = this.category_id
    },
    prepareRequestData() {
      return _.extend(this.data, {
        category_id: this.data_category_id
      })
    },
    submit() {
      axios
        .post(window.Laravel.base_url + 'parameters', this.prepareRequestData())
        .then(response => {
          EventBus.fire('created-parameter', response.data.parameter)
        })
        .catch(error => {
          var errorMessage = 'Error in adding parameter'
          var errorData = error.response.data
          if (typeof errorData == 'string') {
            if (Helper.isTokenException(errorData)) {
              errorMessage += Helper.getTokenExceptionMessage()
            }
          } else if (typeof errorData == 'object') {
            var errorsCollection = {}
            _.each(errorData.errors, (fieldErrors, fieldName) => {
              errorsCollection[fieldName + '_errors'] = fieldErrors
            })
            this.errors = errorsCollection
          }
          this.alert(errorMessage, 'danger', 20)
        })
    }
  }
}

</script>