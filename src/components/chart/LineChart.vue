<template>
  <div style="width: 100%; height: 400px" class="line-chart" ref="container"></div>
</template>
<script lang="ts" setup>
  import { useSettingStore, storeToRefs } from '@/store';
  import { onBeforeUnmount, onMounted, ref, nextTick, watchEffect, watch, toRef } from 'vue';
  import type { EChartsType } from 'echarts';
  import * as echarts from 'echarts';
  import screenfull from 'screenfull';
  import { formatTimestamp } from '@/utils/formatter';
  import { transpose } from '@/utils/helpers';
  import { useNotification } from '@/utils/useNotification';
  import { message } from 'ant-design-vue';

  const { isDark } = storeToRefs(useSettingStore());

  interface IChartDataTitle {
    topTitle?: string;
    yLeftName?: string;
    yRightName?: string;
  }
  interface IChartData {
    title?: IChartDataTitle;
    legend?: string[];
    xdata?: any[];
    ydata?: any[];
    zoom?: number[];
    scale?: boolean;
    refreshData?: boolean;
  }
  interface IChart {
    chartData: IChartData;
  }

  const props = withDefaults(defineProps<{ chartData: IChartData }>(), {
    chartData: () => ({
      title: {
        topTitle: '暂无数据',
        yLeftName: '暂无数据',
        yRightName: '暂无数据',
      },
      legend: [],
      xdata: [],
      ydata: [],
      zoom: [0, 100],
      scale: true,
      refreshData: false,
    }),
  });

  let chart: EChartsType | null = null;
  const container = ref<HTMLElement>();

  function resize() {
    chart?.resize();
  }
  const option = () => ({
    title: {
      text: props.chartData.title.topTitle,
      left: 'center',
    },
    backgroundColor: isDark.value ? '#2a2a2b' : '#fff',
    color: ['#005af9', '#985af9'],
    grid: [
      {
        top: 100,
        left: 32,
        right: 32,
        bottom: 50,
        containLabel: true,
      },
    ],
    xAxis: [
      {
        // name: 'time',
        // nameTextStyle: { color: 'rgba(0 , 0, 0, 0)' },
        // type: 'category',
        // axisTick: { show: true },
        // axisLine: { show: true },
        // boundaryGap: 0,
        // splitLine: {
        //   show: false,
        // },
        nameGap: 25,
        data: props.chartData.xdata,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: props.chartData.title.yLeftName,
        position: 'left',
        scale: true,
        nameRotate: 0,
        nameTextStyle: {
          fontSize: 14,
        },
        axisTick: { show: true },
        axisLine: { show: true },
        axisLabel: {
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            width: 2,
            color: isDark.value ? 'rgba(217, 217, 217, 0.15)' : 'rgba(0, 0, 0, 0.15)',
          },
        },
      },
      {
        type: 'value',
        name: props.chartData.title.yRightName,
        position: 'right',
        scale: true,
        nameRotate: 0,
        nameTextStyle: {
          fontSize: 14,
        },
        axisTick: { show: true },
        axisLine: { show: true },
        axisLabel: {
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
            width: 2,
            color: isDark.value ? 'rgba(217, 217, 217, 0.15)' : 'rgba(0, 0, 0, 0.15)',
          },
        },
      },
    ],
    legend: {
      show: true,
      data: props.chartData.legend,
      top: 40,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'cross', // 默认为直线，可选为：'line' | 'shadow' | 'cross'
      },
      extraCssText: 'white-space:pre-wrap',
    },
    toolbox: {
      feature: {
        // dataView: { show: true, readOnly: false },
        // brush: { show: true },
        // magicType: { show: true, type: ['line', 'bar'] },
        // restore: { show: true },
        myFull: {
          show: true,
          title: screenfull.isFullscreen ? '退出全屏' : '全屏',
          icon: 'path://M641.750109 384.100028l205.227128-204.519-0.704035 115.89966c-0.282433 9.611915 7.489578 18.09103 17.101493 17.808598l12.297071 0c9.611915-0.283456 17.667382-5.936199 17.808598-15.689331l0.565888-172.57752c0-0.14224 0.282433-9.187243 0.282433-9.187243 0.14224-4.804423-0.99056-9.187243-4.100388-12.297071-3.109828-3.109828-7.347339-5.086855-12.297071-4.946662l-8.763594 0.14224c-0.141216 0-0.278339 0-0.420579 0.14224L697.581696 98.166787c-9.611915 0.283456-17.667382 8.200776-17.808598 17.950837l0 12.297071c1.416256 11.44875 10.458189 18.092054 20.070104 17.808598l112.789832 0.283456-204.66124 203.814965c-9.329483 9.329483-9.329483 24.449855 0 33.778314 9.329483 9.470699 24.452925 9.470699 33.782408 0L641.750109 384.100028zM383.095141 576.889893 177.726797 780.705881l0.707105-115.338888c0.283456-9.607822-7.492648-18.086937-17.104563-17.808598l-13.001105 0c-9.611915 0.283456-17.667382 5.937223-17.808598 15.690354l-0.565888 172.718737c0 0.14224-0.282433 9.187243-0.282433 9.187243-0.14224 4.808516 0.99056 9.187243 4.096295 12.297071 3.109828 3.109828 7.351432 5.086855 12.297071 4.946662l8.762571-0.14224c0.14224 0 0.283456 0 0.425695-0.14224l171.873486 0.708128c9.607822-0.283456 17.667382-8.196683 17.808598-17.950837L344.93503 832.575226c-1.415232-11.44875-10.461259-18.092054-20.074198-17.808598L212.069977 814.483172 416.59 610.671277c9.329483-9.329483 9.329483-24.453948 0-33.782408C407.40685 567.41817 392.424624 567.41817 383.095141 576.889893L383.095141 576.889893zM894.047276 835.967486l-0.424672-172.718737c-0.283456-9.612938-8.200776-15.406898-17.809621-15.690354l-12.296047 0c-9.612938-0.278339-17.243733 8.200776-17.105586 17.808598l0.708128 115.903753L641.750109 576.889893c-9.329483-9.329483-24.452925-9.329483-33.782408 0-9.325389 9.328459-9.325389 24.452925 0 33.782408L812.490795 814.483172l-112.789832 0.283456c-9.611915-0.283456-18.515702 6.502088-20.073174 17.808598l0 12.297071c0.282433 9.611915 8.200776 17.667382 17.808598 17.950837l171.166381-0.708128c0.141216 0 0.282433 0.14224 0.424672 0.14224l8.763594 0.14224c4.803399 0.141216 9.187243-1.694595 12.296047-4.946662 3.109828-3.109828 4.238534-7.488555 4.097318-12.297071 0 0-0.14224-9.046027-0.14224-9.187243L894.047276 835.968509zM212.216309 146.506748l112.789832-0.283456c9.607822 0.283456 18.512632-6.502088 20.070104-17.808598L345.076246 116.116601c-0.283456-9.611915-8.196683-17.667382-17.808598-17.950837l-172.011632 0.708128c-0.14224 0-0.283456-0.14224-0.425695-0.14224l-8.761548-0.14224c-4.808516-0.141216-9.187243 1.694595-12.297071 4.946662-3.109828 3.109828-4.242627 7.488555-4.096295 12.297071 0 0 0.282433 9.046027 0.282433 9.187243l0.420579 172.718737c0.14224 9.608845 8.200776 15.406898 17.808598 15.686261l13.005198 0c9.611915 0.282433 17.242709-8.196683 17.10047-17.808598l-0.564865-115.334795 205.231221 203.958228c9.324366 9.329483 24.448832 9.329483 33.777291 0 9.329483-9.329483 9.329483-24.452925 0-33.782408L212.216309 146.506748 212.216309 146.506748zM212.216309 146.506748',
          onclick: toScreenfull,
        },
        // dataZoom: { show: true },
        myExport: {
          // 自定义数据导出方法，自定义的工具名字，只能以 my 开头
          show: true,
          title: '导出为Excel',
          icon: 'image:///static/export.jpg',
          onclick: handleDownload,
        },
        saveAsImage: { show: true },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: props.chartData.zoom[0],
        end: props.chartData.zoom[1],
      },
      {
        show: true,
        type: 'slider',
        height: 10,
        top: '90%',
        start: props.chartData.zoom[0],
        end: props.chartData.zoom[1],
      },
    ],
    series: [
      {
        name: props.chartData.title.yLeftName,
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        lineStyle: {
          width: 3,
        },
        data: props.chartData.ydata[0],
      },
      {
        name: props.chartData.title.yRightName,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        width: 4,
        lineStyle: {
          width: 3,
        },
        data: props.chartData.ydata[1],
      },
    ],
  });

  watchEffect(() => {
    if (props.chartData) {
      updateChart();
    }
  });
  // watch(
  //   () => props.chartData,
  //   () => {
  //     if (props.chartData) {
  //       updateChart();
  //     }
  //   },
  //   { deep: true }
  // );

  async function updateChart() {
    await nextTick();
    chart = echarts.init(container.value!, isDark.value ? 'dark' : 'light');
    chart.setOption(option());
    window.addEventListener('resize', resize);
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });

  function toScreenfull(e) {
    if (screenfull.isEnabled) {
      // 判断是否支持全屏
      screenfull.toggle(container.value); // 使用toggle方法
    } else {
      message.error('不支持全屏');
    }
  }
  function handleDownload({ option }) {
    // 适配单X轴多Y轴
    const { legend, xAxis, series } = option;
    import('@/vendor/Export2Excel').then((excel) => {
      const tHeader = ['DateTime', ...legend[0]['data']];
      const colDataMap = new Map();
      colDataMap.set('DateTime', xAxis[0]['data']);
      series.forEach((row) => {
        colDataMap.set(row.name, row.data);
      });

      const colDataArr = tHeader.map((item) => colDataMap.get(item));
      const rowDataArr = transpose(colDataArr);
      excel.export_json_to_excel({
        header: tHeader,
        data: rowDataArr,
        filename: `${formatTimestamp()} ${props.chartData.title.topTitle || '图表数据源'}`,
        bookType: 'xlsx',
      });
      const { openNotification } = useNotification();
      openNotification('正在导出数据,请稍后... ');
    });
  }
</script>
