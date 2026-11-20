export type Plan = {
  id: 'free' | 'starter' | 'growth' | 'pro' | 'business';
  name: string;
  monthlySends: number;
  price: string;
  description: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlySends: 100,
    price: '₦0',
    description: 'For trying the API and getting your first integration live.',
    features: ['100 sends each month', 'Live and test API keys', 'Templates and delivery logs'],
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlySends: 1_000,
    price: '₦2,500',
    description: 'For a small product starting to verify real users.',
    features: ['1,000 live sends each month', 'Live and test API keys', 'Templates, logs, and webhooks'],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlySends: 5_000,
    price: '₦7,500',
    description: 'For teams growing their user base and OTP volume.',
    features: ['5,000 live sends each month', 'Live and test API keys', 'Templates, logs, and webhooks'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlySends: 10_000,
    price: '₦15,000',
    description: 'For established products with steady verification traffic.',
    features: ['10,000 live sends each month', 'Live and test API keys', 'Templates, logs, and webhooks'],
  },
  {
    id: 'business',
    name: 'Business',
    monthlySends: 50_000,
    price: '₦50,000',
    description: 'For higher-volume services that need more monthly capacity.',
    features: ['50,000 live sends each month', 'Live and test API keys', 'Templates, logs, and webhooks'],
  },
];
