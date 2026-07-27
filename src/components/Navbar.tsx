"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "/commission", label: "Commission" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-clay-200/60 bg-paper-50/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl italic text-clay-700">
          Vartika Collection
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm tracking-wide transition-colors hover:text-clay-500 ${
                  pathname === link.href ? "text-clay-600" : "text-clay-800"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-clay-200/60 md:hidden"
          >
            {links.map((link) => (
              <li key={link.href} className="border-b border-clay-200/40">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-clay-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
