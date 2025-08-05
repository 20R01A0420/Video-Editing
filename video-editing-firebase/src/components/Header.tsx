"use client";

import React from 'react';
import { Icons } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-start gap-4 px-4 md:px-8">
        <Icons.logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          ReelTime <span className="text-primary">Studio</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
