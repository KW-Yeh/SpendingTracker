'use client';
import { AsideMenu } from '@/composites/AsideMenu';
import { Caption } from '@/composites/Caption';
import { useState } from 'react';

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Caption openAside={() => setOpen(true)} />
      <AsideMenu isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
