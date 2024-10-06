<template>
  <v-row>
    <v-col cols="12" md="8" sm="12">
      <v-row>
        <v-col cols="12" class="pb-0">
          <analytics-filter></analytics-filter>
        </v-col>
        <v-col cols="12">
          <analytics-statistics-card></analytics-statistics-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="2" sm="6">
      <v-card>
        <v-card-title class="align-start mb-12">
          <v-avatar
              :color="newProjectOptions.color"
              size="38"
              class="elevation-3"
          >
            <v-icon
                size="24"
                color="white"
                class="rounded-0"
            >
              {{ newProjectOptions.icon }}
            </v-icon>
          </v-avatar>
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text class="text-no-wrap text--primary mt-4">
          <p class="font-weight-semibold text-xl mb-1">
            {{ newProjectOptions.statTitle }}
          </p>

          <div class="d-flex align-end flex-wrap">
            <span class="font-weight-semibold text-2xl me-1 mb-2">{{ newProjectOptions.statistics }}</span>
          </div>
          <p class="text-xs text--secondary mb-0">
            {{ newProjectOptions.subtitle }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="2" sm="6">
      <v-card>
        <v-card-title class="align-start mb-12">
          <v-avatar
              color="#e6e6e6"
              size="38"
          >
            <v-img
                :src="require(`@/assets/images/logos/bank_logo/FLIP_logo.png`)"
            >
            </v-img>
          </v-avatar>
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text class="text-no-wrap text--primary mt-4">
          <p class="font-weight-semibold text-xl mb-1">
            {{ totalProfitOptions.statTitle }}
          </p>

          <div class="d-flex align-end flex-wrap">
            <span class="font-weight-semibold text-2xl me-1 mb-2">{{ totalProfitOptions.statistics }}</span>
          </div>
          <p class="text-xs text--secondary mb-0">
            {{ totalProfitOptions.subtitle }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="8" sm="12">
      <analytics-card-eticketing></analytics-card-eticketing>
    </v-col>
    <v-col cols="12" md="4" sm="12">
      <analytics-card-closing></analytics-card-closing>
    </v-col>
    <v-col cols="12" md="4" sm="12">
      <analytics-card-mobile></analytics-card-mobile>
    </v-col>
    <v-col cols="12" md="4" sm="12">
      <analytics-card-a-r-trade></analytics-card-a-r-trade>
    </v-col>
    <v-col cols="12" md="4" sm="12">
      <analytics-card-transactionby-product></analytics-card-transactionby-product>
    </v-col>
  </v-row>
<!--  <v-row>-->
<!--    <v-col cols="12" md="4">-->
<!--      <analytics-congratulation-john></analytics-congratulation-john>-->
<!--    </v-col>-->
<!--    <v-col cols="12" md="8">-->
<!--      <analytics-statistics-card></analytics-statistics-card>-->
<!--    </v-col>-->

<!--    <v-col cols="12">-->
<!--      <analytics-card-closing></analytics-card-closing>-->
<!--    </v-col>-->

<!--    <v-col cols="12" md="4" sm="6">-->
<!--      <analytics-card-mobile></analytics-card-mobile>-->
<!--    </v-col>-->

<!--    <v-col cols="12" md="6" sm="4">-->
<!--      <analytics-card-eticketing></analytics-card-eticketing>-->
<!--    </v-col>-->

<!--    <v-col cols="12" md="2" sm="2">-->
<!--      <v-row class="match-height">-->
<!--        <v-col cols="12" sm="12">-->
<!--          <v-card>-->
<!--            <v-card-title class="align-start">-->
<!--              <v-avatar-->
<!--                  color="#e6e6e6"-->
<!--                  size="38"-->
<!--              >-->
<!--                <v-img-->
<!--                    :src="require(`@/assets/images/logos/bank_logo/FLIP_logo.png`)"-->
<!--                >-->
<!--                </v-img>-->
<!--              </v-avatar>-->
<!--              <v-spacer></v-spacer>-->
<!--            </v-card-title>-->

<!--            <v-card-text class="text-no-wrap text&#45;&#45;primary mt-3">-->
<!--              <p class="font-weight-semibold text-sm mb-1">-->
<!--                {{ totalProfitOptions.statTitle }}-->
<!--              </p>-->

<!--              <div class="d-flex align-end flex-wrap">-->
<!--                <span class="font-weight-semibold text-2xl me-1 mb-2">{{ totalProfitOptions.statistics }}</span>-->
<!--              </div>-->
<!--              <p class="text-xs text&#45;&#45;secondary mb-0">-->
<!--                {{ totalProfitOptions.subtitle }}-->
<!--              </p>-->
<!--            </v-card-text>-->
<!--          </v-card>-->
<!--        </v-col>-->
<!--        <v-col cols="12" sm="12">-->
<!--          <statistics-card-vertical-->
<!--            :change="newProjectOptions.change"-->
<!--            :color="newProjectOptions.color"-->
<!--            :icon="newProjectOptions.icon"-->
<!--            :statistics="newProjectOptions.statistics"-->
<!--            :stat-title="newProjectOptions.statTitle"-->
<!--            :subtitle="newProjectOptions.subtitle"-->
<!--          ></statistics-card-vertical>-->
<!--        </v-col>-->
<!--      </v-row>-->
<!--    </v-col>-->

<!--    <v-col cols="12" md="4">-->
<!--      <analytics-performance></analytics-performance>-->
<!--    </v-col>-->
<!--    <v-col cols="12" md="8">-->
<!--      <analytics-card-deposit-and-withdraw></analytics-card-deposit-and-withdraw>-->
<!--    </v-col>-->

<!--    <v-col cols="12" md="4">-->
<!--      <analytics-card-sales-by-countries></analytics-card-sales-by-countries>-->
<!--    </v-col>-->
<!--    <v-col cols="12" md="8">-->
<!--      <analytics-user-table></analytics-user-table>-->
<!--    </v-col>-->
<!--  </v-row>-->
</template>

<script>
import {mdiPoll, mdiLabelVariantOutline, mdiAccountOutline, mdiCheckAll} from "@mdi/js";
import StatisticsCardProfitLineChart from "@core/components/statistics-card/StatisticsCardProfitLineChart.vue";
import StatisticsCardVertical from "@/@core/components/statistics-card/StatisticsCardVertical.vue";
import StatisticsCardSessionBarChart from "@core/components/statistics-card/StatisticsCardSessionBarChart.vue";

import AnalyticsFilter from "@/views/dashboards/analytics/AnalyticsFilter";

// demos
import AnalyticsCongratulationJohn from "./AnalyticsCongratulationJohn.vue";
import AnalyticsStatisticsCard from "./AnalyticsStatisticsCard.vue";
import AnalyticsCardTotalEarning from "./AnalyticsCardTotalEarning.vue";
import AnalyticsPerformance from "./AnalyticsPerformance.vue";
import AnalyticsCardDepositAndWithdraw from "./AnalyticsCardDepositAndWithdraw.vue";
import AnalyticsCardSalesByCountries from "./AnalyticsCardSalesByCountries.vue";
import AnalyticsUserTable from "./AnalyticsUserTable.vue";
import AnalyticsWeeklyOverview from "./AnalyticsWeeklyOverview.vue";

import AnalyticsCardEticketing from "@/views/dashboards/analytics/AnalyticsCardEticketing";
import AnalyticsCardMobile from "@/views/dashboards/analytics/AnalyticsCardMobile";
import AnalyticsCardClosing from "@/views/dashboards/analytics/AnalyticsCardClosing";
import AnalyticsCardTransactionbyProduct from "@/views/dashboards/analytics/AnalyticsCardTransactionbyProduct";
import AnalyticsCardARTrade from "@/views/dashboards/analytics/AnalyticsCardARTrade";

export default {
  components: {
    StatisticsCardProfitLineChart,
    StatisticsCardVertical,
    StatisticsCardSessionBarChart,
    AnalyticsFilter,
    AnalyticsCongratulationJohn,
    AnalyticsStatisticsCard,
    AnalyticsCardTotalEarning,
    AnalyticsPerformance,
    AnalyticsCardDepositAndWithdraw,
    AnalyticsCardSalesByCountries,
    AnalyticsUserTable,
    AnalyticsWeeklyOverview,
    AnalyticsCardClosing,

    AnalyticsCardEticketing,
    AnalyticsCardMobile,
    AnalyticsCardTransactionbyProduct,
    AnalyticsCardARTrade,
  },
  setup() {
    const profitLineChart = {
      statTitle: "Saldo Flip",
      statistics: "$86.4k",
      series: [
        {
          data: [0, 20, 5, 30, 15, 45],
        },
      ],
    };

    const totalProfitOptions = {
      statTitle: "Saldo Flip",
      icon: mdiPoll,
      color: "secondary",
      subtitle: "Saldo Balance",
      statistics: "Rp. 25.6jt",
      change: "",
    };

    // vertical card options
    const newProjectOptions = {
      statTitle: "Partner",
      icon: mdiAccountOutline,
      color: "primary",
      subtitle: "Total Partner",
      statistics: "862",
      change: "",
    };

    const sessionBarChart = {
      statTitle: "Sessions",
      statistics: "2,856",
      series: [
        {
          name: "2020",
          data: [45, 85, 65, 50, 70],
        },
      ],
    };

    return {
      profitLineChart,
      totalProfitOptions,
      newProjectOptions,
      sessionBarChart,
      icons:[
          mdiCheckAll
      ]
    };
  },
};
</script>
