'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CompanyForm } from '@/components/company/CompanyForm';
import { Navbar } from '@/components/ui/Navbar';
import { useCompany, useUpdateCompany } from '@/hooks/useCompanies';
import { CompanyFormData } from '@/types/company';

export default function EditCompanyPage() {
  const t = useTranslations('CompanyForm');
  const tPage = useTranslations('EditCompanyPage');
  const params = useParams();
  const id = params['id'] as string;

  const { data: company, isLoading, error } = useCompany(id);
  const updateCompanyMutation = useUpdateCompany();

  const handleSubmit = async (data: CompanyFormData) => {
    await updateCompanyMutation.mutateAsync({ id, data });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">{tPage('loading')}</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">{tPage('not_found')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <main className="container mx-auto py-6 px-4 pb-20 md:py-10">
        <CompanyForm initialData={company} onSubmit={handleSubmit} isEdit />
      </main>
    </div>
  );
}
