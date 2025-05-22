import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectCartItemsCount } from '../store/cartSlice';
import { selectIsAuthenticated, logout } from '../store/authSlice';
import { Button } from '../components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import ThemeSelector from './theme-selector';
import LanguageSelector from './language-selector';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Package, 
  Heart, 
  Home,
  Store,
  LayoutDashboard
} from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // @ts-ignore
  const cartItemsCount = useSelector(selectCartItemsCount);
  // @ts-ignore
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // @ts-ignore
  const user = useSelector((state: any) => state.auth.user);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search for:', searchQuery);
  };

  const handleLogout = () => {
    // @ts-ignore
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {t('common.home')}
              </Link>
              <Link to="/categories" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('common.categories')}
              </Link>
              <Link to="/wishlist" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                {t('common.wishlist')}
              </Link>
              {/* @ts-ignore */}
              {user?.is_store_owner && (
                <Link to="/store/dashboard" className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  {t('common.myStore')}
                </Link>
              )}
              {/* @ts-ignore */}
              {user?.is_superuser && (
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  {t('common.adminDashboard')}
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Fashion Hub
          </span>
        </Link>
        
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {/* @ts-ignore */}
                <Link to="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t('common.home')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('common.categories')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {/* This would be populated dynamically from categories */}
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/categories/featured"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {t('storefront.featuredProducts')}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {t('storefront.featuredProductsDescription')}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      {/* @ts-ignore */}
                      <Link to="/categories/men" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{t('categories.men')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t('categories.menDescription')}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      {/* @ts-ignore */}
                      <Link to="/categories/women" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{t('categories.women')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t('categories.womenDescription')}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      {/* @ts-ignore */}
                      <Link to="/categories/kids" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{t('categories.kids')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t('categories.kidsDescription')}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                {/* @ts-ignore */}
                <Link to="/new-arrivals" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t('storefront.newArrivals')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                {/* @ts-ignore */}
                <Link to="/sale" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t('storefront.onSale')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form onSubmit={handleSearch} className="hidden w-full max-w-sm lg:flex">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('common.search')}
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <ThemeSelector />
          <LanguageSelector />
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {cartItemsCount}
                </Badge>
              )}
              <span className="sr-only">{t('common.cart')}</span>
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.myAccount')}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/account/profile">
                    <User className="mr-2 h-4 w-4" />
                    {t('account.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/orders">
                    <Package className="mr-2 h-4 w-4" />
                    {t('account.orders')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist">
                    <Heart className="mr-2 h-4 w-4" />
                    {t('account.wishlist')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('account.accountSettings')}
                  </Link>
                </DropdownMenuItem>
                
                {/* @ts-ignore */}
                {user?.is_store_owner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/store/dashboard">
                        <Store className="mr-2 h-4 w-4" />
                        {t('common.myStore')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {/* @ts-ignore */}
                {user?.is_superuser && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('common.adminDashboard')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('common.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
