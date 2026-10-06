import React from 'react';
import { Card } from '@/components/ui/Card';
import { TenderInfo } from '@/types';
import { useI18n } from '@/i18n';
import { formatDate } from '@/utils/formatters';
import { Building2, Calendar, UserCheck } from 'lucide-react';

interface TenderHeaderCardProps {
  tender: TenderInfo;
}

export const TenderHeaderCard: React.FC<TenderHeaderCardProps> = ({ tender }) => {
  const { t } = useI18n();

  return (
    <Card className="mb-6 bg-linear-to-r from-slate-900 to-slate-800 text-white border-none shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-700/80 mb-4 gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold tracking-wide border border-blue-400/30">
            {tender.tender_id}
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5">{tender.title}</h2>
        </div>
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
