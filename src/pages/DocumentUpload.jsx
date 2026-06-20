import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { mockDocuments } from '../data/mockData';

export default function DocumentUpload() {
  const [docType, setDocType] = useState('lab_report');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    const valid = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
    if (!valid.includes(file.type)) {
      setUploadState('error');
      return;
    }
    setSelectedFile(file);
    setUploadState('idle');
    setConfirmed(false);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploadState('uploading');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setUploadState('done'); return 100; }
        return prev + 12;
      });
    }, 180);
  };

  const result = mockDocuments[0];

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Document Upload</h1>
          <p className="text-[#3e4850] text-sm mt-1">Upload prescriptions and lab reports. OCR will extract the text automatically.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Upload */}
          <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Upload Document</h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { val: 'prescription', icon: 'medical_information', label: 'Prescription' },
                { val: 'lab_report', icon: 'biotech', label: 'Lab Report' },
              ].map(t => (
                <button
                  key={t.val}
                  onClick={() => setDocType(t.val)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    docType === t.val ? 'border-[#0ea5e9] bg-[#bae6fd]/20' : 'border-[#bec8d2]/50 bg-[#f0f4fa] hover:border-[#0ea5e9]/40'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${docType === t.val ? 'text-[#006591]' : 'text-[#3e4850]'}`}>{t.icon}</span>
                  <span className="font-semibold text-sm text-[#171c20]">{t.label}</span>
                </button>
              ))}
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? 'border-[#006591] bg-[#006591]/5' : 'border-[#bec8d2] bg-[#f0f4fa] hover:border-[#006591]/50'
              }`}
            >
              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[#006591] text-4xl">description</span>
                  <p className="font-semibold text-[#171c20] text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-[#3e4850]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[#006591] text-5xl mb-3 block">cloud_upload</span>
                  <p className="font-semibold text-[#171c20] text-sm mb-1">Drag and drop your document here</p>
                  <p className="text-xs text-[#3e4850] mb-2">or click to browse files</p>
                  <p className="text-xs text-[#6e7881]">Accepted formats: PNG, JPG, JPEG, PDF</p>
                </>
              )}
            </div>

            {uploadState === 'error' && (
              <div className="mt-3 flex items-center gap-2 bg-[#ffdad6] text-[#93000a] rounded-lg px-4 py-3 text-sm">
                <span className="material-symbols-outlined text-lg">error</span>
                Invalid file format. Please upload PNG, JPG, JPEG, or PDF files.
              </div>
            )}

            {uploadState === 'uploading' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#3e4850] mb-1">
                  <span>Extracting text...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-[#f0f4fa] rounded-full h-2">
                  <div className="bg-[#0ea5e9] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadState === 'uploading'}
              className="mt-4 w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">upload_file</span>
              Upload & Extract Text
            </button>

            {/* Previous documents */}
            <div className="mt-6">
              <h3 className="font-bold text-[#171c20] text-sm mb-3">Previous Documents</h3>
              <div className="space-y-2">
                {mockDocuments.map(doc => (
                  <div key={doc.doc_id} className="flex items-center gap-3 p-3 bg-[#f0f4fa] rounded-xl border border-[#bec8d2]/30">
                    <span className="material-symbols-outlined text-[#006591] text-lg">description</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#171c20] truncate">{doc.file_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full capitalize">{doc.doc_type.replace('_', ' ')}</span>
                        <span className="text-xs text-[#3e4850]">{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {doc.is_confirmed && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Confirmed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Extracted text */}
          <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Extracted Text</h2>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-3 py-1 rounded-full font-medium capitalize">{result.doc_type.replace('_', ' ')}</span>
              <span className="text-xs text-[#3e4850]">{result.file_name}</span>
            </div>

            <div className="bg-[#f0f4fa] border border-[#bec8d2]/30 rounded-xl p-5 mb-4 min-h-[180px]">
              <p className="font-mono text-sm text-[#171c20] leading-relaxed whitespace-pre-wrap">{result.extracted_text}</p>
            </div>

            {/* OCR confidence */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm text-[#3e4850]">OCR Confidence:</span>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                High
              </span>
            </div>

            {confirmed ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                Document saved to your health records.
              </div>
            ) : (
              <button
                onClick={() => setConfirmed(true)}
                className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors text-sm flex items-center justify-center gap-2 mb-4"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                Confirm & Save to EHR
              </button>
            )}

            {/* Lab markers */}
            <div className="bg-[#bae6fd]/20 rounded-xl p-4 border border-[#bae6fd]/50">
              <p className="text-xs font-semibold text-[#3d687c] mb-3">Detected Markers</p>
              <div className="space-y-2">
                {[
                  { label: 'CA 15-3', value: '28 U/mL', status: 'normal', ref: 'Normal <30' },
                  { label: 'Estrogen Receptor', value: 'Positive', status: 'flag', ref: '' },
                  { label: 'CBC', value: 'Normal', status: 'normal', ref: '' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between text-xs">
                    <span className="text-[#3e4850] font-medium">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#171c20]">{m.value}</span>
                      {m.ref && <span className="text-[#3e4850]/60">{m.ref}</span>}
                      <span className={`w-2 h-2 rounded-full ${m.status === 'normal' ? 'bg-green-500' : 'bg-[#de8712]'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
