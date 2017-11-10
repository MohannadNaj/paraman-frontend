<template>
  <li>
    <a :class="['list-group-item', 'categories--list__item', isActive ? 'active':'', blocked ? 'block-list-group' : '']" :href="getTarget" v-on:click="openCategory">
          {{ getTitle }}
      <span class="badge">{{parameters.length}}</span>
    </a>
  </li>
</template>

<script>

export default {
  data() {
    return {
      isActive: false
    }
  },
  mounted() {},
  props: {
    title: {
      default: ''
    },
    target: {
      default: ''
    },
    isCategoriesGroup: false,
    blocked: false,
    parameters: {
      default: x => {
        return []
      }
    },
    relatedParameter: {
      default: x => {
        return []
      }
    }
  },
  methods: {
    openCategory() {
      if (this.blocked) return

      EventBus.fire('opening-category', {
        target: this.target,
        title: this.getTitle,
        parameters: this.parameters,
        isCategoriesGroup: this.isCategoriesGroup
      })
    },
    deActivate() {
      this.isActive = false
    },
    activate() {
      this.isActive = true
    }
  },

  computed: {
    getTarget() {
      return this.blocked ? false : '#' + this.target
    },
    getTitle() {
      return this.title
    }
  }
}

</script>