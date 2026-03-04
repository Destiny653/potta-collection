'use client';

import React, { useState } from 'react';
import SurveyForm from '@/components/SurveyForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, ArrowRight, Building2, LayoutDashboard, Microscope, BookOpen, AlertCircle, Award, Lock, UserCheck } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function SurveyPage() {
  const t = useTranslations('Home');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const hasAgreed = searchParams.get('agreed') === 'true';
  const [checked, setChecked] = useState(false);

  const handleProceed = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('agreed', 'true');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('agreed');
    router.replace(`${pathname}?${params.toString()}`);
  };

  React.useEffect(() => {
    if (hasAgreed) {
      window.scrollTo(0, 0);
    }
  }, [hasAgreed]);

  if (!hasAgreed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-0 py-0">
        <Toaster position="top-right" />
        <Card className="max-w-7xl w-full shadow-none border-none border-t-8 border-t-blue-900 bg-white">
          <CardHeader className="text-center space-y-6 pb-8 border-b border-gray-100">
            <div className="flex justify-between items-start pt-2 px-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-blue-900" />
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="px-4">
              <CardTitle className="text-2xl md:text-4xl font-extrabold text-blue-900 leading-tight">
                {t('title')}
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
                <Microscope className="h-5 w-5" /> - {t('purposeTitle')}
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                {t('purposeContent')}
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <BookOpen className="h-5 w-5" /> - {t('proceduresTitle')}
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                {t('proceduresContent')}
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <AlertCircle className="h-5 w-5" /> - {t('risksTitle')}
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                {t('risksContent')}
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <Award className="h-5 w-5" /> - {t('benefitsTitle')}
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                {t('benefitsContent')}
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <Lock className="h-5 w-5" /> - {t('confidentialityTitle')}
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                {t('confidentialityContent')}
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                <ShieldCheck className="h-5 w-5 text-green-600" /> - {t('voluntaryTitle')}
              </h3>
              <p className="text-gray-700 leading-relaxed pl-7">
                {t('voluntaryContent')}
              </p>
            </section>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 bg-gray-50/80 p-2 border-t">
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
                {t('agreementLabel')}
              </label>
            </div>

            <div className="w-full flex justify-center">
              <Button
                className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 py-6 sm:py-8 px-12 sm:px-20 text-lg sm:text-xl text-white font-bold shadow-xl transition-all active:scale-[0.98] disabled:bg-blue-600 rounded-xl flex items-center justify-center h-auto"
                disabled={!checked}
                onClick={handleProceed}
              >
                {t('proceedButton')} <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
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
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-2 pt-10">
        <SurveyForm onBack={handleBack} />
      </div>
    </main>
  );
}
