import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { Card, Container, Row, Col, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const RegisterForm = ({ onRegisterSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [formValues, setFormValues] = useState(null);

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };
 
  // Handle form submission
  const onFinish = async (values) => {
    if (!captchaToken) {
      setError('Please complete the reCAPTCHA!');
      message.error('Please complete the reCAPTCHA!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: values.username,
          password: values.password,
          email: values.email,
          captchaToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('OTP sent to your email!');
        setFormValues(values);
        setIsOtpModalVisible(true);
      } else {
        setError(data.error || 'Registration failed!');
        message.error(data.error || 'Registration failed!');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An unexpected error occurred.');
      message.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async () => {
    if (!otp) {
      message.error('Please enter the OTP!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formValues.email,
          otp,
          userName: formValues.username,
          password: formValues.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Registration successful!');
        setIsOtpModalVisible(false);
        onRegisterSuccess();
      } else {
        setError(data.error || 'OTP verification failed!');
        message.error(data.error || 'OTP verification failed!');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
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

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Register</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form
                form={form}
                name="register"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input disabled={loading} />
                </Form.Item>

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
                  <ReCAPTCHA
                    sitekey="6LefqiUrAAAAAMXyO4sfUFkBBkp5XH_ot8OxPNh5" // Replace with your actual site key
                    onChange={handleCaptchaChange}
                  />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={loading}
                    loading={loading}
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

      {/* OTP Modal */}
      <Modal
        title="Enter OTP"
        open={isOtpModalVisible}
        onOk={handleOtpSubmit}
        onCancel={() => setIsOtpModalVisible(false)}
        confirmLoading={loading}
      >
        <Input
          placeholder="Enter the OTP sent to your email"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={loading}
        />
      </Modal>
    </Container>
  );
};

export default RegisterForm;