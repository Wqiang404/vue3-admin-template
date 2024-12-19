<template>
  <!-- <ThemeProvider :color="{ middle: { 'bg-base': '#fff' } }"> -->
  <div ref="demo" class="demo grid grid-rows-none gap-4 mt-xxs">
    <a-card class="card-demo h-[120px]" hoverable>
      <arco-row :gutter="16">
        <arco-col :span="22">
          <arco-form :model="form">
            <arco-row :gutter="16">
              <arco-col :span="8">
                <arco-form-item field="value1" label="Value 1" label-col-flex="100px">
                  <arco-input v-model="form.value1" placeholder="please enter..." />
                </arco-form-item>
              </arco-col>
              <arco-col :span="8">
                <arco-form-item field="value2" label="Value 2" label-col-flex="80px">
                  <arco-input v-model="form.value2" placeholder="please enter..." />
                </arco-form-item>
              </arco-col>
              <arco-col :span="8">
                <arco-form-item field="value3" label="Value 3" label-col-flex="80px">
                  <arco-input v-model="form.value3" placeholder="please enter..." />
                </arco-form-item>
              </arco-col>
            </arco-row>
            <arco-row :gutter="16">
              <arco-col :span="16">
                <arco-form-item field="value4" label="Value 4" label-col-flex="100px">
                  <arco-input v-model="form.value4" placeholder="please enter..." />
                </arco-form-item>
              </arco-col>
              <arco-col :span="8">
                <arco-form-item field="value5" label="Value 5" label-col-flex="80px">
                  <arco-input v-model="form.value5" placeholder="please enter..." />
                </arco-form-item>
              </arco-col>
            </arco-row>
          </arco-form>
        </arco-col>
        <arco-col :span="2">
          <a-button type="primary" class="mb-5 mr-3">查询</a-button>
          <a-button type="primary" class="mb-5">重置</a-button>
        </arco-col>
      </arco-row>
    </a-card>
    <arco-row :gutter="16" class="h-[320px]">
      <arco-col :span="12">
        <a-card class="card-demo h-[320px]" hoverable>
          <a-button type="primary" class="mb-base">信用债持仓统计</a-button>
          <arco-table :columns="columns" :data="data" :pagination="false" class="h-[230px]" sticky-header></arco-table>
        </a-card>
      </arco-col>
      <arco-col :span="12">
        <a-card class="card-demo h-[320px]" hoverable>
          <a-button type="primary" class="mb-base">信用债持仓统计</a-button>
          <arco-table :columns="columns" :data="data" :pagination="false" class="h-[230px]" sticky-header></arco-table>
        </a-card>
      </arco-col>
    </arco-row>

    <arco-row :gutter="16" class="h-[320px]">
      <arco-col :span="8">
        <a-card class="card-demo h-[320px]" hoverable>
          <a-button type="primary" class="mb-base">信用债持仓统计</a-button>
          <arco-table :columns="columns" :data="data" :pagination="false" class="h-[230px]" sticky-header></arco-table>
        </a-card>
      </arco-col>
      <arco-col :span="8">
        <a-card class="card-demo h-[320px]" hoverable>
          <a-button type="primary" class="mb-base">信用债持仓统计</a-button>
          <arco-table :columns="columns" :data="data" :pagination="false" class="h-[230px]" sticky-header></arco-table>
        </a-card>
      </arco-col>
      <arco-col :span="8">
        <a-card class="card-demo h-[320px]" hoverable>
          <a-button type="primary" class="mb-base">信用债持仓统计</a-button>
          <arco-table :columns="columns" :data="data" :pagination="false" class="h-[230px]" sticky-header></arco-table>
        </a-card>
      </arco-col>
    </arco-row>
  </div>
  <!-- </ThemeProvider> -->
</template>

<script lang="ts" setup>
  import { ThemeProvider } from 'stepin';
  import { reactive } from 'vue';
  import { useUnbounded } from '@/utils/useTheme';

  useUnbounded();

  const form = reactive({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      ellipsis: true,
      tooltip: true,
      // bodyCellClass: (row) => {
      //   return row['name'].includes('Jane') ? 'text-red-700' : 'bg-green-700';
      // },
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
      tooltip: true,
    },
  ];

  const data = reactive([
    {
      key: '1',
      name: 'Jane Doe',
      salary: 23000,
      address: '32 Park Road, London',
      email: 'jane.doe@example.com',
    },
    {
      key: '2',
      name: 'Alisa Ross',
      salary: 25000,
      address: '35 Park Road, London',
      email: 'alisa.ross@example.com',
    },
    {
      key: '3',
      name: 'Kevin Sandra',
      salary: 22000,
      address: '31 Park Road, London',
      email: 'kevin.sandra@example.com',
    },
    {
      key: '4',
      name: 'Ed Hellen',
      salary: 17000,
      address: '42 Park Road, London',
      email: 'ed.hellen@example.com',
    },
    {
      key: '5',
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
    {
      key: '6',
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
    {
      key: '7',
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
    {
      key: '8',
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
  ]);
</script>

<style scoped lang="less">
  .demo {
    .card-demo {
      // .ant-card-body {
      // @apply pt-3 pb-3;
      // }
    }
  }
</style>
