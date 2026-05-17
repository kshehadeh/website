import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

export function tailWindClassFromTextColor(color: string) {
    switch (color) {
        case 'gray':
            return 'text-muted-foreground';
        case 'brown':
            return 'text-amber-600 dark:text-amber-500';
        case 'orange':
            return 'text-orange-600 dark:text-orange-500';
        case 'yellow':
            return 'text-yellow-600 dark:text-yellow-500';
        case 'green':
            return 'text-emerald-600 dark:text-emerald-500';
        case 'blue':
            return 'text-blue-600 dark:text-blue-500';
        case 'purple':
            return 'text-purple-600 dark:text-purple-500';
        case 'pink':
            return 'text-pink-600 dark:text-pink-500';
        case 'red':
            return 'text-red-600 dark:text-red-500';
        case 'gray_background':
            return 'text-foreground bg-muted p-1 rounded-md';
        case 'brown_background':
            return 'text-foreground bg-amber-100 dark:bg-amber-900/30 p-1 rounded-md';
        case 'orange_background':
            return 'text-foreground bg-orange-100 dark:bg-orange-900/30 p-1 rounded-md';
        case 'yellow_background':
            return 'text-foreground bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded-md';
        case 'green_background':
            return 'text-foreground bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-md';
        case 'blue_background':
            return 'text-foreground bg-blue-100 dark:bg-blue-900/30 p-1 rounded-md';
        case 'purple_background':
            return 'text-foreground bg-purple-100 dark:bg-purple-900/30 p-1 rounded-md';
        case 'pink_background':
            return 'text-foreground bg-pink-100 dark:bg-pink-900/30 p-1 rounded-md';
        case 'red_background':
            return 'text-foreground bg-red-100 dark:bg-red-900/30 p-1 rounded-md';
        default:
            return '';
    }
}

export function tailWindClassFromBgColor(color: string) {
    switch (color) {
        case 'default':
            return 'bg-background';
        case 'gray':
            return 'bg-muted';
        case 'brown':
            return 'bg-amber-100 dark:bg-amber-900/30';
        case 'orange':
            return 'bg-orange-100 dark:bg-orange-900/30';
        case 'yellow':
            return 'bg-yellow-100 dark:bg-yellow-900/30';
        case 'green':
            return 'bg-emerald-100 dark:bg-emerald-900/30';
        case 'blue':
            return 'bg-blue-100 dark:bg-blue-900/30';
        case 'purple':
            return 'bg-purple-100 dark:bg-purple-900/30';
        case 'pink':
            return 'bg-pink-100 dark:bg-pink-900/30';
        case 'red':
            return 'bg-red-100 dark:bg-red-900/30';
        default:
            return 'bg-background';
    }
}

export function tailWindClassesFromTextAnnotations(
    annotations: RichTextItemResponse['annotations'],
): string[] {
    const classes = [];
    if (annotations.bold) {
        classes.push('font-bold');
    }
    if (annotations.italic) {
        classes.push('italic');
    }
    if (annotations.strikethrough) {
        classes.push('line-through');
    }
    if (annotations.underline) {
        classes.push('underline');
    }
    if (annotations.code) {
        classes.push('font-mono');
    }
    if (annotations.color) {
        classes.push(tailWindClassFromTextColor(annotations.color));
    }
    return classes;
}

export function tailWindClassesFromQuoteColor(color: string): string[] {
    const baseQuoteTone = ['text-foreground', 'pr-4', 'py-3', 'rounded-r-md'];

    switch (color) {
        case 'gray':
            return [
                ...baseQuoteTone,
                'border-l-muted-foreground/60',
                'bg-muted/35',
            ];
        case 'brown':
            return [
                ...baseQuoteTone,
                'border-l-amber-600/50',
                'dark:border-l-amber-500/50',
                'bg-amber-100/50',
                'dark:bg-amber-900/20',
            ];
        case 'orange':
            return [
                ...baseQuoteTone,
                'border-l-orange-600/50',
                'dark:border-l-orange-500/50',
                'bg-orange-100/50',
                'dark:bg-orange-900/20',
            ];
        case 'yellow':
            return [
                ...baseQuoteTone,
                'border-l-yellow-600/50',
                'dark:border-l-yellow-500/50',
                'bg-yellow-100/50',
                'dark:bg-yellow-900/20',
            ];
        case 'green':
            return [
                ...baseQuoteTone,
                'border-l-emerald-600/50',
                'dark:border-l-emerald-500/50',
                'bg-emerald-100/50',
                'dark:bg-emerald-900/20',
            ];
        case 'blue':
            return [
                ...baseQuoteTone,
                'border-l-blue-600/50',
                'dark:border-l-blue-500/50',
                'bg-blue-100/50',
                'dark:bg-blue-900/20',
            ];
        case 'purple':
            return [
                ...baseQuoteTone,
                'border-l-purple-600/50',
                'dark:border-l-purple-500/50',
                'bg-purple-100/50',
                'dark:bg-purple-900/20',
            ];
        case 'pink':
            return [
                ...baseQuoteTone,
                'border-l-pink-600/50',
                'dark:border-l-pink-500/50',
                'bg-pink-100/50',
                'dark:bg-pink-900/20',
            ];
        case 'red':
            return [
                ...baseQuoteTone,
                'border-l-red-600/50',
                'dark:border-l-red-500/50',
                'bg-red-100/50',
                'dark:bg-red-900/20',
            ];
        case 'gray_background':
            return [
                ...baseQuoteTone,
                'border-l-muted-foreground/60',
                'bg-muted/45',
            ];
        case 'brown_background':
            return [
                ...baseQuoteTone,
                'border-l-amber-600/50 dark:border-l-amber-500/50',
                'bg-amber-100/60 dark:bg-amber-900/25',
            ];
        case 'orange_background':
            return [
                ...baseQuoteTone,
                'border-l-orange-600/50 dark:border-l-orange-500/50',
                'bg-orange-100/60 dark:bg-orange-900/25',
            ];
        case 'yellow_background':
            return [
                ...baseQuoteTone,
                'border-l-yellow-600/50 dark:border-l-yellow-500/50',
                'bg-yellow-100/60 dark:bg-yellow-900/25',
            ];
        case 'green_background':
            return [
                ...baseQuoteTone,
                'border-l-emerald-600/50 dark:border-l-emerald-500/50',
                'bg-emerald-100/60 dark:bg-emerald-900/25',
            ];
        case 'blue_background':
            return [
                ...baseQuoteTone,
                'border-l-blue-600/50 dark:border-l-blue-500/50',
                'bg-blue-100/60 dark:bg-blue-900/25',
            ];
        case 'purple_background':
            return [
                ...baseQuoteTone,
                'border-l-purple-600/50 dark:border-l-purple-500/50',
                'bg-purple-100/60 dark:bg-purple-900/25',
            ];
        case 'pink_background':
            return [
                ...baseQuoteTone,
                'border-l-pink-600/50 dark:border-l-pink-500/50',
                'bg-pink-100/60 dark:bg-pink-900/25',
            ];
        case 'red_background':
            return [
                ...baseQuoteTone,
                'border-l-red-600/50 dark:border-l-red-500/50',
                'bg-red-100/60 dark:bg-red-900/25',
            ];
        default:
            return [];
    }
}
