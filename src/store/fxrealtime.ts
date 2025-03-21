import { defineStore } from 'pinia';
import { h, VNodeChild } from 'vue';
import { message } from 'ant-design-vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import dayjs from 'dayjs';
import { isNull, removeDuplicates } from '@/utils/helpers';
import {
  reqOptionMature,
  reqFxRealTimeTenor,
  reqFxRealTimeSimulation,
  reqFxRealTimeCondition,
  reqFxRealTime,
  reqFxRealTimeLastDay,
  reqFxRealTimeTeamEnumerate,
  reqFxRealTimeTenorEnumerate,
  reqFxRealTimeSimulationEnumerate,
} from '@/api/fxrealtime';
import { formatAmountFillna } from '@/utils/formatter';

export const useFxRealtimeStore = defineStore('fxrealtime', {
  state() {
    return {
      loading: false,
      optionMatureLoading: false,
      timer: null,
      submitLoading: false,
      showOptionMature: false,
      targetShow: false,
      tenorShow: false,
      simulationShow: false,
      tableDataSimulation: [],
      // 子组件的表体数据
      tableData: [],
      // 子组件的表头数据
      tableLabel: [],
      traderBooks: {},
      optionMatureTable: {
        // 子组件的表体数据
        tableData: [],
        // 子组件的表头数据
        tableLabel: [],
        lastUpdateTime: ' ',
      },
      chartData: {
        title: '暂无数据',
        legend: [],
        xdata: [],
        ydata: [],
      },
      tenorDataRaw: null,
      selectRow: null,
      showEdit: false,
      showBatchEdit: false,
      formTenor: {
        period: 'month',
        datatype: null,
        ccypair: null,
      },
      formSimulation: {
        trader: null,
        ccypair: null,
      },
      formFilter: {
        date: dayjs(),
        lastUpdateTime: ' ',
        querytype: localStorage.getItem('querytype') || 'datatype',
        querycondition: null,
        teams: [],
      },
      queryTypeOptions: [
        { label: '按交易员汇总', value: 'trader' },
        { label: '按币种对汇总', value: 'ccypair' },
        { label: '按指标类型汇总', value: 'datatype' },
        { label: '按策略汇总', value: 'strategy' },
      ],
      teamOptions: [],
      queryConditionOptions: [],
      ccypairOptions: [],
      datatypeOptions: [],
      traderOptions: [],
      ccypair2Options: [],
    };
  },
  actions: {
    async openOptionMature() {
      this.showOptionMature = true;
      this.optionMatureLoading = true;
      const queryParam = { date: this.formFilter.date };
      const res = await reqOptionMature(queryParam);
      if (res.code === 200 && res.data != null) {
        this.optionMatureTable.tableData = res.data.tableData || [];
        this.optionMatureTable.tableLabel = formatMatureColumns(res.data.tableLabel || [], res.data.tableData || []);
        this.optionMatureTable.lastUpdateTime = res.data.lastupdatetime;
      }
      this.optionMatureLoading = false;
    },
    tenorEvent() {
      if (isNull(this.formTenor.datatype) || isNull(this.formTenor.ccypair)) {
        this.formTenor.ccypair = (this.ccypairOptions.find((ccyItem) => ccyItem.value === 'USDCNY') ||
          this.ccypairOptions[0])['value'];
        this.formTenor.datatype = (this.datatypeOptions.find((ccyItem) => ccyItem.value === 'net') ||
          this.datatypeOptions[0])['value'];
      }
      const queryParam = Object.assign(
        {
          date: this.formFilter.date,
          teams: this.formFilter.teams,
        },
        this.formTenor
      );
      reqFxRealTimeTenor(queryParam).then((res) => {
        if (res.code === 200) {
          this.tenorDataRaw = res.data || null;
        }
      });
      this.tenorShow = true;
    },
    simulationEvent() {
      const traderObj = this.traderOptions.find((item) => item.value === this.formSimulation.trader);
      if (isNull(this.formSimulation.trader) || isNull(this.formSimulation.ccypair)) {
        this.formSimulation.ccypair = (this.ccypair2Options.find((ccyItem) => ccyItem.value === 'USDCNY') ||
          this.ccypair2Options[0])['value'];
        this.formSimulation.trader = this.traderOptions[0]['value'];
      } else if (!traderObj) {
        this.formSimulation.trader = this.traderOptions[0]['value'];
      }
      const queryParam = Object.assign(
        {
          date: this.formFilter.date,
          teams: this.formFilter.teams,
        },
        this.formSimulation
      );
      reqFxRealTimeSimulation(queryParam).then((res) => {
        if (res.code === 200) {
          this.tableDataSimulation = res.data || null;
        }
      });
      this.simulationShow = true;
    },

    async getLastDay() {
      const res = await reqFxRealTimeLastDay();
      if (res.code === 200 && res.data != null) {
        this.formFilter.date = res.data.lastday;
        this.getConditionOption();
      }
    },
    async getConditionOption() {
      if (this.formFilter.teams && this.formFilter.teams.length) {
        localStorage.setItem('teams', this.formFilter.teams.join('||'));
        localStorage.setItem('querytype', this.formFilter.querytype);
        const res = await reqFxRealTimeCondition(this.formFilter);
        if (res.code === 200 && res.data != null) {
          const list = res.data.options.map((element) =>
            this.formFilter.querytype === 'datatype'
              ? { label: element.toLowerCase(), value: element }
              : { label: element, value: element }
          );
          this.queryConditionOptions = list;
          this.formFilter.querycondition = list[0].value;
          this.getTableData();
        }
      } else {
        message.warning('请至少选择一个部门团队;');
      }
    },
    temChange() {
      this.getConditionOption();
      this.getTenorOption();
      this.getSimulationOption();
    },
    async getTableData() {
      if (this.formFilter.teams && this.formFilter.teams.length) {
        this.loading = true;
        const res = await reqFxRealTime(this.formFilter);
        this.loading = false;
        if (res.code === 200 && res.data != null) {
          this.tableData = res.data.tableData;
          this.tableLabel = formatColumns(res.data.tableLabel || []);
          this.traderBooks = res.data.traderBooks;
          this.formFilter.lastUpdateTime = res.data.lastupdatetime;
        }
      } else {
        message.warning('请至少选择一个部门团队;');
      }
    },
    async getTeamOption() {
      const res = await reqFxRealTimeTeamEnumerate();
      if (res.code === 200 && res.data != null) {
        const list = res.data.teams.map((element) => ({ label: element, value: element }));
        this.teamOptions = list;
        const teams = localStorage.getItem('teams');
        this.formFilter.teams = teams ? teams.split('||') : [list[0].value];
        this.getTenorOption();
        this.getSimulationOption();
      }
    },
    async getTenorOption() {
      const res = await reqFxRealTimeTenorEnumerate({ teams: this.formFilter.teams });
      if (res.code === 200 && res.data != null) {
        this.ccypairOptions = res.data.ccypair.map((element) => ({ label: element.replace('/', ''), value: element }));
        this.datatypeOptions = res.data.datatype.map((element) => ({ label: element, value: element }));
      }
    },
    async getSimulationOption() {
      const res = await reqFxRealTimeSimulationEnumerate({ teams: this.formFilter.teams });
      if (res.code === 200 && res.data != null) {
        this.ccypair2Options = res.data.ccypair.map((element) => ({ label: element.replace('/', ''), value: element }));
        this.traderOptions = res.data.trader.map((element) => ({ label: element, value: element }));
      }
    },
    taskTimer() {
      return setInterval(() => {
        if (this.showOptionMature) {
          this.openOptionMature();
        } else {
          this.getTableData();
        }
      }, 1000 * 60);
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
});

function formatColumns(columns) {
  return columns.map((item) => {
    const colItem: TableColumnData = {
      title: item[1],
      dataIndex: item[0],
      minWidth: 90,
      align: 'right',
      render: ({ record, column, rowIndex }) => {
        if (['Trader', 'Book', 'ccypair', 'oldtactics'].includes(item[0])) {
          return h('strong', {}, record[item[0]] || '-');
        }
        const value = record[item[0]] === 0 ? '-' : formatAmountFillna({ cellValue: record[item[0]] });
        const calss = record[item[0]] > 0 ? 'text-red-600' : record[item[0]] < 0 ? 'text-green-600' : '';
        return h('span', { class: calss }, value);
      },
    };
    if (['Trader', 'Book', 'ccypair'].includes(item[0])) {
      colItem.fixed = 'left';
    }
    if (['oldtactics'].includes(item[0])) {
      colItem.minWidth = 160;
    }
    return colItem;
  });
}

function formatMatureColumns(columns, tableData) {
  return columns.map((item) => {
    const colItem: TableColumnData = {
      title: item.title,
      dataIndex: item.field,
      minWidth: 135,
      align: 'right',
      sortable: {
        sortDirections: ['ascend', 'descend'],
        // defaultSortOrder: 'descend',
      },
      filterable: {
        filters: removeDuplicates(
          tableData.map((dataItem) => ({
            text: dataItem[item.field],
            value: dataItem[item.field],
          }))
        ),
        filter: (value, row) => row[item.field].includes(value),
      },
      bodyCellClass(record) {
        return matureCellStyle(record, item.field);
      },
      render: ({ record, column, rowIndex }) => {
        const calss = '';
        return h('span', { calss: calss }, record[item.field] || '-');
      },
    };
    return colItem;
  });
}

function matureCellStyle(row, field) {
  if (field === 'pors') {
    if (row.pors === '买入') {
      return 'bg-[#e76407] text-white';
    }
  } else if (field === 'status') {
    if (row.status === 'exercised') {
      return 'bg-[#07be16] text-white';
    } else if (row.status === 'itm') {
      return 'bg-[#e74e1f] text-white';
    } else if (row.status === 'atm') {
      return 'bg-[#e787cf] text-white';
    }
  }
}

export function formatTenorColumns(columns, period) {
  return columns.map((item) => {
    const colItem: TableColumnData = {
      title: item === '@period' ? period : item,
      dataIndex: item,
      minWidth: 110,
      align: 'right',
      fixed: item === '@period' ? 'left' : null,
      render: ({ record, column, rowIndex }) => {
        if (['@period'].includes(item)) {
          const value = ['nan', 'NaN', 'inf', 'INF', '-', undefined, null].includes(record[item]) ? '-' : record[item];
          return h('strong', {}, value);
        } else {
          const value = formatAmountFillna({ cellValue: record[item] }, 0);
          return h('span', {}, value);
        }
      },
    };
    return colItem;
  });
}

export function getSimulationColumns() {
  const columns = [
    { field: 'shift', title: 'shift' },
    { field: 'price', title: 'price' },
    { field: 'delta_chg', title: 'delta chg' },
    { field: 'gamma', title: 'gamma' },
    { field: 'vega', title: 'vega' },
    { field: 'pnl_chg', title: 'pnl chg' },
    { field: 'theta', title: 'vega' },
  ];
  return columns.map((item) => {
    const colItem: TableColumnData = {
      title: item.title,
      dataIndex: item.field,
      minWidth: 100,
      align: 'right',
      render: ({ record, column, rowIndex }) => {
        const list = ['delta_chg', 'gamma', 'vega', 'pnl_chg', 'theta'];
        const value = formatAmountFillna({ cellValue: record[item.field] });
        const value_4 = record[item.field].toFixed(4);
        return h('span', {}, list.includes(item.field) ? value : value_4);
      },
    };
    return colItem;
  });
}
