import { ResumePage } from '@/components/Resume/ResumePage';
import React from 'react';

export const revalidate = 60 * 20; // 1 hour

export default async function Page() {
    return <ResumePage printerFriendly={true} />;
}
