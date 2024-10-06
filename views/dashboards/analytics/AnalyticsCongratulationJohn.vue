<template>
  <v-card class="greeting-card">
    <v-card-title class="align-start mb-n4"
      ><span> Filter </span>
    </v-card-title>
    <v-row class="ma-0 pa-0">
      <v-col cols="12">
        <v-card-text class="pr-0 pl-0">
          <v-row>
            <v-col cols="12">
              <v-select
                label="Jurnal"
                :items="jurnalList"
                hide-details
                dense
                v-model="filterForm.journal"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                v-model="menuStart"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filterForm.startDate"
                    label="Start Date"
                    :append-icon="icons.mdiCalendar"
                    readonly
                    dense
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filterForm.startDate"
                  color="primary"
                  @input="menuStart = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                v-model="menuEnd"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filterForm.endDate"
                    label="End Date"
                    :append-icon="icons.mdiCalendar"
                    readonly
                    dense
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filterForm.endDate"
                  color="primary"
                  @input="menuEnd = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" class="">
              <v-btn small color="primary" @click="refreshData()">
                <v-icon dark left>
                  {{ icons.mdiMagnify }}
                </v-icon>
                Filter
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>

      <!--      <v-col cols="4">-->
      <!--        <v-img-->
      <!--          contain-->
      <!--          height="180"-->
      <!--          width="159"-->
      <!--          :src="require(`@/assets/images/misc/triangle-${$vuetify.theme.dark ? 'dark':'light'}.png`)"-->
      <!--          class="greeting-card-bg"-->
      <!--        ></v-img>-->
      <!--        <v-img-->
      <!--          contain-->
      <!--          height="108"-->
      <!--          max-width="83"-->
      <!--          class="greeting-card-trophy"-->
      <!--          src="@/assets/images/misc/trophy.png"-->
      <!--        ></v-img>-->
      <!--      </v-col>-->
    </v-row>
  </v-card>
</template>

<style lang="scss" scoped>
.greeting-card {
  position: relative;
  .greeting-card-bg {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .greeting-card-trophy {
    position: absolute;
    bottom: 10%;
    right: 8%;
  }
}
// rtl
.v-application {
  &.v-application--is-rtl {
    .greeting-card-bg {
      right: initial;
      left: 0;
      transform: rotateY(180deg);
    }
    .greeting-card-trophy {
      left: 8%;
      right: initial;
    }
  }
}
</style>

<script>
import { mdiCalendar, mdiMagnify, mdiReload } from "@mdi/js";
import Form from "vform";
import moment from "moment";

export default {
  name: "Child",
  data() {
    return {
      menuStart: false,
      menuEnd: false,
      icons: {
        mdiCalendar,
        mdiReload,
        mdiMagnify,
      },
      jurnalList: [
        { text: "ALL", value: "" },
        { text: "PARKIR", value: "parkir" },
        { text: "PASAR", value: "pasar" },
        { text: "PARIWISATA", value: "pariwisata" },
        { text: "PUBLIC SERVICE", value: "toilet" },
        { text: "APPS2PAY", value: "apps2pay" },
      ],
      filterForm: new Form({
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
        journal: "",
      }),
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      this.$root.$emit("formFilter", this.filterForm);
    },
  },
};
</script>
