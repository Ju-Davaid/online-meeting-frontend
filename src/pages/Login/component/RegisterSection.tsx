import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  VideoCameraOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import type { SectionProps } from "../type";
import { getCaptcha, refreshCaptcha, register } from "@/api";
import { useLogger } from "loggerect/hooks";

interface CaptchaData {
  image: string;
  captchaId: string;
}

/**
 * 注册区域
 */
const RegisterSection = ({ changeSection }: SectionProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [captcha, setCaptcha] = useState<CaptchaData>({
    image: "",
    captchaId: "",
  });
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(true);
  const log = useLogger("RegisterSection");

  /**
   * 注册提交
   */
  const onFinish = useCallback(
    async (values: {
      username: string;
      email: string;
      password: string;
      captcha: string;
    }) => {
      log.info("注册提交", values);
      try {
        setLoading(true);
        await register({
          username: values.username,
          email: values.email,
          password: values.password,
          captcha: values.captcha,
          captchaId: captcha.captchaId,
        });
        log.info("注册成功");
        message.success("注册成功，请登录");
        changeSection("login");
      } catch (error: unknown) {
        log.error("注册失败", error);
        message.error("注册失败");
        setCaptchaLoading(true);
        getCaptcha(110, 44).then((res) => {
          setCaptcha({
            image: res.data.data.image,
            captchaId: res.data.data.id,
          });
          setCaptchaLoading(false);
        });
        form.setFieldsValue({ captcha: "" });
      } finally {
        setLoading(false);
      }
    },
    [log, captcha, changeSection, form],
  );

  /**
   * 刷新验证码
   */
  const onRefreshCaptcha = useCallback(() => {
    setCaptchaLoading(true);
    refreshCaptcha(captcha.captchaId).then((res) => {
      setCaptcha({
        image: res.data.data.image,
        captchaId: res.data.data.id,
      });
      log.info("刷新验证码成功", res.data.data);
      setCaptchaLoading(false);
    });
  }, [captcha, log]);

  useEffect(() => {
    getCaptcha(110, 44).then((captchaRes) => {
      log.info("获取验证码成功", captchaRes.data.data);
      setCaptcha({
        image: captchaRes.data.data.image,
        captchaId: captchaRes.data.data.id,
      });
      setCaptchaLoading(false);
    });
  }, [log]);

  return (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">创建账号</h2>
          <p className="text-sm text-gray-500">注册后即可发起或加入会议</p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          size="large"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 3, message: "用户名至少 3 个字符" },
              { max: 20, message: "用户名最多 20 个字符" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              className="h-11"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="邮箱"
              className="h-11"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少 6 个字符" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="设置密码"
              className="h-11"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="确认密码"
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
              <Button
                loading={captchaLoading}
                onClick={onRefreshCaptcha}
                title="点击刷新验证码"
                className="h-11 min-w-27.5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center gap-1.5 text-base font-bold tracking-[0.25em] text-blue-600 select-none hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  letterSpacing: "0.3em",
                }}
              >
                {captchaLoading ? (
                  <ReloadOutlined className="text-xs text-gray-400 tracking-normal" />
                ) : (
                  captcha.image && (
                    <img src={captcha.image} className="w-full h-full" />
                  )
                )}
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="h-11 font-medium"
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500">
          已有账号？
          <a
            onClick={() => changeSection("login")}
            className="text-blue-600 hover:text-blue-700 ml-1 cursor-pointer"
          >
            立即登录
          </a>
        </p>

        <div className="mt-4 text-center">
          <a
            onClick={() => changeSection("login")}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeftOutlined />
            返回登录
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;
