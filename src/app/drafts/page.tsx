
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects root-level /drafts to /dashboard/drafts
 */
export default function DraftsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/drafts');
  }, [router]);

  return null;
}
