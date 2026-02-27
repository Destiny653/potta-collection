// Generic 5-level agreement scale
export enum AgreementLevel {
  StronglyAgree = "Strongly agree",
  Agree = "Agree",
  Neutral = "Neither agree nor disagree",
  Disagree = "Disagree",
  StronglyDisagree = "Strongly disagree"
}

// Familiarity scale
export enum FamiliarityLevel {
  VeryFamiliar = "Very familiar",
  SomewhatFamiliar = "Somewhat familiar",
  NotSoFamiliar = "Not so familiar",
  NotAtAllFamiliar = "Not at all familiar"
}

// Extent scale (used in ESG practices)
export enum ImplementationExtent {
  NotAtAll = "Not at all",
  Slightly = "Slightly",
  Moderate = "Moderate",
  LargeExtent = "To a large extent",
  VeryExtensively = "Very extensively"
}

// Barrier significance scale
export enum BarrierSignificance {
  NotSignificant = "Not significant",
  SlightlySignificant = "Slightly significant",
  ModeratelySignificant = "Moderately significant",
  VerySignificant = "Very significant",
  ExtremelySignificant = "Extremely significant"
}
// SECTION A — Respondent Information

export interface SectionA {
  role:
    | "Senior Manager / Executive"
    | "Middle Manager"
    | "Non Management Staff"
    | { other: string };

  department:
    | "Finance"
    | "ESG / Sustainability"
    | "Human Resources"
    | "Legal compliance"
    | "IT"
    | { other: string };

  telecomExperience:
    | "0–2 years"
    | "3–5 years"
    | "6–10 years"
    | "More than 10 years";

  company:
    | "MTN Cameroon"
    | "Orange Cameroon"
    | "CAMTEL"
    | "NEXTTEL";
}

// SECTION B — Awareness & Understanding

export interface SectionB {
  familiarityWithESG: FamiliarityLevel;

  sustainabilityPracticeLevel:
    | "Mainly CSR activities (philanthropy, charity)"
    | "A mix of CSR and early ESG elements"
    | "A structured ESG strategy with defined KPIs"
    | "No formal CSR or ESG practices"
    | "Not sure";

  esgReporting:
    | "Yes, a formal ESG report"
    | "Yes, but activities are only informally communicated"
    | "No reporting"
    | "Not sure";
}

// 🟦 SECTION C — ESG Practices & Maturity
// environmental

export interface EnvironmentalPractices {
  energyEfficiency: ImplementationExtent;
  dataCentreEnergyManagement: ImplementationExtent;
  wasteManagement: ImplementationExtent;
  regulatoryCompliance: ImplementationExtent;
  environmentalTracking: ImplementationExtent;
}

// social

export interface SocialPractices {
  employeeWellbeing: ImplementationExtent;
  diversityInclusion: ImplementationExtent;
  communityInvestment: ImplementationExtent;
  customerSatisfaction: ImplementationExtent;
  dataPrivacyProtection: ImplementationExtent;
  trainingDevelopment: ImplementationExtent;
}

// governance

export interface SocialPractices {
  employeeWellbeing: ImplementationExtent;
  diversityInclusion: ImplementationExtent;
  communityInvestment: ImplementationExtent;
  customerSatisfaction: ImplementationExtent;
  dataPrivacyProtection: ImplementationExtent;
  trainingDevelopment: ImplementationExtent;
}

// 🟦 SECTION D — Perceived Value & Financial Impact

export interface SectionD {
  esgImportance:
    | "Extremely important"
    | "Very important"
    | "Somewhat important"
    | "Not so important"
    | "Not at all important";

  financialBenefits: (
    | "Reduced operational costs"
    | "Increased revenue or customer loyalty"
    | "Reduced cost of borrowing"
    | "Enhanced brand reputation"
    | "Improved risk management"
    | "No financial benefits"
  )[];

  profitabilityAgreement: AgreementLevel;

  measurableLink:
    | "Yes"
    | "Possibly, but with challenges"
    | "No"
    | "Not sure";
}

// 🟦 SECTION E — Barriers

export interface SectionE {
  strategicChallenges: (
    | "Lack of knowledge or expertise"
    | "Lack of structured ESG governance"
    | "Limited financial resources"
    | "Low regulatory pressure"
    | "Lack of industry ESG standards"
    | "Difficulty measuring ESG impact"
    | "Low management priority"
    | { other: string }
  )[];

  barrierSignificance: {
    financialConstraints: BarrierSignificance;
    lackOfSkills: BarrierSignificance;
    limitedData: BarrierSignificance;
    resistanceToChange: BarrierSignificance;
    lackOfGuidance: BarrierSignificance;
  };
}

// 🟦 SECTION F — Internal Readiness

export interface SectionF {
  readiness:
    | "Fully prepared"
    | "Moderately prepared"
    | "Not prepared"
    | "Not sure";

  dedicatedESGTeam:
    | "Yes, a formal ESG team"
    | "Yes, but responsibilities are shared"
    | "No dedicated personnel"
    | "Not sure";

  trackedIndicators: (
    | "Energy consumption"
    | "CO₂ emissions"
    | "Employee satisfaction metrics"
    | "Data privacy or security incidents"
    | "Governance or compliance indicators"
    | "Not sure"
    | "None of the above"
  )[];
}

// 🟦 SECTION G — Open Ended

export interface SectionG {
  recommendations: string;
}

// 
