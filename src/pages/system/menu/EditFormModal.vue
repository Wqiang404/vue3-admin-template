<template>
  <arco-modal
    v-model:visible="isShowEditFormModal"
    :title="editType === 'add' ? '新增菜单' : '编辑菜单'"
    width="40%"
    :on-before-ok="submit"
    @cancel="handleCancel"
    draggable
    unmount-on-close
  >
    <a-form ref="formRef" :rules="rules" :model="formState" :label-col="{ span: 8 }">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="菜单类型">
            <a-select v-model:value="formState.menu_type" placeholder="选择菜单类型">
              <a-select-option v-for="item in menuTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formState.menu_type === 3">
          <a-form-item label="操作类型" name="operate_type">
            <a-select v-model:value="formState.operate_type" placeholder="选择操作类型">
              <a-select-option v-for="item in menuOperateTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formState.menu_type === 2 || formState.menu_type === 3">
          <a-form-item label="父级" name="parent_id">
            <a-tree-select
              v-model:value="formState.parent_id"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              :tree-default-expand-all="false"
              :tree-data="menuOptions"
              tree-node-filter-prop="label"
            ></a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="标题名称" name="name">
            <a-input v-model:value="formState.name" placeholder="请输入标题" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="组件名称" name="code">
            <a-select v-model:value="formState.code" :dropdown-match-select-width="false" placeholder="请输入选择组件">
              <a-select-option v-for="item in componentOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formState.menu_type === 3">
          <a-form-item label="操作指令" name="directive">
            <a-input v-model:value="formState.directive" placeholder="请输入，首字母小写，驼峰格式" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否显示">
            <a-radio-group v-model:value="formState.hidden" name="hiddenRadioGroup">
              <a-radio :value="1">隐藏</a-radio>
              <a-radio :value="0">显示</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="URL路径" name="url">
            <a-input v-model:value="formState.url" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="排序值" name="sequence">
            <a-input v-model:value="formState.sequence" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="图标">
            <a-select ref="selectIcon" v-model:value="formState.icon" placeholder="请选择" show-search>
              <a-select-option v-for="iconItem in Icons" :key="iconItem" :value="iconItem"> <component :is="allIcon[iconItem]" />&nbsp;&nbsp;{{ iconItem }} </a-select-option>
              <template #suffixIcon><component :is="formState.icon" /></template>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备注">
            <a-textarea v-model:value="formState.remark" auto-size />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态">
            <a-radio-group v-model:value="formState.status" name="statusRadioGroup">
              <a-radio :value="1">有效</a-radio>
              <a-radio :value="0">无效</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </arco-modal>
</template>

<script setup lang="ts">
  import { ref, h, reactive, watchEffect, nextTick } from 'vue';
  import { useMenuRebuildStore, storeToRefs, useSettingStore } from '@/store';
  import { reqMenuCreate, reqMenuUpdate } from '@/api/menu';
  import { notification } from 'ant-design-vue';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import Pages from '@/pages';
  import type { Rule } from 'ant-design-vue/es/form';
  import * as arcoIcons from '@arco-design/web-vue/es/icon';
  import * as antIcons from '@ant-design/icons-vue';
  // const IconFont = antIcons.createFromIconfontCN({
  //   scriptUrl: '//at.alicdn.com/t/c/font_4986710_5dwmg0ctgnt.js',
  // }); // <icon-font type="icon-menu_logo_blue" />

  const { isShowEditFormModal, editType, menuOptions, selectRow, formState } = storeToRefs(useMenuRebuildStore());
  const { getTableData } = useMenuRebuildStore();

  const allIcon = {
    ...arcoIcons,
    ...antIcons,
  };
  const Icons = Object.keys(allIcon).filter((iconStr) => /^[A-Z]/.test(iconStr));
  const formRef = ref(null);
  const rules: Record<string, Rule[]> = {
    operate_type: [{ required: true, message: '请选择操作类型' }],
    parent_id: [{ required: true, message: '请选择父菜单' }],
    name: [{ required: true, message: '请输入菜单名称' }],
    code: [{ required: true, message: '请输入菜单代码' }],
    directive: [
      { required: true, message: '请输入操作指令' },
      { pattern: /^[a-z][A-z0-9]*$/, message: '首字母必须是小写，驼峰格式' },
    ],
    url: [{ required: true, message: '请输入URL路径' }],
    sequence: [{ required: true, message: '请输入排序值' }],
  };
  const menuTypeOptions = [
    // { value: 0, label: '全部' },
    { value: 1, label: '目录' },
    { value: 2, label: '菜单' },
    { value: 3, label: '操作' },
  ];
  const menuOperateTypeOptions = [
    // { value: 'none', label: '请选择操作类型' },
    { value: 'add', label: '新增' },
    { value: 'del', label: '删除' },
    { value: 'view', label: '查看' },
    { value: 'update', label: '编辑' },
    { value: 'list', label: '分页api' },
    { value: 'customize', label: '自定义指令' },
  ];
  const componentOptions = Object.keys(Pages).map((key) => {
    return {
      value: key,
      label: key,
    };
  });

  const handleCancel = () => {
    isShowEditFormModal.value = false;
  };
  const submit = async (done) => {
    const res = await formRef.value.validate();
    if (res) {
      if (editType.value === 'edit') {
        // 编辑记录
        const res = await reqMenuUpdate(formState.value);
        if (res.code === 200 && res.data) {
          notification.info({
            message: '成功',
            description: res.message,
            placement: 'topRight',
          });
          getTableData();
          done(true);
        } else {
          done(false);
        }
      } else if (editType.value === 'add') {
        // 添加记录
        const res = await reqMenuCreate(formState.value);
        if (res.code === 200 && res.data) {
          notification.info({
            message: '成功',
            description: res.message,
            placement: 'topRight',
          });
          getTableData();
          done(true);
        } else {
          done(false);
        }
      }
    }
  };
</script>
