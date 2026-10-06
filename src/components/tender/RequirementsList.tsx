import React, { useState } from 'react';
import { Requirement, UploadedDocument, DocumentStatus } from '@/types';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { evaluateRequirementStatus, getAvailableDocuments } from '@/features/documents/documentUtils';
import { StatusSummary } from './StatusSummary';
import { FileText, Clock, Calendar, XCircle } from 'lucide-react';

interface RequirementsListProps {
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>; // requirementId -> documentId
  expiryDates: Record<string, string>; // requirementId -> YYYY-MM-DD
  submissionDeadline?: string;
  onMatch: (requirementId: string, documentId: string) => void;
  onUnmatch: (requirementId: string) => void;
  onSetExpiryDate: (requirementId: string, dateString: string) => void;
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  documents,
  matches,
  expiryDates,
  submissionDeadline,
  onMatch,
  onUnmatch,
  onSetExpiryDate,
}) => {
  const { language, t } = useI18n();
  const [changingReqId, setChangingReqId] = useState<string | null>(null);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t.requirements.checklistTitle}</h3>
          <p className="text-xs text-slate-500">
            Match uploaded PDF files to requirements and enter required document expiry dates.
          </p>
        </div>
      </div>

      {/* Real-time Status Summary Header */}
      <StatusSummary
        requirements={requirements}
        documents={documents}
        matches={matches}
        expiryDates={expiryDates}
        submissionDeadline={submissionDeadline}
      />

      {/* Requirements Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <th className="py-3 px-3 w-10 text-center">{t.requirements.order}</th>
              <th className="py-3 px-4 min-w-[200px]">{t.requirements.docName}</th>
              <th className="py-3 px-3 text-center w-24">{t.requirements.mandatory}</th>
              <th className="py-3 px-3 text-center w-32">{t.requirements.expiry}</th>
              <th className="py-3 px-4 text-center w-36">{t.requirements.status}</th>
              <th className="py-3 px-4 min-w-[280px]">{t.requirements.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requirements.map((req) => {
              const matchedDocId = matches[req.id];
              const matchedDoc = documents.find((d) => d.id === matchedDocId);
              const expiryDate = expiryDates[req.id] || '';

              const status: DocumentStatus = evaluateRequirementStatus({
                requirement: req,
                matchedDocument: matchedDoc,
                expiryDate,
                submissionDeadline,
              });

              const title = language === 'bn' ? req.title_bn : req.title_en;
              const availableDocs = getAvailableDocuments(documents, matches, req.id);
              const isChanging = changingReqId === req.id;

              return (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Order */}
                  <td className="py-3.5 px-3 text-center font-mono text-xs font-semibold text-slate-500">
                    {req.order}
                  </td>

                  {/* Document Title */}
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div>{title}</div>
                  </td>

                  {/* Mandatory / Optional */}
                  <td className="py-3.5 px-3 text-center">
                    {req.mandatory ? (
                      <Badge variant="danger">{t.requirements.mandatoryBadge}</Badge>
                    ) : (
                      <Badge variant="neutral">{t.requirements.optionalBadge}</Badge>
                    )}
                  </td>

                  {/* Expiry Required Indicator */}
                  <td className="py-3.5 px-3 text-center text-xs text-slate-500">
                    {req.has_expiry ? (
                      <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{t.requirements.expiryRequired}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">{t.requirements.noExpiry}</span>
                    )}
                  </td>

                  {/* Real-time Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <Badge status={status}>{t.status[status]}</Badge>
                  </td>

                  {/* File Match Selection & Expiry Input */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-2">
                      {/* File Match Control */}
                      {!matchedDoc || isChanging ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={matchedDocId || ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                onMatch(req.id, e.target.value);
                                setChangingReqId(null);
                              }
                            }}
                            className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                          >
                            <option value="">-- {t.requirements.selectFilePlaceholder} --</option>
                            {availableDocs.map((doc) => (
                              <option key={doc.id} value={doc.id}>
                                {doc.fileName} ({doc.pageCount} {t.documents.pages})
                              </option>
                            ))}
                          </select>
                          {isChanging && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setChangingReqId(null)}
                              className="text-slate-400 hover:text-slate-600 px-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50/60 border border-blue-200/80 rounded-md px-2.5 py-1.5 text-xs">
                          <span className="flex items-center space-x-1.5 font-medium text-blue-900 truncate max-w-[180px]">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate" title={matchedDoc.fileName}>
                              {matchedDoc.fileName}
                            </span>
                          </span>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setChangingReqId(req.id)}
                              className="text-blue-700 hover:text-blue-900 hover:underline font-medium text-[11px] px-1"
                            >
                              {t.requirements.changeMatch}
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                onUnmatch(req.id);
                                setChangingReqId(null);
                              }}
                              className="text-rose-600 hover:text-rose-800 hover:underline font-medium text-[11px] px-1"
                            >
                              {t.requirements.unmatch}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expiry Date Input (Only shown if matched AND requirement.has_expiry === true) */}
                      {matchedDoc && req.has_expiry && (
                        <div className="flex items-center space-x-2 pt-1">
                          <label className="text-xs text-slate-600 flex items-center space-x-1 shrink-0 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t.requirements.expiryDateLabel}:</span>
                          </label>
                          <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => onSetExpiryDate(req.id, e.target.value)}
                            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
