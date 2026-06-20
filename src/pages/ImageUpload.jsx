import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockImages } from '../data/mockData';

export default function ImageUpload() {
  const [imageType, setImageType] = useState('mammogram');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | done | error
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const handleFile = (file) => {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const name = file.name.toLowerCase();
    if (!validTypes.includes(file.type) && !name.endsWith('.dcm')) {
      setUploadState('error');
      return;
    }
    setSelectedFile(file);
    setUploadState('idle');
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    setUploadState('uploading');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('done');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const result = mockImages[0];

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Radiology Lab</h1>
          <p className="text-[#3e4850] text-sm mt-1">Upload mammogram or ultrasound images for AI-powered analysis.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Upload */}
          <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Upload Image</h2>

            {/* Image type selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { val: 'mammogram', icon: 'radiology', label: 'Mammogram' },
                { val: 'ultrasound', icon: 'water', label: 'Ultrasound' },
              ].map(t => (
                <button
                  key={t.val}
                  onClick={() => setImageType(t.val)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    imageType === t.val
                      ? 'border-[#0ea5e9] bg-[#bae6fd]/20'
                      : 'border-[#bec8d2]/50 bg-[#f0f4fa] hover:border-[#0ea5e9]/40'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${imageType === t.val ? 'text-[#006591]' : 'text-[#3e4850]'}`}>{t.icon}</span>
                  <span className="font-semibold text-sm text-[#171c20]">{t.label}</span>
                  {imageType === t.val && <span className="material-symbols-outlined text-[#006591] text-sm ml-auto">check_circle</span>}
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? 'border-[#006591] bg-[#006591]/5' : 'border-[#bec8d2] bg-[#f0f4fa] hover:border-[#006591]/50 hover:bg-[#006591]/5'
              }`}
            >
              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.dcm" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[#006591] text-4xl">check_circle</span>
                  <p className="font-semibold text-[#171c20] text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-[#3e4850]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[#006591] text-5xl mb-3 block">cloud_upload</span>
                  <p className="font-semibold text-[#171c20] text-sm mb-1">Drag and drop your image here</p>
                  <p className="text-xs text-[#3e4850] mb-2">or click to browse files</p>
                  <p className="text-xs text-[#6e7881]">Accepted formats: PNG, JPG, JPEG, DCM</p>
                </>
              )}
            </div>

            {/* Error */}
            {uploadState === 'error' && (
              <div className="mt-3 flex items-center gap-2 bg-[#ffdad6] text-[#93000a] rounded-lg px-4 py-3 text-sm">
                <span className="material-symbols-outlined text-lg">error</span>
                Invalid file format. Please upload PNG, JPG, JPEG, or DCM files.
              </div>
            )}

            {/* Progress bar */}
            {uploadState === 'uploading' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#3e4850] mb-1">
                  <span>Analyzing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-[#f0f4fa] rounded-full h-2">
                  <div
                    className="bg-[#0ea5e9] h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || uploadState === 'uploading'}
              className="mt-4 w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              Analyze Image
            </button>

            {/* Previous uploads */}
            <div className="mt-6">
              <h3 className="font-bold text-[#171c20] text-sm mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Previous Uploads</h3>
              <div className="space-y-2">
                {mockImages.map(img => (
                  <div key={img.image_id} className="flex items-center gap-3 p-3 bg-[#f0f4fa] rounded-xl border border-[#bec8d2]/30">
                    <span className="material-symbols-outlined text-[#006591] text-lg">radiology</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#171c20] truncate">{img.file_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full">{img.image_type}</span>
                        <span className="text-xs text-[#3e4850]">{new Date(img.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${img.risk_score > 0.5 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ffdcbd] text-[#8a5100]'}`}>
                      {(img.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Results */}
          <div className="bg-white border border-[#bae6fd] rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>AI Analysis Results</h2>

            {/* Thumbnail */}
            <div className="w-full h-48 bg-[#f0f4fa] rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-[#bec8d2]/30">
              <div className="flex flex-col items-center gap-2 text-[#3e4850]/50">
                <span className="material-symbols-outlined text-5xl">radiology</span>
                <p className="text-xs">{result.file_name}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-3 py-1 rounded-full font-medium capitalize">{result.image_type}</span>
              <span className="bg-[#ffdcbd] text-[#8a5100] text-xs px-3 py-1 rounded-full font-medium">{result.birads_score}</span>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Analyzed
              </span>
            </div>

            {/* AI Findings */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#171c20] mb-2">AI Findings</p>
              <div className="bg-[#f0f4fa] rounded-xl p-4 border border-[#bec8d2]/30">
                <p className="text-sm text-[#3e4850] leading-relaxed">{result.ai_findings}</p>
              </div>
            </div>

            {/* Risk score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-[#171c20]">Risk Score</p>
                <span className="text-sm font-bold text-[#de8712]">{(result.risk_score * 100).toFixed(0)}% — {result.birads_score}</span>
              </div>
              <div className="w-full bg-[#0ea5e9]/20 rounded-full h-3">
                <div
                  className="bg-[#0ea5e9] h-3 rounded-full transition-all"
                  style={{ width: `${result.risk_score * 100}%` }}
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-[#3e4850] mb-5">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              Analyzed on {new Date(result.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <Link
              to="/ehr"
              className="w-full flex items-center justify-center gap-2 border border-[#006591] text-[#006591] font-bold py-3 rounded-xl hover:bg-[#006591]/10 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">folder_shared</span>
              View in EHR
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
