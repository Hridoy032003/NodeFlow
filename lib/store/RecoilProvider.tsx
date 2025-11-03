"use client";

import { RecoilRoot } from 'recoil';
import { ReactNode } from 'react';

export function RecoilProvider({ children }: { children: ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
