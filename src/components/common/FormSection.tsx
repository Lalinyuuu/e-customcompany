import { ReactNode, memo } from 'react';
import { Card } from '@/components/ui/Card';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const FormSection = memo(function FormSection({
  title,
  description,
  icon,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </Card>
  );
});
