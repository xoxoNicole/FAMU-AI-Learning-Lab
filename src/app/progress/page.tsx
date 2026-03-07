
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects root-level /progress to /dashboard/progress
 */
export default function ProgressRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/progress');
  }, [router]);

  return null;
}
