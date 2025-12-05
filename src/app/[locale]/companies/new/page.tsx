'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { CompanyForm } from '@/components/company/CompanyForm';
import { Navbar } from '@/components/ui/Navbar';
import { STORAGE_KEYS } from '@/constants';
import { useCreateCompany } from '@/hooks/useCompanies';
import { CompanyFormData } from '@/types/company';

export default function NewCompanyPage() {
  const t = useTranslations('CompanyForm');
  const createCompanyMutation = useCreateCompany();

  // Clear draft when entering new company page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.CLEAR_DRAFT_ON_MOUNT, 'true');
    }
  }, []);

  const handleSubmit = async (data: CompanyFormData) => {
    await createCompanyMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <main className="container mx-auto py-6 px-4 pb-20 md:py-10">
        <CompanyForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
