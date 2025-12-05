'use client';

import { Edit, MapPin, Phone, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Company } from '@/types/company';

interface CompanyListCardProps {
  company: Company;
  onDeleteClick: (company: Company) => void;
}

export function CompanyListCard({ company, onDeleteClick }: CompanyListCardProps) {
  const t = useTranslations('CompanyTable');
  const router = useRouter();

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
      {/* Header: Code & Actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md inline-block">
            {company.customerCode}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => router.push(`/companies/${company.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteClick(company)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content: Names & Tax ID */}
      <div>
        <h3 className="font-semibold text-base text-card-foreground">{company.nameTh}</h3>
        <p className="text-sm text-muted-foreground">{company.nameEn}</p>
        <p className="text-sm font-mono text-muted-foreground mt-1">Tax ID: {company.taxId}</p>
      </div>

      {/* Footer: Contact & Location */}
      <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="truncate">{company.province || '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="truncate">{company.phone || '-'}</span>
        </div>
      </div>
    </div>
  );
}
