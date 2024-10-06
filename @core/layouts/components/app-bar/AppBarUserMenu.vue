<template>
  <div>
    <v-dialog v-model="formTenant" persistent width="400">
      <v-card>
        <v-card-title class="headline">
          Setting Tenant
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon @click="formTenant = false">
            <v-icon dark>
              {{ icons.mdiClose }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-form ref="form" @submit.prevent="addData()">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="form.tenantId"
                    :items="tenantList"
                    outlined
                    dense
                    item-text="tenantName"
                    item-value="id"
                    label="Tenant"
                    hide-details="auto"
                    class="mb-0"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined small type="submit"> Simpan </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-menu
      offset-y
      left
      nudge-bottom="14"
      min-width="230"
      content-class="user-profile-menu-content"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          bottom
          color="success"
          overlap
          offset-x="12"
          offset-y="12"
          class="ms-4"
          dot
        >
          <v-avatar
            size="40px"
            v-bind="attrs"
            color="primary"
            class="v-avatar-light-bg primary--text"
            v-on="on"
          >
            <v-icon color="primary" size="28">
              {{ icons.mdiAccountOutline }}
            </v-icon>
          </v-avatar>
        </v-badge>
      </template>
      <v-list>
        <div class="pb-3 pt-2">
          <v-badge
            bottom
            color="success"
            overlap
            offset-x="12"
            offset-y="12"
            class="ms-4"
            dot
          >
            <v-avatar
              size="40px"
              color="primary"
              class="v-avatar-light-bg primary--text"
            >
              <v-icon color="primary" size="28">
                {{ icons.mdiAccountOutline }}
              </v-icon>
            </v-avatar>
          </v-badge>
          <div
            class="d-inline-flex flex-column justify-center ms-3"
            style="vertical-align: middle"
          >
            <span class="text--primary font-weight-semibold mb-n1">
              {{ userData.fullName || userData.username }}
            </span>
            <small class="text--disabled text-capitalize">{{
              userData.roleName
            }}</small>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Profile -->
        <!--      <v-list-item :to="{ name: 'apps-user-view', params: { id: 21 } }" v-show="false">-->
        <!--        <v-list-item-icon class="me-2">-->
        <!--          <v-icon size="22">-->
        <!--            {{ icons.mdiAccountOutline }}-->
        <!--          </v-icon>-->
        <!--        </v-list-item-icon>-->
        <!--        <v-list-item-content>-->
        <!--          <v-list-item-title>Profile</v-list-item-title>-->
        <!--        </v-list-item-content>-->
        <!--      </v-list-item>-->

        <!-- Email -->
        <v-list-item v-show="false">
          <v-list-item-icon class="me-2">
            <v-icon size="22">
              {{ icons.mdiEmailOutline }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Inbox</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Chat -->
        <v-list-item v-show="false">
          <v-list-item-icon class="me-2">
            <v-icon size="22">
              {{ icons.mdiChatOutline }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Chat</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-badge inline color="error" content="2"> </v-badge>
          </v-list-item-action>
        </v-list-item>

        <!--      <v-divider class="my-2"></v-divider>-->

        <!-- Settings -->
        <v-list-item @click="showDialog()" v-show="showTenant">
          <v-list-item-icon class="me-2">
            <v-icon size="22">
              {{ icons.mdiCogOutline }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tenant</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Pricing -->
        <v-list-item v-show="false">
          <v-list-item-icon class="me-2">
            <v-icon size="22">
              {{ icons.mdiCurrencyUsd }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Pricing</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- FAQ -->
        <v-list-item v-show="false">
          <v-list-item-icon class="me-2">
            <v-icon size="22">
              {{ icons.mdiHelpCircleOutline }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>FAQ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!--      <v-divider class="my-2"></v-divider>-->

        <!-- Logout -->
        <v-list-item @click="logoutUser">
          <v-list-item-icon class="me-2">
            <v-icon size="22">
              {{ icons.mdiLogoutVariant }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiCheckboxMarkedOutline,
  mdiChatOutline,
  mdiCogOutline,
  mdiCurrencyUsd,
  mdiHelpCircleOutline,
  mdiLogoutVariant,
  mdiClose,
} from "@mdi/js";
import { useRouter } from "@core/utils";
import { initialAbility } from "@/plugins/acl/config";
import { getCurrentInstance } from "@vue/composition-api";
import router from "@/router";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  setup() {
    const vm = getCurrentInstance().proxy;
    const { router } = useRouter();
    // const userData = JSON.parse(localStorage.getItem('userData'))
    // const userData = JSON.parse(this.$session.get('userData'))

    // const logoutUser = () => {
    //   // Remove userData from localStorage
    //   // ? We just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
    //   localStorage.removeItem('accessToken')
    //
    //   // Remove userData & Ability from localStorage
    //   localStorage.removeItem('userData')
    //   localStorage.removeItem('userAbility')
    //
    //   // Reset ability
    //   vm.$ability.update(initialAbility)
    //
    //   // Redirect to login page
    //   router.push({ name: 'auth-login' })
    // }

    return {
      userData: "",
      formTenant: false,
      showTenant: false,
      icons: {
        mdiAccountOutline,
        mdiEmailOutline,
        mdiCheckboxMarkedOutline,
        mdiChatOutline,
        mdiCogOutline,
        mdiCurrencyUsd,
        mdiHelpCircleOutline,
        mdiLogoutVariant,
        mdiClose,
      },
      tenantList: [],
      form: new Form({
        tenantId: "",
      }),
    };
  },
  mounted() {
    this.getTenantList();
    this.showTenant =
      JSON.parse(this.$session.get("userData")).uid == -1 ? true : false;
    this.userData = JSON.parse(this.$session.get("userData"));
    this.form.tenantId = this.userData.tid;
  },
  methods: {
    getTenantList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/tenant/list/change-tenant`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.tenantList = response.data.result);
          this.tenantList = [];
        })
        .catch((e) => {
          this.$notify("error", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    showDialog() {
      this.formTenant = true;
    },
    notif(Type, Title, Text) {
      this.notif({
        group: "foo",
        type: Type,
        duration: 1000,
        title: Title,
        text: Text,
      });
    },
    addData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_auth}/change-tenant/${this.form.tenantId}`,
          config
        )
        .then((response) => {
          this.$session.set("accessToken", response.data.result.token);
          this.$session.set(
            "userData",
            JSON.stringify(response.data.result.user)
          );
          this.formTenant = false;
          this.$notify("success", "Changes tenant seccess!.");
        })
        .catch((e) => {
          this.$notify("error", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    logoutUser() {
      // Remove userData from localStorage
      // ? We just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem("accessToken");

      // Remove userData & Ability from localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("userAbility");
      sessionStorage.clear();

      // Reset ability
      // vm.$ability.update(initialAbility)

      // Redirect to login page
      router.push({ name: "auth-login" });
      this.$store.dispatch("resetVuex");
    },
  },
};
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}
</style>
