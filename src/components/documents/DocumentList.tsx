import React from 'react';
import { UploadedDocument } from '@/types';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/utils/formatters';
import { FileText, Trash2, AlertTriangle, Layers } from 'lucide-react';

interface DocumentListProps {
  documents: UploadedDocument[];
  onRemoveDocument?: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const { t } = useI18n();

  if (documents.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <h4 className="text-sm font-semibold text-slate-800">{t.documents.uploadedCount} ({documents.length})</h4>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="font-medium text-slate-900 truncate">{doc.fileName}</p>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-slate-400" />
                    <span>{doc.pageCount} {t.documents.pages}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {doc.isDuplicate && (
                <Badge variant="warning" className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>{t.documents.duplicate}</span>
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
