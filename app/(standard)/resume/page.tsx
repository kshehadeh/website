import { ResumePage } from '@/components/Resume/ResumePage';
import timeouts from '@/lib/timeouts';
import React from 'react';

export const revalidate = timeouts.resume;

export default async function Page() {
    return <ResumePage printerFriendly={false} />;
}
