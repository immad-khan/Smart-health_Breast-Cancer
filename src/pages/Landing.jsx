import { Link } from 'react-router-dom';

const features = [
  {
    icon: 'psychology',
    title: 'AI Symptom Analysis',
    desc: 'Describe symptoms by text or voice. Our AI extracts clinical entities instantly.',
  },
  {
    icon: 'radiology',
    title: 'Medical Image Analysis',
    desc: 'Upload mammograms and ultrasounds for AI-powered BI-RADS scoring.',
  },
  {
    icon: 'family_history',
    title: 'Hereditary Risk Mapping',
    desc: 'Track family medical history across 3 generations to calculate genetic risk.',
  },
];

const steps = [
  { num: '1', title: 'Register & Login', desc: 'Create your secure HIPAA-compliant account in minutes.' },
  { num: '2', title: 'Input Symptoms', desc: 'Describe your symptoms using text or voice input.' },
  { num: '3', title: 'Upload Medical Images', desc: 'Submit mammograms and ultrasounds for AI analysis.' },
  { num: '4', title: 'View Risk Assessment', desc: 'Get your personalized risk profile and AI recommendations.' },
  { num: '5', title: 'Connect with Specialists', desc: 'Book consultations with board-certified oncologists.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f6faff] font-inter">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#bec8d2]/30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#006591] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">health_and_safety</span>
            </div>
            <span className="text-[#006591] font-bold text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#3e4850] font-medium">
            <a href="#features" className="hover:text-[#006591] transition-colors border-b-2 border-[#006591] pb-0.5">Services</a>
            <a href="#features" className="hover:text-[#006591] transition-colors">AI Analysis</a>
            <a href="#how-it-works" className="hover:text-[#006591] transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#006591] transition-colors">About Us</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-[#006591] hover:underline">Sign In</Link>
            <Link to="/register" className="bg-[#006591] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#005070] transition-colors">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#006591] via-[#0077a8] to-[#396477] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Clinical AI Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Predict.<br />
              <span className="text-[#89ceff]">Consult.</span><br />
              Recover.
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Empowering patients and providers with high-precision AI diagnostics. Navigate your health journey with absolute clarity and proactive clinical insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-white text-[#006591] font-bold py-3 px-8 rounded-xl hover:bg-[#c9e6ff] transition-all shadow-md flex items-center gap-2"
              >
                Start Analysis
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/60 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all"
              >
                View Clinical Safety
              </Link>
            </div>
          </div>
          {/* Hero visual */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 shadow-xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <span className="material-symbols-outlined text-white/30 text-[160px]">radiology</span>
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl p-4 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-[#bae6fd] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#006591] text-xl">monitoring</span>
                </div>
                <div>
                  <p className="text-[#006591] font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Vital Analysis</p>
                  <p className="text-[#3e4850] text-xs">Real-time systemic risk prediction is currently stable. Confidence interval: 98.4%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-[#f0f4fa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#171c20] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Comprehensive Diagnostics</h2>
            <p className="text-[#3e4850] text-base max-w-xl mx-auto">Our specialized AI modules process complex medical data to provide clear, actionable health pathways.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Large feature card */}
            <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-[#bec8d2]/30 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[#006591] text-3xl mb-4 block">psychology</span>
              <h3 className="text-xl font-bold text-[#171c20] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Symptom Analysis</h3>
              <p className="text-[#3e4850] text-sm leading-relaxed mb-4">Input unstructured clinical narratives. Our NLP engine extracts distinct medical entities, mapping them to recognized diagnostic criteria to suggest potential underlying conditions.</p>
              <Link to="/symptom-input" className="text-[#006591] text-sm font-semibold hover:underline flex items-center gap-1">
                Run Assessment <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { icon: 'radiology', title: 'Radiology AI', desc: 'Automated anomaly detection across Dicom modalities with highlighting.' },
                { icon: 'upload_file', title: 'Report Digitization', desc: 'Convert physical lab results into structured, longitudinal patient data.' },
                { icon: 'analytics', title: 'Risk Prediction', desc: 'Algorithmic forecasting for chronic disease onset based on biomarkers.' },
              ].map((item, i) => (
                <div key={i} className={`bg-white rounded-2xl p-5 border border-[#bec8d2]/30 shadow-sm hover:shadow-md transition-shadow ${i === 2 ? 'col-span-1' : ''}`}>
                  <span className="material-symbols-outlined text-[#006591] text-2xl mb-3 block">{item.icon}</span>
                  <h4 className="font-bold text-[#171c20] text-sm mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>{item.title}</h4>
                  <p className="text-[#3e4850] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
              {/* Connect card */}
              <div className="bg-[#006591] rounded-2xl p-5 text-white col-span-2">
                <h4 className="font-bold text-base mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>Connect with Specialists</h4>
                <p className="text-white/80 text-xs mb-3">Transition seamlessly from AI insights to human expertise. Utilize our network to find board-certified specialists and initiate secure telehealth sessions directly.</p>
                <div className="flex gap-3 items-center">
                  <Link to="/search-specialist" className="text-white/90 text-xs flex items-center gap-1 hover:text-white">
                    <span className="material-symbols-outlined text-sm">search</span> Search
                  </Link>
                  <Link to="/consultation-chat/c-001" className="text-white/90 text-xs flex items-center gap-1 hover:text-white">
                    <span className="material-symbols-outlined text-sm">videocam</span> Live Video
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#171c20] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Clinical Pathway Integration</h2>
            <p className="text-[#3e4850] text-base">A streamlined protocol from initial query to specialized treatment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', icon: 'upload_file', title: 'Data Ingestion', desc: 'Upload historical records, lab results, or describe current acute symptoms.' },
              { num: '2', icon: 'smart_toy', title: 'AI Processing', desc: 'Our models cross-reference data against vast medical literature and diagnostic criteria.' },
              { num: '3', icon: 'person_search', title: 'Actionable Output', desc: 'Receive an articulated clinical summary, risk scores, and specialist referrals.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#006591] rounded-full flex items-center justify-center">
                  <span className="text-[#006591] font-bold text-xl">{step.num}</span>
                </div>
                <span className="material-symbols-outlined text-[#006591] text-3xl mb-3 block">{step.icon}</span>
                <h4 className="font-bold text-[#171c20] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{step.title}</h4>
                <p className="text-[#3e4850] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family History Section */}
      <section className="py-16 px-6 bg-[#f0f4fa]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#bae6fd] rounded-full px-3 py-1 mb-4 text-xs text-[#3d687c] font-medium">
              <span className="material-symbols-outlined text-sm">family_history</span>
              Generational Tracking
            </div>
            <h2 className="text-3xl font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Map Your Genetic Health Heritage</h2>
            <p className="text-[#3e4850] mb-6 leading-relaxed">Understanding familial disease patterns is crucial for preventive care. Our Family History module creates a structured, shareable clinical pedigree, allowing AI to weigh hereditary risks heavily in its predictive models.</p>
            <ul className="space-y-3 mb-8">
              {['Identify autosomal dominant patterns.', 'Export standard pedigrees for oncologists.', 'Automated screening recommendations.'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[#3e4850] text-sm">
                  <span className="material-symbols-outlined text-[#006591] text-lg">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/family-history" className="inline-flex items-center gap-2 border border-[#006591] text-[#006591] font-semibold px-6 py-3 rounded-xl hover:bg-[#006591]/10 transition-colors">
              Build Profile
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-[#bec8d2]/30 shadow-sm min-h-[300px] flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full p-8 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 opacity-60">
                {Array.from({length: 9}).map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0ea5e9]/40 bg-[#bae6fd]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#006591] text-xl">account_circle</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-white/0" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#006591] py-16 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Ready to take control of your health?</h2>
        <p className="text-white/80 mb-8 text-base max-w-xl mx-auto">Join thousands of patients and physicians using Smart Health AI for early cancer detection.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-[#006591] font-bold py-4 px-8 rounded-xl hover:bg-[#c9e6ff] transition-all shadow-md text-base"
        >
          Create Free Account
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#dee3e9] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#006591] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">health_and_safety</span>
            </div>
            <span className="text-[#006591] font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health</span>
          </div>
          <p className="text-[#3e4850] text-sm">© 2024 Smart Health Care System. HIPAA Compliant AI.</p>
          <div className="flex gap-6 text-sm text-[#3e4850]">
            <a href="#" className="hover:text-[#006591]">Privacy Policy</a>
            <a href="#" className="hover:text-[#006591]">Terms of Service</a>
            <a href="#" className="hover:text-[#006591]">Clinical Safety</a>
            <a href="#" className="hover:text-[#006591]">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
