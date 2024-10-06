<template>
  <div>
    <v-row>
      <v-col
        v-show="!formRoleList"
        cols="12"
      >
        <role-list></role-list>
      </v-col>
      <v-col
        v-show="formRoleList"
        cols="12"
      >
        <role-task-list></role-task-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoleList from './RoleList.vue'
import RoleTaskList from './RoleTaskList.vue'

export default {
  name: 'Parent',
  components: {
    // eslint-disable-next-line no-undef
    RoleList,
    RoleTaskList
  },
  data() {
    return {
      formRoleList: false,
    }
  },
  mounted() {
    this.$root.$on('formRoleTask', msg => {
      this.formRoleList = msg
    })
  },
}

</script>
