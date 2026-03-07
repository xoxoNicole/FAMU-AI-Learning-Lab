
"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

/**
 * Redirects root-level /modules/[id] to /dashboard/modules/[id]
 */
export default function ModuleDetailRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      router.replace(`/dashboard/modules/${params.id}`);
    } else {
      router.replace('/dashboard/modules');
    }
  }, [router, params]);

  return null;
}
