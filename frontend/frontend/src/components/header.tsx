import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectCartItemsCount } from '../store/cartSlice';
import { selectIsAuthenticated, logout } from '../store/authSlice';
import { Button } from '../components/ui/button';
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
  Store,
  LayoutDashboard,
} from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isStorefront = Boolean(useMatch('/store/:storeId/*'));

  const cartItemsCount = useSelector(selectCartItemsCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const [searchQuery, setSearchQuery] = React.useState('');

  const companyLinks = [
    { to: '/', label: t('common.home') },
    { to: '/about', label: t('about') },
    { to: '/contact', label: t('contact') },
    { to: '/plans', label: t('subscriptionPlans') },
    { to: '/how-to-use', label: t('howToUse') },
    { to: '/how-to-subscribe', label: t('howToSubscribe') },
  ];

  const storeLinks = [
    { to: '/', label: t('common.home') },
    { to: '/categories', label: t('common.categories') },
    { to: '/wishlist', label: t('common.wishlist') },
    { to: '/new-arrivals', label: t('storefront.newArrivals') },
    { to: '/sale', label: t('storefront.onSale') },
  ];

  const currentLinks = isLanding ? companyLinks : storeLinks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log('Search for:', searchQuery);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderLogo = () => (
    <Link to="/" className="flex items-center space-x-2">
      <span className="font-bold text-xl">Fashion Vibe</span>
    </Link>
  );

  const renderDesktopNav = () => (
    <nav className="hidden md:flex items-center space-x-4">
      {currentLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const renderMobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {renderLogo()}
          </div>
          <nav className="flex flex-col gap-3 p-4 flex-grow">
            {currentLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('common.theme')}</span>
                <ThemeSelector isMobile />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('common.language')}</span>
                <LanguageSelector isMobile />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderSearchBar = () => {
    if (!isStorefront) return null;

    return (
      <form onSubmit={handleSearch} className="hidden lg:flex w-64">
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
    );
  };

  const renderCartButton = () => {
    if (!isStorefront) return null;

    return (
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemsCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {cartItemsCount}
            </Badge>
          )}
          <span className="sr-only">{t('common.cart')}</span>
        </Button>
      </Link>
    );
  };

  const renderUserMenu = () => {
    if (!isStorefront) return null;

    if (!isAuthenticated) {
      return (
        <Link to="/login">
          <Button variant="ghost" size="sm">
            {t('common.login')}
          </Button>
        </Link>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || '/placeholder-avatar.jpg'} alt="User" />
              <AvatarFallback>
                {(user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('common.myAccount')}</DropdownMenuLabel>
          <Link to="/account/profile">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t('account.profile')}</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/account/orders">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              <span>{t('account.orders')}</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/wishlist">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>{t('account.wishlist')}</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/account/settings">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('account.accountSettings')}</span>
            </DropdownMenuItem>
          </Link>
          {user?.is_store_owner && (
            <>
              <DropdownMenuSeparator />
              <Link to="/store/dashboard">
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>{t('common.myStore')}</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          {user?.is_superuser && (
            <>
              <DropdownMenuSeparator />
              <Link to="/admin/dashboard">
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{t('common.adminDashboard')}</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('common.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          {/* {renderMobileNav()} */}
          {renderLogo()}
        </div>
        {renderDesktopNav()}
        <div className="flex items-center space-x-2">
          {renderSearchBar()}
          {renderCartButton()}
          <div className="hidden md:flex items-center space-x-2">
            {/* <ThemeSelector />
            <LanguageSelector /> */}
          </div>
          {renderUserMenu()}
        </div>
      </div>
    </header>
  );
};

export default Header;