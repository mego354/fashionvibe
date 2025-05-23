import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setMode, 
  setColor, 
  setRadius, 
  setFont, 
  setRTL, 
  ThemeMode, 
  ThemeColor, 
  ThemeRadius, 
  ThemeFont,
  selectTheme
} from '../store/themeSlice';
import { RootState } from '../store';
import { Button } from '../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '../components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Switch } from '../components/ui/switch';
import ThemeButton from './theme-button';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette, 
  Type, 
  Square, 
  Languages
} from 'lucide-react';

const themeColors: { name: ThemeColor; color: string }[] = [
  { name: 'default', color: '#0f172a' },
  { name: 'blue', color: '#1e40af' },
  { name: 'green', color: '#15803d' },
  { name: 'red', color: '#b91c1c' },
  { name: 'purple', color: '#7e22ce' },
  { name: 'orange', color: '#c2410c' },
  { name: 'pink', color: '#be185d' },
  { name: 'teal', color: '#0d9488' },
  { name: 'indigo', color: '#4f46e5' },
  { name: 'yellow', color: '#ca8a04' },
  { name: 'amber', color: '#d97706' },
  { name: 'lime', color: '#65a30d' },
  { name: 'emerald', color: '#059669' },
  { name: 'cyan', color: '#0891b2' },
  { name: 'sky', color: '#0284c7' },
  { name: 'violet', color: '#7c3aed' },
  { name: 'fuchsia', color: '#c026d3' },
  { name: 'rose', color: '#e11d48' },
  { name: 'slate', color: '#475569' },
  { name: 'gray', color: '#4b5563' },
  { name: 'zinc', color: '#52525b' },
  { name: 'neutral', color: '#525252' },
  { name: 'stone', color: '#57534e' },
  { name: 'brown', color: '#78350f' },
  { name: 'crimson', color: '#be123c' },
  { name: 'midnight', color: '#020617' },
  { name: 'coffee', color: '#442c2e' },
  { name: 'royal', color: '#1e3a8a' },
  { name: 'forest', color: '#14532d' }
];

interface ThemeSelectorProps {
  isMobile?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isMobile = false }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => selectTheme(state));
  const [open, setOpen] = React.useState(false);

  const handleModeChange = (mode: ThemeMode) => {
    dispatch(setMode(mode));
  };

  const handleColorChange = (color: ThemeColor) => {
    dispatch(setColor(color));
  };

  const handleRadiusChange = (radius: ThemeRadius) => {
    dispatch(setRadius(radius));
  };

  const handleFontChange = (font: ThemeFont) => {
    dispatch(setFont(font));
  };

  const handleRTLChange = (rtl: boolean) => {
    dispatch(setRTL(rtl));
    i18n.changeLanguage(rtl ? 'ar' : 'en');
  };

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {theme.mode === 'dark' ? (
              <Moon className="h-4 w-4 mr-2" />
            ) : (
              <Sun className="h-4 w-4 mr-2" />
            )}
            {t('common.theme')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleModeChange('light')}>
            <Sun className="h-4 w-4 mr-2" />
            {t('common.lightMode')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange('dark')}>
            <Moon className="h-4 w-4 mr-2" />
            {t('common.darkMode')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange('system')}>
            <Monitor className="h-4 w-4 mr-2" />
            {t('common.systemMode')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Palette className="h-4 w-4 mr-2" />
            {t('common.customizeTheme')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Palette className="h-5 w-5" />
            <span className="sr-only">{t('common.theme')}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('common.theme')}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="mode">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="mode">
                {theme.mode === 'dark' ? (
                  <Moon className="h-4 w-4 mr-2" />
                ) : theme.mode === 'light' ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Monitor className="h-4 w-4 mr-2" />
                )}
                {t('common.mode')}
              </TabsTrigger>
              <TabsTrigger value="color">
                <Palette className="h-4 w-4 mr-2" />
                {t('common.color')}
              </TabsTrigger>
              <TabsTrigger value="font">
                <Type className="h-4 w-4 mr-2" />
                {t('common.font')}
              </TabsTrigger>
              <TabsTrigger value="other">
                <Square className="h-4 w-4 mr-2" />
                {t('common.other')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mode" className="space-y-4 py-4">
              <RadioGroup
                value={theme.mode}
                onValueChange={(value) => handleModeChange(value as ThemeMode)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      {t('common.lightMode')}
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      {t('common.darkMode')}
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      {t('common.systemMode')}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </TabsContent>
            <TabsContent value="color" className="py-4">
              <div className="grid grid-cols-5 gap-2">
                {themeColors.map((item) => (
                  <ThemeButton
                    key={item.name}
                    color={item.color}
                    active={theme.color === item.name}
                    onClick={() => handleColorChange(item.name)}
                    aria-label={`${item.name} theme`}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="font" className="space-y-4 py-4">
              <RadioGroup
                value={theme.font}
                onValueChange={(value) => handleFontChange(value as ThemeFont)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sans" id="sans" />
                  <Label htmlFor="sans" className="font-sans">
                    Sans
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serif" id="serif" />
                  <Label htmlFor="serif" className="font-serif">
                    Serif
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mono" id="mono" />
                  <Label htmlFor="mono" className="font-mono">
                    Mono
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cairo" id="cairo" />
                  <Label htmlFor="cairo" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Cairo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tajawal" id="tajawal" />
                  <Label htmlFor="tajawal" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    Tajawal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="readex" id="readex" />
                  <Label htmlFor="readex" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
                    Readex Pro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="noto-sans-arabic" id="noto-sans-arabic" />
                  <Label htmlFor="noto-sans-arabic" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                    Noto Sans Arabic
                  </Label>
                </div>
              </RadioGroup>
            </TabsContent>
            <TabsContent value="other" className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">{t('common.radius')}</h4>
                  <RadioGroup
                    value={theme.radius}
                    onValueChange={(value) => handleRadiusChange(value as ThemeRadius)}
                    className="flex space-x-2"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-none border-2 border-primary mb-1"></div>
                      <RadioGroupItem value="none" id="r-none" className="sr-only" />
                      <Label htmlFor="r-none" className="text-xs">
                        {t('common.none')}
                      </Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-sm border-2 border-primary mb-1"></div>
                      <RadioGroupItem value="small" id="r-small" className="sr-only" />
                      <Label htmlFor="r-small" className="text-xs">
                        {t('common.small')}
                      </Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-md border-2 border-primary mb-1"></div>
                      <RadioGroupItem value="medium" id="r-medium" className="sr-only" />
                      <Label htmlFor="r-medium" className="text-xs">
                        {t('common.medium')}
                      </Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-lg border-2 border-primary mb-1"></div>
                      <RadioGroupItem value="large" id="r-large" className="sr-only" />
                      <Label htmlFor="r-large" className="text-xs">
                        {t('common.large')}
                      </Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full border-2 border-primary mb-1"></div>
                      <RadioGroupItem value="full" id="r-full" className="sr-only" />
                      <Label htmlFor="r-full" className="text-xs">
                        {t('common.full')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4" />
                    <Label htmlFor="rtl-mode">{t('common.rtlMode')}</Label>
                  </div>
                  <Switch
                    id="rtl-mode"
                    checked={theme.rtl}
                    onCheckedChange={handleRTLChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {theme.mode === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">{t('common.theme')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('common.theme')}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleModeChange('light')}>
            <Sun className="h-4 w-4 mr-2" />
            {t('common.lightMode')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange('dark')}>
            <Moon className="h-4 w-4 mr-2" />
            {t('common.darkMode')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange('system')}>
            <Monitor className="h-4 w-4 mr-2" />
            {t('common.systemMode')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Palette className="h-4 w-4 mr-2" />
            {t('common.customizeTheme')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ThemeSelector;