import React from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UploadCloud, FileCheck } from 'lucide-react';

interface DocumentUploaderProps {
  onFilesSelect?: (files: FileList) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = () => {
  const { t } = useI18n();

  return (
    <Card className="mb-6">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3 border border-blue-100">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 mb-1">{t.documents.uploadAreaTitle}</h4>
        <p className="text-xs text-slate-500 mb-4">{t.documents.uploadAreaSubtitle}</p>
        <div className="inline-flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FileCheck className="w-4 h-4 mr-1.5 text-blue-600" />
            {t.documents.browseBtn}
          </Button>
        </div>
      </div>
    </Card>
  );
};
