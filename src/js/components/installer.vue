<template>
  <div>
    <div class="container-fluid installer-header installer--container">
      <div class="row installer-header--container">
        <div class="col-sm-6 text-center">
          <img class="rounded img-fluid installer-header--logo__image" src="../../img/paraman-logo.png" alt="Paraman Logo">
          <div class="installer-header--logo__caption">v{{version}}</div>
        </div>
        <div class="col-sm-6 text-center">
          <div class="installer-header--heading installer-box">
            <h2><span class="installer-header--heading__inline">Paraman Installer</span></h2>
            <h3>
              Paraman couldn't find a database to work on it.
            </h3>
          </div>
          <div class="container-fluid">
            <div class="row">
              <div class="col-xs-12">
                <installer-step v-if="hasActiveStep" :step.sync="getActiveStep"></installer-step>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-8 col-sm-offset-2 mt-2">
          <div class="row">
            <div @click="setActiveStep(step.action)" v-for="(step, index) in steps" :class="['col-sm-4', 'installer-step--navigation', step.isActive ? 'installer-step--navigation__active':'']">
              <installer-step :summary-view="true" :step.sync="step"></installer-step>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import _package from '../../../package.json'
import installerStep from './installer-step'

let originalRefreshStep = {
  title: `Go !`,
  icon: 'fa-refresh',
  text: `Refresh and start using Paraman!`,
  actionText: `Refresh`,
  isDone: false,
  action: 'refresh',
  response: null,
  isActive: false,
  shouldRefresh: true
}

export default {
  data() {
    return {
      version: _package.version,
      refreshCountInterval: null,
      refreshTimer: null,
      steps: [
        {
          title: `Create the database!`,
          icon: 'fa-database',
          text: `Create the sqlite database file. the file will be created in:\r\n`,
          codeProperty: 'getFilePath',
          actionText: `Create`,
          isDone: false,
          action: 'createDatabase',
          response: null,
          isActive: false
        },
        {
          title: `Migrate the database!`,
          icon: 'fa-pencil-square-o',
          text: `run 'php artisan migrate' to migrate the database, the migrations on the queue:\r\n`,
          codeProperty: 'getMigrations',
          actionText: `Migrate`,
          isDone: false,
          action: 'migrate',
          response: null,
          isActive: false
        }
      ]
    }
  },
  components: {
    'installer-step': installerStep
  },
  mounted() {
    this.registerEvents()
    this.setStepsState()
  },
  computed: {
    getFilePath() {
      return window.Laravel.installationData.databasePath
    },
    getMigrations() {
      let migrations = window.Laravel.installationData.migrationPaths

      return Object.keys(migrations)
        .map(k => migrations[k])
        .join('\r\n')
    },
    getActiveStep() {
      return this.steps.find(x => x.isActive === true)
    },
    hasActiveStep() {
      return typeof this.getActiveStep !== 'undefined'
    }
  },
  props: {},
  methods: {
    getProperty(property, data = null) {
      property = this[property]

      if (typeof property === 'function')
        // execute then return
        return property(data)

      return property
    },
    registerEvents() {
      EventBus.listen('activated-installerStep', this.activatedStep)
    },
    activatedStep(data) {
      if (data.old != null && data.old.action === 'refresh') {
        clearTimeout(this.refreshTimer)
        clearInterval(this.refreshCountInterval)
        this.removeRefreshStep()
        this.fillRefreshStep()
      } else if (data.new.action === 'refresh') {
        let step = this.getStepByAction('refresh')
        let seconds = 10

        this.refreshCountInterval = setInterval(() => {
          if (this.proceedRefresh())
            step.text = `${originalRefreshStep.text}, ${seconds--} s`
        }, 1000)

        this.refreshTimer = setTimeout(() => {
          clearInterval(this.refreshCountInterval)
          this[step.action]()
        }, seconds * 1000)
      }
    },
    setStepsState() {
      this.getStepByAction('createDatabase').isDone = !window.Laravel
        .needInstallation

      this.getStepByAction('migrate').isDone = !window.Laravel.needMigration

      if (!this.getStepByAction('migrate').isDone) this.setActiveStep('migrate')

      if (!this.getStepByAction('createDatabase').isDone)
        this.setActiveStep('createDatabase')
    },
    setActiveStep(action) {
      let activeStep = this.getActiveStep

      if (activeStep != null && action === activeStep.action) return

      if (activeStep && activeStep.action === 'refresh')
        activeStep.shouldRefresh = false

      if (action === 'refresh')
        this.getStepByAction('refresh').shouldRefresh = true

      this.steps.map(step => {
        // step.isActive = step.action === action

        step.isActive = false

        if (step.action !== action) return null

        step.isActive = true
        EventBus.fire('activated-installerStep', {
          new: step,
          old: activeStep
        })
      })
    },
    getStepByAction(action) {
      return this.steps.find(x => x.action == action)
    },
    createDatabase(step) {
      axios
        .post(`${window.Laravel.base_url}parameters/createDB`)
        .then(response => {
          if (!response.data.status)
            return this.alert(
              'There is an error creating the database',
              'danger'
            )

          step.response = `database file: ${response.data.path}`
          step.isDone = true
          this.alert('Database created successfully', 'primary')
        })
        .catch(error => {
          var errorData = error.response.data

          console.log(errorData)
          this.alert(`Error! check the console to see error details`, 'danger')
        })
    },
    migrate(step) {
      axios
        .post(`${window.Laravel.base_url}parameters/migrate`)
        .then(response => {
          let output =
            typeof response.data.output === 'string' ? response.data.output : ''
          step.response = output

          if (output.toLowerCase().indexOf('migrated') === -1) {
            console.log(response)
            return this.alert(
              'There is an error migrating the database',
              'danger'
            )
          }

          step.isDone = true
          this.alert('Database migrated successfully', 'success')
          this.finalizeInstallation()
        })
        .catch(error => {
          var errorData = error.response

          console.log(errorData)
          this.alert(`Error! check the console to see error details`, 'danger')
        })
    },
    removeRefreshStep() {
      if (this.getStepByAction('refresh') !== null)
        this.steps.splice(this.steps.findIndex(x => x.action == 'refresh'), 1)
    },
    fillRefreshStep() {
      this.steps.push(Object.assign({}, originalRefreshStep))
    },
    finalizeInstallation() {
      this.fillRefreshStep()

      this.$nextTick(() => {
        this.setActiveStep('refresh')
      })
    },
    proceedRefresh() {
      return (
        this.getActiveStep.action === 'refresh' &&
        this.getActiveStep.shouldRefresh
      )
    },
    refresh() {
      if (this.getActiveStep.action === 'refresh') window.location.reload(true)
    }
  }
}

</script>