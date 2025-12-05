'use client';

import { Brain, MapPin, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { CardHeader, CardTitle } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { Company } from '@/types/company';

interface AddressCardHeaderProps {
  formData: Omit<Company, 'id'>;
  isAutoFilling: boolean;
  onAutoFill: () => void;
}

export function AddressCardHeader({ formData, isAutoFilling, onAutoFill }: AddressCardHeaderProps) {
  const t = useTranslations('CompanyForm');

  return (
    <CardHeader className="border-b bg-linear-to-r from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10 pb-4 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        {t('address_info')}
      </CardTitle>
      <div className="flex items-center gap-2">
        <Tooltip
          content={t('auto_fill_requires_name')}
          side="bottom"
          disabled={!formData.nameTh && !formData.nameEn && !isAutoFilling}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAutoFill}
            disabled={isAutoFilling || (!formData.nameTh && !formData.nameEn)}
            className="text-primary border-primary/20 hover:bg-primary/10 h-8 relative overflow-hidden transition-all duration-300 disabled:opacity-50 group"
          >
            {isAutoFilling && (
              <span className="absolute inset-0 bg-linear-to-r from-primary/10 via-primary/20 to-primary/10 animate-shimmer" />
            )}
            <Sparkles
              className={`mr-2 h-3.5 w-3.5 transition-all ${isAutoFilling ? 'animate-spin text-primary' : 'group-hover:scale-110'}`}
            />
            <span className="relative z-10">
              {isAutoFilling ? t('auto_filling') : t('auto_fill')}
            </span>
          </Button>
        </Tooltip>
        {!isAutoFilling && (formData.nameTh || formData.nameEn) && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50">
            <Brain className="h-3 w-3" />
            {t('ai_powered') || 'AI-Powered'}
          </span>
        )}
      </div>
    </CardHeader>
  );
}
