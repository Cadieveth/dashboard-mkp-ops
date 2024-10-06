<template>
  <v-select
    :value="valueBank"
    label="Bank"
    :items="bankList"
    item-value="code"
    item-text="propKey"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    persistent-placeholder
    :placeholder="phBank"
    @change="$emit('update:valueBank', $event)"
  >
    <template #selection="data">
      <v-avatar left color="#e6e6e6" size="30">
        <v-img
          :src="
            require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
          "
        ></v-img>
      </v-avatar>
      <span class="font-weight-semibold">{{
        "&nbsp;" + data.item.propKey + "&nbsp;"
      }}</span>
    </template>
    <template #item="data">
      <template>
        <v-list-item-content>
          <v-list-item-title>
            <v-avatar left color="#e6e6e6" size="30">
              <v-img
                :src="
                  require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
                "
              ></v-img>
            </v-avatar>
            <span class="font-weight-semibold"> {{ data.item.propKey }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-select>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildComponentBank",
  props: {
    valueBank: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      bankList: [],
      phBank: themeConfig.placeholder.bank,
    };
  },
  mounted() {
    this.getBank();
  },
  methods: {
    getBank() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/combo/list?comboId=BANK`, config)
        .then((response) => {
          if (response.data.result !== null) {
            this.bankList = response.data.result;
            this.bankList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.bankList[index].code +
                    "_logo.png")
                ) {
                  this.bankList[index].logoImage = this.bankList[index].code;
                }
                // do something
              } catch (e) {
                this.bankList[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.bankList = [];
          }
          //   return (this.bankList = response.data.result);
          // this.bankList = [];
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
  },
};
</script>
