import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { Star, Gift, Crown } from 'lucide-react';

/**
 * PlansPage - Lists subscription plans and their limitations/offers for Fashion Vibe.
 * Responsive and clean code, ready for future enhancements.
 */
const plans = [
  {
    name: 'Basic',
    price: '$9/mo',
    features: ['Access to basic collections', 'Email support'],
    limitation: 'Limited to 10 products per month',
    offer: 'First month free!',
    icon: <Star className="h-8 w-8 text-primary mb-2" />,
  },
  {
    name: 'Pro',
    price: '$29/mo',
    features: ['All Basic features', 'Priority support', 'Early access to sales'],
    limitation: 'Limited to 100 products per month',
    offer: 'Save 20% with annual billing!',
    icon: <Gift className="h-8 w-8 text-primary mb-2" />,
  },
  {
    name: 'Elite',
    price: '$99/mo',
    features: ['All Pro features', 'Personal stylist', 'Exclusive events'],
    limitation: 'Unlimited products',
    offer: 'Exclusive launch offer: 2 months free!',
    icon: <Crown className="h-8 w-8 text-primary mb-2" />,
  },
];

const PlansPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-muted/50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{t('plans.title', 'Subscription Plans')}</h1>
        <p className="text-lg text-muted-foreground mb-4">{t('plans.subtitle', 'Choose the plan that fits your style and needs.')}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map(plan => (
          <Card key={plan.name} className="flex flex-col items-center p-6">
            {plan.icon}
            <CardContent className="text-center">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <div className="text-2xl font-bold mb-2">{plan.price}</div>
              <ul className="mb-2 list-disc list-inside text-left mx-auto max-w-xs">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="text-sm text-gray-600 mb-1">{plan.limitation}</div>
              <div className="text-green-600 font-semibold">{plan.offer}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
// @ts-expect-error: generated file, no type declaration needed 