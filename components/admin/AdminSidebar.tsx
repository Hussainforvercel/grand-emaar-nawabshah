'use client';

import React from 'react';
import Link from 'next/link';
import { Hotel, LogOut, Utensils, Award, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
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
            <Utensils className="w-4.5 h-4.5" />
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
            <p className="font-light text-[9px] text-neutral-400">Database changes are cached in localStorage.</p>
          </div>
        )}

        <div className="text-left px-3">
          <p className="text-[10px] uppercase font-mono text-neutral-500">Sign-In Role</p>
          <p className="text-xs font-semibold text-neutral-300 truncate">{adminEmail || 'admin@grandemaar.com'}</p>
        </div>

        <button
          onClick={onLogout}
          id="admin-logout-sidebar-btn"
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>

    </aside>
  );
}
