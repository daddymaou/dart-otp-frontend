export function maskPhone(phone: string) {
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 4)}${'•'.repeat(Math.min(6, phone.length - 6))}${phone.slice(-2)}`;
}

export function badgeStatus(status: string): 'verified' | 'pending' | 'failed' | 'expired' | 'test' {
  if (status === 'verified') return 'verified';
  if (status === 'failed') return 'failed';
  if (status === 'expired') return 'expired';
  return 'pending';
}
