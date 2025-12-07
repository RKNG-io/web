'use client';

import { CartProvider } from '@/components/services/CartContext';
import { CartDrawer } from '@/components/services/CartDrawer';
import { ReportDisplay } from './ReportDisplay';
import type { ReckoningReport } from '@/types/report';

interface ReportWrapperProps {
  report: ReckoningReport;
  name: string;
  answers?: Record<string, string | string[]>;
}

export function ReportWrapper({ report, name, answers }: ReportWrapperProps) {
  return (
    <CartProvider>
      <ReportDisplay report={report} name={name} answers={answers} />
      <CartDrawer />
    </CartProvider>
  );
}
