import { DateTime } from 'luxon';

export function cls(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export function toDate(date?: string): DateTime | undefined {
    return date ? DateTime.fromFormat(date, 'yyyy-MM-dd') : undefined;
}

export function formatDate(date: string) {
    return toDate(date)?.toFormat('yyyy');
}
