import { defineStore } from 'pinia';
import { reqMenuList, reqMenusUsers, reqMenuDelete, reqMenusAll } from '@/api/menu';
import { notification } from 'ant-design-vue';
import { formatAllMenuListToTree } from '@/utils/formatter';

export const initFormState = {
  menu_type: 2,
  operate_type: 'none',
  name: null,
  code: null,
  directive: null,
  url: null,
  parent_id: '',
  icon: 'BankFilled',
  status: 1,
  hidden: 0,
  remark: null,
  sequence: 10,
};
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
      isShowEditFormModal: false,
      editType: 'add' as 'add' | 'edit',
      menuOptions: [],
      formState: { ...initFormState },
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
      // this.selectedTreeNode = [];
    },
    viewEvent(row) {
      // this.selectRow = row;
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
    removeEvent(row) {
      reqMenuDelete([row.id])
        .then((res) => {
          notification.info({
            message: '提示',
            description: res.message,
            placement: 'topRight',
          });
          this.getTableData();
        })
        .catch((err) => {
          notification.info({
            message: '提示',
            description: err.message,
            placement: 'topRight',
          });
        });
    },
    async getMenuOptions() {
      const res = await reqMenusAll({ button: 0 });
      if (res.code === 200 && res.data) {
        this.menuOptions = formatAllMenuListToTree(res.data || []);
      }
    },
  },
});
