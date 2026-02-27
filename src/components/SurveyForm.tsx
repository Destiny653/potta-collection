'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surveySchema, SurveySchemaType, defaultValues } from '@/lib/validation';
import {
    AgreementLevel,
    FamiliarityLevel,
    ImplementationExtent,
    BarrierSignificance
} from '@/types/survey';
import { generateFormattedOutput } from '@/lib/generateFormattedOutput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SECTIONS = [
    { id: 'A', title: 'Respondent Information' },
    { id: 'B', title: 'Awareness & Understanding' },
    { id: 'C1', title: 'Environmental Practices' },
    { id: 'C2', title: 'Social Practices' },
    { id: 'C3', title: 'Governance Practices' },
    { id: 'D', title: 'Value & Impact' },
    { id: 'E', title: 'Barriers' },
    { id: 'F', title: 'Internal Readiness' },
    { id: 'G', title: 'Open Ended' },
];

export default function SurveyForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const methods = useForm<SurveySchemaType>({
        resolver: zodResolver(surveySchema),
        defaultValues,
        mode: 'onChange',
    });

    const { handleSubmit, formState: { errors, submitCount } } = methods;

    // Auto-scroll to first error
    React.useEffect(() => {
        if (submitCount > 0 && Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementById(`section-${firstErrorField.toLowerCase().split('.')[0]}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                toast.error('Please check the highlighted fields.');
            }
        }
    }, [submitCount, errors]);

    const onSubmit = async (data: SurveySchemaType) => {
        setIsSubmitting(true);
        try {
            console.log('Form data:', data);
            const formattedHtml = generateFormattedOutput(data);
            const payload = {
                rawData: data,
                formattedHtml,
                submittedAt: new Date().toISOString(),
            };

            const response = await fetch('/api/submit-survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.status === 'error') {
                throw new Error(result.message);
            }

            toast.success('Survey submitted successfully!');
            // setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit survey. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center space-y-6 bg-white rounded-xl shadow-sm border mt-10">
                <div className="bg-green-100 p-6 rounded-full">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
                <p className="text-gray-600 max-w-md">
                    Your ESG survey response has been successfully recorded. We appreciate your participation in this research.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                    Submit Another Response
                </Button>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto py-12 px-4 space-y-12">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">ESG Telecom Survey</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Evaluating Environmental, Social, and Governance practices in the Cameroon telecommunications sector.
                    </p>
                </div>

                <div className="space-y-16">
                    <section id="section-a" className={`space-y-8 p-6 rounded-xl transition-colors ${errors.sectionA ? 'bg-red-50 border-2 border-red-100' : ''}`}>
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION A — Respondent Information</h2>
                        </div>
                        <SectionAStep />
                    </section>

                    <section id="section-b" className={`space-y-8 p-6 rounded-xl transition-colors ${errors.sectionB ? 'bg-red-50 border-2 border-red-100' : ''}`}>
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION B — Awareness & Understanding</h2>
                        </div>
                        <SectionBStep />
                    </section>

                    <section id="section-c" className={`space-y-12 p-6 rounded-xl transition-colors ${errors.sectionC ? 'bg-red-50 border-2 border-red-100' : ''}`}>
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION C — Current ESG Practices and Maturity Levels</h2>
                        </div>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Environmental Practices</h3>
                                <SectionCMatrixStep type="environmental" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Social Practices</h3>
                                <SectionCMatrixStep type="social" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Governance Practices</h3>
                                <SectionCMatrixStep type="governance" />
                            </div>
                        </div>
                    </section>

                    <section id="section-d" className={`space-y-8 p-6 rounded-xl transition-colors ${errors.sectionD ? 'bg-red-50 border-2 border-red-100' : ''}`}>
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION D — Value & Impact</h2>
                        </div>
                        <SectionDStep />
                    </section>

                    <section id="section-e" className={`space-y-8 p-6 rounded-xl transition-colors ${errors.sectionE ? 'bg-red-50 border-2 border-red-100' : ''}`}>
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION E — Barriers</h2>
                        </div>
                        <SectionEStep />
                    </section>

                    <section id="section-f" className={`space-y-8 p-6 rounded-xl transition-colors ${errors.sectionF ? 'bg-red-50 border-2 border-red-100' : ''}`}>
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION F — Internal Readiness</h2>
                        </div>
                        <SectionFStep />
                    </section>

                    <section id="section-g" className="space-y-8">
                        <div className="border-b-2 border-blue-900 pb-2">
                            <h2 className="text-2xl font-bold text-blue-900">SECTION G — Open Ended</h2>
                        </div>
                        <SectionGStep />
                    </section>
                </div>

                <div className="pt-12 border-t flex justify-center">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-lg px-12 py-6 h-auto rounded-lg shadow-lg flex items-center gap-3 transition-all transform hover:scale-105"
                    >
                        {isSubmitting ? 'Submitting Survey...' : <>Submit Final Response <Send className="h-5 w-5" /></>}
                    </Button>
                </div>

                {Object.keys(errors).length > 0 && (
                    <p className="text-red-500 text-center font-medium mt-4">
                        Please fix the validation errors in the form above before submitting.
                    </p>
                )}
            </form>
        </FormProvider>
    );
}

// --- Sub-components for Steps ---

function SectionAStep() {
    const { register, watch, formState: { errors } } = useFormContext<SurveySchemaType>();

    const selectedRole = watch('sectionA.role');
    const selectedDepartment = watch('sectionA.department');

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">1. What is your role in the company?</p>
                <div className="space-y-3 pl-2">
                    {['Senior Manager / Executive', 'Middle Manager', 'Non Management Staff', 'Other (please specify)'].map((role) => (
                        <div key={role} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`role-${role}`}
                                value={role}
                                {...register('sectionA.role')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`role-${role}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {role}
                            </Label>
                        </div>
                    ))}
                    {selectedRole === 'Other (please specify)' && (
                        <div className="pl-8 pt-2">
                            <Input
                                placeholder="Please specify your role"
                                className="max-w-md border-b-2 border-x-0 border-t-0 rounded-none focus:ring-0 focus:border-blue-900 px-0 h-10 bg-transparent"
                                {...register('sectionA.roleOther' as any)}
                            />
                        </div>
                    )}
                </div>
                {errors.sectionA?.role && <p className="text-red-500 text-sm mt-1">{errors.sectionA.role.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">2. Which department do you work in?</p>
                <div className="space-y-3 pl-2">
                    {['Finance', 'ESG / Sustainability', 'Human Resources', 'Legal compliance', 'IT', 'Other (please specify)'].map((dept) => (
                        <div key={dept} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`dept-${dept}`}
                                value={dept}
                                {...register('sectionA.department')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`dept-${dept}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {dept}
                            </Label>
                        </div>
                    ))}
                    {selectedDepartment === 'Other (please specify)' && (
                        <div className="pl-8 pt-2">
                            <Input
                                placeholder="Please specify your department"
                                className="max-w-md border-b-2 border-x-0 border-t-0 rounded-none focus:ring-0 focus:border-blue-900 px-0 h-10 bg-transparent"
                                {...register('sectionA.departmentOther' as any)}
                            />
                        </div>
                    )}
                </div>
                {errors.sectionA?.department && <p className="text-red-500 text-sm mt-1">{errors.sectionA.department.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">3. How many years have you worked in the telecom sector?</p>
                <div className="space-y-3 pl-2">
                    {['0–2 years', '3–5 years', '6–10 years', 'More than 10 years'].map((exp) => (
                        <div key={exp} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`exp-${exp}`}
                                value={exp}
                                {...register('sectionA.telecomExperience')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`exp-${exp}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {exp}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionA?.telecomExperience && <p className="text-red-500 text-sm mt-1">{errors.sectionA.telecomExperience.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">4. Which telecom company are you employed by?</p>
                <div className="space-y-3 pl-2">
                    {['MTN Cameroon', 'Orange Cameroon', 'CAMTEL', 'NEXTTEL'].map((company) => (
                        <div key={company} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`company-${company}`}
                                value={company}
                                {...register('sectionA.company')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`company-${company}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {company}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionA?.company && <p className="text-red-500 text-sm mt-1">{errors.sectionA.company.message}</p>}
            </div>
        </div>
    );
}

function SectionBStep() {
    const { register, formState: { errors } } = useFormContext<SurveySchemaType>();
    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-700 block mb-4">5. How familiar are you with the term &apos;ESG&apos; (Environmental, Social, and Governance)?</Label>
                <div className="space-y-3 pl-2">
                    {Object.values(FamiliarityLevel).map((level) => (
                        <div key={level} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`esg-fam-${level}`}
                                value={level}
                                {...register('sectionB.familiarityWithESG')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`esg-fam-${level}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {level}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionB?.familiarityWithESG && <p className="text-red-500 text-sm mt-1">{errors.sectionB.familiarityWithESG.message}</p>}
            </div>

            <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-700 block mb-4">6. Which of the following best describes your company&apos;s level of sustainability practices?</Label>
                <div className="space-y-3 pl-2">
                    {[
                        'Mainly CSR activities (philanthropy, charity)',
                        'A mix of CSR and early ESG elements',
                        'A structured ESG strategy with defined KPIs',
                        'No formal CSR or ESG practices',
                        'Not sure'
                    ].map((item) => (
                        <div key={item} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`sust-prac-${item}`}
                                value={item}
                                {...register('sectionB.sustainabilityPracticeLevel')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`sust-prac-${item}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {item}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionB?.sustainabilityPracticeLevel && <p className="text-red-500 text-sm mt-1">{errors.sectionB.sustainabilityPracticeLevel.message}</p>}
            </div>

            <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-700 block mb-4">7. Does your company currently publish an annual sustainability or ESG report?</Label>
                <div className="space-y-3 pl-2">
                    {['Yes', 'No', 'In progress', 'Not sure'].map((option) => (
                        <div key={option} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`esg-rep-${option}`}
                                value={option}
                                {...register('sectionB.esgReporting')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`esg-rep-${option}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {option}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionB?.esgReporting && <p className="text-red-500 text-sm mt-1">{errors.sectionB.esgReporting.message}</p>}
            </div>
        </div>
    );
}

function SectionCMatrixStep({ type }: { type: 'environmental' | 'social' | 'governance' }) {
    const { register } = useFormContext<SurveySchemaType>();

    const questions = {
        environmental: [
            { id: '8', qId: 'energyEfficiency', label: 'Energy efficiency initiatives (solar sites, low energy equipment)' },
            { id: '9', qId: 'dataCentreEnergyManagement', label: 'Network or data centre energy management' },
            { id: '10', qId: 'wasteManagement', label: 'Waste management & recycling' },
            { id: '11', qId: 'regulatoryCompliance', label: 'Environmental regulatory compliance' },
            { id: '12', qId: 'environmentalTracking', label: 'Tracking environmental performance metrics (e.g., CO₂ emissions)' }
        ],
        social: [
            { id: '13', qId: 'employeeWellbeing', label: 'Employee health, safety, and wellbeing' },
            { id: '14', qId: 'diversityInclusion', label: 'Diversity & inclusion programs' },
            { id: '15', qId: 'communityInvestment', label: 'Community investment / social initiatives' },
            { id: '16', qId: 'customerSatisfaction', label: 'Customer satisfaction programs and surveys' },
            { id: '17', qId: 'dataPrivacyProtection', label: 'Data privacy and security (cybersecurity)' },
            { id: '18', qId: 'trainingDevelopment', label: 'Employee training and skill development' }
        ],
        governance: [
            { id: '19', qId: 'boardOversight', label: 'Board-level oversight for sustainability' },
            { id: '20', qId: 'ethicalConduct', label: 'Policies for ethical conduct and anti-corruption' },
            { id: '21', qId: 'riskManagement', label: 'Integration of ESG into risk management' },
            { id: '22', qId: 'transparencyReporting', label: 'Transparency in public reporting' },
            { id: '23', qId: 'stakeholderEngagement', label: 'Stakeholder engagement' }
        ]
    }[type];

    const levels = Object.values(ImplementationExtent);

    // Header numbering based on section
    const startNumber = type === 'environmental' ? 8 : (type === 'social' ? 9 : 10);
    const mainQuestion = {
        environmental: '8. To what extent does your company implement the following environmental practices?',
        social: '9. To what extent does your company implement the following social practices?',
        governance: '10. To what extent does your company implement the following governance practices?'
    }[type];

    return (
        <div className="space-y-6">
            <p className="text-lg font-medium text-gray-700">{mainQuestion}</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm border-collapse bg-white">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-4 text-left border-b font-semibold text-gray-600 w-1/3">Practice / Statement</th>
                            {levels.map(l => (
                                <th key={l} className="p-2 border-b text-center text-xs font-medium text-gray-500 max-w-[80px]">
                                    {l}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {questions.map((q, idx) => (
                            <tr key={q.qId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="p-4 font-medium text-gray-700">{q.label}</td>
                                {levels.map(l => (
                                    <td key={l} className="p-2 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="radio"
                                                value={l}
                                                className="h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                                                {...register(`sectionC.${type}.${q.qId}` as any)}
                                            />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SectionDStep() {
    const { register, setValue, watch, formState: { errors } } = useFormContext<SurveySchemaType>();
    const selectedBenefits = watch('sectionD.financialBenefits') || [];

    const handleBenefitToggle = (benefit: string) => {
        const current = new Set(selectedBenefits);
        if (current.has(benefit)) {
            current.delete(benefit);
        } else {
            current.add(benefit);
        }
        setValue('sectionD.financialBenefits', Array.from(current), { shouldValidate: true });
    };

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">11. How important do you believe ESG is for the financial performance of your company?</p>
                <div className="space-y-3 pl-2">
                    {['Extremely important', 'Very important', 'Somewhat important', 'Not so important', 'Not at all important'].map((i) => (
                        <div key={i} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`importance-${i}`}
                                value={i}
                                {...register('sectionD.esgImportance')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`importance-${i}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {i}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">12. What specific financial benefits do you associate with ESG adoption? (Select all that apply)</p>
                <div className="grid grid-cols-1 gap-3 pl-2 max-w-2xl">
                    {[
                        'Reduced operational costs',
                        'Increased revenue or customer loyalty',
                        'Reduced cost of borrowing',
                        'Enhanced brand reputation',
                        'Improved risk management',
                        'No financial benefits'
                    ].map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-900 hover:bg-gray-50 cursor-pointer transition-all">
                            <Checkbox
                                id={`benefit-${benefit}`}
                                checked={selectedBenefits.includes(benefit)}
                                onCheckedChange={() => handleBenefitToggle(benefit)}
                                className="h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-900"
                            />
                            <Label htmlFor={`benefit-${benefit}`} className="flex-grow cursor-pointer text-gray-700 font-medium">{benefit}</Label>
                        </div>
                    ))}
                </div>
                {errors.sectionD?.financialBenefits && <p className="text-red-500 text-sm mt-2 font-medium">{errors.sectionD.financialBenefits.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">13. To what extent do you agree that strong ESG performance leads to long-term profitability?</p>
                <div className="space-y-3 pl-2">
                    {Object.values(AgreementLevel).map((level) => (
                        <div key={level} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`profit-agree-${level}`}
                                value={level}
                                {...register('sectionD.profitabilityAgreement')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`profit-agree-${level}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {level}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionD?.profitabilityAgreement && <p className="text-red-500 text-sm mt-1">{errors.sectionD.profitabilityAgreement.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">14. Do you believe there is a measurable link between ESG and financial success?</p>
                <div className="space-y-3 pl-2">
                    {['Yes', 'No', 'Not sure'].map((option) => (
                        <div key={option} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`link-${option}`}
                                value={option}
                                {...register('sectionD.measurableLink')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`link-${option}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {option}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionD?.measurableLink && <p className="text-red-500 text-sm mt-1">{errors.sectionD.measurableLink.message}</p>}
            </div>
        </div>
    );
}

function SectionEStep() {
    const { register, setValue, watch, formState: { errors } } = useFormContext<SurveySchemaType>();
    const selectedChallenges = watch('sectionE.strategicChallenges') || [];

    const handleChallengeToggle = (item: string) => {
        const current = new Set(selectedChallenges);
        if (current.has(item)) {
            current.delete(item);
        } else {
            current.add(item);
        }
        setValue('sectionE.strategicChallenges', Array.from(current), { shouldValidate: true });
    };

    const barriers = [
        { id: 'financialConstraints', label: 'Limited financial resources' },
        { id: 'lackOfSkills', label: 'Lack of relevant skills/expertise' },
        { id: 'limitedData', label: 'Limited quality data to measure performance' },
        { id: 'resistanceToChange', label: 'Internal resistance to change' },
        { id: 'lackOfGuidance', label: 'Lack of clear regulatory guidance' }
    ];

    const levels = Object.values(BarrierSignificance);

    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">15. Primary Strategic Challenges (Select all that apply)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                    {[
                        'Lack of knowledge or expertise',
                        'Lack of structured ESG governance',
                        'Limited financial resources',
                        'Low regulatory pressure',
                        'Lack of industry ESG standards',
                        'Difficulty measuring ESG impact',
                        'Low management priority'
                    ].map(c => (
                        <div key={c} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-900 hover:bg-gray-50 cursor-pointer transition-all">
                            <Checkbox checked={selectedChallenges.includes(c)} onCheckedChange={() => handleChallengeToggle(c)} className="h-5 w-5 data-[state=checked]:bg-blue-900" />
                            <Label className="cursor-pointer text-gray-700 font-medium">{c}</Label>
                        </div>
                    ))}
                </div>
                {errors.sectionE?.strategicChallenges && <p className="text-red-500 text-sm mt-2 font-medium">{errors.sectionE.strategicChallenges.message}</p>}
            </div>

            <div className="space-y-6">
                <p className="text-lg font-medium text-gray-700 italic">16. Rate the significance of the following barriers:</p>
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full text-sm border-collapse bg-white">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-4 text-left border-b font-semibold text-gray-600">Barrier</th>
                                {levels.map(l => <th key={l} className="p-2 border-b text-center text-xs font-medium text-gray-500 w-24">{l}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {barriers.map((b, idx) => (
                                <tr key={b.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="p-4 font-medium text-gray-700">{b.label}</td>
                                    {levels.map(l => (
                                        <td key={l} className="p-2 text-center">
                                            <div className="flex justify-center">
                                                <input
                                                    type="radio"
                                                    value={l}
                                                    className="h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                                                    {...register(`sectionE.barrierSignificance.${b.id}` as any)}
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SectionFStep() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<SurveySchemaType>();
    const selectedIndicators = watch('sectionF.trackedIndicators') || [];

    const handleIndicatorToggle = (item: string) => {
        const current = new Set(selectedIndicators);
        if (current.has(item)) current.delete(item);
        else current.add(item);
        setValue('sectionF.trackedIndicators', Array.from(current), { shouldValidate: true });
    };

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">17. How prepared is your company internally for mandatory ESG reporting?</p>
                <div className="space-y-3 pl-2">
                    {['Fully prepared', 'Moderately prepared', 'Not prepared', 'Not sure'].map(r => (
                        <div key={r} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`ready-${r}`}
                                value={r}
                                {...register('sectionF.readiness')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`ready-${r}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {r}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionF?.readiness && <p className="text-red-500 text-sm mt-1">{errors.sectionF.readiness.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">18. Does your company have a dedicated ESG or Sustainability team?</p>
                <div className="space-y-3 pl-2">
                    {['Yes', 'No', 'Under discussion'].map(option => (
                        <div key={option} className="flex items-start space-x-3 group">
                            <input
                                type="radio"
                                id={`team-${option}`}
                                value={option}
                                {...register('sectionF.dedicatedESGTeam')}
                                className="mt-1 h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900 cursor-pointer"
                            />
                            <Label htmlFor={`team-${option}`} className="text-gray-700 cursor-pointer text-base leading-tight pt-1 group-hover:text-blue-900 transition-colors">
                                {option}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.sectionF?.dedicatedESGTeam && <p className="text-red-500 text-sm mt-1">{errors.sectionF.dedicatedESGTeam.message}</p>}
            </div>

            <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">19. Which indicators are currently tracked? (Select all that apply)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                    {[
                        'Energy consumption',
                        'CO₂ emissions',
                        'Employee satisfaction metrics',
                        'Data privacy or security incidents',
                        'Governance or compliance indicators'
                    ].map(i => (
                        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-900 hover:bg-gray-50 cursor-pointer transition-all">
                            <Checkbox checked={selectedIndicators.includes(i)} onCheckedChange={() => handleIndicatorToggle(i)} className="h-5 w-5 data-[state=checked]:bg-blue-900" />
                            <Label className="cursor-pointer text-gray-700 font-medium">{i}</Label>
                        </div>
                    ))}
                </div>
                {errors.sectionF?.trackedIndicators && <p className="text-red-500 text-sm mt-2 font-medium">{errors.sectionF.trackedIndicators.message}</p>}
            </div>
        </div>
    );
}

function SectionGStep() {
    const { register } = useFormContext<SurveySchemaType>();
    return (
        <div className="space-y-4">
            <p className="text-lg font-medium text-gray-700">20. What recommendations would you give for improving ESG adoption in the Cameroon telecom sector?</p>
            <div className="pt-2">
                <Textarea
                    placeholder="Type your recommendations here..."
                    className="min-h-[150px] border-2 focus:border-blue-900 p-4 text-base focus:ring-0"
                    {...register('sectionG.recommendations')}
                />
            </div>
        </div>
    );
}

// Helper hook for form context
import { useFormContext } from 'react-hook-form';
