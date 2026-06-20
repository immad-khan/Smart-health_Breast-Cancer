export const mockUser = {
  user_id: "u-001",
  full_name: "Jane Doe",
  email: "jane.doe@example.com",
  role: "patient",
  created_at: "2024-01-15T10:00:00Z"
};

export const mockDoctorUser = {
  user_id: "d-001",
  full_name: "Dr. Sarah Ahmed",
  email: "dr.sarah@example.com",
  role: "doctor",
  specialty: "Breast Oncologist",
  hospital_name: "City Medical Center",
  city: "New York",
  is_available: true
};

export const mockDashboardStats = {
  symptom_records_count: 3,
  latest_risk_level: "Moderate",
  medical_images_count: 2,
  ocr_documents_count: 4,
  active_consultation: true
};

export const mockSymptoms = [
  {
    symptom_id: "s-001",
    input_type: "text",
    raw_input: "I have been experiencing persistent breast pain and noticed a lump.",
    extracted_symptoms: ["Breast pain", "Lump detection", "Tenderness"],
    is_confirmed: true,
    created_at: "2024-03-10T09:00:00Z"
  },
  {
    symptom_id: "s-002",
    input_type: "voice",
    raw_input: "Nipple discharge for past week",
    extracted_symptoms: ["Nipple discharge"],
    is_confirmed: true,
    created_at: "2024-03-12T14:00:00Z"
  }
];

export const mockImages = [
  {
    image_id: "i-001",
    image_type: "mammogram",
    file_url: "#",
    file_name: "mammogram_march.jpg",
    ai_findings: "Mild asymmetry detected in upper outer quadrant. No definitive mass identified.",
    risk_score: 0.42,
    birads_score: "BI-RADS 3",
    is_analyzed: true,
    created_at: "2024-03-11T10:00:00Z"
  },
  {
    image_id: "i-002",
    image_type: "ultrasound",
    file_url: "#",
    file_name: "ultrasound_followup.jpg",
    ai_findings: "Small hypoechoic lesion 8mm. Recommend follow-up in 6 months.",
    risk_score: 0.38,
    birads_score: "BI-RADS 3",
    is_analyzed: true,
    created_at: "2024-03-13T11:00:00Z"
  }
];

export const mockDocuments = [
  {
    doc_id: "doc-001",
    doc_type: "lab_report",
    file_url: "#",
    file_name: "blood_work_march.pdf",
    extracted_text: "CBC Normal. CA 15-3: 28 U/mL (Normal <30). Estrogen Receptor: Positive.",
    is_confirmed: true,
    created_at: "2024-03-10T08:00:00Z"
  },
  {
    doc_id: "doc-002",
    doc_type: "prescription",
    file_url: "#",
    file_name: "prescription_feb.pdf",
    extracted_text: "Tamoxifen 20mg daily. Vitamin D 1000IU daily.",
    is_confirmed: true,
    created_at: "2024-02-20T10:00:00Z"
  }
];

export const mockRiskAssessment = {
  assessment_id: "r-001",
  risk_level: "Moderate",
  generational_risk_score: 0.65,
  contributing_factors: [
    "Family history of breast cancer (maternal grandmother)",
    "BRCA gene mutation detected in family history",
    "Mammogram shows BI-RADS 3 findings",
    "Reported persistent breast pain for 14+ days",
    "Positive estrogen receptor status"
  ],
  recommended_action: "Schedule consultation with Breast Oncologist within 2 weeks. Follow-up mammogram in 6 months. Consider genetic counseling for BRCA testing.",
  created_at: "2024-03-14T12:00:00Z"
};

export const mockFamilyHistory = [
  { family_id: "f-001", member_relation: "maternal_grandmother", conditions: ["Breast Cancer", "Ovarian Cancer"], notes: "Diagnosed at age 58" },
  { family_id: "f-002", member_relation: "mother", conditions: ["BRCA Gene Mutation", "Hypertension"], notes: "BRCA1 positive" },
  { family_id: "f-003", member_relation: "paternal_grandfather", conditions: ["Diabetes", "Heart Disease"], notes: "" },
  { family_id: "f-004", member_relation: "maternal_grandfather", conditions: ["Lung Cancer"], notes: "Smoker, diagnosed age 70" },
  { family_id: "f-005", member_relation: "father", conditions: ["Hypertension"], notes: "" },
  { family_id: "f-006", member_relation: "sibling", conditions: ["Asthma"], notes: "Younger sister" }
];

export const mockDoctors = [
  {
    doctor_id: "dr-001",
    full_name: "Dr. Sarah Ahmed",
    specialty: "Breast Oncologist",
    qualification: "MD, FRCS (Oncology)",
    hospital_name: "City Medical Center",
    city: "New York",
    is_available: true,
    bio: "15 years experience in breast cancer diagnosis and treatment."
  },
  {
    doctor_id: "dr-002",
    full_name: "Dr. Michael Chen",
    specialty: "Breast Oncologist",
    qualification: "MD, PhD",
    hospital_name: "Memorial Hospital",
    city: "New York",
    is_available: true,
    bio: "Specializes in minimally invasive oncology procedures."
  },
  {
    doctor_id: "dr-003",
    full_name: "Dr. Priya Patel",
    specialty: "Genetic Counselor",
    qualification: "MS, CGC",
    hospital_name: "Genetics Center NY",
    city: "Brooklyn",
    is_available: false,
    bio: "Expert in BRCA hereditary cancer syndromes."
  },
  {
    doctor_id: "dr-004",
    full_name: "Dr. James Wilson",
    specialty: "Radiologist",
    qualification: "MD, FRCR",
    hospital_name: "Radiology Associates",
    city: "Manhattan",
    is_available: true,
    bio: "Subspecialty in breast imaging and mammography."
  }
];

export const mockConsultations = [
  {
    consultation_id: "c-001",
    patient_id: "u-001",
    doctor_id: "d-001",
    doctor_name: "Dr. Sarah Ahmed",
    status: "active",
    initiated_at: "2024-03-14T13:00:00Z"
  },
  {
    consultation_id: "c-002",
    patient_id: "u-001",
    doctor_id: "d-002",
    doctor_name: "Dr. Michael Chen",
    status: "closed",
    initiated_at: "2024-02-20T10:00:00Z",
    closed_at: "2024-02-20T10:45:00Z"
  }
];

export const mockMessages = [
  {
    msg_id: "m-001",
    consultation_id: "c-001",
    sender_id: "u-001",
    sender_role: "patient",
    sender_name: "Jane Doe",
    message_text: "Hello Doctor, I am concerned about my recent mammogram results.",
    sent_at: "2024-03-14T13:01:00Z",
    is_read: true
  },
  {
    msg_id: "m-002",
    consultation_id: "c-001",
    sender_id: "d-001",
    sender_role: "doctor",
    sender_name: "Dr. Sarah Ahmed",
    message_text: "Hello Jane, I have reviewed your results. The BI-RADS 3 finding is something we should monitor closely. Can you describe any recent changes?",
    sent_at: "2024-03-14T13:05:00Z",
    is_read: true
  },
  {
    msg_id: "m-003",
    consultation_id: "c-001",
    sender_id: "u-001",
    sender_role: "patient",
    sender_name: "Jane Doe",
    message_text: "The lump I mentioned seems slightly larger than last month. I also have occasional sharp pain.",
    sent_at: "2024-03-14T13:08:00Z",
    is_read: true
  },
  {
    msg_id: "m-004",
    consultation_id: "c-001",
    sender_id: "d-001",
    sender_role: "doctor",
    sender_name: "Dr. Sarah Ahmed",
    message_text: "Thank you for the update. Given your family history and these symptoms, I recommend we schedule an in-person biopsy evaluation. I will send a referral today.",
    sent_at: "2024-03-14T13:12:00Z",
    is_read: false
  }
];

export const mockPendingConsultations = [
  {
    consultation_id: "c-003",
    patient_name: "Alice Johnson",
    patient_risk_level: "High",
    initiated_at: "2024-03-15T09:00:00Z",
    top_factors: ["BRCA mutation", "Family history", "High BI-RADS score"]
  },
  {
    consultation_id: "c-004",
    patient_name: "Maria Garcia",
    patient_risk_level: "Moderate",
    initiated_at: "2024-03-15T10:30:00Z",
    top_factors: ["Breast pain", "Mammogram asymmetry"]
  }
];

export const DISEASE_OPTIONS = [
  "Breast Cancer", "Ovarian Cancer", "BRCA Gene Mutation",
  "Cervical Cancer", "Lung Cancer", "Diabetes",
  "Hypertension", "Heart Disease", "Asthma",
  "COPD", "Alzheimer's", "Stroke", "Other"
];
