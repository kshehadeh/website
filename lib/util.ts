import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function cls(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string) {
    return date.slice(0, 4);
}
