"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link } from "@/i18n/navigation";
import { useTransitionNavigate } from "@/components/providers/PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function TransitionLink({ href, onClick, ...props }: Props) {
  const navigate = useTransitionNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} scroll={false} {...props} />;
}
