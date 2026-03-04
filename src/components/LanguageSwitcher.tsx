'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function onValueChange(value: string) {
        const params = searchParams.toString();
        const url = params ? `${pathname}?${params}` : pathname;
        router.replace(url, { locale: value });
    }

    return (
        <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-blue-900" />
            <Select value={locale} onValueChange={onValueChange}>
                <SelectTrigger className="w-[120px] h-9 border-blue-900 text-blue-900 font-semibold focus:ring-blue-900 bg-white">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
