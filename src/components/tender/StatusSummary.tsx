import React from 'react';
import { Requirement, UploadedDocument, DocumentStatus } from '@/types';
import { useI18n } from '@/i18n';
import { evaluateRequirementStatus, isBlockingStatus } from '@/features/documents/documentUtils';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, CheckCircle2, CheckSquare } from 'lucide-react';

interface StatusSummaryProps {
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>;
  expiryDates: Record<string, string>;
  submissionDeadline?: string;
}

export const StatusSummary: React.FC<StatusSummaryProps> = ({
  requirements,
  documents,
  matches,
  expiryDates,
  submissionDeadline,
}) => {
  const { t } = useI18n();

  const counts: Record<DocumentStatus, number> = {
    OK: 0,
    MISSING: 0,
    EXPIRY_NEEDED: 0,
    EXPIRED: 0,
    NOT_PROVIDED: 0,
  };

  let blockingCount = 0;

  for (const req of requirements) {
    const matchedDocId = matches[req.id];
    const matchedDoc = documents.find((d) => d.id === matchedDocId);
    const expiryDate = expiryDates[req.id] || '';

    const status = evaluateRequirementStatus({
      requirement: req,
      matchedDocument: matchedDoc,
      expiryDate,
      submissionDeadline,
    });

    counts[status] = (counts[status] || 0) + 1;

    if (isBlockingStatus(status)) {
      blockingCount++;
    }
  }

  const completionPercent = Math.round((counts.OK / (requirements.length || 1)) * 100);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 mb-5 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        {/* Status Count Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 mr-2 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>{requirements.length} {t.summary.totalDocs}</span>
          </div>

          <Badge status="OK" className="space-x-1 py-1 px-2.5">
            <span>🟢 {counts.OK} {t.status.OK}</span>
          </Badge>

          {counts.MISSING > 0 && (
            <Badge status="MISSING" className="space-x-1 py-1 px-2.5">
              <span>🔴 {counts.MISSING} {t.status.MISSING}</span>
            </Badge>
          )}

          {counts.EXPIRY_NEEDED > 0 && (
            <Badge status="EXPIRY_NEEDED" className="space-x-1 py-1 px-2.5">
              <span>🟡 {counts.EXPIRY_NEEDED} {t.status.EXPIRY_NEEDED}</span>
            </Badge>
          )}

          {counts.EXPIRED > 0 && (
            <Badge status="EXPIRED" className="space-x-1 py-1 px-2.5">
              <span>🔴 {counts.EXPIRED} {t.status.EXPIRED}</span>
            </Badge>
          )}

          {counts.NOT_PROVIDED > 0 && (
            <Badge status="NOT_PROVIDED" className="space-x-1 py-1 px-2.5">
              <span>⚪ {counts.NOT_PROVIDED} {t.status.NOT_PROVIDED}</span>
            </Badge>
          )}
        </div>

        {/* Blocking Issue Indicator */}
        <div>
          {blockingCount > 0 ? (
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-rose-800 bg-rose-50 px-3.5 py-1.5 rounded-lg border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>{blockingCount}</strong> {t.summary.blockingWarning}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.summary.allValid}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
        <div
          className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
    </div>
  );
};
