import React from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, PackageCheck, AlertCircle, Loader2 } from 'lucide-react';

interface PackageActionsProps {
  isValid: boolean;
  blockingCount?: number;
  isGenerating?: boolean;
  onGeneratePackage?: () => void;
}

export const PackageActions: React.FC<PackageActionsProps> = ({
  isValid,
  blockingCount = 0,
  isGenerating = false,
  onGeneratePackage,
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

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            variant="primary"
            disabled={!isValid || isGenerating}
            onClick={onGeneratePackage}
            className="w-full sm:w-auto font-semibold shadow-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Compiling Package...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                <span>{t.package.generateBtn}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
