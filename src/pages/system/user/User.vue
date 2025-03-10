<template>
  <div class="user-container mt-xxs">
    <a-card class="h-[780px]" hoverable>
      <!-- 搜索表单 -->
      <div class="search-form">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="用户名">
            <a-input v-model:value="searchForm.username" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input v-model:value="searchForm.phone" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button class="ml-xs" @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 操作按钮 -->
      <div class="operation-btns">
        <a-button type="primary" @click="handleAdd">新增用户</a-button>
      </div>

      <!-- 用户列表 -->
      <arco-table
        :columns="columns"
        :data="userStore.userList"
        :loading="loading"
        :pagination="{
          total: userStore.pagination.total,
          current: userStore.pagination.current,
          pageSize: userStore.pagination.pageSize,
          showTotal: true,
          showJumper: true,
          showPageSize: true
        }"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #status="{ record }">
          <arco-tag :color="record.status ? 'green' : 'red'">
            {{ record.status ? '启用' : '禁用' }}
          </arco-tag>
        </template>
        <template #operations="{ record }">
          <arco-space>
            <arco-button type="text" @click="handleAssignRole(record)">分配角色</arco-button>
            <arco-popconfirm 
              title="确定要删除该用户吗？" 
              @ok="handleDelete(record)"
            >
              <arco-button type="text" status="danger">删除</arco-button>
            </arco-popconfirm>
          </arco-space>
        </template>
      </arco-table>
    </a-card>

    <!-- 新增/编辑用户弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel">
      <a-form :model="formData" :rules="rules" ref="formRef">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码" name="password" v-if="modalTitle === '新增用户'">
          <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="formData.status" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分配角色弹窗 -->
    <a-modal
      v-model:visible="roleModalVisible"
      title="分配角色"
      @ok="handleRoleModalOk"
      @cancel="handleRoleModalCancel"
    >
      <a-checkbox-group v-model:value="selectedRoles" :options="userStore.roleOptions" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const loading = ref(false);
const modalVisible = ref(false);
const roleModalVisible = ref(false);
const modalTitle = ref('新增用户');
const formRef = ref();
const currentUser = ref(null);
const selectedRoles = ref([]);

// 搜索表单数据
const searchForm = reactive({
  username: '',
  phone: '',
});

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  phone: '',
  email: '',
  status: true,
});

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  phone: [{ required: true, message: '请输入手机号' }],
  email: [{ required: true, message: '请输入邮箱' }],
};

// 表格列配置
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    slotName: 'operations',
    width: 200,
  },
];

// 获取用户列表
const getUserList = async () => {
  loading.value = true;
  try {
    await userStore.getUserList({
      pageNum: userStore.pagination.current,
      pageSize: userStore.pagination.pageSize,
      ...searchForm,
    });
  } finally {
    loading.value = false;
  }
};

// 分页处理
const onPageChange = (current: number) => {
  userStore.pagination.current = current;
  getUserList();
};

const onPageSizeChange = (pageSize: number) => {
  userStore.pagination.pageSize = pageSize;
  getUserList();
};

// 查询
const handleSearch = () => {
  userStore.pagination.current = 1;
  getUserList();
};

// 重置
const handleReset = () => {
  searchForm.username = '';
  searchForm.phone = '';
  handleSearch();
};

// 新增用户
const handleAdd = () => {
  modalTitle.value = '新增用户';
  modalVisible.value = true;
  formData.username = '';
  formData.password = '';
  formData.phone = '';
  formData.email = '';
  formData.status = true;
};

// 删除用户
const handleDelete = async (record: any) => {
  await userStore.deleteUser(record.id);
  getUserList();
};

// 分配角色
const handleAssignRole = async (record: any) => {
  currentUser.value = record;
  roleModalVisible.value = true;
  await userStore.getRoleOptions();
  const roles = await userStore.getUserRoles(record.id);
  selectedRoles.value = roles;
};

// 模态框确认
const handleModalOk = async () => {
  await formRef.value.validate();
  await userStore.saveUser(formData);
  modalVisible.value = false;
  getUserList();
};

// 模态框取消
const handleModalCancel = () => {
  modalVisible.value = false;
  formRef.value?.resetFields();
};

// 角色弹窗确认
const handleRoleModalOk = async () => {
  await userStore.assignUserRoles(currentUser.value.id, selectedRoles.value);
  roleModalVisible.value = false;
};

// 角色弹窗取消
const handleRoleModalCancel = () => {
  roleModalVisible.value = false;
  selectedRoles.value = [];
};

onMounted(() => {
  getUserList();
});
</script>

<style scoped lang="less">
.user-container {
  .search-form {
    margin-bottom: 24px;
  }

  .operation-btns {
    margin-bottom: 16px;
  }
}
</style>
