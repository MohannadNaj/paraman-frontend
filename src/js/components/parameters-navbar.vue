<template>
  <nav class="parameters-navbar navbar navbar-inverse navbar-fixed visible-xs visible-sm">
    <div class="parameters-navbar__container container-fluid">
      <div class="parameters-navbar__header navbar-header">
        <button type="button" class="parameters-navbar__button-toggle navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              </button>
        <a class="parameters-navbar__branhd navbar-brand" href="#" v-text="brand"></a>
      </div>
      <div class="parameters-navbar__collapse collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-left">
          <li class="separator hidden-lg"></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  data() {
    return {
      brand: 'Paraman'
    }
  },
  mounted() {
    EventBus.listen('custom-logo', this.useCustomLogo)
  },
  methods: {
    useCustomLogo(data) {
      if (data.text) this.brand = data.text
    }
  }
}

</script>