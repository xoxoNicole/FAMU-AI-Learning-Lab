
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects root-level /modules to /dashboard/modules
 */
export default function ModulesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/modules');
  }, [router]);

  return null;
}
