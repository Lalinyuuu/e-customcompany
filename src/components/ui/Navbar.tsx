import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/i18n/routing';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const t = useTranslations('Navigation');
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex flex-col md:flex-row h-auto md:h-16 items-center px-4 md:px-6 container mx-auto py-3 md:py-0 gap-3 md:gap-0">
        <Link
          href="/companies"
          className="text-lg font-semibold tracking-tight w-full md:w-auto text-center md:text-left"
        >
          {title || 'E-Customs Company'}
        </Link>
        <div className="flex items-center justify-center space-x-4 md:space-x-6 w-full md:w-auto">
          <Link
            href="/companies"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('companies')}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
