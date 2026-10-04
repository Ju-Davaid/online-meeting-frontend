import server from "./server";

// 获取验证码
export const getCaptcha = (width: number, height: number) =>
  server.get(`/captcha?width=${width}&height=${height}`);

export interface LoginRequest {
  username: string;
  password: string;
  captcha: string;
  captchaId: string;
}
// 登录
export const login = (data: LoginRequest) => server.post("/login", data);

// 刷新验证码
export const refreshCaptcha = (id: string) =>
  server.get(`/captcha/refresh?id=${id}`);

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  captcha: string;
  captchaId: string;
}
// 注册
export const register = (data: RegisterRequest) =>
  server.post("/register", data);

export interface ResetPasswordRequest {
  username: string;
  email: string;
  newPassword: string;
  captcha: string;
  captchaId: string;
}
// 重置密码（忘记密码）
export const resetPassword = (data: ResetPasswordRequest) =>
  server.post("/password/reset", data);
