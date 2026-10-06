import React from 'react';
import { Requirement, UploadedDocument, DocumentStatus } from '@/types';
import { useI18n } from '@/i18n';
import { evaluateRequirementStatus, isBlockingStatus } from '@/features/documents/documentUtils';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

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

  // Calculate status counts
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

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Count Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 mr-1">
            {requirements.length} {t.summary.totalDocs}:
          </span>

          <Badge status="OK" className="space-x-1">
            <span>{counts.OK} {t.status.OK}</span>
          </Badge>

          {counts.MISSING > 0 && (
            <Badge status="MISSING" className="space-x-1">
              <span>{counts.MISSING} {t.status.MISSING}</span>
            </Badge>
          )}

          {counts.EXPIRY_NEEDED > 0 && (
            <Badge status="EXPIRY_NEEDED" className="space-x-1">
              <span>{counts.EXPIRY_NEEDED} {t.status.EXPIRY_NEEDED}</span>
            </Badge>
          )}

          {counts.EXPIRED > 0 && (
            <Badge status="EXPIRED" className="space-x-1">
              <span>{counts.EXPIRED} {t.status.EXPIRED}</span>
            </Badge>
          )}

          {counts.NOT_PROVIDED > 0 && (
            <Badge status="NOT_PROVIDED" className="space-x-1">
              <span>{counts.NOT_PROVIDED} {t.status.NOT_PROVIDED}</span>
            </Badge>
          )}
        </div>

        {/* Blocking Issue Indicator */}
        <div>
          {blockingCount > 0 ? (
            <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>{blockingCount}</strong> {t.summary.blockingWarning}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.summary.allValid}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
