<template>
  <div class="menu-container grid grid-rows-none gap-4 mt-xxs">
    <a-card class="" hoverable>
      <arco-row>
        <arco-col :span="4">
          <arco-input-search style="margin-bottom: 8px; max-width: 200px; margin-right: 8px" v-model="searchKey" />
          <a-button type="primary" @click="getTableData">查询</a-button>
          <div class="flex justify-around w-[240px] my-3">
            <a-button type="primary" @click="toggleExpanded">
              {{ expandedKeys?.length ? '收起全部' : '展开全部' }}
            </a-button>
            <a-button type="primary">新增菜单</a-button>
          </div>
          <div class="h-[630px] overflow-scroll">
            <arco-tree
              :data="treeData"
              v-model:expanded-keys="expandedKeys"
              v-model:selected-keys="selectedTreeNode"
              :show-line="true"
              :size="'large'"
              draggable
              @select="onTreeSelect"
              @drop="onDrop"
            >
              <template #title="nodeData">
                <template v-if="getMatchIndex(nodeData?.title) < 0">{{ nodeData?.title }}</template>
                <span v-else>
                  {{ nodeData?.title?.substr(0, getMatchIndex(nodeData?.title)) }}
                  <span style="color: var(--color-primary-light-4)">
                    {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title), searchKey.length) }}
                  </span>
                  {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length) }}
                </span>
              </template>
            </arco-tree>
          </div>
        </arco-col>
        <arco-col :span="20">
          <arco-table :columns="columns" :data="data" :pagination="false" :loading="loading" :scroll="{ maxHeight: '720px' }">
            <template #optional="{ record }">
              <a-button class="mr-1" type="primary" ghost @click="showRoleAndUserListModal(record)"> view </a-button>
              <a-button class="mr-1" type="primary" ghost @click="$modal.info({ title: 'Name', content: record.name })"> edit </a-button>
              <a-button class="mr-1" danger @click="$modal.info({ title: 'Name', content: record.name })"> delete </a-button>
            </template>
          </arco-table>
        </arco-col>
      </arco-row>
    </a-card>

    <RoleAndUserListModal />
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, h, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { getIconMap } from '@/utils/helpers';
  import { formatMenuListToTree } from '@/utils/formatter';
  import { useMenuRebuildStore, storeToRefs } from '@/store';
  import RoleAndUserListModal from './RoleAndUserListModal.vue';

  const { getTableData, viewEvent } = useMenuRebuildStore();
  const { loading, formFilter, tableData, selectedTreeNode, isShowRoleAndUserListModal } = storeToRefs(useMenuRebuildStore());
  const menuTypeMap = ['全部', '目录', '菜单', '操作'];

  const data = computed(() => {
    if (selectedTreeNode.value && selectedTreeNode.value[0]) {
      return tableData.value.filter((item) => item.parent_id === selectedTreeNode.value[0]).sort((a, b) => a.sequence - b.sequence);
    }
    return tableData.value.filter((item) => !item.parent_id).sort((a, b) => a.sequence - b.sequence);
  });
  const originTreeData = computed(() => {
    return formatMenuListToTree(tableData.value);
  });
  const initTreeData = (data, parent: string | null = null) => {
    data.forEach((item) => {
      item.parent = parent;
      if (Array.isArray(item.children) && item.children.length) {
        initTreeData(item.children, item.key);
      }
    });
  };
  initTreeData(originTreeData.value);
  const expandedKeys = ref([]);
  const allExpandedKeys = computed(() => {
    return formatMenuListToTree(tableData.value).map((treeItem) => treeItem.id);
  });
  const toggleExpanded = () => {
    expandedKeys.value = expandedKeys?.value.length ? [] : allExpandedKeys.value;
  };
  const searchKey = ref('');
  const treeData = computed(() => {
    let list: any[] = [];
    if (!searchKey.value) {
      list = originTreeData.value;
    } else {
      list = searchData(searchKey.value);
    }
    const genTreeData = (arr) => {
      return arr.map((item) => {
        return {
          key: item.id,
          title: item.name,
          children: genTreeData(item.children || []),
        };
      });
    };
    return genTreeData(list);
  });

  const onTreeSelect = (selectedKeys, data) => {
    const current = tableData.value.find((item) => item.id === selectedKeys[0]);
    if (current && current.menu_type < 3) {
      selectedTreeNode.value = [current.id];
    }
  };

  function searchData(keyword) {
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      return result;
    };

    return loop(originTreeData.value);
  }

  function getMatchIndex(title) {
    if (!searchKey.value) return -1;
    return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
  }
  const onDrop = ({ dragNode, dropNode, dropPosition }) => {
    // console.log(dragNode, dropNode, dropPosition);
    if (dragNode.parent !== dropNode.parent) return;
    const data = originTreeData.value;
    const loop = (data, key, callback) => {
      data.some((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return true;
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
        return false;
      });
    };

    if (dropPosition !== 0) {
      loop(data, dragNode.key, (_, index, arr) => {
        arr.splice(index, 1);
      });
      loop(data, dropNode.key, (_, index, arr) => {
        arr.splice(dropPosition < 0 ? index : index + 1, 0, dragNode);
      });
    } else {
      // loop(data, dragNode.key, (_, index, arr) => {
      //   arr.splice(index, 1);
      // });
      // loop(data, dropNode.key, (item) => {
      //   item.children = item.children || [];
      //   item.children.push(dragNode);
      // });
    }
  };

  onMounted(() => {
    getTableData();
  });

  const showRoleAndUserListModal = (record) => {
    isShowRoleAndUserListModal.value = true;
    viewEvent(record);
  };
  const getMenuName = () => {
    const current = tableData.value.find((item) => item.id === selectedTreeNode.value[0]);
    return current?.name || '';
  };

  const columns: TableColumnData[] = [
    {
      title: '排序值',
      dataIndex: 'sequence',
      width: 80,
      align: 'center',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 70,
      align: 'center',
      render: ({ record, column, rowIndex }) => {
        const IconComponent = getIconMap().get('apps');
        return h(IconComponent, { class: 'text-[18px] mx-[4px]' });
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '组件名称',
      dataIndex: 'code',
      minWidth: 160,
    },
    {
      title: '操作指令',
      dataIndex: 'directive',
      width: 100,
    },
    {
      title: '菜单地址',
      dataIndex: 'url',
      minWidth: 280,
    },
    {
      title: '隐藏',
      dataIndex: 'hidden',
      width: 70,
      render: ({ record, column, rowIndex }) => {
        return h('span', { class: '' }, record.hidden ? '隐藏' : '显示');
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 70,
      render: ({ record, column, rowIndex }) => {
        return h('span', { class: '' }, record.status ? '有效' : '无效');
      },
    },
    {
      title: '类型',
      dataIndex: 'menu_type',
      width: 70,
      render: ({ record, column, rowIndex }) => {
        return h('span', { class: '' }, menuTypeMap[record.menu_type]);
      },
    },
    {
      title: '父菜单',
      dataIndex: 'parent_id',
      width: 90,
      render: ({ record, column, rowIndex }) => {
        return h('span', { class: '' }, getMenuName());
      },
    },
    {
      title: '描述',
      dataIndex: 'remark',
      minWidth: 150,
    },
    {
      title: '操作',
      width: 230,
      slotName: 'optional',
    },
  ];
</script>

<style scoped lang="less"></style>
