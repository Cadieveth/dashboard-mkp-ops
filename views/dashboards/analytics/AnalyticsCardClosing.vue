<template>
<!--  <v-card>-->
<!--    <v-card-title class="align-start pb-1">-->
<!--      <span class="font-weight-semibold">Statistics Closing Transaction</span>-->
<!--      <v-spacer></v-spacer>-->
<!--    </v-card-title>-->

<!--    <v-card-subtitle class="mb-1 mt-n5 pb-0">-->
<!--      <span class="font-weight-semibold text&#45;&#45;primary me-1">{{-->
<!--          dateStart-->
<!--        }}</span>-->
<!--      <span> s/d </span>-->
<!--      <span class="font-weight-semibold text&#45;&#45;primary me-1">{{ dateEnd }}</span>-->
<!--    </v-card-subtitle>-->

<!--    <v-card-text>-->
<!--      <v-row>-->
<!--        &lt;!&ndash; horizontal statistics card &ndash;&gt;-->
<!--        <v-col-->
<!--            cols="12"-->
<!--            md="3"-->
<!--            sm="6"-->
<!--        >-->
<!--          <statistics-card-horizontal-summary-->
<!--              :stat-title="statisticsData[0].statTitle"-->
<!--              :change="statisticsData[0].change"-->
<!--              :color="statisticsData[0].color"-->
<!--              :icon="statisticsData[0].icon"-->
<!--              :statistics="statisticsData[0].statistics"-->
<!--          ></statistics-card-horizontal-summary>-->
<!--        </v-col>-->
<!--        <v-col-->
<!--            cols="12"-->
<!--            md="3"-->
<!--            sm="6"-->
<!--        >-->
<!--          <statistics-card-horizontal-summary-->
<!--              :change="statisticsData[1].change"-->
<!--              :color="statisticsData[1].color"-->
<!--              :icon="statisticsData[1].icon"-->
<!--              :statistics="statisticsData[1].statistics"-->
<!--              :stat-title="statisticsData[1].statTitle"-->
<!--          ></statistics-card-horizontal-summary>-->
<!--        </v-col>-->
<!--        <v-col-->
<!--            cols="12"-->
<!--            md="3"-->
<!--            sm="6"-->
<!--        >-->
<!--          <statistics-card-horizontal-summary-->
<!--              :change="statisticsData[2].change"-->
<!--              :color="statisticsData[2].color"-->
<!--              :icon="statisticsData[2].icon"-->
<!--              :statistics="statisticsData[2].statistics"-->
<!--              :stat-title="statisticsData[2].statTitle"-->
<!--          ></statistics-card-horizontal-summary>-->
<!--        </v-col>-->
<!--        <v-col-->
<!--            cols="12"-->
<!--            md="3"-->
<!--            sm="6"-->
<!--        >-->
<!--          <statistics-card-horizontal-summary-->
<!--              :change="statisticsData[3].change"-->
<!--              :color="statisticsData[3].color"-->
<!--              :icon="statisticsData[3].icon"-->
<!--              :statistics="statisticsData[3].statistics"-->
<!--              :stat-title="statisticsData[3].statTitle"-->
<!--          ></statistics-card-horizontal-summary>-->
<!--        </v-col>-->
<!--      </v-row>-->
<!--    </v-card-text>-->
<!--  </v-card>-->
  <v-row>
    <v-col cols="12">
      <v-card>
        <div class="d-flex justify-space-between">
          <div>
            <v-card-title class="font-weight-semibold text-md text--primary mb-1">
              Summary Reconcile
            </v-card-title>
            <v-card-text class="text-no-wrap mt-4">
              <p class="font-weight-semibold text-xl text--primary mb-1">
                Todo
              </p>
              <span class="text-xl font-weight-semibold text--primary me-1">$25,980</span>
              <p class="text-xs text--secondary mb-0">
                Transaction reconcile todo
              </p>
            </v-card-text>
          </div>

          <vue-apex-charts
              id="chart-stats-total-sales"
              height="160"
              :options="chartOptions"
              :series="chartSeries"
          />
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <statistics-card-vertical
          :change="statisticsData[1].change"
          :color="statisticsData[1].color"
          :icon="statisticsData[1].icon"
          :statistics="statisticsData[1].statistics"
          :stat-title="statisticsData[1].statTitle"
          :subtitle="statisticsData[1].subtitle"
      ></statistics-card-vertical>
    </v-col>
    <v-col cols="12" md="6">
      <statistics-card-vertical
          :change="statisticsData[2].change"
          :color="statisticsData[2].color"
          :icon="statisticsData[2].icon"
          :statistics="statisticsData[2].statistics"
          :stat-title="statisticsData[2].statTitle"
          :subtitle="statisticsData[2].subtitle"
      ></statistics-card-vertical>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiAccountOutline,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiDotsVertical,
  mdiLabelOutline, mdiBankOutline, mdiPoll, mdiPlus, mdiMagnify, mdiClose, mdiCheckAll,
} from "@mdi/js";
import moment from "moment";

import AnalyticsCongratulationJohn from "@/views/dashboards/analytics/AnalyticsCongratulationJohn";
import axios from "@axios";
import themeConfig from "@themeConfig";
import StatisticsCardHorizontalSummary from "@core/components/statistics-card/StatisticsCardHorizontalSummary";
import StatisticsCardVertical from "@core/components/statistics-card/StatisticsCardVertical";
export default {
  components: {
    AnalyticsCongratulationJohn,
    StatisticsCardHorizontalSummary,
    StatisticsCardVertical,
    VueApexCharts: () => import('vue-apexcharts'),
  },
  setup() {
    const statisticsData = [
      {
        statTitle: 'TODO',
        statistics: '2,856',
        change: '',
        icon: mdiPlus,
        color: 'info',
      },
      {
        statTitle: 'ON REVIEW',
        statistics: '28.6k',
        change: '',
        icon: mdiMagnify,
        color: 'primary',
        subtitle:'Transaction reconcile on review',
      },
      {
        statTitle: 'FAILED',
        statistics: '13.6k',
        change: '',
        icon: mdiClose,
        color: 'error',
        subtitle: 'Transaction reconcile failed'
      },
      {
        statTitle: 'DONE',
        statistics: '2,856',
        change: '',
        icon: mdiCheckAll,
        color: 'success',
      },
    ];

    const resolveStatisticsIconVariation = (data) => {
      if (data === "Service Fee")
        return { icon: mdiCurrencyUsd, color: "primary" };
      if (data === "Mdr")
        return { icon: mdiBankOutline, color: "success" };
      if (data === "Transaksi")
        return { icon: mdiTrendingUp, color: "warning" };
      if (data === "Revenue")
        return { icon: mdiCurrencyUsd, color: "info" };

      return { icon: mdiAccountOutline, color: "success" };
    };

    const chartSeries = [85, 20, 30]
    const chartOptions = {
      chart: {
        offsetY: 7,
        type: 'donut',
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: false,
        },
      },
      stroke: {
        colors: ['#fff'],
        width: 8,
      },
      grid: {
        padding: {
          bottom: 10,
        },
      },
      colors: [
        themeConfig.themes.light.success,
        themeConfig.themes.light.primary,
        themeConfig.themes.light.error
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '14px',
                offsetY: 25,
              },
              value: {
                offsetY: -13,
                formatter(value) {
                  return `${value}k`
                },
              },
              total: {
                show: true,
                label: '1 Quater',
                formatter() {
                  return '18%'
                },
              },
            },
          },
        },
      },
    }

    return {
      statisticsData,
      resolveStatisticsIconVariation,
      chartSeries,
      chartOptions,

      // icons
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiAccountOutline,
        mdiLabelOutline,
        mdiCurrencyUsd,
        mdiBankOutline,
      },
      dateStart: "",
      dateEnd: "",
      partner: 0,
      revenue: 0,
      serviceFee: 0,
      trx: 0,
    };
  },
  mounted() {
    this.dateStart = moment(
        AnalyticsCongratulationJohn.data().filterForm.startDate
    ).format("DD MMMM YYYY");
    this.dateEnd = moment(
        AnalyticsCongratulationJohn.data().filterForm.endDate
    ).format("DD MMMM YYYY");
    this.$root.$on("formFilter", (data) => {
      this.dateStart = moment(data.startDate).format("DD MMMM YYYY");
      this.dateEnd = moment(data.endDate).format("DD MMMM YYYY");
      this.getCountPartner();
    });
  },
  methods: {

  },
};
</script>

<style lang="scss">
#chart-stats-total-sales {
  max-width: 150px;
  height: auto;
  .apexcharts-pie {
    .apexcharts-pie-series .apexcharts-pie-area {
      stroke-width: 10;
    }
  }
  .apexcharts-canvas {
    .apexcharts-text {
      &.apexcharts-datalabel-value {
        font-weight: 600;
        font-size: 1.25rem;
      }
      &.apexcharts-datalabel-label {
        font-size: 0.75rem;
        margin-bottom: 2rem;
        transform: translateY(-7px);
      }
    }
  }
}

.v-application {
  &.theme--dark {
    #chart-stats-total-sales {
      path {
        stroke: #312d4b;
      }
    }
  }
}
</style>
