'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, X, ImageIcon, Trophy } from 'lucide-react';

interface BestSellingItem {
  name: string;
  quantity: number;
  revenue: number;
  image_url?: string | null;
}

interface ReportStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSales: number;
  avgOrderValue: number;
}

interface AdminFinanceReportModalProps {
  periodLabel: string;
  rangeLabel: string;
  stats: ReportStats;
  bestSellingItems: BestSellingItem[];
  onClose: () => void;
}

export default function AdminFinanceReportModal({
  periodLabel,
  rangeLabel,
  stats,
  bestSellingItems,
  onClose,
}: AdminFinanceReportModalProps) {
  const printReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 print:static print:bg-white print:p-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 print:hidden"
        aria-label="Close report modal"
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[92vh] rounded-sm shadow-2xl flex flex-col overflow-hidden print:max-h-none print:shadow-none print:max-w-none print:w-full">
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-br from-neutral-950 to-neutral-900 print:hidden">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logo.png"
              alt="Grand Emaar Logo"
              width={44}
              height={44}
              className="rounded-full object-contain"
              priority
            />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Grand Emaar
              </p>
              <h2 className="font-serif text-lg font-bold text-white">
                Finance Report
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 print:overflow-visible">
          <div id="finance-report-print-area" className="p-5 sm:p-6 print:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-neutral-200 pb-4">
              <div className="flex items-start gap-4">
                <Image
                  src="/logo/logo.png"
                  alt="Grand Emaar Logo"
                  width={70}
                  height={70}
                  className="object-contain shrink-0"
                  priority
                />

                <div>
                  <h1 className="font-serif text-2xl font-bold text-neutral-900">
                    GRAND EMAAR
                  </h1>

                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                    Finance &amp; Sales Report
                  </p>

                  <p className="mt-3 text-xs text-neutral-500">
                    Opposite H.M Khoja Tower, Nawabshah
                  </p>

                  <p className="text-xs text-neutral-500">
                    Call: +92 308 2077721
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xs text-neutral-400 uppercase tracking-widest">
                  Report Period
                </p>

                <p className="text-sm font-bold text-neutral-900">
                  {periodLabel}
                </p>

                <p className="mt-3 text-xs text-neutral-400 uppercase tracking-widest">
                  Range
                </p>

                <p className="text-sm font-semibold text-neutral-900">
                  {rangeLabel}
                </p>

                <p className="mt-3 text-xs text-neutral-400 uppercase tracking-widest">
                  Generated On
                </p>

                <p className="text-sm font-semibold text-neutral-900">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="py-5 border-b border-neutral-200">
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mb-3">
                Summary
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-neutral-200 rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Total Orders
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">
                    {stats.totalOrders}
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Total Sales
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">
                    Rs. {stats.totalSales.toLocaleString()}
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Completed
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">
                    {stats.completedOrders}
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Pending
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">
                    {stats.pendingOrders}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Average Order Value
                  </p>
                  <p className="text-sm font-bold text-neutral-900">
                    Rs.{' '}
                    {stats.avgOrderValue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-5">
              <p className="flex items-center gap-1.5 text-xs text-neutral-400 uppercase tracking-widest font-bold mb-3">
                <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
                Top Selling Items
              </p>

              {bestSellingItems.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No completed sales in this period.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 text-xs uppercase tracking-widest text-neutral-400">
                          Rank
                        </th>
                        <th className="text-left py-3 text-xs uppercase tracking-widest text-neutral-400">
                          Item
                        </th>
                        <th className="text-center py-3 text-xs uppercase tracking-widest text-neutral-400">
                          Qty Sold
                        </th>
                        <th className="text-right py-3 text-xs uppercase tracking-widest text-neutral-400">
                          Revenue
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {bestSellingItems.map((item, index) => (
                        <tr
                          key={item.name}
                          className="border-b border-neutral-100"
                        >
                          <td className="py-3 text-neutral-500 font-bold">
                            #{index + 1}
                          </td>

                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-neutral-100 shrink-0">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(event) => {
                                      event.currentTarget.onerror = null;
                                      event.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(
                                        item.name
                                      )}/100/100`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>

                              <p className="font-semibold text-neutral-900">
                                {item.name}
                              </p>
                            </div>
                          </td>

                          <td className="py-3 text-center text-neutral-600">
                            {item.quantity}
                          </td>

                          <td className="py-3 text-right font-semibold text-neutral-900">
                            Rs. {item.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-2 text-center border-t border-neutral-100 pt-4">
              <p className="font-serif text-lg font-bold text-neutral-900">
                Grand Emaar — Internal Finance Report
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                This report is generated from Grand Emaar Admin Dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            Close
          </button>

          <button
            type="button"
            onClick={printReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}