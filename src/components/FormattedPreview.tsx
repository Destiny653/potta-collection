'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { generateFormattedOutput } from '@/lib/generateFormattedOutput';
import { SurveySchemaType } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

export default function FormattedPreview() {
    const { watch } = useFormContext<SurveySchemaType>();
    const formData = watch();

    const html = generateFormattedOutput(formData);

    const downloadHtml = () => {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ESG_Survey_Preview_${new Date().getTime()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <p className="text-sm text-gray-500">This is how your final submission will look</p>
                </div>
                <Button onClick={downloadHtml} variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download HTML
                </Button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg border min-h-[400px] overflow-auto max-h-[600px]">
                <div
                    className="bg-white shadow-lg mx-auto transform scale-90 origin-top"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    );
}
