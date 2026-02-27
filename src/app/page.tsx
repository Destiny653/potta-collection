'use client';

import React, { useState } from 'react';
import SurveyForm from '@/components/SurveyForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, ArrowRight, Building2, LayoutDashboard, Microscope, BookOpen, AlertCircle, Award, Lock, UserCheck } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function SurveyPage() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [checked, setChecked] = useState(false);

  if (!hasAgreed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
        <Toaster position="top-right" />
        <Card className="max-w-7xl w-full shadow-none border-none border-t-8 border-t-blue-900 bg-white">
          <CardHeader className="text-center space-y-6 pb-8 border-b border-gray-100">
            <div className="flex justify-between items-start pt-2 px-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-blue-900" />
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-blue-900 hover:bg-blue-50 font-semibold gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            </div>
            <div className="px-4">
              <CardTitle className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-tight">
                The Impact of ESG adoption on Sustainable Financial Performance in your Organization
              </CardTitle>
              <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-700" />
                  <span className="font-semibold text-gray-900">Kenneth KOME Echalle</span>
                </div>
                <div className="hidden md:block text-gray-300">|</div>
                <div className="text-sm font-medium">Robert Kennedy College - University of Cumbria</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <Microscope className="h-5 w-5" /> 1. Purpose of the Study
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                This study aims to investigate on how Cameroonian Mobile Telecoms can leverage structured ESG adoption to secure long-term financial performance in a growing market.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <BookOpen className="h-5 w-5" /> 2. Procedures
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                If you agree to participate, you are required to complete a questionnaire that follows. This questionnaire will require you to provide the name of your organization, your level in the organization’s hierarchy, your role, and the years of experience you have in ESG related topics. Then you will be required to provide your opinion on how ESG is being practiced by your organization by answering YES/NO question, and providing a few recommendations at the end. You are not required to disclose your personal information in at any time in the survey.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <AlertCircle className="h-5 w-5" /> 3. Risks and Discomforts
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 ml-7">
                <p className="text-red-900 font-medium italic">
                  &quot;You might face retaliation risks from your employer if you provide negative feedback on ESG practices and this comes to their notice.&quot;
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <Award className="h-5 w-5" /> 4. Benefits
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                You may benefit from this study if your organization implements actions that bring positive social and financial benefits for employees although this cannot be guaranteed. You should also be proud to contribute to the creation of new knowledge on ESG adoption in Cameroon.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <Lock className="h-5 w-5" /> 5. Confidentiality
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                Your personal information will be protected and stored securely.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <ShieldCheck className="h-5 w-5 text-green-600" /> 6. Voluntary Participation
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                Participation is voluntary, and you may withdraw at any time without penalty. You are free to fully disclose, partially disclose or not disclose at all any information you deem to sensitive to be made available to outsiders, without any penalties.
              </p>
            </section>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 bg-gray-50/80 p-8 border-t">
            <div className="flex items-start space-x-4 p-5 border-2 border-blue-100 rounded-xl bg-white hover:border-blue-300 transition-all cursor-pointer group">
              <div className="pt-1">
                <Checkbox
                  id="terms"
                  checked={checked}
                  onCheckedChange={(val) => setChecked(!!val)}
                  className="h-6 w-6 border-2 border-blue-200 data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
                />
              </div>
              <label
                htmlFor="terms"
                className="text-base font-semibold leading-snug cursor-pointer select-none text-gray-800 group-hover:text-blue-900 transition-colors"
              >
                I have read the ABOVE information and AGREE to participate in this study under the stated conditions.
              </label>
            </div>

            <Button
              className="w-full bg-blue-900 hover:bg-blue-800 py-8 text-xl text-white font-bold shadow-xl transition-all active:scale-[0.98] disabled:bg-blue-600"
              disabled={!checked}
              onClick={() => setHasAgreed(true)}
            >
              Proceed <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <Toaster position="top-right" />
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-900" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-blue-900 leading-none">ESG Survey</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Telecom | Cameroon</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hidden md:flex border-blue-900 text-blue-900 font-semibold gap-2 hover:bg-blue-50">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <SurveyForm />
      </div>
    </main>
  );
}
