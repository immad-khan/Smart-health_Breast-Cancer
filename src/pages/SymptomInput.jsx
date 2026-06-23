import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockSymptoms } from '../data/mockData';

const CHIPS = ['Breast Pain', 'Lump', 'Nipple Discharge', 'Skin Changes', 'Fatigue', 'Swelling'];

export default function SymptomInput() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [extractedSymptoms, setExtractedSymptoms] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setText(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error', e);
        setError('Voice input error. Please check microphone permissions.');
        setRecording(false);
      };

      rec.onend = () => {
        setRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. Please type your symptoms.');
      return;
    }

    if (recording) {
      recognition.stop();
      setRecording(false);
    } else {
      setError('');
      setRecording(true);
      recognition.start();
    }
  };

  const extractSymptoms = async (queryText) => {
    if (!queryText.trim()) return;
    setIsExtracting(true);
    try {
      const response = await fetch('http://localhost:8002/api/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: queryText }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract symptoms');
      }

      const data = await response.json();
      if (data.extracted_symptoms) {
        setExtractedSymptoms(data.extracted_symptoms);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to extract symptoms. You can still add symptoms manually below.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Debounced auto-extraction when text changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (text.trim()) {
        extractSymptoms(text);
      }
    }, 2000);

    return () => clearTimeout(delayDebounce);
  }, [text]);

  const addChip = (chip) => {
    setText(prev => prev ? `${prev}, ${chip.toLowerCase()}` : chip.toLowerCase());
  };

  const removeSymptom = (idx) => {
    setExtractedSymptoms(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddCustomSymptom = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (customSymptom.trim() && !extractedSymptoms.includes(customSymptom.trim())) {
        setExtractedSymptoms(prev => [...prev, customSymptom.trim()]);
        setCustomSymptom('');
      }
    }
  };

  const handleAnalyze = () => {
    if (extractedSymptoms.length === 0 && !text.trim()) {
      setError('Please describe your symptoms and ensure at least one symptom is identified.');
      return;
    }
    setError('');
    navigate('/risk-assessment', { 
      state: { 
        symptoms: extractedSymptoms.length > 0 ? extractedSymptoms : [text] 
      } 
    });
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Symptom Input</h1>
          <p className="text-[#3e4850] text-sm mt-1">Describe how you're feeling in detail or use voice input. Our clinical AI will extract key symptoms.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left panel */}
          <div className="lg:col-span-8 bg-white border border-[#bae6fd] rounded-2xl shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#bec8d2]/30">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'text'
                    ? 'text-[#006591] border-b-2 border-[#006591] bg-[#bae6fd]/20'
                    : 'text-[#3e4850] hover:bg-[#f0f4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">keyboard</span>
                Text Input
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'voice'
                    ? 'text-[#006591] border-b-2 border-[#006591] bg-[#bae6fd]/20'
                    : 'text-[#3e4850] hover:bg-[#f0f4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">mic</span>
                Voice Input
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'text' ? (
                <div>
                  <label className="block text-sm font-semibold text-[#171c20] mb-2">Describe your symptoms</label>
                  <textarea
                    value={text}
                    onChange={e => { setText(e.target.value); setError(''); }}
                    rows={6}
                    placeholder="E.g., I've been experiencing persistent breast pain, noticed a lump in the upper outer area, and have had nipple discharge for the past week..."
                    className={`w-full bg-[#f0f4fa] border rounded-xl px-4 py-3 text-sm text-[#171c20] placeholder-[#3e4850]/50 focus:outline-none resize-none transition-colors ${
                      error ? 'border-[#ba1a1a]' : 'border-[#bec8d2]/50 focus:border-[#006591]'
                    }`}
                  />
                  {error && <p className="text-[#ba1a1a] text-xs mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{error}</p>}

                  <div className="mt-4">
                    <p className="text-xs font-medium text-[#3e4850] mb-2">Common Symptoms — Click to add:</p>
                    <div className="flex flex-wrap gap-2">
                      {CHIPS.map(chip => (
                        <button
                          key={chip}
                          onClick={() => addChip(chip)}
                          className="rounded-full bg-[#f0f4fa] border border-[#bec8d2]/40 px-4 py-1.5 text-sm text-[#171c20] hover:bg-[#bae6fd] hover:text-[#3d687c] transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <p className="text-[#3e4850] text-sm text-center max-w-sm mb-8">
                    Use our secure voice transcription. Speak naturally about what you are experiencing.
                  </p>

                  <div className="relative flex items-center justify-center mb-8">
                    {/* Rings */}
                    <div className={`absolute w-32 h-32 rounded-full bg-[#006591]/10 border border-[#006591]/20 ${recording ? 'animate-ping' : ''}`} />
                    <div className="absolute w-24 h-24 rounded-full bg-[#006591]/10 border border-[#006591]/20" />
                    {/* Mic button */}
                    <button
                      onClick={toggleRecording}
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        recording ? 'bg-[#ba1a1a] scale-110' : 'bg-[#006591] hover:scale-105'
                      }`}
                    >
                      <span className="material-symbols-outlined text-white text-2xl">{recording ? 'stop' : 'mic'}</span>
                    </button>
                  </div>

                  {/* Waveform */}
                  <div className="flex items-center gap-1 mb-4 h-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full bg-[#006591] transition-all ${recording ? 'animate-pulse' : 'opacity-30'}`}
                        style={{ height: recording ? `${Math.random() * 24 + 4}px` : '4px' }}
                      />
                    ))}
                  </div>

                  <p className="text-sm font-medium text-[#3e4850]">
                    {recording ? 'Recording... tap to stop' : 'Tap to start speaking'}
                  </p>

                  {recording && (
                    <div className="mt-4 w-full max-w-sm bg-[#f0f4fa] border border-[#bec8d2]/40 rounded-xl p-4 text-sm text-[#3e4850] min-h-[60px] text-center">
                      <span className="animate-pulse">Listening & Transcribing...</span>
                    </div>
                  )}

                  {text && (
                    <div className="mt-6 w-full max-w-xl bg-white border border-[#bec8d2]/40 rounded-xl p-4 shadow-sm">
                      <p className="text-xs font-semibold text-[#3e4850] mb-2 uppercase">Transcribed Text:</p>
                      <p className="text-sm text-[#171c20] italic">"{text}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-white to-[#f6faff] border border-[#bae6fd] rounded-2xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#006591]">auto_awesome</span>
                <h3 className="font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Live Extraction</h3>
              </div>
              <p className="text-xs text-[#006591] mb-4">{isExtracting ? 'AI Extracting...' : 'AI Ready'}</p>

              <p className="text-xs font-medium text-[#3e4850] mb-3">Identified clinical entities:</p>

              <div className="space-y-2 mb-4">
                {extractedSymptoms.length > 0 ? (
                  extractedSymptoms.map((symptom, idx) => (
                    <div key={idx} className="bg-[#f0f4fa] border border-[#bec8d2]/40 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006591] text-lg">check_circle</span>
                        <span className="text-sm text-[#171c20]">{symptom}</span>
                      </div>
                      <button onClick={() => removeSymptom(idx)} className="text-[#3e4850] hover:text-[#ba1a1a] transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#3e4850]/60 italic py-2">No symptoms identified yet. Describe your symptoms on the left.</p>
                )}
              </div>

              {/* Add Custom Symptom */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={e => setCustomSymptom(e.target.value)}
                    onKeyDown={handleAddCustomSymptom}
                    placeholder="Add symptom manually..."
                    className="flex-1 bg-white border border-[#bec8d2]/50 rounded-xl px-3 py-2 text-xs text-[#171c20] placeholder-[#3e4850]/50 focus:outline-none focus:border-[#006591]"
                  />
                  <button
                    onClick={handleAddCustomSymptom}
                    className="bg-[#bae6fd] text-[#006591] font-bold px-3 py-2 rounded-xl text-xs hover:bg-[#bae6fd]/80 transition-colors flex items-center justify-center"
                  >
                    Add
                  </button>
                </div>
              </div>

              {isExtracting && (
                <div className="flex items-center gap-2 text-[#006591] text-xs italic mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  Analyzing input...
                </div>
              )}

              <hr className="border-[#bec8d2]/30 mb-4" />

              <button
                onClick={handleAnalyze}
                disabled={isExtracting}
                className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 text-sm mb-3 disabled:opacity-50"
              >
                Proceed to Risk Assessment
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[#3e4850]">
                <span className="material-symbols-outlined text-sm">lock</span>
                HIPAA Compliant AI Analysis
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

