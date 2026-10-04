import { useMemo, useState, type ComponentType } from "react";
import LeftSection from "./component/LeftSection";
import LoginSection from "./component/LoginSection";
import RegisterSection from "./component/RegisterSection";
import ForgotSection from "./component/ForgotSection";
import type { SectionProps } from "./type";

/**
 * 登录页
 */
const Login = () => {
  const [section, setSection] = useState<string>("login");

  // 切换右侧区域
  const changeSection = (newSection: string) => {
    setSection(newSection);
  };

  // 右侧区域：存组件类型，渲染时动态传参
  const rightSection = useMemo(() => {
    const sectionMap: Record<string, ComponentType<SectionProps>> = {
      login: LoginSection,
      register: RegisterSection,
      forgot: ForgotSection,
    };
    const SectionComponent = sectionMap[section];
    return SectionComponent ? (
      <SectionComponent changeSection={changeSection} />
    ) : null;
  }, [section]);

  return (
    <div className="min-h-screen w-full flex bg-[#f5f7fa]">
      {/* 左侧特性区 */}
      <LeftSection section={section} />
      {/* 右侧登录表单区 */}
      {rightSection}
    </div>
  );
};

export default Login;
