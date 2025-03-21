<template>
  <!-- <ThemeProvider :color="{ middle: { 'bg-base': '#fff' } }"> -->
  <div ref="fxrealtime" class="fxrealtime grid grid-rows-none gap-4 mt-xxs">
    <a-card class="card-fxrealtime">
      <a-date-picker
        class="mr-2"
        v-model:value="formFilter.date"
        format="YYYY-MM-DD"
        valueFormat="YYYYMMDD"
        :allowClear="false"
      />
      <a-select
        class="mr-2"
        v-model:value="formFilter.teams"
        :options="teamOptions"
        mode="multiple"
        placeholder="请选择部门团队"
        style="width: 400px"
        @change="temChange"
      ></a-select>
      <a-select
        class="mr-2"
        v-model:value="formFilter.querytype"
        :options="queryTypeOptions"
        placeholder="请选择查询类型"
        style="width: 200px"
        @change="getConditionOption"
      ></a-select>
      <a-select
        class="mr-2"
        v-model:value="formFilter.querycondition"
        :options="queryConditionOptions"
        placeholder="请选择查询类型"
        style="width: 200px"
        @change="getTableData"
      ></a-select>
      <a-button class="mr-2" type="primary" @click="getTableData">查询</a-button>
      <span class="mr-2">最后更新：{{ formFilter.lastUpdateTime }}</span>
      <a-button class="mr-2" type="primary" ghost :icon="h(LayoutOutlined)" @click="openOptionMature">
        期权到期监控
      </a-button>
      <a-button class="mr-2" type="primary" ghost :icon="h(BookOutlined)" @click="tenorEvent">Tenor</a-button>
      <a-button class="mr-2" type="primary" ghost :icon="h(ScheduleOutlined)" @click="simulationEvent">
        Simulation
      </a-button>
    </a-card>
    <a-card class="card-fxrealtime min-h-[680px]">
      <arco-table
        :columns="tableLabel"
        :data="tableData"
        :loading="loading"
        :pagination="false"
        :bordered="{ cell: true }"
        row-key="id"
        stripe
        sticky-header
        column-resizable
        :scroll="{ maxHeight: '640px' }"
      >
      </arco-table>
    </a-card>

    <arco-drawer
      :width="'82%'"
      :header="false"
      :footer="false"
      :visible="showOptionMature"
      unmountOnClose
      @cancel="showOptionMature = false"
    >
      <div>
        <strong>最后更新：{{ optionMatureTable.lastUpdateTime }}</strong>
        <arco-table
          :columns="optionMatureTable.tableLabel"
          :data="optionMatureTable.tableData"
          :loading="optionMatureLoading"
          :pagination="false"
          :filter-icon-align-left="true"
          :bordered="{ cell: true }"
          row-key="id"
          sticky-header
          column-resizable
          :scroll="{ x: '900px', y: '860px' }"
        >
        </arco-table>
      </div>
    </arco-drawer>

    <arco-drawer
      :width="'70%'"
      :header="false"
      :footer="false"
      :visible="tenorShow"
      unmountOnClose
      @cancel="tenorShow = false"
    >
      <div>
        <a-button class="mb-2 w-full" type="primary">◆ Tenor ◆</a-button>
        <a-row class="mb-2">
          <a-radio-group class="mr-2" v-model:value="formTenor.period" button-style="solid">
            <a-radio-button value="month">Month</a-radio-button>
            <a-radio-button value="day">Day</a-radio-button>
          </a-radio-group>
          <a-select
            class="mr-2"
            v-model:value="formTenor.datatype"
            :options="datatypeOptions"
            placeholder="请选择指标类型"
            style="width: 120px"
            @change="tenorEvent"
          ></a-select>
          <a-select
            v-model:value="formTenor.ccypair"
            :options="ccypairOptions"
            placeholder="请选择货币对"
            style="width: 120px"
            @change="tenorEvent"
          ></a-select>
        </a-row>
        <arco-table
          :columns="tableColumnTenor"
          :data="tableDataTenor"
          :pagination="false"
          :filter-icon-align-left="true"
          :bordered="{ cell: true }"
          row-key="id"
          sticky-header
          column-resizable
          :scroll="{ x: '800px', y: '800px' }"
        >
        </arco-table>
      </div>
    </arco-drawer>

    <arco-drawer
      :width="'45%'"
      :header="false"
      :footer="false"
      :visible="simulationShow"
      unmountOnClose
      @cancel="simulationShow = false"
    >
      <div>
        <a-button class="mb-2 w-full" type="primary">◆ Simulation ◆</a-button>
        <a-row class="mb-2">
          <a-select
            class="mr-2"
            v-model:value="formSimulation.trader"
            :options="traderOptions"
            placeholder="请选择交易员"
            style="width: 150px"
            @change="simulationEvent"
          ></a-select>
          <a-select
            v-model:value="formSimulation.ccypair"
            :options="ccypair2Options"
            placeholder="请选择货币对"
            style="width: 150px"
            @change="simulationEvent"
          ></a-select>
        </a-row>
        <arco-table
          :columns="getSimulationColumns()"
          :data="tableDataSimulation"
          :pagination="false"
          :filter-icon-align-left="true"
          :bordered="{ cell: true }"
          row-key="id"
          sticky-header
          column-resizable
          :scroll="{ x: '800px', y: '800px' }"
        >
        </arco-table>
      </div>
    </arco-drawer>
  </div>
  <!-- </ThemeProvider> -->
</template>

<script lang="ts" setup>
  // import { ThemeProvider } from 'stepin';
  import { computed, h, onActivated, onDeactivated, onMounted, onUnmounted } from 'vue';
  import { BookOutlined, LayoutOutlined, ScheduleOutlined } from '@ant-design/icons-vue';
  import { reactive } from 'vue';
  import { useFxRealtimeStore, storeToRefs } from '@/store';
  import { formatTenorColumns, getSimulationColumns } from '@/store/fxrealtime';
  import { useUnbounded } from '@/utils/useTheme';
  import { isNull } from '@/utils/helpers';
  useUnbounded();

  const {
    getLastDay,
    getTeamOption,
    temChange,
    getConditionOption,
    getTableData,
    openOptionMature,
    tenorEvent,
    simulationEvent,
    taskTimer,
    clearTimer,
  } = useFxRealtimeStore();
  const {
    loading,
    optionMatureLoading,
    formFilter,
    teamOptions,
    queryTypeOptions,
    queryConditionOptions,
    tableData,
    tableLabel,
    showOptionMature,
    tenorShow,
    formTenor,
    datatypeOptions,
    ccypairOptions,
    tenorDataRaw,
    simulationShow,
    formSimulation,
    traderOptions,
    ccypair2Options,
    tableDataSimulation,
    optionMatureTable,
  } = storeToRefs(useFxRealtimeStore());
  let { timer } = storeToRefs(useFxRealtimeStore());

  const tableColumnTenor = computed(() => {
    const data = tenorDataRaw.value;
    const columns = isNull(data) ? [] : data[formTenor.value.period]['columns'];
    const tableColumns = Array.isArray(columns)
      ? formatTenorColumns(columns, formTenor.value.period.toUpperCase())
      : [];
    return tableColumns;
  });
  const tableDataTenor = computed(() => {
    const data = tenorDataRaw.value;
    const tableData = isNull(data) ? [] : data[formTenor.value.period][formTenor.value.datatype];
    return tableData;
  });

  onMounted(() => {
    getLastDay();
    getTeamOption();
  });
  // 组件挂载， 定时刷新页面逻辑
  onMounted(() => {
    timer.value = taskTimer();
  });
  // 若组件实例是 <KeepAlive> 缓存树的一部分，当组件激活时调用。
  onActivated(() => {
    if (!timer.value) {
      timer.value = taskTimer();
    }
  });
  // 若组件实例是 <KeepAlive> 缓存树的一部分，当组件从 DOM 中被移除时调用。
  onDeactivated(() => {
    clearTimer();
  });
  // 组件实例被卸载之后调用
  onUnmounted(() => {
    clearTimer();
  });
</script>

<style scoped lang="less">
  .demo1 {
  }
</style>
