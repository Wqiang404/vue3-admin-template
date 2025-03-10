<template>
  <!-- <ThemeProvider :color="{ middle: { 'bg-base': '#fff' } }"> -->
  <div ref="demo1" class="demo grid grid-rows-none gap-4 mt-xxs">
    <arco-table :columns="columns" :data="data" :pagination="false"></arco-table>
  </div>
  <!-- </ThemeProvider> -->
</template>

<script lang="ts" setup>
  import { ThemeProvider } from 'stepin';
  import { reactive } from 'vue';
  import { useUnbounded } from '@/utils/useTheme';

  useUnbounded();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
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
  ]);
</script>

<style scoped lang="less">
  .demo1 {
  }
</style>
