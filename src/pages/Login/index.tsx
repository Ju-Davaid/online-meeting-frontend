import { useMemo, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  AudioOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { Feature, onFinishProps } from "./type";

// 生成随机验证码
const randomCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * 登录页
 */
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [captcha, setCaptcha] = useState(randomCaptcha);

  const refreshCaptcha = () => {
    setCaptcha(randomCaptcha());
  };

  const onFinish = async (values: onFinishProps) => {
    // 校验验证码（不区分大小写）
    if (values.captcha.toUpperCase() !== captcha.toUpperCase()) {
      message.error("验证码错误");
      refreshCaptcha();
      form.setFieldsValue({ captcha: "" });
      return;
    }
    setLoading(true);
    // 模拟登录请求
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    message.success(`欢迎回来，${values.username}！`);
    console.log("登录信息:", values);
  };

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

  return (
    <div className="min-h-screen w-full flex bg-[#f5f7fa]">
      {/* 左侧品牌展示区 */}
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
            随时随地，
            <br />
            <span className="text-blue-200">开启高效远程协作</span>
          </h1>
          <p className="text-blue-100/80 text-base mb-10 max-w-md">
            高清视频会议、屏幕共享、实时协作——让每一次沟通都身临其境。
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

      {/* 右侧登录表单区 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-100">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl">
              <VideoCameraOutlined />
            </div>
            <span className="text-xl font-bold text-gray-800">
              云会议 CloudMeeting
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎登录</h2>
            <p className="text-sm text-gray-500">登录后即可发起或加入会议</p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入账号" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="手机号 / 邮箱"
                className="h-11"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                className="h-11"
              />
            </Form.Item>

            <Form.Item
              name="captcha"
              rules={[{ required: true, message: "请输入验证码" }]}
            >
              <div className="flex gap-3">
                <Input
                  prefix={
                    <SafetyCertificateOutlined className="text-gray-400" />
                  }
                  placeholder="请输入验证码"
                  className="h-11"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  title="点击刷新验证码"
                  className="h-11 min-w-27.5 px-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center gap-1.5 text-base font-bold tracking-[0.25em] text-blue-600 select-none hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "0.3em",
                  }}
                >
                  {captcha}
                  <ReloadOutlined className="text-xs text-gray-400 tracking-normal" />
                </button>
              </div>
            </Form.Item>

            <div className="flex items-center justify-between mb-5">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a className="text-sm text-blue-600 hover:text-blue-700" href="#">
                忘记密码？
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="h-11 font-medium"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-sm text-gray-500">
            还没有账号？
            <a className="text-blue-600 hover:text-blue-700 ml-1" href="#">
              立即注册
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
