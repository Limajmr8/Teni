import crypto from 'crypto';

export const verifyRazorpaySignature = (body: string, signature: string, secret: string) => {
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
};
