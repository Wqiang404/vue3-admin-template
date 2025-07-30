<template>
  <arco-modal
    v-model:visible="isShowRoleAndUserListModal"
    :title="selectRow?.name + ' - 菜单已授权角色及用户'"
    width="50%"
    :footer="false"
    @cancel="handleCancel"
    draggable
    unmount-on-close
  >
    <a-radio-group v-model:value="activeKey" button-style="solid" class="mb-1">
      <a-radio-button value="roles">{{ selectRow.name }} - 菜单已授权角色</a-radio-button>
      <a-radio-button value="users">{{ selectRow.name }} - 菜单已授权用户</a-radio-button>
    </a-radio-group>
    <arco-table
      v-show="activeKey === 'roles'"
      :columns="roleColumns"
      :data="menuRoleUserData.rolse"
      :loading="roleAndUserDataLoading"
      :pagination="false"
      :scroll="{ maxHeight: '600px' }"
    >
      <template #title-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
        <div
          class="custom-filter p-[20px] bg-[var(--color-bg-5)] border border-solid border-[var(--color-neutral-3)] rounded-[var(--border-radius-medium)] shadow-[0_2px_5px_rgba(0,0,0,0.1)]"
        >
          <a-space direction="vertical">
            <arco-input :model-value="filterValue[0]" @input="(value) => setFilterValue([value])" />
            <div class="custom-filter-footer flex justify-between">
              <a-button @click="handleFilterConfirm">确定</a-button>
              <a-button @click="handleFilterReset">重置</a-button>
            </div>
          </a-space>
        </div>
      </template>
    </arco-table>
    <arco-table
      v-show="activeKey === 'users'"
      :columns="userColumns"
      :data="menuRoleUserData.admins"
      :loading="roleAndUserDataLoading"
      :pagination="false"
      :scroll="{ maxHeight: '600px' }"
    >
      <template #filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
        <div
          class="custom-filter p-[20px] bg-[var(--color-bg-5)] border border-solid border-[var(--color-neutral-3)] rounded-[var(--border-radius-medium)] shadow-[0_2px_5px_rgba(0,0,0,0.1)]"
        >
          <a-space direction="vertical">
            <arco-input :model-value="filterValue[0]" @input="(value) => setFilterValue([value])" />
            <div class="custom-filter-footer flex justify-between">
              <a-button @click="handleFilterConfirm">确定</a-button>
              <a-button @click="handleFilterReset">重置</a-button>
            </div>
          </a-space>
        </div>
      </template>
    </arco-table>
  </arco-modal>
</template>

<script setup lang="ts">
  import { ref, h } from 'vue';
  import { useMenuRebuildStore, storeToRefs } from '@/store';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { IconSearch } from '@arco-design/web-vue/es/icon';

  const { selectRow, isShowRoleAndUserListModal, menuRoleUserData, roleAndUserDataLoading } = storeToRefs(useMenuRebuildStore());

  // 当前激活的标签页
  const activeKey = ref('roles');
  // 角色表格列配置
  const roleColumns: TableColumnData[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '代码',
      dataIndex: 'name',
    },
    {
      title: '名称',
      dataIndex: 'title',
      filterable: {
        // filters: [
        //   {
        //     text: '管理',
        //     value: '管理',
        //   },
        // ],
        filter: (value, record) => {
          return record.title.includes(value);
        },
        slotName: 'title-filter',
        icon: () => h(IconSearch),
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      render: ({ record, column, rowIndex }) => {
        return h('span', { class: '' }, record.status ? '有效' : '无效');
      },
    },
    {
      title: '描述',
      dataIndex: 'remark',
    },
  ];
  // 用户表格列配置
  const userColumns: TableColumnData[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      width: 100,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      filterable: {
        filter: (value, record) => {
          return record.user_name.includes(value);
        },
        slotName: 'filter',
        icon: () => h(IconSearch),
      },
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      width: 100,
      filterable: {
        filter: (value, record) => {
          return record.real_name.includes(value);
        },
        slotName: 'filter',
        icon: () => h(IconSearch),
      },
    },
    {
      title: '部门',
      dataIndex: 'sector',
      filterable: {
        filter: (value, record) => {
          return record.sector.includes(value);
        },
        slotName: 'filter',
        icon: () => h(IconSearch),
      },
    },
    {
      title: '分行',
      dataIndex: 'branch',
      width: 80,
      filterable: {
        filter: (value, record) => {
          return record.branch.includes(value);
        },
        slotName: 'filter',
        icon: () => h(IconSearch),
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      render: ({ record, column, rowIndex }) => {
        return h('span', { class: '' }, record.status ? '有效' : '无效');
      },
    },
    {
      title: '描述',
      dataIndex: 'remark',
    },
  ];

  const handleCancel = () => {
    isShowRoleAndUserListModal.value = false;
  };
</script>
