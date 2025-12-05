'use client';

import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Company } from '@/types/company';

interface ContactCardProps {
  formData: Omit<Company, 'id'>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactCard = memo(function ContactCard({
  formData,
  errors,
  onChange,
}: ContactCardProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
          {t('contact_info')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            {t('phone')}
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            required
            placeholder={t('placeholders.phone')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fax" className="text-sm font-medium text-foreground">
            {t('fax')}
          </label>
          <Input
            id="fax"
            name="fax"
            value={formData.fax}
            onChange={onChange}
            placeholder={t('placeholders.fax')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {t('email')}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder={t('placeholders.email')}
            className={errors['email'] ? 'border-red-500' : ''}
          />
          {errors['email'] && <p className="text-xs text-red-500">{errors['email']}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="dMailCorpId" className="text-sm font-medium text-foreground">
            {t('d_mail_corp_id')}
          </label>
          <Input
            id="dMailCorpId"
            name="dMailCorpId"
            value={formData.dMailCorpId || ''}
            onChange={onChange}
            placeholder={t('placeholders.d_mail_corp_id')}
          />
        </div>
      </CardContent>
    </Card>
  );
});
