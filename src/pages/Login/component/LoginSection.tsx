import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  VideoCameraOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { onFinishProps, SectionProps } from "../type";
import { getCaptcha, login, refreshCaptcha } from "@/api";
import Config from "@/enum/Config";
import { useLogger } from "loggerect/hooks";

interface CaptchaData {
  image: string;
  captchaId: string;
}

const LoginSection = ({ changeSection }: SectionProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [captcha, setCaptcha] = useState<CaptchaData>({
    image: "",
    captchaId: "",
  });
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(true);
  const log = useLogger("LoginPage");
  /**
   * 登录提交
   */
  const onFinish = useCallback(
    async (values: onFinishProps) => {
      log.info("登录提交", values);
      try {
        setLoading(true);
        const loginRes = await login({
          username: values.username,
          password: values.password,
          captcha: values.captcha,
          captchaId: captcha.captchaId,
        });
        log.info("登录成功", loginRes.data.data);
        message.success("登录成功");
        localStorage.setItem(
          Config.USER_INFO_KEY,
          JSON.stringify(loginRes.data.data.userInfo),
        );
        localStorage.setItem(
          Config.TOKEN_KEY,
          JSON.stringify({
            accessToken: loginRes.data.data.accessToken,
            refreshToken: loginRes.data.data.refreshToken,
            expiration: loginRes.data.data.expiration,
          }),
        );
      } catch (error: unknown) {
        log.error("登录失败", error);
        message.error("登录失败");
        setCaptchaLoading(true);
        getCaptcha(110, 44).then((res) => {
          setCaptcha({
            image: res.data.data.image,
            captchaId: res.data.data.id,
          });
          setCaptchaLoading(false);
        });
      } finally {
        setLoading(false);
      }
    },
    [log, captcha],
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
    Promise.all([getCaptcha(108, 38)]).then(([captchaRes]) => {
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
            rules={[{ required: true, message: "用户名 / 邮箱" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名 / 邮箱"
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
                prefix={<SafetyCertificateOutlined className="text-gray-400" />}
                placeholder="请输入验证码"
                className="h-11"
                maxLength={4}
              />
              <Button
                loading={captchaLoading}
                onClick={() => onRefreshCaptcha()}
                title="点击刷新验证码"
                className="h-11 px-0! min-w-27.5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center gap-1.5 text-base font-bold tracking-[0.25em] text-blue-600 select-none hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  letterSpacing: "0.3em",
                }}
              >
                {captchaLoading ? (
                  <ReloadOutlined className="text-xs text-gray-400 tracking-normal" />
                ) : (
                  captcha.image && (
                    <img src={captcha.image} className="w-27 h-9.5 object-contain" />
                  )
                )}
              </Button>
            </div>
          </Form.Item>

          <div className="flex items-center justify-bfetween mb-5">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a
              onClick={() => changeSection("forgot")}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
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
          <a
            onClick={() => changeSection("register")}
            className="text-blue-600 hover:text-blue-700 ml-1 cursor-pointer"
          >
            立即注册
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginSection;
