<template>
  <div>
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
    <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
    <v-dialog v-model="formDetailList" persistent width="1000">
      <v-card>
        <v-card-title class="headline font-weight-bold">
          Detail
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4" class="pb-0">
              <div>
                <span class="text--secondary me-2">Merchant:</span>
                <span
                  class="
                    d-block
                    text--primary
                    font-weight-semibold
                    text-truncate
                  "
                  >{{ headerList.ouName }}</span
                >
                <span class="text-xs">{{ headerList.ouCode }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <div>
                <span class="text--secondary me-2">Cash/Bank:</span>
                <div class="d-flex align-center">
                  <v-avatar
                    v-if="headerList.logoImage"
                    color="#e6e6e6"
                    size="30"
                  >
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${headerList.logoImage}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span v-else> - </span>
                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ headerList.accountName }}</span
                    >
                    <span class="text-xs">{{ headerList.accountNo }}</span>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <div>
                <span class="text--secondary me-2">Payment:</span>
                <div class="d-flex align-center">
                  <v-avatar
                    v-if="headerList.logoPaymentChanel"
                    color="#e6e6e6"
                    size="30"
                  >
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${headerList.logoPaymentChanel}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span v-else> - </span>
                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ headerList.subPaymentChannelName }}</span
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="">
          <v-data-table
            :headers="headersDetail"
            :items="mainDataDetail"
            hide-default-footer
            disable-pagination
            fixed-header
            dense
          >
            <!-- format tanggal-->
            <template #[`item.docDate`]="{ item }">
              {{ dateFormat(item.docDate) }}
            </template>
            <template #[`item.processAt`]="{ item }">
              {{ dateTimeFormat(item.processAt) }}
            </template>
            <template #[`item.settledDate`]="{ item }">
              {{ dateFormat(item.settledDate) }}
            </template>

            <template #[`item.amount`]="{ item }">
              Rp.{{ number_format(item.amount) }}
            </template>
            <template #[`item.currentOsAmount`]="{ item }">
              Rp.{{ number_format(item.currentOsAmount) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- payAmountFormDialog -->
    <v-dialog v-model="formPayAmount" persistent width="1300">
      <v-card class="px-4">
        <v-card-title class="font-weight-bold">
          Change Pay Amount
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closePayAmountForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="pb-0">
              <div>
                <span class="text--secondary me-2">Merchant:</span>
                <span
                  class="
                    d-block
                    text--primary
                    font-weight-semibold
                    text-truncate
                  "
                  >{{ payAmountDetail.ouName }}</span
                >
                <span class="text-xs">{{ payAmountDetail.ouCode }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <div>
                <span class="text--secondary me-2">Doc No:</span>
                <span
                  class="
                    d-block
                    text--primary
                    font-weight-semibold
                    text-truncate
                  "
                  >{{ payAmountDetail.docNo }}</span
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-data-table
            :headers="payAmountHeader"
            :items="payAmountList"
            hide-default-footer
            disable-pagination
            fixed-header
            dense
          >
            <!-- Bank Rekon -->
            <template #[`item.bank`]="{ item }">
              <div>
                <div class="d-flex align-center">
                  <v-avatar v-if="item.logoImage" color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span v-else> - </span>
                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.accountName }}</span
                    >
                    <span class="text-xs">{{ item.accountNo }}</span>
                  </div>
                </div>
              </div>
            </template>
            <!-- date period -->
            <template #[`item.startDate`]="{ item }">
              <span
                >{{ dateFormat(item.startDate) }} -
                {{ dateFormat(item.endDate) }}</span
              >
            </template>
            <!-- payment -->
            <template #[`item.subPaymentChannelName`]="{ item }">
              <div class="d-flex align-center">
                <v-avatar
                  v-if="item.logoPaymentChanel"
                  color="#e6e6e6"
                  size="30"
                >
                  <v-img
                    :src="
                      require(`@/assets/images/logos/bank_logo/${item.logoPaymentChanel}_logo.png`)
                    "
                  ></v-img>
                </v-avatar>
                <span v-else> - </span>
                <div class="d-flex flex-column ms-3">
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.subPaymentChannelName }}</span
                  >
                </div>
              </div>
            </template>
            <template #[`item.amount`]="{ item }">
              Rp.{{ number_format(item.amount) }}
              <!-- <v-tooltip bottom color="info">
                <template #activator="{ on, attrs }">
                  <v-btn
                    x-small
                    icon
                    color="info"
                    v-bind="attrs"
                    v-on="on"
                    @click="formEditPayAmount.payAmount = item.amount"
                    v-show="formEditPayAmount.payAmount != item.amount"
                  >
                    <v-icon>
                      {{ icons.mdiCheckAll }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>Terbayar</span>
              </v-tooltip>
              <v-tooltip bottom color="error">
                <template #activator="{ on, attrs }">
                  <v-btn
                    x-small
                    icon
                    color="error"
                    v-bind="attrs"
                    v-on="on"
                    @click="formEditPayAmount.payAmount = 0"
                    v-show="formEditPayAmount.payAmount == item.amount"
                  >
                    <v-icon>
                      {{ icons.mdiClose }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>Belum Terbayar</span>
              </v-tooltip> -->
            </template>

            <template #[`item.thp`]="{ item }">
              <vuetify-money
                class="mr-2"
                dense
                v-model="formEditPayAmount.payAmount"
                v-bind:readonly="readonly"
                v-bind:disabled="disabled"
                v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                v-bind:options="options"
                v-bind:properties="properties"
                hide-details
              />
              <!-- <vue-numeric
                :style="{
                  borderBottom: '1px solid #ccc',
                  borderRadius: '0px',
                  padding: '5px',
                  color: $vuetify.theme.isDark ? '#ADAAC4' : '#000000',
                }"
                v-model="formEditPayAmount.payAmount"
                :currency="'Rp.'"
                v-bind:precision="2"
                thousand-separator="."
                decimal-separator=","
              /> -->
            </template>

            <template #[`item.balance`]="{ item }">
              Rp.{{
                number_format(
                  parseFloat(formEditPayAmount.payAmount) - item.amount
                )
              }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="mt-6 d-flex justify-content-between">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small dark color="primary" @click="editReceiveAmount()">
            <v-icon dark left>
              {{ icons.mdiCheckAll }}
            </v-icon>
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-card>
          <v-card-title>Bank Merchant Transaction</v-card-title>
          <v-card-text>
            <div>
              <v-tabs
                class="mb-4"
                grow
                v-model="currentTab"
                @change="refreshDataFilter()"
              >
                <v-tab> Bank Reconciliation </v-tab>
                <v-tab> History Bank Reconciliation </v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <v-card>
                    <!-- <v-card-title
                      ><span>Bank Reconciliation</span></v-card-title
                    > -->
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <app-autocomplite-ou-branch
                            :form-value.sync="filterForm.ouId"
                            ou-branch-type="bankReconcile"
                          ></app-autocomplite-ou-branch>
                        </v-col>
                        <!-- <v-col cols="12" md="6"> -->
                        <!-- <vuetify-money
                  dense
                  v-bind:readonly="readonly"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                /> -->
                        <!-- <vuetify-money v-model="vueMoney" :label="'label'" /> -->
                        <!-- <currency-input
                  :style="{
                    color: $vuetify.theme.isDark ? '#CECCE3' : '#716C7B',
                    borderBottom: $vuetify.theme.isDark
                      ? '1px solid #4A4861'
                      : '1px solid #E8E7EB',
                    marginLeft: '-3px',
                  }"
                  class="vMoney-text-field__input"
                /> -->
                        <!-- <v-text-field
                  v-model="vueMoney"
                  v-currency="{
                    locale: 'de-DE',
                    currency: null,
                    distractionFree: false,
                  }"
                ></v-text-field> -->
                        <!-- </v-col> -->
                        <v-col
                          v-show="merchantList.length > 0"
                          cols="12"
                          md="6"
                          class="pb-0 mt-2"
                        >
                          <!-- <app-autocomplite-ou-subbranch
                  :form-value.sync="filterForm.subBranchId"
                  ou-sub-branch-type="bankReconcile"
                >
                </app-autocomplite-ou-subbranch> -->
                          <v-autocomplete
                            :label="phOuSB"
                            :items="merchantList"
                            v-model="merchantPicked"
                            persistent-placeholder
                            :placeholder="phOuSB"
                            dense
                            hide-details
                            clearable
                            @change="filterItems"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="mt-6">
                      <v-btn
                        small
                        dark
                        color="primary"
                        @click="filterInvoiceAP()"
                      >
                        <v-icon dark left>
                          {{ icons.mdiMagnify }}
                        </v-icon>
                        Filter
                      </v-btn>
                    </v-card-actions>
                    <v-card-text class="">
                      <v-flex
                        v-for="(item, index) in filteredItems"
                        :key="item.id"
                      >
                        <v-row>
                          <v-col cols="12">
                            <v-card outlined>
                              <v-card-text
                                class="d-flex justify-content-between"
                              >
                                <table>
                                  <tbody>
                                    <tr>
                                      <td>Merchant:</td>
                                      <th>
                                        {{ item[0].ouCode + " - " + index }}
                                      </th>
                                    </tr>
                                    <tr v-show="isVoidTrue(item)">
                                      <td>Doc No:</td>
                                      <th>
                                        {{ item[0].docNo }}
                                      </th>
                                    </tr>
                                    <tr>
                                      <td>Period:</td>
                                      <th>
                                        {{ furthestDate(item) }} -
                                        {{ newestDate(item) }}
                                      </th>
                                    </tr>
                                  </tbody>
                                </table>
                                <!-- <v-col cols="6" class="pb-0">
                        <v-list>
                          <v-list-item dense class="px-0 mt-n6 mb-2">
                            <span class="text--secondary me-2">Period:</span>
                            <span class="font-weight-semibold">
                              {{ furthestDate(item) + " " }}
                            </span>
                            <span class="font-weight-semibold ml-2 me-2"
                              >-</span
                            >
                            <span class="font-weight-semibold">
                              {{ " " + newestDate(item) }}
                            </span>
                          </v-list-item>
                          <v-list-item dense class="px-0 mt-n6">
                            <span class="text--secondary me-2">Merchant:</span>
                            <span class="font-weight-semibold me-2">{{
                              item[0].ouCode + " - " + index
                            }}</span>
                          </v-list-item>
                          <v-list-item
                            v-show="isVoidTrue(item)"
                            dense
                            class="px-0 mt-n4"
                          >
                            <span class="text--secondary me-2">Doc No:</span>
                            <span class="font-weight-semibold">
                              {{ item[0].docNo }}
                            </span>
                          </v-list-item>
                        </v-list>
                      </v-col> -->
                                <v-spacer></v-spacer>
                                <v-chip
                                  medium
                                  :class="`${
                                    item[0].workflowStatus == ''
                                      ? 'secondary'
                                      : item[0].workflowStatus == 'DRAFT'
                                      ? 'warning'
                                      : item[0].workflowStatus == 'VOID'
                                      ? 'error'
                                      : 'success'
                                  }--text`"
                                  class="
                                    mb-3
                                    v-chip-light-bg
                                    font-weight-semibold
                                    text-capitalize
                                  "
                                  :color="
                                    item[0].workflowStatus == ''
                                      ? 'secondary'
                                      : item[0].workflowStatus == 'DRAFT'
                                      ? 'warning'
                                      : item[0].workflowStatus == 'VOID'
                                      ? 'error'
                                      : 'success'
                                  "
                                >
                                  {{
                                    item[0].workflowStatus == ""
                                      ? "NONE"
                                      : item[0].workflowStatus
                                  }}
                                </v-chip>
                              </v-card-text>
                              <v-card-text>
                                <v-row>
                                  <v-col
                                    cols="12"
                                    md="4"
                                    class="pb-0"
                                    v-show="formEdit"
                                  >
                                    <v-text-field
                                      dense
                                      hide-details
                                      label="Nomor Bank Recon"
                                      readonly
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    md="4"
                                    class="pb-0"
                                    v-show="formEdit"
                                  >
                                    <v-text-field
                                      dense
                                      hide-details
                                      label="Tgl & Waktu Dilayani"
                                      readonly
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card-text>

                              <v-card-text class="mt-n4">
                                <v-data-table
                                  :headers="headers"
                                  :items="item"
                                  hide-default-footer
                                  disable-pagination
                                  fixed-header
                                >
                                  <!-- Bank Rekon -->
                                  <template #[`item.bank`]="{ item }">
                                    <div>
                                      <div class="d-flex align-center">
                                        <v-avatar
                                          v-if="item.logoImage"
                                          color="#e6e6e6"
                                          size="30"
                                        >
                                          <v-img
                                            :src="
                                              require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                                            "
                                          ></v-img>
                                        </v-avatar>
                                        <span v-else> - </span>
                                        <div class="d-flex flex-column ms-3">
                                          <span
                                            class="
                                              d-block
                                              text--primary
                                              font-weight-semibold
                                              text-truncate
                                            "
                                            >{{ item.accountName }}</span
                                          >
                                          <span class="text-xs">{{
                                            item.accountNo
                                          }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </template>

                                  <!-- payment -->
                                  <template
                                    #[`item.subPaymentChannelName`]="{ item }"
                                  >
                                    <div class="d-flex align-center">
                                      <v-avatar
                                        v-if="item.logoPaymentChanel"
                                        color="#e6e6e6"
                                        size="30"
                                      >
                                        <v-img
                                          :src="
                                            require(`@/assets/images/logos/bank_logo/${item.logoPaymentChanel}_logo.png`)
                                          "
                                        ></v-img>
                                      </v-avatar>
                                      <span v-else> - </span>
                                      <div class="d-flex flex-column ms-3">
                                        <span
                                          class="
                                            d-block
                                            text--primary
                                            font-weight-semibold
                                            text-truncate
                                          "
                                          >{{
                                            item.subPaymentChannelName
                                          }}</span
                                        >
                                      </div>
                                    </div>
                                  </template>

                                  <template #[`item.balance`]="{ item }">
                                    Rp.{{
                                      number_format(
                                        parseFloat(item.payAmount) - item.amount
                                      )
                                    }}
                                  </template>

                                  <template #[`item.amount`]="{ item }">
                                    Rp.{{ number_format(item.amount) }}
                                    <!-- <v-tooltip bottom color="info">
                            <template #activator="{ on, attrs }">
                              <v-btn
                                x-small
                                icon
                                color="info"
                                v-bind="attrs"
                                v-on="on"
                                @click="item.payAmount = item.amount"
                                v-show="
                                  item.payAmount != item.amount &&
                                  item.statusDoc == ''
                                "
                              >
                                <v-icon>
                                  {{ icons.mdiCheckAll }}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Terbayar</span>
                          </v-tooltip>
                          <v-tooltip bottom color="error">
                            <template #activator="{ on, attrs }">
                              <v-btn
                                x-small
                                icon
                                color="error"
                                v-bind="attrs"
                                v-on="on"
                                @click="item.payAmount = 0"
                                v-show="
                                  item.payAmount == item.amount &&
                                  item.statusDoc == ''
                                "
                              >
                                <v-icon>
                                  {{ icons.mdiClose }}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Belum Terbayar</span>
                          </v-tooltip> -->
                                  </template>

                                  <template #[`item.thp`]="{ item }">
                                    <vuetify-money
                                      v-model="item.payAmount"
                                      thousand-separator="."
                                      decimal-separator=","
                                    />
                                  </template>

                                  <template #[`item.startDate`]="{ item }">
                                    <span
                                      >{{ dateFormat(item.startDate) }} -
                                      {{ dateFormat(item.endDate) }}</span
                                    >
                                  </template>

                                  <!--                      saving amount-->
                                  <template #[`item.savingAmount`]="{ item }">
                                    Rp.{{ number_format(item.savingAmount) }}
                                    <!-- <v-tooltip bottom color="info">
                            <template #activator="{ on, attrs }">
                              <v-btn
                                x-small
                                icon
                                color="info"
                                v-bind="attrs"
                                v-on="on"
                                @click="
                                  item.savingAmountUse = item.savingAmount
                                "
                                v-show="
                                  item.savingAmount > 0 &&
                                  item.savingAmountUse != item.savingAmount
                                "
                              >
                                <v-icon>
                                  {{ icons.mdiCheckAll }}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Terbayar</span>
                          </v-tooltip>
                          <v-tooltip bottom color="error">
                            <template #activator="{ on, attrs }">
                              <v-btn
                                x-small
                                icon
                                color="error"
                                v-bind="attrs"
                                v-on="on"
                                @click="item.savingAmountUse = 0"
                                v-show="
                                  item.savingAmount > 0 &&
                                  item.savingAmountUse == item.savingAmount
                                "
                              >
                                <v-icon>
                                  {{ icons.mdiClose }}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Belum Terbayar</span>
                          </v-tooltip> -->
                                  </template>

                                  <template #[`item.savingUse`]="{ item }">
                                    <vuetify-money
                                      dense
                                      v-model="item.savingAmountUse"
                                      v-bind:readonly="readonly"
                                      v-bind:disabled="item.savingAmount == 0"
                                      v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                                      v-bind:options="options"
                                      v-bind:properties="properties"
                                      hide-details
                                      @keypress="getAmount(item)"
                                    />
                                  </template>

                                  <template #[`item.actions`]="{ item }">
                                    <v-tooltip bottom color="warning">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          v-show="item.statusDoc != ''"
                                          x-small
                                          icon
                                          color="warning"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="editPayAmount(item)"
                                        >
                                          <v-icon>
                                            {{ icons.mdiClipboardEditOutline }}
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Edit</span>
                                    </v-tooltip>
                                    <v-tooltip bottom color="primary">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          x-small
                                          icon
                                          color="primary"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="detailData(item)"
                                        >
                                          <v-icon>
                                            {{
                                              icons.mdiFileDocumentMultipleOutline
                                            }}
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Detail</span>
                                    </v-tooltip>
                                  </template>
                                </v-data-table>
                                <v-row class="mt-4 mr-1 mb-1">
                                  <span></span>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    v-show="isVoidTrue(item)"
                                    small
                                    dark
                                    color="error"
                                    @click="confirmVoid(item)"
                                  >
                                    <v-icon dark left>
                                      {{ icons.mdiCheckboxMarkedCircleOutline }}
                                    </v-icon>
                                    Void
                                  </v-btn>
                                  <v-btn
                                    small
                                    dark
                                    color="primary"
                                    @click="confirmDialog(item)"
                                    v-show="
                                      mainData.length > 0 &&
                                      showReconcile &&
                                      !isVoidTrue(item)
                                    "
                                  >
                                    <v-icon dark left>
                                      {{ icons.mdiCheckboxMarkedCircleOutline }}
                                    </v-icon>
                                    Process Reconcile
                                  </v-btn>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-flex>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <advance-settle-list></advance-settle-list>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppAutocompliteOuSubbranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch.vue";
import AdvanceSettleList from "../settle/advance-settle/AdvanceSettleList.vue";
import Form from "vform";
import {
  mdiMagnify,
  mdiSquareEditOutline,
  mdiDotsVertical,
  mdiTrendingUp,
  mdiCashCheck,
  mdiCheckAll,
  mdiClose,
  mdiCheckboxMarkedCircleOutline,
  mdiFileDocumentMultipleOutline,
  mdiClipboardEditOutline,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  dateFormat,
  dateTimeFormat,
  number_format,
  isInArray,
} from "../../../constan";
import moment from "moment";
import { formatDate } from "@/@core/utils/filter";
import useAppConfig from "@/@core/@app-config/useAppConfig";

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOu,
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AdvanceSettleList,
    AppCardLoader,
  },

  data() {
    const { isDark } = useAppConfig();

    return {
      isDialogVisible: false,
      formDetailList: false,
      formPayAmount: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      ouId: -99,
      theDate: "DATEE",
      phOuSB: themeConfig.placeholder.ouSB,

      vueMoney: 50000,
      isDark,
      // role

      showReconcile:
        isInArray(
          "processReconcileBankMerchantTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      currentTab: 0,

      readonly: false,
      disabled: false,
      outlined: true,
      clearable: true,
      valueWhenIsEmpty: "",
      moneyOptions: {
        prefix: "$",
        decimal: ".",
        thousands: ",",
        precision: 2,
      },
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        decimal: ",",
        thousands: ".",
        length: 20,
        precision: 2,
        autoDecimalMode: false,
      },
      properties: {
        hint: "my hint",
      },

      formEdit: false,
      filterForm: new Form({
        ouId: -99,
        subBranchId: -99,
        keyword: "",
      }),
      formEditPayAmount: new Form({
        id: -99,
        payAmount: -99,
      }),
      icons: {
        mdiMagnify,
        mdiSquareEditOutline,
        mdiCheckboxMarkedCircleOutline,
        mdiDotsVertical,
        mdiTrendingUp,
        mdiCashCheck,
        mdiCheckAll,
        mdiClose,
        mdiFileDocumentMultipleOutline,
        mdiClipboardEditOutline,
      },
      headers: [
        {
          text: "Action",
          align: "right",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Beneficiary Bank",
          value: "bank",
          width: "250px",
          sortable: false,
        },
        // { text: 'Payment Channel', value: 'paymentChannelName', sortable: false },
        {
          text: "Payment Method",
          value: "subPaymentChannelName",
          sortable: false,
        },
        {
          text: "Period",
          value: "startDate",
          width: "200px",
          sortable: false,
        },
        {
          text: "Current Amount",
          value: "amount",
          align: "right",
          width: "190px",
          sortable: false,
        },
        {
          text: "Receive Amount",
          value: "thp",
          align: "right",
          sortable: false,
        },
        // { text: 'O/S Saving Amount', value: 'savingAmount', align: 'right', sortable: false },
        // { text: 'Saving Amount Use', value: 'savingUse', align: 'right', sortable: false },
        {
          text: "O/S Amount",
          value: "balance",
          align: "right",
          sortable: false,
        },
      ],
      headersDetail: [
        { text: "Doc No", value: "docNo", width: "200px" },
        { text: "Doc Date", value: "docDate", width: "175px" },
        // { text: "Reconcile No", value: "processNo", width: "250px" },
        // { text: "Reconcile Date", value: "processAt", width: "200px" },
        // { text: "Settlement Date", value: "settledDate", width: "200px" },
        {
          text: "Amount",
          value: "amount",
          align: "right",
          width: "175px",
        },
        {
          text: "Current O/S Amount",
          value: "currentOsAmount",
          align: "right",
          width: "175px",
        },
      ],
      payAmountHeader: [
        {
          text: "Beneficiary Bank",
          value: "bank",
        },
        {
          text: "Payment Method",
          value: "subPaymentChannelName",
          sortable: false,
        },
        {
          text: "Period",
          value: "startDate",
          width: "200px",
          sortable: false,
        },
        {
          text: "Current Amount",
          value: "amount",
          width: "200px",
          align: "right",
          sortable: false,
        },
        {
          text: "Receive Amount",
          value: "thp",
          sortable: false,
        },
        {
          text: "O/S Amount",
          value: "balance",
          align: "right",
          sortable: false,
        },
      ],
      mainData: [],
      items: [],
      filteredItems: [],
      merchantList: [],
      merchantPicked: null,
      headerList: [],
      payAmountList: [],
      payAmountDetail: [],
      mainDataDetail: [],
      statusClosingOu: "",
      lastClosingOu: "",
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuBranchBankReconcile", (msg) => {
      this.filterForm.subBranchId = -99;
    });
  },
  computed: {
    formattedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          formattedValue: Number(item.payAmount).toLocaleString(),
        };
      });
    },
  },
  methods: {
    updateNumber(item, event) {
      console.log(item);
      // item.payAmount = parseFloat(event.replace(/,/g, ""));
      // console.log(item.payAmount);
    },

    formatNumber(value) {
      if (value == null) {
        return "";
      }
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    updateNumber(item, event) {
      const input = event.payAmount;
      if (typeof input === "string" && input !== "") {
        const numericValue = parseFloat(input.replace(/[^\d.-]/g, ""));
        this.$set(item, "payAmount", numericValue);
      }
    },
    formatMoment(data) {
      const date = moment(data).format("YYYYMMDD");
      return date;
    },
    furthestDate(date) {
      const furthestDate = date.reduce((minDate, obj) => {
        return moment(obj.startDate).isBefore(minDate)
          ? moment(obj.startDate).format("LL")
          : minDate;
      }, moment("3000-01-01"));
      return furthestDate;
    },
    newestDate(date) {
      const newestDate = date.reduce((maxDate, obj) => {
        return moment(obj.endDate).isAfter(maxDate)
          ? moment(obj.endDate).format("LL")
          : maxDate;
      }, moment("1900-01-01"));
      return newestDate;
    },
    isVoidTrue(item) {
      const showVoid = item.every((obj) => obj.statusDoc != "");
      return showVoid;
    },

    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      return dateFormat(value.substring(0, 8));
    },
    dateTimeFormat(value) {
      return dateTimeFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    closeForm() {
      this.formDetailList = false;
      // this.filterInvoiceAP()
    },
    closePayAmountForm() {
      this.formPayAmount = false;
      this.payAmountList = [];
      this.payAmountDetail = [];
    },
    editPayAmount(data) {
      this.payAmountList.push(data);
      this.payAmountDetail = data;
      this.formEditPayAmount.payAmount = data.payAmount;
      this.formEditPayAmount.id = data.idSettleReceive;
      this.formPayAmount = true;
    },
    sortData(columnName) {
      var sortedData = {};

      for (var i = 0; i < this.mainData.length; i++) {
        var object = this.mainData[i];

        if (Object.keys(sortedData).indexOf(object[columnName]) === -1) {
          sortedData[object[columnName]] = [];
        }

        sortedData[object[columnName]].push(object);
      }
      return sortedData;
    },
    getOuId(ouId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/bank-reconcile/last-status-closing?ouId=${ouId}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.statusClosingOu = response.data.result[0].statusClosing;
            this.lastClosingOu = dateTimeFormat(
              response.data.result[0].processAt
            );
          } else {
            this.lastClosingOu = "";
            this.statusClosingOu = "";
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    confirmDialog(dataRecon) {
      this.$dialog
        .confirm("Are you sure you want to process this transaction?.", {
          loader: true,
        })
        .then((dialog) => {
          // setTimeout(() => {
          dialog.close();
          // }, 500);
          this.addBankReconcile(dataRecon);
        })
        .catch(() => {
          // this.filterInvoiceAP()
        });
    },
    confirmVoid(data) {
      this.$dialog
        .confirm("Are you sure you want to process this transaction?.", {
          loader: true,
        })
        .then((dialog) => {
          // setTimeout(() => {
          dialog.close();
          // }, 500);
          this.voidData(data[0].idAdvanceSettle);
        })
        .catch(() => {
          // this.filterInvoiceAP()
        });
    },
    filterItems(value) {
      const newobj = Object.fromEntries(
        Object.entries(this.items).filter(([key]) => key == value)
      );

      if (value != null) {
        this.filteredItems = newobj;
      } else {
        this.filteredItems = this.items;
      }
    },
    editReceiveAmount() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_pc}/bank-reconcile/edit-receive-amount`,
          {
            id: this.formEditPayAmount.id,
            payAmount: parseFloat(this.formEditPayAmount.payAmount),
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.closePayAmountForm();
          this.filterInvoiceAP();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    addBankReconcile(dataRecon) {
      this.isDialogVisible = true;
      var totPayAmount = 0;
      var message = "";
      var j = 0;
      // for (var i = 0; i < dataRecon.length; i++) {
      //   if (
      //     parseFloat(dataRecon[i].payAmount) <= parseFloat(dataRecon[i].amount)
      //   ) {
      //     dataRecon[i].payAmount =
      //       dataRecon[i].payAmount == ""
      //         ? parseFloat("0.00")
      //         : parseFloat(dataRecon[i].payAmount);
      //     totPayAmount += dataRecon[i].payAmount;
      //   } else {
      //     this.isDialogVisible = false;
      //     j = i + 1;
      //     message = "Nominal pembayaran ke-" + j + " melebihi nominal settle";
      //     this.notif("error", "Failed", message);
      //     break;
      //   }
      // }

      if (message == "" && totPayAmount >= 0) {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$session.get("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        };
        const ouId =
          this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
        axios
          .post(
            `${themeConfig.app.api_pc}/bank-reconcile/add`,
            {
              invoiceApList: dataRecon,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.filterForm.ouId = ouId;
            this.mainData = [];
            this.items = [];
            this.filterInvoiceAP();
          })
          .catch((e) => {
            this.isDialogVisible = false;
            if (e.response.status === 401) {
              localStorage.clear();
              sessionStorage.clear();
              router.push({ name: "auth-login" });
            }
            this.notif("error", "Failed", e.response.data.meta.message);
          });
      }
    },
    voidData(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_pc}/advance-settle/void?id=${id}`, config)
        .then((response) => {
          this.filterInvoiceAP();
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    detailData(data) {
      this.isDialogVisible = true;
      this.headerList = data;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/bank-reconcile/invoice-ap-list-detail?ouId=${data.ouId}&cashbankId=${data.cashbankId}&paymentChannelId=${data.paymentChannelId}&subPaymentChannelId=${data.subPaymentChannelId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.formDetailList = true;
            this.mainDataDetail = response.data.result;
          } else {
            this.mainDataDetail = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    filterInvoiceAP() {
      this.isDialogVisible = true;
      this.merchantPicked = null;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      this.ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const ouId = this.ouId;
      axios
        .get(
          `${themeConfig.app.api_pc}/bank-reconcile/invoice-ap-list?ouId=${ouId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
                // do something else
              }
            });

            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].paymentChannelName +
                    "_logo.png")
                ) {
                  this.mainData[index].logoPaymentChanel =
                    this.mainData[index].paymentChannelName;
                }
                // do something
              } catch (e) {
                this.mainData[index].logoPaymentChanel = "NONE";
                // do something else
              }
            });
            this.items = this.sortData("ouName");
            this.filteredItems = this.items;
            this.merchantList = Object.keys(this.items);

            var result = [];
            // this.mainData.reduce(function (res, value) {
            //   if (!res[value.ouId]) {
            //     // res[value.ouId] = {
            //     //   accountName: value.ouId,
            //     //   paymentRefNo: '0',
            //     //   paymentRefDate: moment().format('YYYYMMDD'),
            //     //   amount: parseFloat(value.amount),
            //     //   totalTransferAmount: parseFloat(value.amount),
            //     //   remark: ''
            //     // };
            //     // result.push(res[value.cashbankId])
            //   } else {
            //   }
            //   return res;
            // }, {});
            // this.mainDataItemList = result
          } else {
            this.mainData = [];
            this.items = [];
            this.filteredItems = [];
            this.merchantList = [];
            this.merchantPicked = null;
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.mainData = [];
          this.items = [];
          this.filteredItems = [];
          this.merchantList = [];
          this.merchantPicked = null;

          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
<style>
th {
  text-align: left;
  padding-left: 8px;
}
.vMoney-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  margin-top: -2px;
}

.vMoney-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: -4px;
}
.vMoney-text-field__input {
  border: none;
  border-radius: 0px;
  padding: 4px;
  font-size: 14px;
  line-height: 24px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.vMoney-text-field__input:focus {
  outline: none;
  background-color: transparent;
}

.vMoney-input--active .v-text-field__input {
  background-color: transparent;
}
input::placeholder {
  /* Default placeholder color */
  color: #c1bfc5;
}

/* Placeholder color when input field is empty */
input.empty::placeholder {
  color: red;
}
</style>
