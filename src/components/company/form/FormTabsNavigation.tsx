'use client';

import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface FormTabsNavigationProps {
  className?: string;
}

export const FormTabsNavigation = memo(function FormTabsNavigation({
  className,
}: FormTabsNavigationProps) {
  const t = useTranslations('CompanyForm');

  return (
    <div
      className={`mb-6 p-1 rounded-xl bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 shadow-sm backdrop-blur-sm ${className || ''}`}
    >
      <TabsList className="grid w-full grid-cols-2 bg-transparent border-0 p-0 h-auto">
        <TabsTrigger value="main" className="relative z-10 cursor-pointer">
          {t('tab_all_info')}
        </TabsTrigger>
        <TabsTrigger value="other" className="relative z-10 cursor-pointer">
          {t('tab_other_info')}
        </TabsTrigger>
      </TabsList>
    </div>
  );
});
