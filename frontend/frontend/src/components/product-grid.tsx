import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  fetchProducts, 
  setSearchQuery, 
  setCategoryFilter, 
  setPriceFilter, 
  setSortBy, 
  setPage,
  clearFilters,
  selectProducts,
  selectProductsLoading,
  selectProductFilters,
  selectProductPagination
} from '../store/productSlice';
import { selectCategories } from '../store/productSlice';
import ProductCard from './product-card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Skeleton } from '../components/ui/skeleton';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Badge } from '../components/ui/badge';

const ProductGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectProductsLoading);
  const filters = useSelector(selectProductFilters);
  const pagination = useSelector(selectProductPagination);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 5000
  ]);
  const [searchValue, setSearchValue] = React.useState('');
  const [openFilters, setOpenFilters] = React.useState(false);

  React.useEffect(() => {
    // @ts-ignore
    dispatch(fetchProducts());
  }, [dispatch, filters, pagination.page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(setSearchQuery(searchValue));
  };

  const handleCategoryChange = (categoryId: any) => {
    // @ts-ignore
    dispatch(setCategoryFilter(categoryId ? parseInt(categoryId) : null));
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handlePriceApply = () => {
    // @ts-ignore
    dispatch(setPriceFilter({ min: priceRange[0], max: priceRange[1] }));
  };

  const handleSortChange = (value: string) => {
    // @ts-ignore
    dispatch(setSortBy(value));
  };

  const handlePageChange = (page: number) => {
    // @ts-ignore
    dispatch(setPage(page));
  };

  const handleClearFilters = () => {
    // @ts-ignore
    dispatch(clearFilters());
    setPriceRange([0, 5000]);
    setSearchValue('');
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              // Show first page, last page, current page, and pages around current page
              return (
                page === 1 || 
                page === totalPages || 
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              );
            })
            .map((page, index, array) => {
              // Add ellipsis
              const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
              const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
              
              return (
                <React.Fragment key={page}>
                  {showEllipsisBefore && (
                    <PaginationItem>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      isActive={page === pagination.page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  {showEllipsisAfter && (
                    <PaginationItem>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )}
                </React.Fragment>
              );
            })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
              className={pagination.page === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderFilters = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">{t('common.categories')}</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="all-categories" 
                checked={!filters.category_id}
                onCheckedChange={() => handleCategoryChange('')}
              />
              <Label htmlFor="all-categories">{t('common.all')}</Label>
            </div>
            {categories.map((category: any) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`} 
                  checked={filters.category_id === category.id}
                  onCheckedChange={() => handleCategoryChange(category.id.toString())}
                />
                <Label htmlFor={`category-${category.id}`}>{category.name_en}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">{t('common.price')}</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              min={0}
              max={5000}
              step={100}
              onValueChange={handlePriceChange}
            />
            <div className="flex justify-between text-sm">
              <span>{priceRange[0]} EGP</span>
              <span>{priceRange[1]} EGP</span>
            </div>
            <Button size="sm" onClick={handlePriceApply}>
              {t('common.apply')}
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">{t('common.sortBy')}</h3>
          <Select value={filters.sort_by || ''} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('common.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('common.default')}</SelectItem>
              <SelectItem value="price_asc">{t('common.priceLowToHigh')}</SelectItem>
              <SelectItem value="price_desc">{t('common.priceHighToLow')}</SelectItem>
              <SelectItem value="newest">{t('common.newest')}</SelectItem>
              <SelectItem value="popularity">{t('common.popularity')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(filters.category_id || filters.min_price || filters.max_price || filters.sort_by) && (
          <Button variant="outline" size="sm" onClick={handleClearFilters} className="w-full">
            <X className="h-4 w-4 mr-2" />
            {t('common.clearFilters')}
          </Button>
        )}
      </div>
    );
  };

  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardHeader className="p-4 pb-0">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-full" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">{t('common.noProductsFound')}</h3>
          <p className="text-muted-foreground mb-4">{t('common.tryDifferentFilters')}</p>
          <Button variant="outline" onClick={handleClearFilters}>
            {t('common.clearFilters')}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name_en}
            price={product.price}
            salePrice={product.sale_price}
            image={product.images[0]}
            category={categories.find((c: any) => c.id === product.category_id)?.name_en || ''}
            isNew={new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
            isFeatured={product.is_featured}
            isOnSale={product.is_on_sale}
            storeId={product.store_id}
            storeName="Store Name" // This would come from the store data
            sku={product.sku}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>{t('common.filters')}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderFilters()}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Mobile Filters */}
        <div className="md:hidden mb-4">
          <div className="flex gap-2">
            <Sheet open={openFilters} onOpenChange={setOpenFilters}>
              <SheetTrigger>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('common.filters')}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <h2 className="text-lg font-medium mb-4">{t('common.filters')}</h2>
                {renderFilters()}
              </SheetContent>
            </Sheet>
            
            <Select value={filters.sort_by || ''} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('common.default')}</SelectItem>
                <SelectItem value="price_asc">{t('common.priceLowToHigh')}</SelectItem>
                <SelectItem value="price_desc">{t('common.priceHighToLow')}</SelectItem>
                <SelectItem value="newest">{t('common.newest')}</SelectItem>
                <SelectItem value="popularity">{t('common.popularity')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('common.searchProducts')}
                  className="pl-8"
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                />
              </div>
              <Button type="submit">{t('common.search')}</Button>
            </form>
          </div>
          
          {/* Active Filters */}
          {(filters.category_id || filters.min_price || filters.max_price || filters.sort_by) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">{t('common.activeFilters')}:</span>
              
              {filters.category_id && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === filters.category_id)?.name_en}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleCategoryChange('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {(filters.min_price || filters.max_price) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.min_price || 0} - {filters.max_price || 5000} EGP
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => dispatch(setPriceFilter({ min: null, max: null }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.sort_by && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.sort_by === 'price_asc' && t('common.priceLowToHigh')}
                  {filters.sort_by === 'price_desc' && t('common.priceHighToLow')}
                  {filters.sort_by === 'newest' && t('common.newest')}
                  {filters.sort_by === 'popularity' && t('common.popularity')}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => dispatch(setSortBy(null))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="ml-auto">
                {t('common.clearAll')}
              </Button>
            </div>
          )}
          
          {renderProductGrid()}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
