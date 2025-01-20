<template>
  <div class="menu-container grid grid-rows-none gap-4 mt-xxs">
    <a-card class="h-[780px]" hoverable>
      <arco-row>
        <arco-col :span="4">
          <arco-input-search style="margin-bottom: 8px; max-width: 240px" v-model="searchKey" />
          <div class="flex justify-around w-[240px] my-3">
            <a-button type="primary" @click="toggleExpanded">
              {{ expandedKeys?.length ? '收起全部' : '展开全部' }}
            </a-button>
            <a-button type="primary">新增菜单</a-button>
          </div>
          <arco-tree
            :data="treeData"
            v-model:expanded-keys="expandedKeys"
            :show-line="true"
            :size="'large'"
            draggable
            @drop="onDrop"
          >
            <template #title="nodeData">
              <template v-if="getMatchIndex(nodeData?.title) < 0">{{ nodeData?.title }}</template>
              <span v-else>
                {{ nodeData?.title?.substr(0, getMatchIndex(nodeData?.title)) }}
                <span style="color: var(--color-primary-light-4)">
                  {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title), searchKey.length) }} </span
                >{{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length) }}
              </span>
            </template>
          </arco-tree>
        </arco-col>
        <arco-col :span="18">
          <arco-table :columns="columns" :data="data" :pagination="false"></arco-table>
        </arco-col>
      </arco-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  const originTreeData = ref([
    {
      title: 'Trunk 0-0',
      key: '0-0',
      children: [
        {
          title: 'Branch 0-0-0',
          key: '0-0-0',
          children: [
            {
              title: 'Leaf-1',
              key: '0-0-0-0',
            },
            {
              title: 'Leaf-2',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'Branch 0-0-1',
          key: '0-0-1',
          children: [
            {
              title: 'Leaf-3',
              key: '0-0-1-0',
            },
          ],
        },
      ],
    },
  ]);
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
  const allExpandedKeys = ['0-0', '0-0-0', '0-0-1'];
  const toggleExpanded = () => {
    expandedKeys.value = expandedKeys?.value.length ? [] : allExpandedKeys;
  };
  const searchKey = ref('');
  const treeData = computed(() => {
    if (!searchKey.value) return originTreeData.value;
    return searchData(searchKey.value);
  });

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

<style scoped lang="less"></style>
