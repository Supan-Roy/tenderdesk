import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TenderInfo } from '@/types';
import { useI18n } from '@/i18n';
import { formatDate } from '@/utils/formatters';
import { Building2, Calendar, UserCheck, FileText, Upload } from 'lucide-react';

interface TenderHeaderCardProps {
  tender: TenderInfo;
  requirementsCount: number;
  onChangeJson?: () => void;
}

export const TenderHeaderCard: React.FC<TenderHeaderCardProps> = ({
  tender,
  requirementsCount,
  onChangeJson,
}) => {
  const { t } = useI18n();

  return (
    <Card className="mb-6 bg-slate-900 text-white border-slate-800 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 mb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-400/30">
              {tender.tender_id}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {t.tenderDetails.totalRequirements}: {requirementsCount} {t.tenderDetails.documentsCount}
              </span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">{tender.title}</h2>
        </div>

        {onChangeJson && (
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeJson}
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 shrink-0"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            {t.tenderDetails.changeJsonBtn}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
        <div className="flex items-start space-x-2.5">
          <Building2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.tenderDetails.procuringEntity}</p>
            <p className="text-white font-medium">{tender.procuring_entity}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5">
          <UserCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.tenderDetails.bidderName}</p>
            <p className="text-white font-medium">{tender.bidder || '-'}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5">
          <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.tenderDetails.submissionDeadline}</p>
            <p className="text-white font-semibold">{formatDate(tender.submission_deadline)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
