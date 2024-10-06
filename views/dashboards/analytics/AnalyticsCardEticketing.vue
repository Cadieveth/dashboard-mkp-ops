<template>
  <v-card>
    <v-card-title class="align-start pb-0">
      <span>Transaction Chart</span>
      <v-spacer></v-spacer>
      <v-radio-group
          v-model="form.selectedRadio"
          class="mt-0"
          hide-details
      >
        <div class="d-flex flex-wrap demo-space-x">
          <v-radio
              label="Daily"
              color="secondary"
              value="daily"
          ></v-radio>
          <v-radio
              label="Weekly"
              color="secondary"
              value="weekly"
          ></v-radio>
          <v-radio
              label="Monthly"
              color="secondary"
              value="monthly"
          ></v-radio>
          <v-radio
              label="Yearly"
              color="secondary"
              value="yearly"
              class="pb-2"
          ></v-radio>
        </div>
      </v-radio-group>
    </v-card-title>

    <v-card-text>
      <!-- Chart -->
      <vue-apex-charts
          type="area"
          height="293"
          :options="chartOptions"
          :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import themeConfig from "@themeConfig";
import Form from "vform";

// colors
const chartColors = {
  column: {
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
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [themeConfig.themes.light.secondary, themeConfig.themes.light.secondary, themeConfig.themes.light.secondary],
        colors: [chartColors.area.series3, chartColors.area.series2, chartColors.area.series1],
      },
      colors: [chartColors.area.series3, chartColors.area.series2, chartColors.area.series1],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      tooltip: {
        shared: false,
        custom(data) {
          return `${'<div class="px-1 py-50"><span>'}${
            data.series[data.seriesIndex][data.dataPointIndex]
          }%</span></div>`
        },
      },
      xaxis: {
        categories: [
          '7/12',
          '8/12',
          '9/12',
          '10/12',
          '11/12',
          '12/12',
          '13/12',
          '14/12',
          '15/12',
          '16/12',
          '17/12',
          '18/12',
          '19/12',
          '20/12',
          '21/12',
        ],
      },
      yaxis: {
          // opposite: isRtl,
      },
    }

    const series= [
      {
        name: 'Visits',
        data: [100, 120, 90, 170, 130, 160, 140, 240, 220, 180, 270, 280, 375],
      },
      {
        name: 'Clicks',
        data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220, 275],
      },
      {
        name: 'Sales',
        data: [20, 40, 30, 70, 40, 60, 50, 140, 120, 100, 140, 180, 220],
      },
    ]
    return {
      chartOptions,
      series,
      form: new Form({
        selectedRadio: 'daily',
      })
    }
  },

}
</script>
