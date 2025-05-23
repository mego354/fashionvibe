import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { UserPlus, Search, ShoppingCart, Star, Gift } from 'lucide-react';

const steps = [
  { icon: <UserPlus className="h-6 w-6 text-primary" />, label: 'Sign up for a Fashion Vibe account.' },
  { icon: <Search className="h-6 w-6 text-primary" />, label: 'Browse our latest collections and products.' },
  { icon: <ShoppingCart className="h-6 w-6 text-primary" />, label: 'Add your favorite items to the cart.' },
  { icon: <Star className="h-6 w-6 text-primary" />, label: 'Choose a subscription plan that fits your needs.' },
  { icon: <Gift className="h-6 w-6 text-primary" />, label: 'Enjoy exclusive offers and updates!' },
];

/**
 * HowToUsePage - Explains how to use the Fashion Vibe platform.
 * Responsive and clean code, ready for future enhancements.
 */
const HowToUsePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-muted/50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{t('howToUse.title', 'How to Use Fashion Vibe')}</h1>
        <p className="text-lg text-muted-foreground mb-4">{t('howToUse.subtitle', 'Follow these simple steps to get started.')}</p>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-xl">
        {steps.map((step, idx) => (
          <Card key={idx} className="flex items-center p-4">
            <div className="mr-4">{step.icon}</div>
            <CardContent className="text-base font-medium">{t(`howToUse.step${idx+1}`, step.label)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowToUsePage;
// @ts-expect-error: generated file, no type declaration needed 