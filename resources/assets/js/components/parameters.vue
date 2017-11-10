<template>
<div class="wrapper">
  <div class="sidebar" data-color="blue">
      <div class="sidebar-wrapper">
          <div class="logo">
              <a href="http://www.creative-tim.com" class="simple-text">
                  Creative Tim
              </a>
          </div>
          <ul class="nav">
              <li class="active">
                  <a href="dashboard.html">
                      <i class="pe-7s-graph"></i>
                      <p>Dashboard</p>
                  </a>
              </li>
              <li>
                  <a href="user.html">
                      <i class="pe-7s-user"></i>
                      <p>User Profile</p>
                  </a>
              </li>
              <li>
                  <a href="table.html">
                      <i class="pe-7s-note2"></i>
                      <p>Table List</p>
                  </a>
              </li>
              <li>
                  <a href="typography.html">
                      <i class="pe-7s-news-paper"></i>
                      <p>Typography</p>
                  </a>
              </li>
              <li>
                  <a href="icons.html">
                      <i class="pe-7s-science"></i>
                      <p>Icons</p>
                  </a>
              </li>
              <li>
                  <a href="maps.html">
                      <i class="pe-7s-map-marker"></i>
                      <p>Maps</p>
                  </a>
              </li>
              <li>
                  <a href="notifications.html">
                      <i class="pe-7s-bell"></i>
                      <p>Notifications</p>
                  </a>
              </li>
              <li class="active-pro">
                  <a href="upgrade.html">
                      <i class="pe-7s-rocket"></i>
                      <p>Upgrade to PRO</p>
                  </a>
              </li>
          </ul>
      </div>
  </div>
  <div class="main-panel">
      <nav class="navbar navbar-default navbar-fixed">
          <div class="container-fluid">
              <div class="navbar-header">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="#">Dashboard</a>
              </div>
              <div class="collapse navbar-collapse">
                  <ul class="nav navbar-nav navbar-left">
                      <li>
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                              <i class="fa fa-dashboard"></i>
                              <p class="hidden-lg hidden-md">Dashboard</p>
                          </a>
                      </li>
                      <li class="dropdown">
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                              <i class="fa fa-globe"></i>
                              <b class="caret hidden-lg hidden-md"></b>
                              <p class="hidden-lg hidden-md">
                                  5 Notifications
                                  <b class="caret"></b>
                              </p>
                          </a>
                          <ul class="dropdown-menu">
                              <li><a href="#">Notification 1</a></li>
                              <li><a href="#">Notification 2</a></li>
                              <li><a href="#">Notification 3</a></li>
                              <li><a href="#">Notification 4</a></li>
                              <li><a href="#">Another notification</a></li>
                          </ul>
                      </li>
                      <li>
                          <a href="">
                              <i class="fa fa-search"></i>
                              <p class="hidden-lg hidden-md">Search</p>
                          </a>
                      </li>
                  </ul>
                  <ul class="nav navbar-nav navbar-right">
                      <li>
                          <a href="">
                              <p>Account</p>
                          </a>
                      </li>
                      <li class="dropdown">
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                              <p>
                                  Dropdown
                                  <b class="caret"></b>
                              </p>
                          </a>
                          <ul class="dropdown-menu">
                              <li><a href="#">Action</a></li>
                              <li><a href="#">Another action</a></li>
                              <li><a href="#">Something</a></li>
                              <li><a href="#">Another action</a></li>
                              <li><a href="#">Something</a></li>
                              <li class="divider"></li>
                              <li><a href="#">Separated link</a></li>
                          </ul>
                      </li>
                      <li>
                          <a href="#">
                              <p>Log out</p>
                          </a>
                      </li>
                      <li class="separator hidden-lg"></li>
                  </ul>
              </div>
          </div>
      </nav>
      <div class="content">
          <div class="container-fluid">...
          </div>
      </div>
      <footer class="footer">
          <div class="container-fluid">
              <nav class="pull-left">
                  <ul>
                      <li>
                          <a href="#">
                              Home
                          </a>
                      </li>
                      <li>
                          <a href="#">
                              Company
                          </a>
                      </li>
                      <li>
                          <a href="#">
                              Portfolio
                          </a>
                      </li>
                      <li>
                          <a href="#">
                              Blog
                          </a>
                      </li>
                  </ul>
              </nav>
              <p class="copyright pull-right">
                  &copy; <a href="http://www.creative-tim.com">Creative Tim</a>, made with love for a better web
              </p>
          </div>
      </footer>
  </div>
</div>
</template>

<script>

import parametersCategory from './parameters-category'
import addCategory from './add-category'
import parametersList from './parameters-list'
import installer from './installer'

import base from './mixins/parameters/base.js'

export default {
  mixins: [base],
  data() {
    return {
      categories: [],
      parameters: [],
      openedCategory: null,
      categoriesParameters: [],
      editCategoriesMode: false,
      needInstallation: false
    }
  },
  components: {
    'parameters-category': parametersCategory,
    'add-category': addCategory,
    'parameters-list': parametersList,
    installer: installer
  },
  mounted() {
    this.parameters = this.parametersList
    this.registerEvents()
    this.loadParameters()
  },
  props: {
    parametersList: null
  },
  methods: {
    loadParameters() {
      this.prepareCategories()
      this.$nextTick(this.openCategoryByHash)
    },
    registerEvents() {
      EventBus.listen('need-installation', () => {
        this.needInstallation = true
      })
      EventBus.listen('opening-category', data => {
        this.deactivateCategories()
        this.openCategory(data)
      })
      EventBus.listen('change-paramCategory', this.changeParamCategory)
      EventBus.listen('chose-paramCategory', this.choseParamCategory)
      EventBus.listen('created-category', this.createdCategory)
      EventBus.listen('updated-parameter', this.updateCategoryParameter)
      EventBus.listen('created-parameter', this.createdParameter)
      EventBus.listen('confirm-removeParameter', this.confirmRemoveParameter)
      EventBus.listen('cancel-removeParameter', this.cancelRemoveParameter)
      EventBus.listen(
        'confirmed-removeParameter',
        this.confirmedRemoveParameter
      )
    }
  }
}

</script>