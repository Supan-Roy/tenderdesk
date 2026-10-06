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
import { FileCode, FileUp, CheckCircle, ArrowRight, Sparkles, RefreshCw, Upload } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { t } = useI18n();
  const {
    tender,
    requirements,
    documents,
    matches,
    expiryDates,
    isInspectingPdf,
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
    handleSetExpiryDate,
    handleRemoveDocument,
    handleClearAllDocuments,
    resetAll,
  } = useTenderDesk();

  const mainJsonInputRef = useRef<HTMLInputElement>(null);

  const handleMainJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleJsonFileSelect(e.target.files[0]);
      if (mainJsonInputRef.current) mainJsonInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            className={`p-3.5 rounded-lg border flex items-center space-x-3 transition-colors ${
              tender
                ? 'bg-white border-blue-200 text-blue-900 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <div className={`p-2 rounded-md ${tender ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">{t.steps.loadRequirements}</p>
              <p className="text-xs text-slate-500 truncate">
                {tender ? `${tender.tender_id} (${requirements.length} reqs)` : 'No requirements JSON loaded'}
              </p>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border flex items-center space-x-3 transition-colors ${
              documents.length > 0
                ? 'bg-white border-blue-200 text-blue-900 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <div
              className={`p-2 rounded-md ${
                documents.length > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">{t.steps.uploadDocuments}</p>
              <p className="text-xs text-slate-500">{documents.length} PDF files uploaded</p>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border flex items-center space-x-3 transition-colors ${
              isWorkspaceValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <div
              className={`p-2 rounded-md ${
                isWorkspaceValid ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">{t.steps.verifyPackage}</p>
              <p className="text-xs text-slate-500">
                {isWorkspaceValid ? 'Verification Complete' : `${blockingIssueCount} issue(s) remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Header Controls */}
        {tender && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Tender Workspace</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => mainJsonInputRef.current?.click()}
                className="text-slate-700 bg-white"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                {t.emptyState.uploadJsonBtn}
              </Button>
              <Button variant="ghost" size="sm" onClick={resetAll} className="text-slate-600">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Reset Workspace
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Dashboard */}
        {!tender ? (
          /* Empty State View */
          <Card className="p-10 text-center max-w-3xl mx-auto shadow-xs border-slate-200 bg-white">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t.emptyState.title}</h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-8">{t.emptyState.subtitle}</p>

            {/* Workflow Step Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">
                  1
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{t.emptyState.step1Title}</h4>
                <p className="text-xs text-slate-500">{t.emptyState.step1Desc}</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">
                  2
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{t.emptyState.step2Title}</h4>
                <p className="text-xs text-slate-500">{t.emptyState.step2Desc}</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">
                  3
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{t.emptyState.step3Title}</h4>
                <p className="text-xs text-slate-500">{t.emptyState.step3Desc}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={() => mainJsonInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                <span>{t.emptyState.uploadJsonBtn}</span>
              </Button>
              <Button variant="outline" onClick={loadSampleData}>
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

            <PackageActions isValid={isWorkspaceValid} blockingCount={blockingIssueCount} />
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
