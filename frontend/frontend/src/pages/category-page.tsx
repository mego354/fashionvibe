import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import ProductCard from '../components/product-card';
import CategoryBanner from '../components/category-banner';
import ProductGrid from '../components/product-grid';

// Mock data for category page
const mockCategory = {
  id: 1,
  name: "Women's Dresses",
  description: "Explore our collection of stylish dresses for every occasion. From casual day dresses to elegant evening wear, find the perfect dress to express your unique style.",
  image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  subcategories: [
    { id: 101, name: "Casual Dresses", slug: "casual-dresses" },
    { id: 102, name: "Formal Dresses", slug: "formal-dresses" },
    { id: 103, name: "Maxi Dresses", slug: "maxi-dresses" },
    { id: 104, name: "Mini Dresses", slug: "mini-dresses" },
    { id: 105, name: "Party Dresses", slug: "party-dresses" }
  ]
};

const mockProducts = [
  {
    id: 1,
    name: 'Summer Floral Dress',
    price: 1200,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WD-1001'
  },
  {
    id: 9,
    name: 'Printed Maxi Dress',
    price: 1350,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=873&q=80',
    category: 'Women',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WD-9009'
  },
  {
    id: 17,
    name: 'Embroidered Blouse',
    price: 950,
    salePrice: 750,
    image: 'https://images.unsplash.com/photo-1604945234568-86eda11263b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WB-1717'
  },
  {
    id: 22,
    name: 'Floral Wrap Dress',
    price: 1150,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=746&q=80',
    category: 'Women',
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    storeId: 3,
    storeName: 'Cairo Chic',
    sku: 'WD-2222'
  },
  {
    id: 23,
    name: 'Sleeveless Summer Dress',
    price: 950,
    salePrice: 750,
    image: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'WD-2323'
  },
  {
    id: 24,
    name: 'Elegant Evening Gown',
    price: 2500,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=708&q=80',
    category: 'Women',
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WD-2424'
  },
  {
    id: 25,
    name: 'Casual T-Shirt Dress',
    price: 850,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1623609163859-ca93c959b5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'WD-2525'
  },
  {
    id: 26,
    name: 'Bohemian Maxi Dress',
    price: 1450,
    salePrice: 1200,
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    storeId: 3,
    storeName: 'Cairo Chic',
    sku: 'WD-2626'
  }
];

const mockFilters = {
  price: [
    { id: 'price-1', label: 'Under 500 EGP', value: 'under-500' },
    { id: 'price-2', label: '500 - 1000 EGP', value: '500-1000' },
    { id: 'price-3', label: '1000 - 1500 EGP', value: '1000-1500' },
    { id: 'price-4', label: '1500 - 2000 EGP', value: '1500-2000' },
    { id: 'price-5', label: 'Over 2000 EGP', value: 'over-2000' }
  ],
  colors: [
    { id: 'color-1', label: 'Black', value: 'black', hex: '#000000' },
    { id: 'color-2', label: 'White', value: 'white', hex: '#ffffff' },
    { id: 'color-3', label: 'Red', value: 'red', hex: '#ef4444' },
    { id: 'color-4', label: 'Blue', value: 'blue', hex: '#3b82f6' },
    { id: 'color-5', label: 'Green', value: 'green', hex: '#22c55e' },
    { id: 'color-6', label: 'Yellow', value: 'yellow', hex: '#eab308' },
    { id: 'color-7', label: 'Pink', value: 'pink', hex: '#ec4899' },
    { id: 'color-8', label: 'Purple', value: 'purple', hex: '#a855f7' }
  ],
  sizes: [
    { id: 'size-1', label: 'XS', value: 'xs' },
    { id: 'size-2', label: 'S', value: 's' },
    { id: 'size-3', label: 'M', value: 'm' },
    { id: 'size-4', label: 'L', value: 'l' },
    { id: 'size-5', label: 'XL', value: 'xl' },
    { id: 'size-6', label: 'XXL', value: 'xxl' }
  ],
  stores: [
    { id: 'store-1', label: 'Fashion Elite', value: '1' },
    { id: 'store-2', label: 'Cairo Threads', value: '2' },
    { id: 'store-3', label: 'Cairo Chic', value: '3' }
  ]
};

const mockSortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' }
];

const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // In a real implementation, these would come from Redux and URL params
  const category = mockCategory;
  const products = mockProducts;
  const filters = mockFilters;
  const sortOptions = mockSortOptions;
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({
    price: [],
    colors: [],
    sizes: [],
    stores: []
  });
  const [sortBy, setSortBy] = React.useState('newest');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = React.useState<Record<string, boolean>>({
    price: true,
    colors: true,
    sizes: true,
    stores: true
  });
  
  const toggleFilterSection = (section: string) => {
    setExpandedFilterSections({
      ...expandedFilterSections,
      [section]: !expandedFilterSections[section]
    });
  };
  
  const handleFilterChange = (filterType: string, value: string) => {
    const currentFilters = [...(selectedFilters[filterType] || [])];
    const valueIndex = currentFilters.indexOf(value);
    
    if (valueIndex === -1) {
      // Add filter
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: [...currentFilters, value]
      });
    } else {
      // Remove filter
      currentFilters.splice(valueIndex, 1);
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: currentFilters
      });
    }
  };
  
  const clearAllFilters = () => {
    setSelectedFilters({
      price: [],
      colors: [],
      sizes: [],
      stores: []
    });
    setSearchQuery('');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Search query:', searchQuery);
  };
  
  // Count active filters
  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (count, filterValues) => count + filterValues.length, 
    0
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Category Banner */}
        <CategoryBanner category={{
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image,
          link: `/categories/${category.id}`
        }} />
        
        <div className="container py-8">
          {/* Subcategories */}
          {category.subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">{t('category.subcategories')}</h2>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <Link 
                    key={subcategory.id} 
                    to={`/categories/${subcategory.slug}`}
                    className="px-4 py-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t('category.filters')}</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    {t('category.clearAll')}
                  </Button>
                )}
              </div>
              
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Price Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('price')}
                    >
                      <h3 className="font-medium">{t('category.price')}</h3>
                      {expandedFilterSections.price ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.price && (
                      <div className="mt-2 space-y-2">
                        {filters.price.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={option.id}
                              checked={selectedFilters.price.includes(option.value)}
                              onChange={() => handleFilterChange('price', option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={option.id} className="ml-2 text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Color Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('colors')}
                    >
                      <h3 className="font-medium">{t('category.color')}</h3>
                      {expandedFilterSections.colors ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.colors && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {filters.colors.map((option) => (
                          <div key={option.id} className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => handleFilterChange('colors', option.value)}
                              className={`h-8 w-8 rounded-full border-2 ${
                                selectedFilters.colors.includes(option.value) 
                                  ? 'ring-2 ring-primary ring-offset-2' 
                                  : 'ring-0'
                              }`}
                              style={{ backgroundColor: option.hex }}
                              title={option.label}
                            >
                              <span className="sr-only">{option.label}</span>
                            </button>
                            <span className="text-xs mt-1">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Size Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('sizes')}
                    >
                      <h3 className="font-medium">{t('category.size')}</h3>
                      {expandedFilterSections.sizes ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.sizes && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {filters.sizes.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleFilterChange('sizes', option.value)}
                            className={`h-8 w-8 flex items-center justify-center rounded-md border ${
                              selectedFilters.sizes.includes(option.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-muted'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Store Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('stores')}
                    >
                      <h3 className="font-medium">{t('category.store')}</h3>
                      {expandedFilterSections.stores ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.stores && (
                      <div className="mt-2 space-y-2">
                        {filters.stores.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={option.id}
                              checked={selectedFilters.stores.includes(option.value)}
                              onChange={() => handleFilterChange('stores', option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={option.id} className="ml-2 text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Products */}
            <div>
              {/* Search and Sort Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('category.searchInCategory')}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      title={t('category.gridView')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      title={t('category.listView')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`category.${option.value}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {t('category.filters')}
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(selectedFilters).map(([filterType, values]) =>
                    values.map((value) => {
                      const filterOption = filters[filterType as keyof typeof filters].find(
                        (option) => option.value === value
                      );
                      
                      return filterOption ? (
                        <Badge
                          key={`${filterType}-${value}`}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          <span>
                            {t(`category.${filterType}`)}: {filterOption.label}
                          </span>
                          <button
                            onClick={() => handleFilterChange(filterType, value)}
                            className="ml-1 rounded-full hover:bg-muted-foreground/20"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">{t('category.remove')}</span>
                          </button>
                        </Badge>
                      ) : null;
                    })
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    {t('category.clearAll')}
                  </Button>
                </div>
              )}
              
              {/* Products Grid/List */}
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">{t('category.noProducts')}</h3>
                  <p className="text-muted-foreground mb-6">{t('category.noProductsMessage')}</p>
                  <Button onClick={clearAllFilters}>
                    {t('category.clearFilters')}
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }>
                  {products.map((product) => (
                    viewMode === 'grid' ? (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        salePrice={product.salePrice}
                        image={product.image}
                        category={product.category}
                        isNew={product.isNew}
                        isFeatured={product.isFeatured}
                        isOnSale={product.isOnSale}
                        storeId={product.storeId}
                        storeName={product.storeName}
                        sku={product.sku}
                      />
                    ) : (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative md:w-1/3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover aspect-square md:aspect-auto"
                            />
                            {product.isNew && (
                              <Badge variant="secondary" className="absolute top-2 left-2 bg-blue-500 text-white hover:bg-blue-600">
                                {t('storefront.new')}
                              </Badge>
                            )}
                            {product.isOnSale && (
                              <Badge variant="secondary" className="absolute top-2 left-2 bg-red-500 text-white hover:bg-red-600">
                                {t('storefront.sale')}
                              </Badge>
                            )}
                          </div>
                          <div className="p-6 flex flex-col justify-between md:w-2/3">
                            <div>
                              <h3 className="font-bold text-lg mb-2">
                                <Link to={`/products/${product.id}`} className="hover:underline">
                                  {product.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {t('storefront.by')} {product.storeName}
                              </p>
                              <p className="mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
                                nisl eget ultricies tincidunt, nisl nisl aliquam nisl.
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                              <div className="mb-4 sm:mb-0">
                                {product.salePrice ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xl font-bold text-primary">{product.salePrice.toLocaleString()} EGP</span>
                                    <span className="text-sm line-through text-muted-foreground">{product.price.toLocaleString()} EGP</span>
                                  </div>
                                ) : (
                                  <span className="text-xl font-bold">{product.price.toLocaleString()} EGP</span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button asChild>
                                  <Link to={`/products/${product.id}`}>
                                    {t('storefront.viewDetails')}
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronUp className="h-4 w-4 rotate-90" />
                    <span className="sr-only">{t('category.previous')}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">1</Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8">2</Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8">3</Button>
                  <span>...</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8">8</Button>
                  <Button variant="outline" size="icon">
                    <ChevronUp className="h-4 w-4 -rotate-90" />
                    <span className="sr-only">{t('category.next')}</span>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters Dialog */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{t('category.filters')}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">{t('common.close')}</span>
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Price Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('price')}
                    >
                      <h3 className="font-medium">{t('category.price')}</h3>
                      {expandedFilterSections.price ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.price && (
                      <div className="mt-2 space-y-2">
                        {filters.price.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-${option.id}`}
                              checked={selectedFilters.price.includes(option.value)}
                              onChange={() => handleFilterChange('price', option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`mobile-${option.id}`} className="ml-2 text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Color Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('colors')}
                    >
                      <h3 className="font-medium">{t('category.color')}</h3>
                      {expandedFilterSections.colors ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.colors && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {filters.colors.map((option) => (
                          <div key={option.id} className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => handleFilterChange('colors', option.value)}
                              className={`h-8 w-8 rounded-full border-2 ${
                                selectedFilters.colors.includes(option.value) 
                                  ? 'ring-2 ring-primary ring-offset-2' 
                                  : 'ring-0'
                              }`}
                              style={{ backgroundColor: option.hex }}
                              title={option.label}
                            >
                              <span className="sr-only">{option.label}</span>
                            </button>
                            <span className="text-xs mt-1">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Size Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('sizes')}
                    >
                      <h3 className="font-medium">{t('category.size')}</h3>
                      {expandedFilterSections.sizes ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.sizes && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {filters.sizes.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleFilterChange('sizes', option.value)}
                            className={`h-8 w-8 flex items-center justify-center rounded-md border ${
                              selectedFilters.sizes.includes(option.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-muted'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Store Filter */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection('stores')}
                    >
                      <h3 className="font-medium">{t('category.store')}</h3>
                      {expandedFilterSections.stores ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedFilterSections.stores && (
                      <div className="mt-2 space-y-2">
                        {filters.stores.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-${option.id}`}
                              checked={selectedFilters.stores.includes(option.value)}
                              onChange={() => handleFilterChange('stores', option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`mobile-${option.id}`} className="ml-2 text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                      {t('common.apply')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
