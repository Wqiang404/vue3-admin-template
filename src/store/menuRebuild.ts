import { defineStore } from 'pinia';
import { reqMenuList } from '@/api/menu';

export const useMenuRebuildStore = defineStore('menuRebuild', {
  state() {
    return {
      loading: false,
      formFilter: {
        key: null,
      },
      tableData: [],
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
      }
    },
  },
});
