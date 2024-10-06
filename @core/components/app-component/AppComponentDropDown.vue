<template>
  <v-select
    v-model="selectedItems"
    :items="items"
    :value="selectedItems"
    label="Select Header"
    multiple
    chips
    item-text="name"
    item-value="id"
    return-object
    @change="func"
  >
    <template v-slot:prepend-item>
      <v-btn v-show="showSelectAll" text @click="selectAll">Select All</v-btn>
      <v-btn v-show="showSelectAll === false" text @click="deSelectAll"
        >De-Select All</v-btn
      >
    </template>
    <template v-slot:selection="{ item, index }">
      <span v-if="index === 1" class="grey--text text-caption">
        ({{ selectedItems.length }} items)
      </span>
    </template>
  </v-select>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
        { id: 4, name: "Item 4" },
      ],
      selectedItems: [],
      showSelectAll: true,
    };
  },
  props: {},
  methods: {
    selectAll() {
      this.showSelectAll = false;
      this.selectedItems = this.items.map((item) => item.id);
    },
    deSelectAll() {
      this.showSelectAll = true;
      this.selectedItems = [];
    },
    func() {
      console.log(this.selectedItems);
    },
  },
};
</script>
