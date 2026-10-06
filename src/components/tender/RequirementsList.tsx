import React from 'react';
import { Requirement, UploadedDocument } from '@/types';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, Clock } from 'lucide-react';

interface RequirementsListProps {
  requirements: Requirement[];
  documents?: UploadedDocument[];
  matches?: Record<string, string>; // requirementId -> documentId
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  documents = [],
  matches = {},
}) => {
  const { language, t } = useI18n();

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t.requirements.title}</h3>
          <p className="text-xs text-slate-500">
            Sorted document requirements list from specifications file.
          </p>
        </div>
        <Badge variant="neutral">{requirements.length} {t.tenderDetails.documentsCount}</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <th className="py-3 px-3 w-12 text-center">{t.requirements.order}</th>
              <th className="py-3 px-4">{t.requirements.docName}</th>
              <th className="py-3 px-3 text-center">{t.requirements.mandatory}</th>
              <th className="py-3 px-3 text-center">{t.requirements.expiry}</th>
              <th className="py-3 px-4 text-center">{t.requirements.status}</th>
              <th className="py-3 px-4">{t.requirements.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requirements.map((req) => {
              const matchedDocId = matches[req.id];
              const matchedDoc = documents.find((d) => d.id === matchedDocId);
              const title = language === 'bn' ? req.title_bn : req.title_en;

              return (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-mono text-xs font-semibold text-slate-500">
                    {req.order}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {title}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {req.mandatory ? (
                      <Badge variant="danger">{t.requirements.mandatoryBadge}</Badge>
                    ) : (
                      <Badge variant="neutral">{t.requirements.optionalBadge}</Badge>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-xs text-slate-500">
                    {req.has_expiry ? (
                      <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{t.requirements.expiryRequired}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">{t.requirements.noExpiry}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="neutral">{t.requirements.awaitingMatch}</Badge>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {matchedDoc ? (
                      <span className="inline-flex items-center space-x-1.5 text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[200px]">{matchedDoc.fileName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic font-normal">-</span>
                    )}
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
