<template>
  <v-row>
    <v-col cols="12" md="6">
      <statistics-card-vertical
          :change="statisticsData[0].change"
          :color="statisticsData[0].color"
          :icon="statisticsData[0].icon"
          :statistics="statisticsData[0].statistics"
          :stat-title="statisticsData[0].statTitle"
          :subtitle="statisticsData[0].subtitle"
      ></statistics-card-vertical>
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
    <v-col cols="12">
      <v-card>
        <v-card-title class="align-start pb-0 pt-1 font-weight-bold">
          <span>A/R Trade Over Due</span>
        </v-card-title>
        <v-card-text>
          <vue-apex-charts
              type="bar"
              :options="chartOptions"
              :series="chartData"
              height="107"
          ></vue-apex-charts>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import StatisticsCardVertical from "@core/components/statistics-card/StatisticsCardVertical";
  import {
    mdiAlertBoxOutline,
    mdiAlertCircleOutline,
    mdiCalendarAlert,
    mdiCheckAll,
    mdiClose,
    mdiMagnify,
    mdiPlus
  } from "@mdi/js";
  import themeConfig from "@themeConfig";

  export default {
    name: "ChildCardARTrade",
    components: {
      StatisticsCardVertical,
      VueApexCharts: () => import('vue-apexcharts'),
    },
    data(){
      const chartOptions = {
        chart: {
          zoom: {
            enabled: true,
          },
          toolbar: {
            show: false,
          },
        },
        markers: {
          strokeWidth: 7,
          strokeOpacity: 1,
          strokeColors: [themeConfig.themes.light.secondary, themeConfig.themes.light.secondary],
          colors: [themeConfig.themes.dark.error],
        },
        colors: [themeConfig.themes.dark.error],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        tooltip: {
          shared: false,
          // custom(data) {
          //   return `${'<div class="px-1 py-50"><span>'}${
          //       data.series[data.seriesIndex][data.dataPointIndex]
          //   }</span></div>`
          // },
        },
        plotOptions: {
          bar: {
            columnWidth: '60%',
            distributed: false,
            borderRadius: 4,
            startingShape: 'rounded',
          },
        },
        xaxis: {
          show: false,
          categories: ['Today', '7 Days', '14 Days', '>30 Days'],
          labels: {
            show: false,
          },

          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tickPlacement: 'on',
        },
        yaxis: {
          // opposite: isRtl,
          show: false,
        },
        grid: {
          show: true,
          padding: {
            top: -20,
            right: 10,
            left: -10,
            bottom: -15,
          },
        },
      }

      const chartData= [
        {
          name: 'Transaction',
          data: [100, 120, 90, 170],
        },
      ]
      return{
        chartOptions,
        chartData,
        statisticsData : [
          {
            statTitle: 'Due',
            statistics: '2,856',
            change: '',
            icon: mdiCalendarAlert,
            color: 'warning',
            subtitle:'Account Receivable Due',
          },
          {
            statTitle: 'Over Due',
            statistics: '28.6k',
            change: '',
            icon: mdiAlertCircleOutline,
            color: 'error',
            subtitle:'Account Receivable Over Due',
          }
        ],
      }
    },
    mounted() {
    },
    methods:{

    }
  }
</script>