/**
 * Header Component
 * 
 * Top navigation bar with branding and wallet connection.
 */

'use client';

import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Github, BookOpen } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--polkadot-pink)] to-[var(--polkadot-purple)]">
            <span className="text-xl font-bold text-white">CP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              ChainLink Portfolio
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Cross-Chain Asset Tracker
            </p>
          </div>
        </div>

        {/* Nav and Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="https://wiki.polkadot.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </Link>
            <Link
              href="https://github.com/yourusername/chainlink-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </nav>
          
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}


