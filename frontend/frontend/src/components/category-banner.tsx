import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryBannerProps {
  category: {
    id: number;
    name: string;
    description: string;
    image: string;
    link: string;
  };
  reverse?: boolean;
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ category, reverse = false }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-muted/30 rounded-lg overflow-hidden`}>
      <div className="md:w-1/2">
        <img 
          src={category.image} 
          alt={category.name} 
          className="h-full w-full object-cover"
        />
      </div>
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
        <p className="text-muted-foreground mb-6">{category.description}</p>
        <div>
          <Button asChild>
            <Link to={category.link}>
              {t('common.shopNow')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
