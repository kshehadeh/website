import { ResumePage } from '@/components/Resume/ResumePage';
import React from 'react';

export const revalidate = 60 * 60; // 1 hour

export default async function Page() {
    return (<ResumePage />)
}
