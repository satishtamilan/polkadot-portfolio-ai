/**
 * Footer Component
 * 
 * Bottom page footer with links and information.
 */

'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--card-border)]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">ChainLink Portfolio</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Track your assets across the Polkadot ecosystem.
              Built for the Polkadot Cloud Hackathon.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Resources</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link 
                  href="https://wiki.polkadot.network/" 
                  target="_blank"
                  className="text-[var(--text-secondary)] hover:text-[var(--polkadot-pink)] transition-colors"
                >
                  Polkadot Wiki
                </Link>
              </li>
              <li>
                <Link 
                  href="https://polkadot.js.org/docs/" 
                  target="_blank"
                  className="text-[var(--text-secondary)] hover:text-[var(--polkadot-pink)] transition-colors"
                >
                  Polkadot.js Docs
                </Link>
              </li>
              <li>
                <Link 
                  href="https://polkadot.devpost.com/" 
                  target="_blank"
                  className="text-[var(--text-secondary)] hover:text-[var(--polkadot-pink)] transition-colors"
                >
                  Hackathon
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Connect</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link 
                  href="https://github.com" 
                  target="_blank"
                  className="text-[var(--text-secondary)] hover:text-[var(--polkadot-pink)] transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link 
                  href="https://twitter.com" 
                  target="_blank"
                  className="text-[var(--text-secondary)] hover:text-[var(--polkadot-pink)] transition-colors"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-[var(--card-border)] pt-8 text-sm text-[var(--text-secondary)]">
          <span>Built with</span>
          <Heart className="h-4 w-4 fill-[var(--polkadot-pink)] text-[var(--polkadot-pink)]" />
          <span>for the Polkadot Cloud Hackathon</span>
        </div>
      </div>
    </footer>
  );
}


