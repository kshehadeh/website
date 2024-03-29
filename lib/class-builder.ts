import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

export function tailWindClassFromTextColor(color: string) {
    switch (color) {
        case 'gray':
            return 'text-gray-500';
        case 'brown':
            return 'text-yellow-600';
        case 'orange':
            return 'text-orange-500';
        case 'yellow':
            return 'text-yellow-500';
        case 'green':
            return 'text-green-500';
        case 'blue':
            return 'text-blue-500';
        case 'purple':
            return 'text-purple-500';
        case 'pink':
            return 'text-pink-500';
        case 'red':
            return 'text-red-500';
        case 'gray_background':
            return 'text-gray-900 bg-gray-500 p-1 rounded-md';
        case 'brown_background':
            return 'text-gray-900 bg-yellow-500 p-1 rounded-md';
        case 'orange_background':
            return 'text-gray-900 bg-orange-500 p-1 rounded-md';
        case 'yellow_background':
            return 'text-gray-900 bg-yellow-500 p-1 rounded-md';
        case 'green_background':
            return 'text-gray-900 bg-green-500 p-1 rounded-md';
        case 'blue_background':
            return 'text-gray-900 bg-blue-500 p-1 rounded-md';
        case 'purple_background':
            return 'text-gray-900 bg-purple-500 p-1 rounded-md';
        case 'pink_background':
            return 'text-gray-900 bg-pink-500 p-1 rounded-md';
        case 'red_background':
            return 'text-gray-900 bg-red-500 p-1 rounded-md';
        default:
            return '';
    }
}

export function tailWindClassFromBgColor(color: string) {
    switch (color) {
        case 'default':
            return 'bg-gray-900';
        case 'gray':
            return 'bg-gray-500';
        case 'brown':
            return 'bg-yellow-600';
        case 'orange':
            return 'bg-orange-500';
        case 'yellow':
            return 'bg-yellow-500';
        case 'green':
            return 'bg-green-500';
        case 'blue':
            return 'bg-blue-500';
        case 'purple':
            return 'bg-purple-500';
        case 'pink':
            return 'bg-pink-500';
        case 'red':
            return 'bg-red-500';
        default:
            return 'bg-gray-900';
    }
}

export function tailWindClassesFromTextAnnotations(
    annotations: TextRichTextItemResponse['annotations'],
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
