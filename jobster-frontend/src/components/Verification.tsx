import { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { resendVerificationCode, verifyUser } from '../api/auth'; // Make sure to import the API calls

const VerifyAccount = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');  // Assuming you have a way to pre-fill or set the email
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyUser(email, verificationCode);  // Pass email and code
      if (response.success) {
        toast.success('Account verified successfully!');
      } else {
        toast.error(response.message || 'Verification failed!');
      }
    } catch (error) {
      toast.error('Error occurred during verification.');
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const response = await resendVerificationCode(email);  // Send the email to resend verification code
      if (response.success) {
        toast.success('Verification code resent successfully!');
      } else {
        toast.error(response.message || 'Failed to resend verification code.');
      }
    } catch (error) {
      toast.error('Error occurred while resending verification code.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3>Verify Account</h3>
      <Form onSubmit={handleVerify}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Verify
        </Button>
      </Form>

      <Alert variant="info" className="mt-3">
        Didn't receive a code?{' '}
        <Button variant="link" onClick={handleResendVerification} disabled={resendLoading}>
          {resendLoading ? 'Resending...' : 'Resend Verification Code'}
        </Button>
      </Alert>
    </Container>
  );
};

export default VerifyAccount;
