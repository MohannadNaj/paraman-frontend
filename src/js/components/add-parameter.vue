<style scoped>
</style>
<template>
  <div class="addParameter">
    <form class="form-horizontal addParameter--form" role="form" v-on:submit.prevent="submit">
      <div class="form-group">
        <label class="control-label col-sm-2">Name</label>
        <div class="col-sm-4">
          <input type="text" class="form-control addParameter--form-input__name" v-model="data.name" placeholder="parameter_name">
          <div v-if="showErrors" class="help-block">
            <ul>
              <li v-for="message in errors.name_errors">{{message}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-group ">
        <label class="control-label col-sm-2">Label</label>
        <div class="col-sm-4">
          <input type="text" class="form-control addParameter--form-input__label" v-model="data.label" placeholder="parameter_label">
          <div v-if="showErrors" class="help-block">
            <ul>
              <li v-for="message in errors.label_errors">{{message}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-group ">
        <label class="control-label col-sm-2">
							Type
						</label>
        <div class="col-sm-4">
          <select v-model="data.type" class="form-control addParameter--form-input__type">
								<option v-for="(type,index) in parametersTypes" v-text="type" :value="type"></option>
							</select>
          <div v-if="showErrors" class="help-block">
            <ul>
              <li v-for="message in errors.type_errors">{{message}}</li>
            </ul>
          </div>
        </div>
      </div>
      <button type="submit" class="col-sm-offset-1 btn btn-primary addParameter--button__submit">Submit</button>
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