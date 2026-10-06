import React, { useRef } from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UploadCloud, FileText, Loader2, FileCode } from 'lucide-react';

interface DocumentUploaderProps {
  onPdfSelect: (files: FileList | File[]) => void;
  onJsonSelect: (file: File) => void;
  isInspectingPdf?: boolean;
  hasTender?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onPdfSelect,
  onJsonSelect,
  isInspectingPdf = false,
  hasTender = false,
}) => {
  const { t } = useI18n();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handlePdfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onPdfSelect(e.target.files);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onJsonSelect(e.target.files[0]);
      if (jsonInputRef.current) jsonInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const jsonFile = files.find((f) => f.name.toLowerCase().endsWith('.json'));
      const pdfFiles = files.filter(
        (f) => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf'
      );

      if (jsonFile && !hasTender) {
        onJsonSelect(jsonFile);
      }
      if (pdfFiles.length > 0) {
        onPdfSelect(pdfFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card className="mb-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfInputChange}
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        id="pdf-upload-input"
      />
      <input
        type="file"
        ref={jsonInputRef}
        onChange={handleJsonInputChange}
        accept="application/json,.json"
        className="hidden"
        id="json-upload-input"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={() => pdfInputRef.current?.click()}
      >
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3 border border-blue-100">
          {isInspectingPdf ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <h4 className="text-base font-semibold text-slate-800 mb-1">
          {isInspectingPdf ? t.documents.inspecting : t.documents.uploadAreaTitle}
        </h4>
        <p className="text-xs text-slate-500 mb-4">{t.documents.uploadAreaSubtitle}</p>

        <div className="inline-flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => pdfInputRef.current?.click()}
            disabled={isInspectingPdf}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            {t.documents.browseBtn}
          </Button>

          {!hasTender && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => jsonInputRef.current?.click()}
            >
              <FileCode className="w-4 h-4 mr-1.5 text-blue-600" />
              {t.emptyState.uploadJsonBtn}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
