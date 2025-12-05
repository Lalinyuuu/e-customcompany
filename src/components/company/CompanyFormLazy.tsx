'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

// Lazy load form sections for better code splitting
export const CompanyInfoCardLazy = dynamic(
  () => import('./cards/CompanyInfoCard').then((mod) => ({ default: mod.CompanyInfoCard })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
);

export const AddressCardLazy = dynamic(
  () => import('./cards/AddressCard').then((mod) => ({ default: mod.AddressCard })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
);

export const ContactCardLazy = dynamic(
  () => import('./cards/ContactCard').then((mod) => ({ default: mod.ContactCard })),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false,
  }
);

export const SettingsCardLazy = dynamic(
  () => import('./cards/SettingsCard').then((mod) => ({ default: mod.SettingsCard })),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false,
  }
);

export const AdditionalInfoCardLazy = dynamic(
  () => import('./cards/AdditionalInfoCard').then((mod) => ({ default: mod.AdditionalInfoCard })),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false,
  }
);

export const OtherInfoCardLazy = dynamic(
  () => import('./cards/OtherInfoCard').then((mod) => ({ default: mod.OtherInfoCard })),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false,
  }
);

export const AIExplanationCardLazy = dynamic(
  () => import('./cards/AIExplanationCard').then((mod) => ({ default: mod.AIExplanationCard })),
  {
    loading: () => <Skeleton className="h-32 w-full" />,
    ssr: false,
  }
);
