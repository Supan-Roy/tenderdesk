import React from 'react';
import { UploadedDocument, Requirement } from '@/types';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/utils/formatters';
import { MAX_FILE_COUNT, MAX_TOTAL_SIZE_BYTES, calculateTotalBytes } from '@/features/documents/documentUtils';
import { FileText, Trash2, Layers, HardDrive, Files, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DocumentListProps {
  documents: UploadedDocument[];
  requirements?: Requirement[];
  matches?: Record<string, string>; // requirementId -> documentId
  onRemoveDocument: (id: string) => void;
  onClearAll?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  requirements = [],
  matches = {},
  onRemoveDocument,
  onClearAll,
}) => {
  const { language, t } = useI18n();

  const totalBytes = calculateTotalBytes(documents);
  const totalMbFormatted = (totalBytes / (1024 * 1024)).toFixed(1);
  const maxMb = (MAX_TOTAL_SIZE_BYTES / (1024 * 1024)).toFixed(0);

  // Helper map: documentId -> Requirement
  const docMatchMap = new Map<string, Requirement>();
  for (const [reqId, docId] of Object.entries(matches)) {
    const req = requirements.find((r) => r.id === reqId);
    if (req) {
      docMatchMap.set(docId, req);
    }
  }

  return (
    <Card className="mb-6">
      {/* Upload Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-4 gap-3">
        <div>
          <h4 className="text-base font-semibold text-slate-800">
            {t.documents.uploadedCount} ({documents.length})
          </h4>
          <p className="text-xs text-slate-500">
            Local PDF files ready for verification and packaging.
          </p>
        </div>

        {/* Upload Limits Summary Bar */}
        <div className="flex items-center space-x-4 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-xs">
          <div className="flex items-center space-x-1 text-slate-700">
            <Files className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">{t.documents.filesCount}:</span>
            <span className="font-semibold text-slate-900">
              {documents.length} / {MAX_FILE_COUNT}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200" />

          <div className="flex items-center space-x-1 text-slate-700">
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">{t.documents.totalSize}:</span>
            <span className="font-semibold text-slate-900">
              {totalMbFormatted} MB / {maxMb} MB
            </span>
          </div>

          {documents.length > 0 && onClearAll && (
            <>
              <div className="h-3 w-px bg-slate-200" />
              <button
                type="button"
                onClick={onClearAll}
                className="text-rose-600 hover:text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                {t.documents.removeAll}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs italic">
          {t.documents.noFilesUploaded}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const matchedReq = docMatchMap.get(doc.id);
            const reqTitle = matchedReq
              ? language === 'bn'
                ? matchedReq.title_bn
                : matchedReq.title_en
              : null;

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-slate-900 truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 font-medium text-slate-700">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {doc.pageCount} {t.documents.pages}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {/* Match Indicator Badge */}
                  {matchedReq ? (
                    <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t.documents.matchedTo}: {reqTitle}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200 font-medium">
                      <span>{t.documents.unmatched}</span>
                    </span>
                  )}

                  {/* Duplicate Placeholder Badge */}
                  {doc.isDuplicate && (
                    <Badge variant="warning" className="flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{t.documents.duplicate}</span>
                    </Badge>
                  )}

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveDocument(doc.id)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title={t.documents.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
