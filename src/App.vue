<template>
  <a-config-provider :getPopupContainer="getPopupContainer">
    <ThemeProvider is-root v-bind="themeConfig" :apply-style="false">
      <stepin-view
        system-name="FICC 数智平台"
        logo-src="@/assets/menu_logo_light.svg"
        :class="`${contentClass}`"
        :user="user"
        :navMode="navigation"
        :useTabs="useTabs"
        :themeList="themeList"
        v-model:show-setting="showSetting"
        v-model:theme="theme"
        @themeSelect="configTheme"
      >
        <template #headerActions>
          <HeaderActions @showSetting="open = true" />
        </template>
        <template #pageFooter>
          <PageFooter />
        </template>
        <template #themeEditorTab>
          <a-tab-pane tab="其它" key="other">
            <Setting />
          </a-tab-pane>
        </template>
      </stepin-view>
      <theme-edit :open="open" @close="onClose"></theme-edit>
    </ThemeProvider>
  </a-config-provider>
  <login-modal :unless="['/login']" />
  <SplashCursor
    :SIM_RESOLUTION="128"
    :DYE_RESOLUTION="1440"
    :CAPTURE_RESOLUTION="512"
    :DENSITY_DISSIPATION="3.5"
    :VELOCITY_DISSIPATION="2"
    :PRESSURE="0.1"
    :PRESSURE_ITERATIONS="20"
    :CURL="3"
    :SPLAT_RADIUS="0.2"
    :SPLAT_FORCE="6000"
    :SHADING="true"
    :COLOR_UPDATE_SPEED="10"
    :BACK_COLOR="{ r: 0.5, g: 0, b: 0 }"
    :TRANSPARENT="true"
  />
</template>

<script lang="ts" setup>
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAccountStore, useMenuStore, useSettingStore, storeToRefs } from '@/store';
  import avatar from '@/assets/kunkun.png';
  import { PageFooter, HeaderActions } from '@/components/layout';
  import Setting from './components/setting';
  import { LoginModal } from '@/pages/login';
  import { configTheme, themeList } from '@/theme';
  import { ThemeProvider } from 'stepin';
  import { computed } from 'vue';
  import { SplashCursor } from '@/components/splashCursor/index';

  const { logout, profile } = useAccountStore();

  const open = ref<boolean>(false);
  const onClose = () => {
    open.value = false;
  };

  // 获取个人信息
  // profile().then((response) => {
  //   const { account } = response;
  //   user.name = account.username;
  //   // user.name = 'test';
  //   // user.avatar = account.avatar;
  // });

  const showSetting = ref(false);
  const router = useRouter();

  // useMenuStore().getMenuList();

  const { navigation, useTabs, theme, contentClass } = storeToRefs(useSettingStore());
  const themeConfig = computed(() => themeList.find((item) => item.key === theme.value)?.config ?? {});

  const user = reactive({
    name: 'admin',
    avatar: avatar,
    menuList: [
      // { title: '个人中心', key: 'personal', icon: 'UserOutlined', onClick: () => router.push('/profile') },
      // { title: '设置', key: 'setting', icon: 'SettingOutlined', onClick: () => (showSetting.value = true) },
      { type: 'divider' },
      {
        title: '退出登录',
        key: 'logout',
        icon: 'LogoutOutlined',
        onClick: () => logout().then(() => router.push('/login')),
      },
    ],
  });

  function getPopupContainer() {
    return document.querySelector('.stepin-layout');
  }
</script>

<style lang="less">
  .stepin-view {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: theme('colors.primary.500');
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: theme('colors.primary.400');

      &:hover {
        background-color: theme('colors.primary.500');
      }
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
      border-radius: 4px;
      background: theme('backgroundColor.layout');
    }
  }

  html {
    height: 100vh;
    overflow-y: hidden;
  }

  body {
    margin: 0;
    height: 100vh;
    overflow-y: hidden;
    .stepin-alert-message-info {
      background-color: aqua;
    }
  }
  .stepin-img-checkbox {
    @apply transition-transform;
    &:hover {
      @apply scale-105 ~"-translate-y-[2px]";
    }
    img {
      @apply shadow-low rounded-md transition-transform;
    }
  }
</style>
