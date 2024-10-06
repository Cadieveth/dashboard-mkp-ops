<template>
  <div class="auth-wrapper auth-v2">
    <div class="auth-inner">
      <v-snackbar
        top
        v-model="snackbar"
        :timeout="timeout"
        :color="color"
        outlined
        text
      >
        {{ text }}
      </v-snackbar>
      <!-- brand logo -->
      <router-link to="/" class="brand-logo d-flex align-center">
        <v-img
          :src="appLogo"
          max-height="30px"
          max-width="30px"
          alt="logo"
          contain
          class="me-3"
        ></v-img>

        <h3 class="text--primary">
          {{ textLoader }}
        </h3>
      </router-link>
      <!--/ brand logo -->

      <v-row class="auth-row ma-0">
        <v-col
          lg="8"
          class="d-none d-lg-block position-relative overflow-hidden pa-0"
        >
          <div class="auth-illustrator-wrapper">
            <!-- triangle bg -->
            <img
              height="362"
              class="auth-mask-bg"
              :src="
                require(`@/assets/images/misc/mask-v2-${
                  $vuetify.theme.dark ? 'dark' : 'light'
                }.png`)
              "
            />

            <!-- tree -->
            <v-img
              height="226"
              width="300"
              class="auth-tree"
              src="@/assets/images/misc/tree-4.png"
            ></v-img>

            <!-- 3d character -->
            <div class="d-flex align-center h-full pa-16 pe-0">
              <v-img
                contain
                max-width="100%"
                height="692"
                class="auth-3d-group"
                :src="
                  require(`@/assets/images/3d-characters/group-${
                    $vuetify.theme.dark ? 'dark' : 'light'
                  }.png`)
                "
              ></v-img>
            </div>
          </div>
        </v-col>

        <v-col lg="4" class="d-flex align-center auth-bg pa-10 pb-0">
          <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
          <!--          <v-dialog v-model="isDialogVisible" persistent width="400">-->
          <!--            <v-card color="primary" dark>-->
          <!--              <v-card-text class="pt-3" align="center">-->
          <!--                {{ textLoader }}-->
          <!--                <v-progress-linear-->
          <!--                  indeterminate-->
          <!--                  color="white"-->
          <!--                  class="mb-0"-->
          <!--                ></v-progress-linear>-->
          <!--              </v-card-text>-->
          <!--            </v-card>-->
          <!--          </v-dialog>-->
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">
              <v-card flat>
                <v-card-text>
                  <p class="text-2xl font-weight-semibold text--primary mb-2">
                    Welcome to MKP for Business
                  </p>
                  <p class="mb-2">Please sign-in to your account</p>
                </v-card-text>

                <!-- login form -->
                <v-card-text>
                  <v-form ref="loginForm" @submit.prevent="handleFormSubmit">
                    <v-text-field
                      v-model="auth.jUser"
                      label="Username"
                      placeholder="username"
                      :rules="[validators.required]"
                      hide-details="auto"
                      class="mb-6"
                      persistent-placeholder
                    ></v-text-field>

                    <v-text-field
                      v-model="auth.jPass"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      label="Password"
                      placeholder="Password"
                      :append-icon="
                        isPasswordVisible
                          ? icons.mdiEyeOffOutline
                          : icons.mdiEyeOutline
                      "
                      persistent-placeholder
                      :rules="[validators.required]"
                      hide-details="auto"
                      class="mb-2"
                      @click:append="isPasswordVisible = !isPasswordVisible"
                    ></v-text-field>

                    <v-btn block color="primary" type="submit" class="mt-6">
                      Login
                    </v-btn>
                  </v-form>
                </v-card-text>
                <v-snackbar
                  v-model="message.isSnackbarVisible"
                  :timeout="2000"
                  :light="$vuetify.theme.dark"
                  right
                  top
                >
                  {{ message.messageSnackBar }}
                </v-snackbar>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { ref, getCurrentInstance } from "@vue/composition-api";
import { required, emailValidator } from "@core/utils/validation";
import { useRouter } from "@core/utils";
import themeConfig from "@themeConfig";
import axios from "@axios";
import moment from "moment/moment";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
export default {
  components: {
    AppCardLoader,
  },
  setup() {
    // Template Ref
    const loginForm = ref(null);

    // eslint-disable-next-line no-unused-vars
    const vm = getCurrentInstance().proxy;
    // eslint-disable-next-line no-unused-vars
    const { router } = useRouter();

    const isPasswordVisible = ref(false);

    return {
      isPasswordVisible,
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      validators: {
        required,
        emailValidator,
      },

      // themeConfig
      appName: themeConfig.app.name,
      appLogo: themeConfig.app.logo,

      // Template Refs
      loginForm,
    };
  },
  data() {
    return {
      isDialogVisible: false,
      textLoader: themeConfig.placeholder.remarkLoader,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      auth: {
        jUser: "",
        jPass: "",
      },
      message: {
        isSnackbarVisible: false,
        messageSnackBar: "",
      },
    };
  },
  mounted() {
    this.$notification.requestPermission().then((data) => {
      if (data != "granted") {
        this.notif();
      }
    });
  },
  methods: {
    notif() {
      this.snackbar = true;
      this.text = "Please allow notification in your browser!";
      this.color = "warning";
    },
    handleFormSubmit() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
      };

      axios
        .post(
          `${themeConfig.app.api_auth}/login`,
          { jUser: this.auth.jUser, jPass: window.btoa(this.auth.jPass) },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.$session.set(
            "accessHumanTask",
            response.data.result.taskList.split(",")
          );
          this.$session.set("accessToken", response.data.result.token);
          this.$session.set(
            "userData",
            JSON.stringify(response.data.result.user)
          );

          sessionStorage.setItem(
            "accessHumanTask",
            response.data.result.taskList.split(",")
          );
          sessionStorage.setItem("accessToken", response.data.result.token);
          sessionStorage.setItem(
            "userData",
            JSON.stringify(response.data.result.user)
          );

          this.$router.push("/");
        })
        .catch((error) => {
          console.log("error", error);
          this.isDialogVisible = false;
          console.error("Oops, Unable to login!");
          this.message.isSnackbarVisible = true;
          this.message.messageSnackBar = error.response.data.meta.message;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@core/preset/preset/pages/auth.scss";
@import "src/styles/styles.scss";
</style>
