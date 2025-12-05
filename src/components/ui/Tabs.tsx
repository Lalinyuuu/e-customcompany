'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 p-1.5 text-muted-foreground border border-border/50 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, children, className, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-linear-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 scale-105'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/80 hover:scale-102',
        className
      )}
      onClick={() => context.setActiveTab(value)}
      {...props}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-foreground rounded-full animate-in fade-in-0 slide-in-from-bottom-1 duration-300" />
      )}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  if (context.activeTab !== value) {
    return null;
  }

  return (
    <div
      className={cn(
        'mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-0 slide-in-from-top-2 duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
