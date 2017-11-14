<template>
  <div>
    <div class="container-fluid installer-header installer--container">
      <div class="row installer-header--container">
        <div class="col-xs-12 text-center installer-header--logo__container">
          <img class="rounded img-fluid installer-header--logo__image" src="../../img/paraman-logo.png" alt="Paraman Logo">
        </div>
        <div class="col-xs-8">
          <h2>Paraman Installer</h2>
          <h3>
            Paraman couldn't find a database to work on it.
          </h3>
          <hr>
        </div>
        <hr>
        <div class="col-xs-4"></div>
        <div class="col-xs-1"></div>
        <div class="col-xs-10">
          <div class="row">
            <div v-for="step in steps" class="col-sm-4">
              <installer-step :step.sync="step"></installer-step>
            </div>
          </div>
        </div>
      </div>
      <!-- FOOTER -->
      <footer>
        <p>&copy; 2017 Paraman &middot;</p>
      </footer>

    </div>
    <!-- /.container -->
  </div>
</template>
<script>

import _package from '../../../../package.json'
import installerStep from './installer-step'

export default {
  data() {
    return {
      version: _package.version,
      steps: [
        {
          title: `Create the database!`,
          icon: 'fa-database',
          text: `Create the sqlite database file. the file will be created in:\r\n`,
          codeProperty: 'getFilePath',
          actionText: `Create`,
          isDone: false,
          action: 'createDatabase',
          response: null
        },
        {
          title: `Migrate the database!`,
          icon: 'fa-pencil-square-o',
          text: `run 'php artisan migrate' to migrate the database, the migrations on the queue:\r\n`,
          codeProperty: 'getMigrations',
          actionText: `Migrate`,
          isDone: false,
          action: 'migrate',
          response: null
        }
      ]
    }
  },
  components: {
    'installer-step': installerStep,
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
    registerEvents() {},
    setStepsState() {
      this.steps.find(x => x.action == 'createDatabase').isDone = !window
        .Laravel.needInstallation
      this.steps.find(x => x.action == 'migrate').isDone = !window.Laravel
        .needMigration
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

          console.log(response)
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
          let output = typeof response.data.output === 'string' ? response.data.output : ''
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
        })
        .catch(error => {
          var errorData = error.response

          console.log(errorData)
          this.alert(`Error! check the console to see error details`, 'danger')
        })
    }
  }
}

</script>