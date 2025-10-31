import React, { PropsWithChildren } from 'react';
import Image from 'next/image';

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
            className={`list-inside mt-2 mb-2 leading-normal text-gray-600  ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </ul>
    );
}

export function OL({ children, additionalClasses }: PrimitiveProps) {
    return (
        <ol
            className={`list-inside mt-2 mb-2 leading-normal text-gray-600  ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </ol>
    );
}

export function LI({ children, additionalClasses }: PrimitiveProps) {
    return (
        <li
            className={`mt-2 mb-2 leading-normal text-gray-600  ${buildAdditionalClasses(additionalClasses)}`}
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
            className={`text-blue-600 hover:text-purple-60 ${buildAdditionalClasses(additionalClasses)}`}
            href={href}
            target={target}
        >
            {children}
        </a>
    );
}

export function HR({ additionalClasses }: PrimitiveProps) {
    return (
        <hr
            className={`my-4 border-gray-200 ${buildAdditionalClasses(additionalClasses)}`}
        />
    );
}

export function Blockquote({ children, additionalClasses }: PrimitiveProps) {
    return (
        <blockquote
            className={`border-l-4 border-gray-200 pl-4 my-4 ${buildAdditionalClasses(additionalClasses)}`}
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
            className={`text-sm bg-gray-100 p-1 rounded ${buildAdditionalClasses(additionalClasses)}`}
            data-lang={language}
        >
            {children}
        </code>
    );
}

export function Pre({ children, additionalClasses }: PrimitiveProps) {
    return (
        <pre
            className={`bg-gray-100  p-1 rounded ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </pre>
    );
}

export function InlineCode({ children, additionalClasses }: PrimitiveProps) {
    return (
        <code
            className={`text-sm bg-gray-100  p-1 rounded ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </code>
    );
}

export function Strong({ children, additionalClasses }: PrimitiveProps) {
    return (
        <strong
            className={`font-semibold ${buildAdditionalClasses(additionalClasses)}`}
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
}: PrimitiveProps<{ src: string; alt: string; height?: number; width?: number }>) {
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
            className={`border px-4 py-2 ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </th>
    );
}

export function TD({ children, additionalClasses }: PrimitiveProps) {
    return (
        <td
            className={`border px-4 py-2 ${buildAdditionalClasses(additionalClasses)}`}
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
            className={`bg-white text-gray-700 p-4 mt-4 mb-4 rounded shadow ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </details>
    );
}

export function Summary({ children, additionalClasses }: PrimitiveProps) {
    return (
        <summary
            className={`cursor-pointer text-lg font-bold mb-2 text-gray-700 ${buildAdditionalClasses(additionalClasses)}`}
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
            className={`bg-gray-200 rounded px-1 ${buildAdditionalClasses(additionalClasses)}`}
        >
            {children}
        </span>
    );
}
