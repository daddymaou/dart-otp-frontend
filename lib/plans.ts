export type Plan = {
  id: 'free' | 'pro';
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
    price: '$0',
    description: 'For a first integration and a little breathing room.',
    features: ['100 sends each month', 'Live and test API keys', 'Templates and delivery logs'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlySends: 10_000,
    price: 'Placeholder',
    description: 'More room for an app that is picking up speed.',
    features: ['10,000 sends each month', 'Everything in Free', 'Webhook support'],
  },
];
