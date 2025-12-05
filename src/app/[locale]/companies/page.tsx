'use client';

import { useTranslations } from 'next-intl';
import CompanyTable from '@/components/company/cards/CompanyTable';
import { Navbar } from '@/components/ui/Navbar';
import { Link } from '@/i18n/routing';

export default function CompanyListPage() {
  const t = useTranslations('CompanyTable'); // Reusing CompanyTable namespace for now or add new one

  return (
    <div className="min-h-screen bg-muted/40 relative">
      <Navbar title="E-Customs Company Master" />

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('companies')}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t('search_placeholder')}</p>
          </div>

          <Link
            href="/companies/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 shadow-sm w-full md:w-auto"
          >
            + {t('add_company')}
          </Link>
        </div>

        <CompanyTable />
      </div>
    </div>
  );
}
