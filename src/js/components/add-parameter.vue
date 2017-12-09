<style scoped>
</style>
<template>
  <div class="add-parameter">
    <form v-if="showAddParameter" class="form-horizontal add-parameter__form" role="form" v-on:submit.prevent="submit">
      <div class="add-parameter__form-group form-group">
        <label class="add-parameter__form-label control-label col-sm-3">{{lang('add_parameter_label_name')}}</label>
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
        <label class="add-parameter__form-label control-label col-sm-3">{{lang('add_parameter_label_label')}}</label>
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
							{{lang('add_parameter_label_type')}}
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
      <button type="submit" class="add-parameter__button add-parameter__button--action add-parameter__button--submit col-sm-offset-1 btn btn-primary rounded-btn">{{lang('add_parameter_button_add')}}</button>
    </form>
  </div>
</template>

<script>
import configurableMixin from './mixins/common/configurable'

export default {
  mixins: [configurableMixin],
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
    this.parametersTypes = window.Paraman.parametersTypes

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
        .post(this.route('add_parameter'), this.prepareRequestData())
        .then(response => {
          EventBus.fire('created-parameter', response.data.parameter)
        })
        .catch(error => {
          var errorMessage = this.lang('add_parameter_error')
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