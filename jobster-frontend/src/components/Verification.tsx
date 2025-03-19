import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';

const VerifyAccount = () => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      });

      if (response.ok) {
        toast.success('Account verified successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Verification failed!');
      }
    } catch (error) {
      toast.error('Error occurred during verification.');
    }
  };

  return (
    <Container className="mt-5">
      <h3>Verify Account</h3>
      <Form onSubmit={handleVerify}>
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
    </Container>
  );
};

export default VerifyAccount;
