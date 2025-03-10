import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import http from './http';

export interface RoleState {
  roleList: any[];
  menuTree: any[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    roleList: [],
    menuTree: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  }),

  actions: {
    async getRoleList(params: any) {
      try {
        const { data } = await http.get('/system/role/list', { params });
        this.roleList = data.list;
        this.pagination.total = data.total;
        return data;
      } catch (error) {
        message.error('获取角色列表失败');
        return Promise.reject(error);
      }
    },

    async deleteRole(id: string) {
      try {
        await http.delete(`/system/role/${id}`);
        message.success('删除成功');
      } catch (error) {
        message.error('删除失败');
        return Promise.reject(error);
      }
    },

    async saveRole(roleData: any) {
      try {
        await http.post('/system/role', roleData);
        message.success('保存成功');
      } catch (error) {
        message.error('保存失败');
        return Promise.reject(error);
      }
    },

    async getMenuTree() {
      try {
        const { data } = await http.get('/system/menu/tree');
        this.menuTree = data;
        return data;
      } catch (error) {
        message.error('获取菜单树失败');
        return Promise.reject(error);
      }
    },

    async getRoleMenus(roleId: string) {
      try {
        const { data } = await http.get(`/system/role/${roleId}/menus`);
        return data;
      } catch (error) {
        message.error('获取角色菜单失败');
        return Promise.reject(error);
      }
    },

    async assignRoleMenus(roleId: string, menuIds: string[]) {
      try {
        await http.post(`/system/role/${roleId}/menus`, { menuIds });
        message.success('权限分配成功');
      } catch (error) {
        message.error('权限分配失败');
        return Promise.reject(error);
      }
    }
  }
});