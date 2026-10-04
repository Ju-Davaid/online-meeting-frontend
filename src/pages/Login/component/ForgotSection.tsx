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
  KeyOutlined,
} from "@ant-design/icons";
import type { SectionProps } from "../type";
import { getCaptcha, refreshCaptcha, resetPassword } from "@/api";
import { useLogger } from "loggerect/hooks";

interface CaptchaData {
  image: string;
  captchaId: string;
}

/**
 * 忘记密码区域
 */
const ForgotSection = ({ changeSection }: SectionProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [captcha, setCaptcha] = useState<CaptchaData>({
    image: "",
    captchaId: "",
  });
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(true);
  const log = useLogger("ForgotSection");

  /**
   * 重置密码提交
   */
  const onFinish = useCallback(
    async (values: {
      username: string;
      email: string;
      newPassword: string;
      captcha: string;
    }) => {
      log.info("重置密码提交", values);
      try {
        setLoading(true);
        await resetPassword({
          username: values.username,
          email: values.email,
          newPassword: values.newPassword,
          captcha: values.captcha,
          captchaId: captcha.captchaId,
        });
        log.info("重置密码成功");
        message.success("密码重置成功，请重新登录");
        changeSection("login");
      } catch (error: unknown) {
        log.error("重置密码失败", error);
        message.error("重置密码失败，请检查信息是否正确");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">重置密码</h2>
          <p className="text-sm text-gray-500">验证身份后设置新密码</p>
        </div>

        <Form
          form={form}
          name="forgot-password"
          onFinish={onFinish}
          size="large"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
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
              { required: true, message: "请输入注册邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="注册邮箱"
              className="h-11"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码至少 6 个字符" },
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined className="text-gray-400" />}
              placeholder="新密码"
              className="h-11"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="确认新密码"
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
              确认重置
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
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

export default ForgotSection;
