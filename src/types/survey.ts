export enum AgreementLevel {
    StronglyAgree = "Strongly agree",
    Agree = "Agree",
    Neutral = "Neither agree nor disagree",
    Disagree = "Disagree",
    StronglyDisagree = "Strongly disagree"
}

export enum FamiliarityLevel {
    VeryFamiliar = "Very familiar",
    SomewhatFamiliar = "Somewhat familiar",
    NotSoFamiliar = "Not so familiar",
    NotAtAllFamiliar = "Not at all familiar"
}

export enum ImplementationExtent {
    NotAtAll = "Not at all",
    Slightly = "Slightly",
    Moderate = "Moderate",
    LargeExtent = "To a large extent",
    VeryExtensively = "Very extensively"
}

export enum BarrierSignificance {
    NotSignificant = "Not significant",
    SlightlySignificant = "Slightly significant",
    ModeratelySignificant = "Moderately significant",
    VerySignificant = "Very significant",
    ExtremelySignificant = "Extremely significant"
}

export interface SectionA {
    role: string;
    department: string;
    telecomExperience: string;
    company: string;
}

export interface SectionB {
    familiarityWithESG: FamiliarityLevel;
    sustainabilityPracticeLevel: string;
    esgReporting: string;
}

export interface EnvironmentalPractices {
    energyEfficiency: ImplementationExtent;
    dataCentreEnergyManagement: ImplementationExtent;
    wasteManagement: ImplementationExtent;
    regulatoryCompliance: ImplementationExtent;
    environmentalTracking: ImplementationExtent;
}

export interface SocialPractices {
    employeeWellbeing: ImplementationExtent;
    diversityInclusion: ImplementationExtent;
    communityInvestment: ImplementationExtent;
    customerSatisfaction: ImplementationExtent;
    dataPrivacyProtection: ImplementationExtent;
    trainingDevelopment: ImplementationExtent;
}

export interface GovernancePractices {
    boardOversight: ImplementationExtent;
    ethicalConduct: ImplementationExtent;
    riskManagement: ImplementationExtent;
    transparencyReporting: ImplementationExtent;
    stakeholderEngagement: ImplementationExtent;
}

export interface SectionC {
    environmental: EnvironmentalPractices;
    social: SocialPractices;
    governance: GovernancePractices;
}

export interface SectionD {
    esgImportance: string;
    financialBenefits: string[];
    profitabilityAgreement: AgreementLevel;
    measurableLink: string;
}

export interface SectionE {
    strategicChallenges: string[];
    barrierSignificance: {
        financialConstraints: BarrierSignificance;
        lackOfSkills: BarrierSignificance;
        limitedData: BarrierSignificance;
        resistanceToChange: BarrierSignificance;
        lackOfGuidance: BarrierSignificance;
    };
}

export interface SectionF {
    readiness: string;
    dedicatedESGTeam: string;
    trackedIndicators: string[];
}

export interface SectionG {
    recommendations: string;
}

export interface SurveyResponse {
    sectionA: SectionA;
    sectionB: SectionB;
    sectionC: SectionC;
    sectionD: SectionD;
    sectionE: SectionE;
    sectionF: SectionF;
    sectionG: SectionG;
    submittedAt: string;
}
