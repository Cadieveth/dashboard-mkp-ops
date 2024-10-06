<template>
  <v-card>
    <v-card-title class="align-start pb-0 pt-2 mb-0">
      <span>Transaction Chart by Product</span>
      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-text class="pb-0">
      <h4 class="mt-0 font-weight-medium text-sm">
        <span class="font-weight-semibold text--primary me-1">{{ dateStart }}</span>
        <span> s/d </span>
        <span class="font-weight-semibold text--primary me-1">{{ dateEnd }}</span>
      </h4>
    </v-card-text>

    <v-card-text class="pt-0">
      <!-- Chart -->
      <vue-apex-charts
          type="bar"
          height="300"
          :options="chartOptions"
          :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import themeConfig from "@themeConfig";
import Form from "vform";
import moment from "moment";
import AnalyticsCongratulationJohn from "@/views/dashboards/analytics/AnalyticsCongratulationJohn";

// colors
const chartColors = {
  bar: {
    series1: '#826af9',
    series2: '#d2b0ff',
    bg: '#f8d3ff',
  },
  success: {
    shade_100: '#7eefc7',
    shade_200: '#06774f',
  },
  donut: {
    series1: '#ffe700',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#2b9bf4',
    series5: '#FFA1A1',
  },
  area: {
    series3: '#7eefc7',
    series2: '#00d4bd',
    series1: '#06774f',
  },
}

export default {
  name: 'DailyChart',
  components: {
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
        colors: [chartColors.bar.series1, chartColors.bar.series2],
      },
      colors: [chartColors.bar.series1, chartColors.bar.series2],
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
        categories: [
          'PARK',
          'TIC',
          'PSR',
          'PUB SER',
        ],
      },
      yaxis: {
        // opposite: isRtl,
      },
    }

    const series= [
      {
        name: 'Transaction',
        data: [100, 120, 90, 170],
      },
      {
        name: 'Service Fee',
        data: [10, 20, 9, 70],
      },
    ]
    return {
      chartOptions,
      series,
      dateStart: '',
      dateEnd: '',
    }
  },
  mounted() {
    this.dateStart = moment(AnalyticsCongratulationJohn.data().filterForm.startDate).format('DD MMMM YYYY')
    this.dateEnd = moment(AnalyticsCongratulationJohn.data().filterForm.endDate).format('DD MMMM YYYY')
    this.$root.$on('formFilter', data => {
      this.dateStart = moment(data.startDate).format('DD MMMM YYYY')
      this.dateEnd = moment(data.endDate).format('DD MMMM YYYY')
    })
  }

}
</script>
