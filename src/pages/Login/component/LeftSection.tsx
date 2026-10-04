import {
  VideoCameraOutlined,
  DesktopOutlined,
  AudioOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import type { Feature } from "../type";

interface LeftSectionProps {
  /** 当前右侧区域标识 */
  section: string;
}

/**
 * 登录页左侧特性展示
 */
const LeftSection = ({ section }: LeftSectionProps) => {
  const features = useMemo<Feature[]>(
    () => [
      {
        icon: <VideoCameraOutlined />,
        title: "高清视频",
        desc: "1080P 超清画质，低延迟流畅通话",
      },
      {
        icon: <DesktopOutlined />,
        title: "屏幕共享",
        desc: "一键共享桌面，远程协作更高效",
      },
      {
        icon: <TeamOutlined />,
        title: "多人会议",
        desc: "支持百人同时在线，大型会议轻松开",
      },
      {
        icon: <AudioOutlined />,
        title: "智能降噪",
        desc: "AI 语音降噪，环境再吵也清晰",
      },
    ],
    [],
  );

  // 不同区域的标语
  const sloganMap: Record<
    string,
    { title: string; highlight: string; desc: string }
  > = {
    login: {
      title: "随时随地，",
      highlight: "开启高效远程协作",
      desc: "高清视频会议、屏幕共享、实时协作——让每一次沟通都身临其境。",
    },
    register: {
      title: "加入云会议，",
      highlight: "开启高效远程协作",
      desc: "注册账号，立即体验高清视频会议、屏幕共享、实时协作——让每一次沟通都身临其境。",
    },
    forgot: {
      title: "找回密码，",
      highlight: "重新连接高效协作",
      desc: "验证身份后即可重置密码，继续享受高清视频会议与实时协作体验。",
    },
  };
  const slogan = sloganMap[section] ?? sloganMap.login;

  return (
    <div className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden bg-linear-to-br from-[#1677ff] via-[#0958d9] to-[#003eb3] text-white p-12">
      {/* 装饰性圆形 */}
      <div className="absolute -top-25 -right-25 w-100 h-100 rounded-full bg-white/5" />
      <div className="absolute -bottom-37.5 -left-20 w-87.5 h-87.6 rounded-full bg-white/5" />
      <div className="absolute top-[40%] right-[10%] w-50 h-50 rounded-full bg-white/3" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl">
          <VideoCameraOutlined />
        </div>
        <span className="text-2xl font-bold tracking-wide">
          云会议 CloudMeeting
        </span>
      </div>

      {/* 中间标语 & 特性 */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold leading-tight mb-4">
          {slogan.title}
          <br />
          <span className="text-blue-200">{slogan.highlight}</span>
        </h1>
        <p className="text-blue-100/80 text-base mb-10 max-w-md">
          {slogan.desc}
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-lg">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5">{f.title}</div>
                <div className="text-xs text-blue-100/70">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部版权 */}
      <div className="relative z-10 text-xs text-blue-100/50">
        © 2026 CloudMeeting. All rights reserved.
      </div>
    </div>
  );
};

export default LeftSection;
