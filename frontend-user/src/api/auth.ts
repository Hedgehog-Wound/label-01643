import { mockAuthApi } from '../mock';
import type { User } from '../types';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export const authApi = {
  login: (params: LoginParams): Promise<LoginResult> =>
    mockAuthApi.login(params.username, params.password),

  register: (params: RegisterParams): Promise<User> =>
    mockAuthApi.register(params.username, params.password, params.nickname),

  getMe: (): Promise<User> =>
    mockAuthApi.getMe(),
};
