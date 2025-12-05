'use client';

import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from '@/i18n/routing';

interface FormHeaderProps {
  isEdit: boolean;
  loading: boolean;
}

export const FormHeader = memo(function FormHeader({ isEdit, loading }: FormHeaderProps) {
  const t = useTranslations('CompanyForm');
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {isEdit ? t('title_edit') : t('title_create')}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          {isEdit ? t('subtitle_edit') : t('subtitle_create')}
        </p>
      </div>
      <div className="hidden md:flex w-full md:w-auto space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/companies')}
          disabled={loading}
          className="flex-1 md:flex-none"
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 md:flex-none">
          {loading ? t('saving') : isEdit ? t('save_edit') : t('save_create')}
        </Button>
      </div>
    </div>
  );
});
