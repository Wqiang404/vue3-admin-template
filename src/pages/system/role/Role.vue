<template>
  <div class="role-container mt-xxs">
    <a-card class="h-[780px]" hoverable>
      <!-- 搜索表单 -->
      <a-card class="search-form">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="">
            <a-input v-model:value="searchForm.roleName" placeholder="请输入内容" />
          </a-form-item>
          <a-form-item>
            <a-button class="mr-4" type="primary" @click="handleSearch">查询</a-button>
            <a-button class="mr-4" type="primary" @click="handleAdd">
              <template #icon>
                <PlusOutlined />
              </template>
              新增角色
            </a-button>
            <a-button class="mr-4" type="primary" danger @click="handleDelete">批量删除</a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 角色列表 -->
      <arco-table
        :columns="columns"
        :data="roleStore.roleList"
        :loading="loading"
        :pagination="{
          total: roleStore.pagination.total,
          current: roleStore.pagination.current,
          pageSize: roleStore.pagination.pageSize,
          showTotal: true,
          showJumper: true,
          showPageSize: true,
        }"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #operations="{ record }">
          <arco-space>
            <arco-button type="text" @click="handleAssignMenu(record)">分配权限</arco-button>
            <arco-popconfirm title="确定要删除该角色吗？" @ok="handleDelete(record)">
              <arco-button type="text" status="danger">删除</arco-button>
            </arco-popconfirm>
          </arco-space>
        </template>
      </arco-table>
    </a-card>

    <!-- 新增/编辑角色弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel">
      <a-form :model="formData" :rules="rules" ref="formRef">
        <a-form-item label="角色名称" name="roleName">
          <a-input v-model:value="formData.roleName" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色描述" name="description">
          <a-textarea v-model:value="formData.description" placeholder="请输入角色描述" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分配权限弹窗 -->
    <a-modal
      v-model:visible="menuModalVisible"
      title="分配权限"
      @ok="handleMenuModalOk"
      @cancel="handleMenuModalCancel"
    >
      <a-tree v-model:checked-keys="checkedKeys" :data="roleStore.menuTree" checkable :default-expand-all="true" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRoleStore } from '@/store/role';

  const roleStore = useRoleStore();
  const loading = ref(false);
  const modalVisible = ref(false);
  const menuModalVisible = ref(false);
  const modalTitle = ref('新增角色');
  const formRef = ref();
  const currentRole = ref(null);
  const checkedKeys = ref([]);

  // 搜索表单数据
  const searchForm = reactive({
    roleName: '',
  });

  // 表单数据
  const formData = reactive({
    roleName: '',
    description: '',
  });

  // 表单校验规则
  const rules = {
    roleName: [{ required: true, message: '请输入角色名称' }],
  };

  // 表格列配置
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      slotName: 'operations', // arco-design 使用 slotName 而不是 slots
      width: 200,
      align: 'center',
    },
  ];

  // 获取角色列表
  const getRoleList = async () => {
    loading.value = true;
    try {
      await roleStore.getRoleList({
        pageNum: roleStore.pagination.current,
        pageSize: roleStore.pagination.pageSize,
        ...searchForm,
      });
    } finally {
      loading.value = false;
    }
  };

  // 分页处理
  const onPageChange = (current: number) => {
    roleStore.pagination.current = current;
    getRoleList();
  };

  const onPageSizeChange = (pageSize: number) => {
    roleStore.pagination.pageSize = pageSize;
    getRoleList();
  };

  // 查询
  const handleSearch = () => {
    roleStore.pagination.current = 1;
    getRoleList();
  };

  // 新增角色
  const handleAdd = () => {
    modalTitle.value = '新增角色';
    modalVisible.value = true;
    formData.roleName = '';
    formData.description = '';
  };

  // 删除角色
  const handleDelete = async (record: any) => {
    await roleStore.deleteRole(record.id);
    getRoleList();
  };

  // 分配权限
  const handleAssignMenu = async (record: any) => {
    currentRole.value = record;
    menuModalVisible.value = true;
    await roleStore.getMenuTree();
    const menuIds = await roleStore.getRoleMenus(record.id);
    checkedKeys.value = menuIds;
  };

  // 模态框确认
  const handleModalOk = async () => {
    await formRef.value.validate();
    await roleStore.saveRole(formData);
    modalVisible.value = false;
    getRoleList();
  };

  // 模态框取消
  const handleModalCancel = () => {
    modalVisible.value = false;
    formRef.value?.resetFields();
  };

  // 权限弹窗确认
  const handleMenuModalOk = async () => {
    await roleStore.assignRoleMenus(currentRole.value.id, checkedKeys.value);
    menuModalVisible.value = false;
  };

  // 权限弹窗取消
  const handleMenuModalCancel = () => {
    menuModalVisible.value = false;
    checkedKeys.value = [];
  };

  onMounted(() => {
    getRoleList();
  });
</script>

<style scoped lang="less">
  .role-container {
    // padding: 24px;

    .search-form {
      margin-bottom: 8px;
    }

    .operation-btns {
      margin-bottom: 8px;
    }
  }
</style>
