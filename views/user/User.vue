<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        >
        <user-list></user-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UserList from './UserList.vue'
export default {
  name: 'Parent',
  components: {
    UserList
  },
  data() {
    return {
      formUserList: false,
    }
  },
  mounted() {

  },
}
</script>
