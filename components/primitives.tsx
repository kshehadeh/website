import React, { PropsWithChildren } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/util';
import { Separator } from '@/components/ui/separator';

export type PrimitiveProps<T = unknown> = T &
    PropsWithChildren & {
        additionalClasses?: string[];
    };

function buildAdditionalClasses(additionalClasses?: string[]) {
    return additionalClasses?.join(' ') || '';
}

export function UL({ children, additionalClasses }: PrimitiveProps) {
    return (
        <ul
            className={cn(
                'list-inside mt-2 mb-2 leading-normal text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </ul>
    );
}

export function OL({ children, additionalClasses }: PrimitiveProps) {
    return (
        <ol
            className={cn(
                'list-inside mt-2 mb-2 leading-normal text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </ol>
    );
}

export function LI({ children, additionalClasses }: PrimitiveProps) {
    return (
        <li
            className={cn(
                'mt-2 mb-2 leading-normal text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </li>
    );
}

export function A({
    children,
    href,
    target,
    additionalClasses,
}: PrimitiveProps<{ href: string; target?: string }>) {
    return (
        <a
            className={cn(
                'text-primary hover:text-primary/80 underline-offset-4 hover:underline',
                buildAdditionalClasses(additionalClasses),
            )}
            href={href}
            target={target}
        >
            {children}
        </a>
    );
}

export function HR({ additionalClasses }: PrimitiveProps) {
    return (
        <Separator
            className={cn('my-4', buildAdditionalClasses(additionalClasses))}
        />
    );
}

export function Blockquote({ children, additionalClasses }: PrimitiveProps) {
    return (
        <blockquote
            className={cn(
                'border-l-4 border-muted-foreground/30 pl-4 my-4 text-muted-foreground italic',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </blockquote>
    );
}

export function Code({
    children,
    language,
    additionalClasses,
}: PrimitiveProps<{ language: string }>) {
    return (
        <code
            className={cn(
                'text-sm bg-muted text-foreground p-1 rounded font-mono',
                buildAdditionalClasses(additionalClasses),
            )}
            data-lang={language}
        >
            {children}
        </code>
    );
}

export function Pre({ children, additionalClasses }: PrimitiveProps) {
    return (
        <pre
            className={cn(
                'bg-muted text-foreground p-4 rounded overflow-x-auto font-mono text-sm',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </pre>
    );
}

export function InlineCode({ children, additionalClasses }: PrimitiveProps) {
    return (
        <code
            className={cn(
                'text-sm bg-muted text-foreground px-1.5 py-0.5 rounded font-mono',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </code>
    );
}

export function Strong({ children, additionalClasses }: PrimitiveProps) {
    return (
        <strong
            className={cn(
                'font-semibold text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </strong>
    );
}

export function Em({ children, additionalClasses }: PrimitiveProps) {
    return (
        <em className={`italic ${buildAdditionalClasses(additionalClasses)}`}>
            {children}
        </em>
    );
}

export function Del({ children, additionalClasses }: PrimitiveProps) {
    return (
        <del
            className={`line-through ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </del>
    );
}

export function Br() {
    return <br />;
}

export function Img({
    src,
    alt,
    height,
    width,
    additionalClasses,
}: PrimitiveProps<{
    src: string;
    alt: string;
    height?: number;
    width?: number;
}>) {
    // Use provided dimensions or defaults (CSS will handle responsive sizing)
    const imageWidth = width || 800;
    const imageHeight = height || 600;

    return (
        <Image
            src={src}
            alt={alt}
            width={imageWidth}
            height={imageHeight}
            className={`rounded ${buildAdditionalClasses(additionalClasses)}`}
            unoptimized
        />
    );
}

export function Table({ children, additionalClasses }: PrimitiveProps) {
    return (
        <table
            className={`table-auto ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </table>
    );
}

export function THead({ children, additionalClasses }: PrimitiveProps) {
    return (
        <thead className={buildAdditionalClasses(additionalClasses)}>
            {children}
        </thead>
    );
}

export function TBody({ children, additionalClasses }: PrimitiveProps) {
    return (
        <tbody className={buildAdditionalClasses(additionalClasses)}>
            {children}
        </tbody>
    );
}

export function TR({ children, additionalClasses }: PrimitiveProps) {
    return (
        <tr className={buildAdditionalClasses(additionalClasses)}>
            {children}
        </tr>
    );
}

export function TH({ children, additionalClasses }: PrimitiveProps) {
    return (
        <th
            className={cn(
                'border border-border px-4 py-2 bg-muted font-semibold text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </th>
    );
}

export function TD({ children, additionalClasses }: PrimitiveProps) {
    return (
        <td
            className={cn(
                'border border-border px-4 py-2 text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </td>
    );
}

export function Div({ children, additionalClasses }: PrimitiveProps) {
    return (
        <div className={buildAdditionalClasses(additionalClasses)}>
            {children}
        </div>
    );
}

export function Span({ children, additionalClasses }: PrimitiveProps) {
    return (
        <span className={buildAdditionalClasses(additionalClasses)}>
            {children}
        </span>
    );
}

export function Legend({ children, additionalClasses }: PrimitiveProps) {
    return (
        <legend className={buildAdditionalClasses(additionalClasses)}>
            {children}
        </legend>
    );
}

export function Emoji({ emoji }: { emoji: string }) {
    return (
        <span role="img" aria-label="emoji">
            {emoji}
        </span>
    );
}

export function Details({ children, additionalClasses }: PrimitiveProps) {
    return (
        <details
            className={cn(
                'bg-card text-card-foreground p-4 mt-4 mb-4 rounded border border-border shadow-sm',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </details>
    );
}

export function Summary({ children, additionalClasses }: PrimitiveProps) {
    return (
        <summary
            className={cn(
                'cursor-pointer text-lg font-semibold mb-2 text-foreground',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </summary>
    );
}

export function Figure({ children, additionalClasses }: PrimitiveProps) {
    return (
        <figure className={`my-4 ${buildAdditionalClasses(additionalClasses)}`}>
            {children}
        </figure>
    );
}

export function Mention({ children, additionalClasses }: PrimitiveProps) {
    return (
        <span
            className={cn(
                'bg-muted text-muted-foreground rounded px-1.5 py-0.5',
                buildAdditionalClasses(additionalClasses),
            )}
        >
            {children}
        </span>
    );
}
