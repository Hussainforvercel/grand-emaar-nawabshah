'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, LogOut, ShieldAlert, Utensils, X } from 'lucide-react';

interface AdminSidebarProps {
  onLogout: () => void;
  adminEmail: string;
  isDemoMode: boolean;
}

export default function AdminSidebar({
  onLogout,
  adminEmail,
  isDemoMode,
}: AdminSidebarProps) {
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  const openLogoutPopup = () => {
    setIsLogoutPopupOpen(true);
  };

  const closeLogoutPopup = () => {
    setIsLogoutPopupOpen(false);
  };

  const confirmLogout = () => {
    setIsLogoutPopupOpen(false);
    onLogout();
  };

  useEffect(() => {
    if (isLogoutPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLogoutPopupOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLogoutPopup();
      }
    };

    if (isLogoutPopupOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isLogoutPopupOpen]);

  return (
    <>
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between h-full text-white">
        <div>
          {/* Sidebar Logo */}
          <div className="p-6 border-b border-neutral-800">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-[#C5A059] transition-colors">
                GRAND EMAAR
              </span>
              <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#C5A059] font-semibold -mt-0.5">
                Admin Interface
              </span>
            </Link>
          </div>

          {/* Navigation list */}
          <nav className="p-4 space-y-1.5 text-left">
            <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase block px-3 mb-2">
              Control Panel
            </span>

            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#C5A059]/10 border border-[#C5A059]/15 text-[#C5A059] rounded-sm text-sm font-semibold">
              <Utensils className="w-4 h-4" />
              <span>Manage Food Menu</span>
            </div>
          </nav>
        </div>

        {/* Admin Profile and Logout */}
        <div className="p-4 border-t border-neutral-800 space-y-4">
          {/* Badge Indicator */}
          {isDemoMode && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-[10px] text-yellow-500 space-y-1 text-left">
              <div className="flex items-center gap-1 font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Offline Mode</span>
              </div>

              <p className="font-light text-[9px] text-neutral-400">
                Database changes are cached in localStorage.
              </p>
            </div>
          )}

          <div className="text-left px-3">
            <p className="text-[10px] uppercase font-mono text-neutral-500">
              Sign-In Role
            </p>

            <p className="text-xs font-semibold text-neutral-300 truncate">
              {adminEmail || 'admin@grandemaar.com'}
            </p>
          </div>

          <button
            onClick={openLogoutPopup}
            id="admin-logout-sidebar-btn"
            type="button"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Popup */}
      {isLogoutPopupOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close logout popup overlay"
            onClick={closeLogoutPopup}
            className="absolute inset-0 w-full h-full cursor-default"
          />

          <div className="relative z-10 w-full max-w-md bg-white border border-red-100 shadow-2xl rounded-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-red-500 font-bold">
                    Logout Confirmation
                  </p>

                  <h3
                    id="logout-modal-title"
                    className="font-serif text-lg font-bold text-neutral-900"
                  >
                    Sign out?
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={closeLogoutPopup}
                className="w-8 h-8 inline-flex items-center justify-center border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-sm transition-colors"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-4">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Are you sure you want to sign out from the Grand Emaar admin
                dashboard?
              </p>

              <div className="rounded-sm border border-neutral-100 bg-neutral-50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Current Account
                </p>

                <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                  {adminEmail || 'admin@grandemaar.com'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLogoutPopup}
                className="px-4 py-2 border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}