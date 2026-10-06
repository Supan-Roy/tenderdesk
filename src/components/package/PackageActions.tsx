import React from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PackageCheck, AlertCircle } from 'lucide-react';

interface PackageActionsProps {
  isValid: boolean;
  blockingCount?: number;
  onGeneratePackage?: () => void;
}

export const PackageActions: React.FC<PackageActionsProps> = ({
  isValid,
  blockingCount = 0,
}) => {
  const { t } = useI18n();

  return (
    <Card className="bg-slate-50 border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-lg border ${
              isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}
          >
            {isValid ? <PackageCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t.package.title}</h4>
            <p className="text-xs text-slate-600">
              {isValid
                ? t.package.validPackage
                : blockingCount > 0
                ? `${blockingCount} ${t.summary.blockingWarning}`
                : t.package.invalidPackage}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1 w-full sm:w-auto">
          <Button variant="primary" disabled className="w-full sm:w-auto cursor-not-allowed">
            <span>{t.package.generateBtn}</span>
          </Button>
          <span className="text-[11px] text-slate-400 italic">
            {t.package.disabledNotice}
          </span>
        </div>
      </div>
    </Card>
  );
};
