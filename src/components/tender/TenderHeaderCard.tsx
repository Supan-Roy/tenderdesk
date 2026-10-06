import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TenderInfo } from '@/types';
import { useI18n } from '@/i18n';
import { formatDate } from '@/utils/formatters';
import { Building2, Calendar, UserCheck, FileText, Upload, ShieldCheck } from 'lucide-react';

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
    <Card className="mb-6 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white border-slate-800/80 shadow-lg relative overflow-hidden">
      {/* Subtle background glow decorator */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 mb-5 gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-400/30 flex items-center space-x-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{tender.tender_id}</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium flex items-center space-x-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {t.tenderDetails.totalRequirements}: <strong className="text-white">{requirementsCount}</strong> {t.tenderDetails.documentsCount}
                </span>
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">{tender.title}</h2>
          </div>

          {onChangeJson && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeJson}
              className="border-slate-700 bg-slate-800/80 text-slate-100 hover:bg-slate-700/90 shrink-0 cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              {t.tenderDetails.changeJsonBtn}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t.tenderDetails.procuringEntity}</p>
              <p className="text-white font-semibold text-sm mt-0.5">{tender.procuring_entity}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t.tenderDetails.bidderName}</p>
              <p className="text-white font-semibold text-sm mt-0.5">{tender.bidder || '-'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t.tenderDetails.submissionDeadline}</p>
              <p className="text-amber-300 font-bold text-sm mt-0.5">{formatDate(tender.submission_deadline)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
