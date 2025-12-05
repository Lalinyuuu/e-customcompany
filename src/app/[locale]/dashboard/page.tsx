'use client';

import { Building2, FileText, LucideIcon, MapPin, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCompanies } from '@/hooks/useCompanies';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={`skeleton-${index}`} className="h-32" />
        ))}
      </div>
    </div>
  );
}

function ProvinceList({
  provinces,
  totalCompanies,
}: {
  provinces: [string, number][];
  totalCompanies: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          จังหวัดที่มีบริษัทมากที่สุด
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {provinces.map(([province, count], index) => (
            <div key={province} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <span className="font-medium">{province}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(count / totalCompanies) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UsageTypeList({
  usageTypes,
  totalCompanies,
}: {
  usageTypes: Record<string, number>;
  totalCompanies: number;
}) {
  const getTypeName = (type: string) => {
    switch (type) {
      case 'GENERAL':
        return 'ทั่วไป';
      case 'GOLD_CARD':
        return 'Gold Card';
      case 'BROKER':
        return 'Broker';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          สรุปตามประเภทการใช้งาน
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(usageTypes).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="font-medium">{getTypeName(type)}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(count / totalCompanies) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useCompanies();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return <div className="p-8 text-center text-destructive">ไม่สามารถโหลดข้อมูลได้</div>;
  }

  const totalCompanies = data.length;
  const provinces = Array.from(new Set(data.map((c) => c.province).filter(Boolean)));
  const totalProvinces = provinces.length;

  const provinceCounts = provinces.reduce(
    (acc, province) => {
      acc[province] = data.filter((c) => c.province === province).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const topProvinces = Object.entries(provinceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const usageTypeCounts = data.reduce(
    (acc, company) => {
      const type = company.usageType || 'GENERAL';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">ภาพรวมข้อมูลบริษัททั้งหมด</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="จำนวนบริษัททั้งหมด"
          value={totalCompanies}
          icon={Building2}
          description="บริษัทที่ลงทะเบียนในระบบ"
        />
        <StatCard
          title="จำนวนจังหวัด"
          value={totalProvinces}
          icon={MapPin}
          description="จังหวัดที่มีบริษัทตั้งอยู่"
        />
        <StatCard
          title="บริษัททั่วไป"
          value={usageTypeCounts['GENERAL'] || 0}
          icon={Users}
          description="สิทธิ์การใช้งานทั่วไป"
        />
        <StatCard
          title="Gold Card"
          value={usageTypeCounts['GOLD_CARD'] || 0}
          icon={TrendingUp}
          description="สิทธิ์ Gold Card"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProvinceList provinces={topProvinces} totalCompanies={totalCompanies} />
        <UsageTypeList usageTypes={usageTypeCounts} totalCompanies={totalCompanies} />
      </div>
    </div>
  );
}
