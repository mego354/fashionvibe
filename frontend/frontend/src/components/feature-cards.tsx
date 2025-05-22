import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Truck, CreditCard, RefreshCw, Clock } from 'lucide-react';

const FeatureCards: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('storefront.freeShipping'),
      description: t('storefront.freeShippingDescription'),
      color: 'bg-blue-500'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: t('storefront.securePayment'),
      description: t('storefront.securePaymentDescription'),
      color: 'bg-green-500'
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: t('storefront.easyReturns'),
      description: t('storefront.easyReturnsDescription'),
      color: 'bg-amber-500'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('storefront.customerSupport'),
      description: t('storefront.customerSupportDescription'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <Card key={index} className="border-none shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Badge className={`${feature.color} text-white p-3 rounded-full mb-4`}>
              {feature.icon}
            </Badge>
            <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCards;
