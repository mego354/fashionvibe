import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: {
    id: number;
    name: string;
    image: string;
    link: string;
    productCount: number;
  }[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const { t } = useTranslation();
  
  // Group categories by type for tabs
  const menCategories = categories.filter(cat => cat.link.includes('/men'));
  const womenCategories = categories.filter(cat => cat.link.includes('/women'));
  const kidsCategories = categories.filter(cat => cat.link.includes('/kids'));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('common.shopByCategory')}</h2>
        <Button asChild variant="ghost">
          <Link to="/categories">
            {t('common.viewAll')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
          <TabsTrigger value="men">{t('categories.men')}</TabsTrigger>
          <TabsTrigger value="women">{t('categories.women')}</TabsTrigger>
          <TabsTrigger value="kids">{t('categories.kids')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="men" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="women" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {womenCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="kids" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kidsCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    image: string;
    link: string;
    productCount: number;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="overflow-hidden group">
      <Link to={category.link}>
        <div className="relative">
          <img 
            src={category.image} 
            alt={category.name} 
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <CardContent className="p-4 text-white">
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-white/80">
                {category.productCount} {t('common.products')}
              </p>
            </CardContent>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CategoryGrid;
