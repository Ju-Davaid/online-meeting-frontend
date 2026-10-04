import type { ReactNode } from "react";

/**
 * 登录页功能项
 */
export interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
}
/**
 * 登录页提交表单参数
 */
export interface onFinishProps {
  username: string;
  password: string;
  captcha: string;
  remember: boolean;
}

/**
 * 右侧区域组件通用 Props
 */
export interface SectionProps {
  /** 切换右侧区域 */
  changeSection: (section: string) => void;
}
