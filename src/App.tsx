import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useI18n } from '@/i18n';
import { useTenderDesk } from '@/hooks/useTenderDesk';
import { TenderHeaderCard } from '@/components/tender/TenderHeaderCard';
import { RequirementsList } from '@/components/tender/RequirementsList';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { DocumentList } from '@/components/documents/DocumentList';
import { PackageActions } from '@/components/package/PackageActions';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileCode, FileUp, CheckCircle2, ArrowRight, Sparkles, RefreshCw, Upload, Download, Wand2 } from 'lucide-react';
import { downloadChecklistCsv } from '@/features/tender/exporter';
import { saveToLocalStorage, exportProjectState } from '@/features/tender/projectSerializer';

export const AppContent: React.FC = () => {
  const { t } = useI18n();
  const {
    tender,
    requirements,
    documents,
    matches,
    expiryDates,
    isInspectingPdf,
    isGeneratingPackage,
    errorMessage,
    infoMessage,
    blockingIssueCount,
    isWorkspaceValid,
    clearError,
    clearInfo,
    loadSampleData,
    handleJsonFileSelect,
    handlePdfFilesSelect,
    handleMatchDocument,
    handleUnmatchDocument,
    handleAutoMatch,
    handleSetExpiryDate,
    handleRemoveDocument,
    handleClearAllDocuments,
    handleGeneratePackage,
    resetAll,
  } = useTenderDesk();

  const mainJsonInputRef = useRef<HTMLInputElement>(null);

  const handleMainJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleJsonFileSelect(e.target.files[0]);
      if (mainJsonInputRef.current) mainJsonInputRef.current.value = '';
    }
  };

  const handleExportCsv = () => {
    if (tender) {
      downloadChecklistCsv({ tender, requirements, documents, matches, expiryDates });
    }
  };

  const handleSaveProject = () => {
    if (tender) {
      saveToLocalStorage({ tender, requirements, documents, matches, expiryDates });
      const jsonStr = exportProjectState({ tender, requirements, documents, matches, expiryDates });
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tender.tender_id}_ProjectState.json`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans">
      <Header />

      {/* Hidden Global JSON Input for Main Action Buttons */}
      <input
        type="file"
        ref={mainJsonInputRef}
        onChange={handleMainJsonChange}
        accept="application/json,.json"
        className="hidden"
        id="global-json-file-input"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error / Alert Banners */}
        {errorMessage && (
          <div className="mb-6">
            <Alert variant="danger" title="Action Failed" onDismiss={clearError}>
              {errorMessage}
            </Alert>
          </div>
        )}

        {infoMessage && (
          <div className="mb-6">
            <Alert variant="info" onDismiss={clearInfo}>
              {infoMessage}
            </Alert>
          </div>
        )}

        {/* Workflow Step Indicator Bar */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-xl border flex items-center space-x-3.5 transition-all ${
              tender
                ? 'bg-white border-blue-200/90 text-blue-950 shadow-2xs'
                : 'bg-slate-100/70 border-slate-200/80 text-slate-500'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                tender ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.steps.loadRequirements}</p>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {tender ? `${tender.tender_id} (${requirements.length} reqs)` : 'No requirements JSON loaded'}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center space-x-3.5 transition-all ${
              documents.length > 0
                ? 'bg-white border-blue-200/90 text-blue-950 shadow-2xs'
                : 'bg-slate-100/70 border-slate-200/80 text-slate-500'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                documents.length > 0
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.steps.uploadDocuments}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{documents.length} PDF files uploaded</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center space-x-3.5 transition-all ${
              isWorkspaceValid
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-2xs'
                : 'bg-slate-100/70 border-slate-200/80 text-slate-500'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                isWorkspaceValid ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.steps.verifyPackage}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isWorkspaceValid ? 'Ready to Package' : `${blockingIssueCount} issue(s) remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Header Toolbar */}
        {tender && (
          <div className="flex flex-wrap items-center justify-between mb-5 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Tender Workspace</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoMatch}
                className="text-blue-700 bg-blue-50/60 border-blue-200/80 hover:bg-blue-100/60 cursor-pointer text-xs font-semibold"
                title="Auto-match documents based on filenames"
              >
                <Wand2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Auto Match
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className="text-slate-700 bg-white border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                title="Export requirement checklist to CSV"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveProject}
                className="text-slate-700 bg-white border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                title="Save project session JSON file"
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Save Session
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => mainJsonInputRef.current?.click()}
                className="text-slate-700 bg-white border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                {t.emptyState.uploadJsonBtn}
              </Button>

              <Button variant="ghost" size="sm" onClick={resetAll} className="text-slate-600 hover:text-slate-900 cursor-pointer text-xs font-medium">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Dashboard */}
        {!tender ? (
          /* Empty State View */
          <Card className="p-10 text-center max-w-3xl mx-auto shadow-xs border-slate-200 bg-white">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-blue-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2.5 tracking-tight">{t.emptyState.title}</h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-8 font-medium leading-relaxed">{t.emptyState.subtitle}</p>

            {/* Workflow Step Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center mb-2.5 shadow-2xs">
                  1
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{t.emptyState.step1Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-normal">{t.emptyState.step1Desc}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center mb-2.5 shadow-2xs">
                  2
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{t.emptyState.step2Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-normal">{t.emptyState.step2Desc}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center mb-2.5 shadow-2xs">
                  3
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{t.emptyState.step3Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-normal">{t.emptyState.step3Desc}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={() => mainJsonInputRef.current?.click()} className="cursor-pointer font-bold px-6 py-2.5">
                <Upload className="w-4 h-4 mr-2" />
                <span>{t.emptyState.uploadJsonBtn}</span>
              </Button>
              <Button variant="outline" onClick={loadSampleData} className="cursor-pointer font-bold px-6 py-2.5">
                <span>{t.emptyState.loadSampleBtn}</span>
                <ArrowRight className="w-4 h-4 ml-2 text-slate-400" />
              </Button>
            </div>
          </Card>
        ) : (
          /* Active Tender Loaded State */
          <div>
            <TenderHeaderCard
              tender={tender}
              requirementsCount={requirements.length}
              onChangeJson={() => mainJsonInputRef.current?.click()}
            />

            <RequirementsList
              requirements={requirements}
              documents={documents}
              matches={matches}
              expiryDates={expiryDates}
              submissionDeadline={tender.submission_deadline}
              onMatch={handleMatchDocument}
              onUnmatch={handleUnmatchDocument}
              onSetExpiryDate={handleSetExpiryDate}
            />

            <DocumentUploader
              onPdfSelect={handlePdfFilesSelect}
              onJsonSelect={handleJsonFileSelect}
              isInspectingPdf={isInspectingPdf}
              hasTender={!!tender}
            />

            <DocumentList
              documents={documents}
              requirements={requirements}
              matches={matches}
              onRemoveDocument={handleRemoveDocument}
              onClearAll={handleClearAllDocuments}
            />

            <PackageActions
              isValid={isWorkspaceValid}
              blockingCount={blockingIssueCount}
              isGenerating={isGeneratingPackage}
              onGeneratePackage={handleGeneratePackage}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return <AppContent />;
}

export default App;
