
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects root-level /strategist to /dashboard/strategist 
 * to ensure the user is within the authenticated dashboard layout.
 */
export default function StrategistRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/strategist');
  }, [router]);

  return null;
}
