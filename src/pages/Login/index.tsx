import { Button, NavBar, Form, Input, Toast } from "antd-mobile";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCode, login } from "@/store/actions/login";
import { AxiosError } from "axios";
import { useRef, useState, useEffect } from "react";
import { InputRef } from "antd-mobile/es/components/input";

import styles from "./index.module.scss";

type LoginForm = {
  mobile: string;
  code: string;
};

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // 创建form实例
  const [form] = Form.useForm();
  // 创建获取手机号的 ref 对象
  // 注意：现在要操作的是 Input 组件，所以，此处的 泛型参数 应该组件的 ref 类型
  const mobileRef = useRef<InputRef>(null);
  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState(0);
  // 定时器 ref
  const timerRef = useRef(-1);

  const onGetCode = () => {
    // 拿到手机号码
    const mobile = (form.getFieldValue("mobile") ?? "") as string;
    console.log(mobile.trim())
    // 判断手机号码校验是否成功
    const hasError = form.getFieldError("mobile").length > 0;
    console.log(hasError);
    
    if (mobile.trim() === '' || hasError) {
      return mobileRef.current?.focus();
    }
    dispatch(getCode(mobile));
    // 设置倒计时时间
    setTimeLeft(5);
    // 注意：此处需要使用 window.setInterval
    // 因为 setInterval 默认返回 NodeJS.Timeout，使用 window.setInterval 后，返回值才是 number 类型的数值
    timerRef.current = window.setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    Toast.show({
      content: "验证码已发送",
      duration: 600,
    });
  };
  // 1.监听倒计时变化，在倒计时结束时清理定时器
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
    }
  }, [timeLeft]);

 // 2. 在组件卸载时清理定时器
  useEffect(() => {
    return () => {
      // 组件卸载时清理定时器
      clearInterval(timerRef.current)
    }
  },[])

  const onFinish = async (values: LoginForm) => {
    try {
      await dispatch(login(values));
      // 登录成功提示
      Toast.show({
        content: "登录成功",
        duration: 600,
        afterClose: () => {
          // 返回首页
          history.replace("/home");
        },
      });
    } catch (e) {
      // 异常
      // 如果异步操作失败了，会执行此处的错误处理
      // 对于登录功能来说，出错了，通常时请求出问题了
      // 因此，此处将错误类型转位AxiosError
      const error = e as AxiosError<{ message: string }>;
      Toast.show({
        content: error.response?.data?.message,
        duration: 1000,
      });
    }
  };

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}></NavBar>
      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form form={form} onFinish={onFinish}>
          <Form.Item
            className="login-item"
            name="mobile"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "手机号格式错误",
              },
            ]}
          >
            <Input
              placeholder="请输入手机号码"
              maxLength={11}
              ref={mobileRef}
              autoComplete="false"
            />
          </Form.Item>
          <Form.Item
            className="login-item"
            name="code"
            validateTrigger="onBlur"
            rules={[{ required: true, message: "请输入验证码" }]}
            extra={
              <span
                className="code-extra"
                onClick={timeLeft === 0 ? onGetCode : undefined}
              >
                {/* 判断是否开启定时器，没开启绑定时间，开启后去掉事件 */}
                {timeLeft === 0 ? "发送验证码" : `${timeLeft}s后重新获取`}
              </span>
            }
          >
            <Input placeholder="请输入验证码" autoComplete="false" />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => {
              /*               // isFieldTouched(true) 检查是否所有字段都被操作过
              const untouched = !form.isFieldsTouched(true);
              //getFieldError() 获取所有字段名对应的错误信息
              const hasError =
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length !== 0;
              const disabled = untouched || hasError; */
              // 得到禁用状态
              const disabled =
                form.getFieldsError().filter((item) => item.errors.length > 0)
                  .length > 0 || !form.isFieldsTouched(true);
              return (
                <Button
                  block
                  type="submit"
                  color="primary"
                  className="login-submit"
                  disabled={disabled}
                >
                  登录
                </Button>
              );
            }}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
