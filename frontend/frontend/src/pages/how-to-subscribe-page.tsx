import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { Gift, Star, ShoppingCart, UserPlus } from 'lucide-react';

const steps = [
  { icon: <Gift className="h-6 w-6 text-primary" />, label: 'Visit the Subscription Plans page.' },
  { icon: <Star className="h-6 w-6 text-primary" />, label: 'Compare available plans and select the best one for you.' },
  { icon: <ShoppingCart className="h-6 w-6 text-primary" />, label: 'Click the Subscribe button and follow the checkout process.' },
  { icon: <UserPlus className="h-6 w-6 text-primary" />, label: 'Enjoy your Fashion Vibe membership and benefits!' },
];

/**
 * HowToSubscribePage - Explains how to subscribe to Fashion Vibe plans.
 * Responsive and clean code, ready for future enhancements.
 */
const HowToSubscribePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-muted/50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{t('howToSubscribe.title', 'How to Subscribe')}</h1>
        <p className="text-lg text-muted-foreground mb-4">{t('howToSubscribe.subtitle', 'Subscribe in just a few easy steps.')}</p>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-xl">
        {steps.map((step, idx) => (
          <Card key={idx} className="flex items-center p-4">
            <div className="mr-4">{step.icon}</div>
            <CardContent className="text-base font-medium">{t(`howToSubscribe.step${idx+1}`, step.label)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowToSubscribePage; 