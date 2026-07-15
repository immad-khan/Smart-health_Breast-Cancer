import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

const API_BASE = 'http://127.0.0.1:8002';

const DOC_TYPES = [
  {
    val: 'prescription',
    icon: 'medical_information',
    label: 'Prescription',
    hint: 'Upload a photo of a handwritten or printed prescription',
    accept: '.png,.jpg,.jpeg,.bmp,.tiff',
  },
  {
    val: 'lab_report',
    icon: 'biotech',
    label: 'Lab Report',
    hint: 'Upload a printed lab report image',
    accept: '.png,.jpg,.jpeg,.bmp,.tiff',
  },
];

function StatusBadge({ status }) {
  const map = {
    idle: null,
    uploading: { bg: 'bg-[#bae6fd]', text: 'text-[#006591]', icon: 'sync', label: 'Processing…' },
    done: { bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle', label: 'Extracted' },
    error: { bg: 'bg-[#ffdad6]', text: 'text-[#93000a]', icon: 'error', label: 'Failed' },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`material-symbols-outlined text-sm ${status === 'uploading' ? 'animate-spin' : ''}`}>{s.icon}</span>
      {s.label}
    </span>
  );
}

export default function DocumentUpload() {
  const [docType, setDocType] = useState('prescription');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ocrResult, setOcrResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('raw');
  const fileRef = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/ocr/documents`)
      .then(r => r.json())
      .then(d => setHistory(d.documents || []))
      .catch(() => {});
  }, [ocrResult]);

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const validExts = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif'];
    if (!validExts.includes(ext)) {
      setUploadState('error');
      setErrorMsg('Invalid file format. Please upload a valid image (PNG, JPG, BMP, TIFF).');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadState('idle');
    setOcrResult(null);
    setConfirmed(false);
    setErrorMsg('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadState('uploading');
    setOcrResult(null);
    setErrorMsg('');
    setConfirmed(false);

    const form = new FormData();
    form.append('file', selectedFile);
    form.append('doc_type', docType);

    try {
      const res = await fetch(`${API_BASE}/ocr/upload`, { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }
      const data = await res.json();
      setOcrResult(data);
      setUploadState('done');
      setActiveTab('raw');
    } catch (e) {
      setUploadState('error');
      setErrorMsg(e.message);
    }
  };

  const currentType = DOC_TYPES.find(d => d.val === docType);
  const meds = ocrResult?.structured_data?.medications || [];
  const tests = ocrResult?.structured_data?.tests || [];

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Prescription &amp; Report Digitization
          </h1>
          <p className="text-[#3e4850] text-sm mt-1">
            Upload a prescription or lab report image — our clinical AI will extract and store the content in your EHR.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* ── Left: upload panel ─── */}
          <div className="lg:col-span-5 space-y-4">

            {/* Document type selector */}
            <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-5">
              <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-3">Document Type</p>
              <div className="grid grid-cols-2 gap-3">
                {DOC_TYPES.map(t => (
                  <button
                    key={t.val}
                    onClick={() => {
                      setDocType(t.val);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setOcrResult(null);
                      setUploadState('idle');
                      setErrorMsg('');
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                      docType === t.val
                        ? 'border-[#006591] bg-[#bae6fd]/20'
                        : 'border-[#bec8d2]/50 bg-[#f0f4fa] hover:border-[#006591]/40'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${docType === t.val ? 'text-[#006591]' : 'text-[#3e4850]'}`}>
                      {t.icon}
                    </span>
                    <span className={`font-semibold text-sm ${docType === t.val ? 'text-[#006591]' : 'text-[#171c20]'}`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#3e4850] mt-3 text-center">{currentType.hint}</p>
            </div>

            {/* Drop zone */}
            <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-5">
              <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-3">Upload Image</p>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-[#006591] bg-[#006591]/5' : 'border-[#bec8d2] bg-[#f0f4fa] hover:border-[#006591]/50'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept={currentType.accept}
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-40 rounded-lg object-contain border border-[#bec8d2]/40 shadow-sm"
                    />
                    <div className="text-center">
                      <p className="font-semibold text-[#171c20] text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-xs text-[#3e4850]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setOcrResult(null);
                        setUploadState('idle');
                        setErrorMsg('');
                      }}
                      className="text-xs text-[#ba1a1a] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[#006591] text-5xl mb-3 block">cloud_upload</span>
                    <p className="font-semibold text-[#171c20] text-sm mb-1">Drag &amp; drop image here</p>
                    <p className="text-xs text-[#3e4850] mb-1">or click to browse</p>
                    <p className="text-xs text-[#6e7881]">PNG, JPG, JPEG, BMP, TIFF</p>
                  </>
                )}
              </div>

              {/* Error message */}
              {uploadState === 'error' && (
                <div className="mt-3 flex items-start gap-2 bg-[#ffdad6] text-[#93000a] rounded-xl px-4 py-3 text-sm">
                  <span className="material-symbols-outlined text-lg flex-shrink-0 mt-0.5">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Digitize button */}
              <button
                id="btn-digitize"
                onClick={handleUpload}
                disabled={!selectedFile || uploadState === 'uploading'}
                className="mt-4 w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {uploadState === 'uploading' ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    Extracting Text…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">document_scanner</span>
                    Digitize
                  </>
                )}
              </button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-[#171c20] text-sm mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Previously Digitized
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {history.map((doc, idx) => (
                    <div key={doc.id ?? idx} className="flex items-center gap-3 p-3 bg-[#f0f4fa] rounded-xl border border-[#bec8d2]/30">
                      <span className="material-symbols-outlined text-[#006591] text-lg">
                        {doc.doc_type === 'prescription' ? 'medical_information' : 'biotech'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#171c20] truncate">{doc.filename || 'Untitled'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full capitalize">
                            {doc.doc_type.replace('_', ' ')}
                          </span>
                          {doc.created_at && (
                            <span className="text-xs text-[#3e4850]">
                              {new Date(doc.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Saved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: review panel ─── */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Extracted Content
                </h2>
                <StatusBadge status={uploadState} />
              </div>

              {/* Empty state */}
              {!ocrResult && uploadState !== 'uploading' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-20 h-20 bg-[#f0f4fa] rounded-2xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[#006591]/40 text-4xl">document_scanner</span>
                  </div>
                  <p className="text-[#3e4850] text-sm font-medium">No document digitized yet</p>
                  <p className="text-xs text-[#3e4850]/60 mt-1 max-w-xs">
                    Select a document type, upload an image, then click <strong>Digitize</strong>.
                  </p>
                </div>
              )}

              {/* Loading state */}
              {uploadState === 'uploading' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-[#bae6fd]" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#006591] animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[#171c20] text-sm mb-1">Clinical AI Reading Document…</p>
                    <p className="text-xs text-[#3e4850]">Sending to Llama 4 Scout vision model for extraction</p>
                  </div>
                  <div className="w-64 bg-[#f0f4fa] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#006591] h-full rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                </div>
              )}

              {/* Result */}
              {ocrResult && uploadState === 'done' && (
                <div className="flex flex-col flex-1">
                  {/* Quality warning (non-blocking) */}
                  {ocrResult.quality_warning && (
                    <div className="mb-4 flex items-center gap-2 bg-[#ffdcbd] text-[#6d3a00] rounded-xl px-4 py-3 text-sm">
                      <span className="material-symbols-outlined text-lg">warning</span>
                      {ocrResult.quality_warning}
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="flex border-b border-[#bec8d2]/30 mb-4 -mx-1">
                    {[
                      { key: 'raw', label: 'Raw Text', icon: 'notes' },
                      {
                        key: 'structured',
                        label: docType === 'prescription' ? 'Medications' : 'Test Results',
                        icon: docType === 'prescription' ? 'medication' : 'science',
                      },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all ${
                          activeTab === tab.key
                            ? 'text-[#006591] border-b-2 border-[#006591] bg-[#bae6fd]/10'
                            : 'text-[#3e4850] hover:bg-[#f0f4fa]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Raw text */}
                  {activeTab === 'raw' && (
                    <div className="bg-[#f0f4fa] border border-[#bec8d2]/30 rounded-xl p-5 min-h-[200px] mb-4 flex-1 overflow-auto">
                      <p className="font-mono text-sm text-[#171c20] leading-relaxed whitespace-pre-wrap">
                        {ocrResult.raw_text}
                      </p>
                    </div>
                  )}

                  {/* Structured */}
                  {activeTab === 'structured' && (
                    <div className="mb-4 flex-1">
                      {docType === 'prescription' ? (
                        <>
                          {ocrResult.structured_data?.summary && (
                            <div className="bg-[#f6faff] rounded-xl p-4 border border-[#bae6fd] mb-4 flex items-start gap-3">
                              <span className="material-symbols-outlined text-[#006591] text-lg mt-0.5">summarize</span>
                              <div>
                                <p className="text-xs font-semibold text-[#006591] uppercase tracking-wide mb-1">AI Summary</p>
                                <p className="text-sm text-[#171c20] leading-relaxed">{ocrResult.structured_data.summary}</p>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                              { label: 'Doctor', val: ocrResult.structured_data?.doctor_name || '—', icon: 'person' },
                              { label: 'Date', val: ocrResult.structured_data?.date || '—', icon: 'calendar_today' },
                            ].map(m => (
                              <div key={m.label} className="bg-[#f0f4fa] rounded-xl p-3 border border-[#bec8d2]/30">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="material-symbols-outlined text-[#006591] text-sm">{m.icon}</span>
                                  <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide">{m.label}</p>
                                </div>
                                <p className="text-sm text-[#171c20] font-medium">{m.val}</p>
                              </div>
                            ))}
                          </div>

                          {meds.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl border border-[#bec8d2]/30">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-[#f0f4fa] text-[#3e4850] uppercase tracking-wide">
                                    {['Medication', 'Dosage', 'Frequency', 'Duration'].map(h => (
                                      <th key={h} className="text-left px-4 py-2 font-semibold">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {meds.map((m, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f6faff]'}>
                                      <td className="px-4 py-2.5 font-medium text-[#171c20]">{m.name || '—'}</td>
                                      <td className="px-4 py-2.5 text-[#3e4850]">{m.dosage || '—'}</td>
                                      <td className="px-4 py-2.5 text-[#3e4850]">{m.frequency || '—'}</td>
                                      <td className="px-4 py-2.5 text-[#3e4850]">{m.duration || '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-sm text-[#3e4850] italic text-center py-6">No structured medications detected.</p>
                          )}
                        </>
                      ) : (
                        <>
                          {ocrResult.structured_data?.lab_name && (
                            <div className="bg-[#f0f4fa] rounded-xl p-3 border border-[#bec8d2]/30 mb-4 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#006591] text-sm">business</span>
                              <p className="text-sm text-[#171c20] font-medium">{ocrResult.structured_data.lab_name}</p>
                            </div>
                          )}

                          {tests.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl border border-[#bec8d2]/30">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-[#f0f4fa] text-[#3e4850] uppercase tracking-wide">
                                    {['Test', 'Value', 'Unit', 'Reference'].map(h => (
                                      <th key={h} className="text-left px-4 py-2 font-semibold">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {tests.map((t, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f6faff]'}>
                                      <td className="px-4 py-2.5 font-medium text-[#171c20]">{t.test_name || '—'}</td>
                                      <td className="px-4 py-2.5 text-[#3e4850] font-semibold">{t.value || '—'}</td>
                                      <td className="px-4 py-2.5 text-[#3e4850]">{t.unit || '—'}</td>
                                      <td className="px-4 py-2.5 text-[#3e4850]/70">{t.reference_range || '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-sm text-[#3e4850] italic text-center py-6">No structured test results detected.</p>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Confirm & save (TC21) */}
                  <div className="pt-4 border-t border-[#bec8d2]/30 mt-auto">
                    {confirmed ? (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 text-sm">
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                        <div>
                          <p className="font-semibold">Saved to your Electronic Health Record</p>
                          {ocrResult.document_id && (
                            <p className="text-xs text-green-600 mt-0.5">Document ID: {ocrResult.document_id}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        id="btn-confirm-ehr"
                        onClick={() => setConfirmed(true)}
                        className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">save</span>
                        Confirm &amp; Save to EHR
                      </button>
                    )}
                    <p className="text-xs text-[#3e4850]/60 text-center mt-3 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Securely stored in your encrypted health record
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
