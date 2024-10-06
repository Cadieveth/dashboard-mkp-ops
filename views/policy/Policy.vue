<template>
  <div>
    <v-row>
      <v-col
          v-show="!formPolicyOu"
          cols="12"
      >
        <policy-list></policy-list>
      </v-col>
      <v-col
          v-show="formPolicyOu"
          cols="12"
      >
        <policy-ou-list></policy-ou-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PolicyList from './PolicyList.vue'
import PolicyOuList from './PolicyOuList.vue'

export default {
  name: 'Parent',
  components: {
    PolicyList,
    PolicyOuList
  },
  data() {
    return {
      formPolicyOu: false
    }
  },
  mounted() {
    this.$root.$on('formPolicyOu', msg => {
      this.formPolicyOu = msg
    })
  }
}
</script>