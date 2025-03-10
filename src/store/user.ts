import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import http from './http';

export interface UserState {
  userList: any[];
  roleOptions: any[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userList: [],
    roleOptions: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  }),
  
  actions: {
    async getUserList(params: any) {
      try {
        const { data } = await http.get('/system/user/list', { params });
        this.userList = data.list;
        this.pagination.total = data.total;
        return data;
      } catch (error) {
        message.error('获取用户列表失败');
        return Promise.reject(error);
      }
    },

    async deleteUser(id: string) {
      try {
        await http.delete(`/system/user/${id}`);
        message.success('删除成功');
      } catch (error) {
        message.error('删除失败');
        return Promise.reject(error);
      }
    },

    async saveUser(userData: any) {
      try {
        await http.post('/system/user', userData);
        message.success('保存成功');
      } catch (error) {
        message.error('保存失败');
        return Promise.reject(error);
      }
    },

    async getRoleOptions() {
      try {
        const { data } = await http.get('/system/role/list');
        this.roleOptions = data.map((role: any) => ({
          label: role.roleName,
          value: role.id,
        }));
        return this.roleOptions;
      } catch (error) {
        message.error('获取角色列表失败');
        return Promise.reject(error);
      }
    },

    async getUserRoles(userId: string) {
      try {
        const { data } = await http.get(`/system/user/${userId}/roles`);
        return data;
      } catch (error) {
        message.error('获取用户角色失败');
        return Promise.reject(error);
      }
    },

    async assignUserRoles(userId: string, roleIds: string[]) {
      try {
        await http.post(`/system/user/${userId}/roles`, { roleIds });
        message.success('角色分配成功');
      } catch (error) {
        message.error('角色分配失败');
        return Promise.reject(error);
      }
    }
  }
});