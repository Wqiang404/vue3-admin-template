import { defineStore } from 'pinia';
import { reqMenuList, reqMenusUsers } from '@/api/menu';

export const useMenuRebuildStore = defineStore('menuRebuild', {
  state() {
    return {
      loading: false,
      formFilter: {
        key: null,
      },
      tableData: [],
      selectedTreeNode: [],
      isShowRoleAndUserListModal: false,
      selectRow: null,
      menuRoleUserData: { rolse: [], admins: [] },
      roleAndUserDataLoading: false,
    };
  },
  actions: {
    async getTableData() {
      const queryParam = { ...this.formFilter, limit: 0, menu_type: 0, parent_id: '' };
      this.loading = true;
      const res = await reqMenuList(queryParam);
      this.loading = false;
      if (res.code === 200 && res.data != null) {
        this.tableData = res.data.items || [];
      } else {
        this.tableData = [];
      }
      this.selectedTreeNode = [];
    },
    viewEvent(row) {
      this.selectRow = row;
      this.roleAndUserDataLoading = true;
      // 用户已授权菜单列表
      reqMenusUsers({ mid: row.id }).then((res) => {
        if (res.code === 200 && res.data) {
          this.menuRoleUserData = {
            rolse: (res.data.rolse || []).map((item, index) => ({ ...item, index: index + 1 })),
            admins: (res.data.admins || []).map((item, index) => ({ ...item, index: index + 1 })),
          };
        } else {
          this.menuRoleUserData = { rolse: [], admins: [] };
        }
        this.roleAndUserDataLoading = false;
      });
    },
  },
});
