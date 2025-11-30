import { DateTime } from 'luxon';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function cls(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export function toDate(date?: string): DateTime | undefined {
    return date ? DateTime.fromFormat(date, 'yyyy-MM-dd') : undefined;
}

export function formatDate(date: string) {
    return toDate(date)?.toFormat('yyyy');
}
