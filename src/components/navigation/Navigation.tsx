'use client';

import { useState } from 'react';
import Link from 'next/link';
import { navigationItems, contactInfo } from '@/data/neighborhood-data';
import { X, Menu, Mail, Phone, Instagram } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-light tracking-wider text-black">
            53W53
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/inquire"
              className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Inquire
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-black hover:text-gray-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={toggleMenu} />
          <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={toggleMenu}
                  className="p-2 text-black hover:text-gray-600 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-6 mb-12">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    className="block text-lg font-medium text-black hover:text-gray-600 transition-colors duration-200 tracking-wide"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Contact Information */}
              <div className="space-y-4 border-t border-gray-200 pt-8">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Mail size={20} />
                  <span className="text-sm">Email</span>
                </a>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center space-x-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Phone size={20} />
                  <span className="text-sm">Phone</span>
                </a>
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Instagram size={20} />
                  <span className="text-sm">Instagram</span>
                </a>
                <Link
                  href={contactInfo.press}
                  onClick={toggleMenu}
                  className="block text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Press
                </Link>
              </div>

              {/* Mobile CTA Button */}
              <div className="mt-8">
                <Link
                  href="/inquire"
                  onClick={toggleMenu}
                  className="block w-full bg-black text-white text-center px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
