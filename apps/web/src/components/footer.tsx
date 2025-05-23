'use client';

import {
  DATABASE_DUMPS_URL,
  DEVELOPER_GITHUB_URL,
  DEVELOPER_INSTAGRAM_URL,
  DEVELOPER_SITE_URL,
  DEVELOPER_TWITTER_URL,
  GITHUB_REPO_URL,
  TWITTER_URL,
} from '@/constants/GLOBALS';
import { cn } from '@/utils/conversions/cn';
import React from 'react';
import { RandomPoemButton } from './random-poem-button';

type Props = {
  className?: string;
};

type FooterLinkProps = {
  label: string;
  href: string;
  screenReadersOnly: boolean;
};

const footerLinks: readonly FooterLinkProps[] = [
  // visible
  { label: 'البريد', href: 'mailto:contact@qafiyah.com', screenReadersOnly: false },
  { label: 'التويتر', href: TWITTER_URL, screenReadersOnly: false },
  { label: 'الكود', href: GITHUB_REPO_URL, screenReadersOnly: false },
  { label: 'البيانات', href: DATABASE_DUMPS_URL, screenReadersOnly: false },
  { label: 'المطور', href: DEVELOPER_SITE_URL, screenReadersOnly: false },
  // screen readers only
  { label: 'تويتر المطور', href: DEVELOPER_TWITTER_URL, screenReadersOnly: true },
  { label: 'إنستغرام المطور', href: DEVELOPER_INSTAGRAM_URL, screenReadersOnly: true },
  { label: 'قتهب المطور', href: DEVELOPER_GITHUB_URL, screenReadersOnly: true },
] as const;

function FooterLink({ label, href, screenReadersOnly }: FooterLinkProps) {
  return (
    <a
      aria-hidden={screenReadersOnly}
      tabIndex={screenReadersOnly ? -1 : 0}
      className={cn('hover:cursor-pointer hover:underline', screenReadersOnly && 'sr-only')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export function Footer({ className }: Props) {
  const visibleLinks = footerLinks.filter((link) => !link.screenReadersOnly);

  return (
    <footer
      className={cn(
        'relative w-full flex justify-between items-center py-4 text-xs xss:text-sm md:text-base xl:text-lg text-zinc-600 gap-4',
        className
      )}
    >
      <div className="flex md:gap-3 gap-[5px]">
        {visibleLinks.map((link, index) => (
          <React.Fragment key={link.href}>
            {index > 0 && <p className="opacity-65">•</p>}
            <FooterLink {...link} />
          </React.Fragment>
        ))}

        {/* Screen reader–only links rendered separately */}
        {footerLinks
          .filter((link) => link.screenReadersOnly)
          .map((link) => (
            <FooterLink key={link.href} {...link} />
          ))}
      </div>

      <RandomPoemButton />
    </footer>
  );
}
