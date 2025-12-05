'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <span className="uppercase">{locale}</span>
    </Button>
  );
}
