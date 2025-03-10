import { defineStore } from 'pinia';
import http from './http';
import { Response, LoginResponse } from '@/types';
import { useMenuStore } from './menu';
import { useAuthStore } from '@/plugins';
import { useLoadingStore } from './loading';

export interface Profile {
  account: Account;
  permissions: string[];
  role: string;
}
export interface Account {
  username: string;
  avatar: string;
  gender: number;
}

export type TokenResult = {
  token: string;
  expires: number;
  access_token: string;
};
export const useAccountStore = defineStore('account', {
  state() {
    return {
      account: {} as Account,
      permissions: [] as string[],
      role: '',
      logged: true,
    };
  },
  actions: {
    async login(username: string, password: string) {
      const formData = new FormData();
      const userInfo = { username, password };
      for (const key in userInfo) {
        formData.append(key, userInfo[key]);
      }
      return http
        .request<TokenResult, LoginResponse<TokenResult>>('/v1/auth/login', 'POST_JSON', formData)
        .then(async (response) => {
          if (response.code === 200) {
            this.logged = true;
            http.setAuthorization(`Bearer ${response.access_token}`, new Date(response.expires) || 3600 * 1000);
            await useMenuStore().getMenuList();
            return response;
          } else {
            return Promise.reject(response);
          }
        });
    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        localStorage.removeItem('stepin-menu');
        http.removeAuthorization();
        this.logged = false;
        resolve(true);
      });
    },
    async profile() {
      const { setAuthLoading } = useLoadingStore();
      setAuthLoading(true);
      return http
        .request<Account, Response<Profile>>('/account', 'get')
        .then((response) => {
          if (response.code === 0) {
            const { setAuthorities } = useAuthStore();
            const { account, permissions, role } = response.data;
            this.account = account;
            this.permissions = permissions;
            this.role = role;
            setAuthorities(permissions);
            return response.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setAuthLoading(false));
    },
    setLogged(logged: boolean) {
      this.logged = logged;
    },
  },
});
