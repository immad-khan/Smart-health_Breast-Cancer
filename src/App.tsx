import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import SymptomInput from './pages/SymptomInput';
import ImageUpload from './pages/ImageUpload';
import DocumentUpload from './pages/DocumentUpload';
import RiskAssessment from './pages/RiskAssessment';
import EHRView from './pages/EHRView';
import SearchSpecialist from './pages/SearchSpecialist';
import ConsultationChat from './pages/ConsultationChat';
import FamilyHistory from './pages/FamilyHistory';
import DoctorDashboard from './pages/DoctorDashboard';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/symptom-input" element={<SymptomInput />} />
          <Route path="/image-upload" element={<ImageUpload />} />
          <Route path="/document-upload" element={<DocumentUpload />} />
          <Route path="/risk-assessment" element={<RiskAssessment />} />
          <Route path="/ehr" element={<EHRView />} />
          <Route path="/search-specialist" element={<SearchSpecialist />} />
          <Route path="/consultation-chat/:consultation_id" element={<ConsultationChat />} />
          <Route path="/family-history" element={<FamilyHistory />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
