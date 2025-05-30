import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { Card, Container, Row, Col, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import RegisterForm from './RegisterForm';

const AuthApp = ({ onLoginSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Handle form submission for login
  const onFinish = async (values) => {
    if (!captchaToken) {
      setError('Please complete the reCAPTCHA!');
      message.error('Please complete the reCAPTCHA!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          captchaToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Login successful!');
        localStorage.setItem('userId', data.user.id);
        console.log('User Info:', data.user);
        onLoginSuccess(data.user.username);
      } else {
        setError(data.error || 'Login failed!');
        message.error(data.error || 'Login failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred.');
      message.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form errors
  const onFinishFailed = (errorInfo) => {
    setError('Please check your inputs and try again.');
    message.error('Please check your inputs and try again.');
    console.log('Failed:', errorInfo);
  };

  // Handle navigation to RegisterForm
  const handleShowRegister = () => {
    setShowRegister(true);
  };

  // Handle navigation back to LoginForm from RegisterForm
  const handleBackToLogin = () => {
    setShowRegister(false);
    setError('');
    form.resetFields();
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setError('');
    form.resetFields();
    message.success('Registration successful! Please log in.');
  };

  // Render RegisterForm if showRegister is true
  if (showRegister) {
    return (
      <RegisterForm
        onRegisterSuccess={handleRegisterSuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  // Render LoginForm
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form
                form={form}
                name="login"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                    { min: 3, message: 'Username must be at least 3 characters!' },
                  ]}
                >
                  <Input disabled={loading} />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password disabled={loading} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Row className="justify-content-md-center">
                    <Col md={12} className="text-center">
                      <ReCAPTCHA
                        sitekey="6LefqiUrAAAAAMXyO4sfUFkBBkp5XH_ot8OxPNh5" // Replace with your actual site key
                        onChange={handleCaptchaChange}
                      />
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                  <Checkbox disabled={loading}>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={loading}
                    loading={loading}
                    style={{ marginRight: '10px' }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleShowRegister}
                    disabled={loading}
                    style={{ marginRight: '10px' }}
                  >
                    Register
                  </Button>
                  <Button onClick={onBack} disabled={loading}>
                    Back
                  </Button>
                </Form.Item>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthApp;