import { z } from 'zod';
import {
    AgreementLevel,
    FamiliarityLevel,
    ImplementationExtent,
    BarrierSignificance
} from '@/types/survey';

const implementationExtentSchema = z.nativeEnum(ImplementationExtent);
const barrierSignificanceSchema = z.nativeEnum(BarrierSignificance);

export const surveySchema = z.object({
    sectionA: z.object({
        role: z.string().min(1, 'Role is required'),
        roleOther: z.string().optional(),
        department: z.string().min(1, 'Department is required'),
        departmentOther: z.string().optional(),
        telecomExperience: z.string().min(1, 'Experience is required'),
        company: z.string().min(1, 'Company is required'),
    }),
    sectionB: z.object({
        familiarityWithESG: z.nativeEnum(FamiliarityLevel),
        sustainabilityPracticeLevel: z.string().min(1, 'This field is required'),
        esgReporting: z.string().min(1, 'This field is required'),
    }),
    sectionC: z.object({
        environmental: z.object({
            energyEfficiency: implementationExtentSchema,
            dataCentreEnergyManagement: implementationExtentSchema,
            wasteManagement: implementationExtentSchema,
            regulatoryCompliance: implementationExtentSchema,
            environmentalTracking: implementationExtentSchema,
        }),
        social: z.object({
            employeeWellbeing: implementationExtentSchema,
            diversityInclusion: implementationExtentSchema,
            communityInvestment: implementationExtentSchema,
            customerSatisfaction: implementationExtentSchema,
            dataPrivacyProtection: implementationExtentSchema,
            trainingDevelopment: implementationExtentSchema,
        }),
        governance: z.object({
            boardOversight: implementationExtentSchema,
            ethicalConduct: implementationExtentSchema,
            riskManagement: implementationExtentSchema,
            transparencyReporting: implementationExtentSchema,
            stakeholderEngagement: implementationExtentSchema,
        }),
    }),
    sectionD: z.object({
        esgImportance: z.string().min(1, 'Importance is required'),
        financialBenefits: z.array(z.string()).min(1, 'Select at least one benefit'),
        profitabilityAgreement: z.nativeEnum(AgreementLevel),
        measurableLink: z.string().min(1, 'This field is required'),
    }),
    sectionE: z.object({
        strategicChallenges: z.array(z.string()).min(1, 'Select at least one challenge'),
        barrierSignificance: z.object({
            financialConstraints: barrierSignificanceSchema,
            lackOfSkills: barrierSignificanceSchema,
            limitedData: barrierSignificanceSchema,
            resistanceToChange: barrierSignificanceSchema,
            lackOfGuidance: barrierSignificanceSchema,
        }),
    }),
    sectionF: z.object({
        readiness: z.string().min(1, 'Readiness is required'),
        dedicatedESGTeam: z.string().min(1, 'This field is required'),
        trackedIndicators: z.array(z.string()).min(1, 'Select at least one indicator'),
    }),
    sectionG: z.object({
        recommendations: z.string().optional(),
    }),
});

export type SurveySchemaType = z.infer<typeof surveySchema>;

export const defaultValues: SurveySchemaType = {
    sectionA: {
        role: '',
        roleOther: '',
        department: '',
        departmentOther: '',
        telecomExperience: '',
        company: '',
    },
    sectionB: {
        familiarityWithESG: FamiliarityLevel.NotAtAllFamiliar,
        sustainabilityPracticeLevel: '',
        esgReporting: '',
    },
    sectionC: {
        environmental: {
            energyEfficiency: ImplementationExtent.NotAtAll,
            dataCentreEnergyManagement: ImplementationExtent.NotAtAll,
            wasteManagement: ImplementationExtent.NotAtAll,
            regulatoryCompliance: ImplementationExtent.NotAtAll,
            environmentalTracking: ImplementationExtent.NotAtAll,
        },
        social: {
            employeeWellbeing: ImplementationExtent.NotAtAll,
            diversityInclusion: ImplementationExtent.NotAtAll,
            communityInvestment: ImplementationExtent.NotAtAll,
            customerSatisfaction: ImplementationExtent.NotAtAll,
            dataPrivacyProtection: ImplementationExtent.NotAtAll,
            trainingDevelopment: ImplementationExtent.NotAtAll,
        },
        governance: {
            boardOversight: ImplementationExtent.NotAtAll,
            ethicalConduct: ImplementationExtent.NotAtAll,
            riskManagement: ImplementationExtent.NotAtAll,
            transparencyReporting: ImplementationExtent.NotAtAll,
            stakeholderEngagement: ImplementationExtent.NotAtAll,
        },
    },
    sectionD: {
        esgImportance: '',
        financialBenefits: [],
        profitabilityAgreement: AgreementLevel.Neutral,
        measurableLink: '',
    },
    sectionE: {
        strategicChallenges: [],
        barrierSignificance: {
            financialConstraints: BarrierSignificance.NotSignificant,
            lackOfSkills: BarrierSignificance.NotSignificant,
            limitedData: BarrierSignificance.NotSignificant,
            resistanceToChange: BarrierSignificance.NotSignificant,
            lackOfGuidance: BarrierSignificance.NotSignificant,
        },
    },
    sectionF: {
        readiness: '',
        dedicatedESGTeam: '',
        trackedIndicators: [],
    },
    sectionG: {
        recommendations: '',
    },
};
