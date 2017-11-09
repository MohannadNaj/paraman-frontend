<template>

  <div>
    <nav class="navbar navbar-fixed-top navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Paraman</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="">
              <a>{{version}}</a>
            </li>
          </ul>
        </div><!-- /.nav-collapse -->
      </div><!-- /.container -->
    </nav><!-- /.navbar -->
    <div class="container-fluid installer-header">
      <div class="row installer-header--container">
        <div class="col-12 text-center installer-header--logo__container">
          <img class="rounded img-fluid installer-header--logo__image" src="../../img/paraman-logo.png" alt="Paraman Logo">
        </div>
        <div class="col-8 mt-4">
          <h2>Paraman Installer</h2>
          <h3>
            Paraman couldn't find a database to work on it.
          </h3>
          <hr>
        </div>
        <hr>
        <div class="col-4"></div>
        <div class="col-1"></div>
        <div class="col-10">
          <div class="row">
            <div v-for="step in steps" class="col-sm-4">
              <div :class="['card', 'installer-header--steps', step.isDone ? 'installer-header--steps__done':'']">
                <div class="card-body">
                  <h4 class="card-title"><i :class="'mr-2 fa ' + step.icon"></i>{{step.title}}</h4>
                  <p class="card-text installer-header--steps__text">
                    {{step.text}}
                    <code class="hide-if-empty" v-if="typeof step['codeProperty'] !== 'undefined'" v-text="getProperty(step.codeProperty)"></code>
                  </p>
                  <button href="#" @click="getProperty(step.action, step)" class="btn btn-outline-primary">{{step.actionText}}</button>
                  <hr>
                  <div v-text="step.response" class="installer-header--steps__responseText"></div>
                </div>
              </div>
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
  components: {},
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