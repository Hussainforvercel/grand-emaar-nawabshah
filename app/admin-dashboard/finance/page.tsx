'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  ClipboardList,
  Banknote,
  TrendingUp,
  Award,
  FileText,
  RefreshCw,
  CheckCircle2,
  Clock,
  Trophy,
  CalendarDays,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminFinanceReportModal from '@/components/admin/AdminFinanceReportModal';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image_url?: string | null;
}

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string | null;
  items: OrderItem[];
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface MenuImageItem {
  name: string;
  image_url: string | null;
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

const periodLabels: Record<Period, string> = {
  daily: 'Today',
  weekly: 'This Week',
  monthly: 'This Month',
  yearly: 'This Year',
  custom: 'Custom Date',
};

const normalizeName = (name: string) => name.trim().toLowerCase();

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AdminFinancePage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [activePeriod, setActivePeriod] = useState<Period>('daily');
  const [customDate, setCustomDate] = useState<string>(
    toDateInputValue(new Date())
  );
  const customDateInputRef = useRef<HTMLInputElement | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('admin-session');
    router.push('/admin-login');
  };

  const fetchMenuImages = async () => {
    if (!supabase) return [];

    const { data } = await supabase
      .from('menu_items')
      .select('name, image_url');

    const menuData = (data || []) as MenuImageItem[];
    setMenuItems(menuData);
    return menuData;
  };

  const fetchOrders = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [{ data, error }] = await Promise.all([
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }),
      fetchMenuImages(),
    ]);

    if (!error && data) {
      setOrders(data as Order[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadAdmin = async () => {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setAdminEmail(user.email);
      }
    };

    loadAdmin();
    fetchOrders();
  }, []);

  // --- Period range calculation (calendar-based boundaries) ---
  const getPeriodRange = (period: Period): { start: Date; end: Date } => {
    const now = new Date();

    if (period === 'custom') {
      const [year, month, day] = customDate.split('-').map(Number);
      const start = new Date(year, (month || 1) - 1, day || 1, 0, 0, 0, 0);
      const end = new Date(year, (month || 1) - 1, day || 1, 23, 59, 59, 999);
      return { start, end };
    }

    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        break;
      case 'weekly': {
        const dayOfWeek = start.getDay(); // 0 = Sunday
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(start.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case 'monthly':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'yearly':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
    }

    return { start, end };
  };

  const filteredOrders = useMemo(() => {
    const { start, end } = getPeriodRange(activePeriod);
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= start && orderDate <= end;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, activePeriod, customDate]);

  const completedInPeriod = useMemo(
    () => filteredOrders.filter((order) => order.status === 'completed'),
    [filteredOrders]
  );

  const pendingInPeriod = useMemo(
    () => filteredOrders.filter((order) => order.status === 'pending'),
    [filteredOrders]
  );

  const totalSales = useMemo(
    () =>
      completedInPeriod.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
      ),
    [completedInPeriod]
  );

  const avgOrderValue = useMemo(() => {
    if (completedInPeriod.length === 0) return 0;
    return totalSales / completedInPeriod.length;
  }, [totalSales, completedInPeriod]);

  // --- Best selling items (by quantity, from completed orders in period) ---
  const bestSellingItems = useMemo(() => {
    const imageMap = new Map<string, string>();
    menuItems.forEach((menuItem) => {
      if (menuItem.name && menuItem.image_url) {
        imageMap.set(normalizeName(menuItem.name), menuItem.image_url);
      }
    });

    const itemMap = new Map<
      string,
      { quantity: number; revenue: number; image_url: string | null }
    >();

    completedInPeriod.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.name.trim();
        const existing = itemMap.get(key) || {
          quantity: 0,
          revenue: 0,
          image_url: item.image_url || imageMap.get(normalizeName(item.name)) || null,
        };

        itemMap.set(key, {
          quantity: existing.quantity + Number(item.quantity || 0),
          revenue:
            existing.revenue + Number(item.quantity || 0) * Number(item.price || 0),
          image_url: existing.image_url,
        });
      });
    });

    return Array.from(itemMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [completedInPeriod, menuItems]);

  const topItem = bestSellingItems[0] || null;

  const rangeLabel = useMemo(() => {
    const { start, end } = getPeriodRange(activePeriod);

    if (activePeriod === 'custom') {
      return start.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeriod, customDate]);

  return (
    <div className="h-screen bg-neutral-100 flex overflow-hidden">
      <div className="w-64 h-screen shrink-0 sticky top-0 print:hidden">
        <AdminSidebar
          onLogout={handleLogout}
          adminEmail={adminEmail}
          isDemoMode={!isSupabaseConfigured}
        />
      </div>

      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden min-w-0 p-6 print:hidden">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Grand Emaar Admin
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-900">
              Finance &amp; Reports
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Sales performance, order totals, and best-selling items by period.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              type="button"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              type="button"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#C5A059] text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#A98443] transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Period Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {(Object.keys(periodLabels) as Period[]).map((period) => {
            if (period === 'custom') {
              return (
                <div key={period} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePeriod('custom');
                      const input = customDateInputRef.current;
                      if (input) {
                        if (typeof (input as any).showPicker === 'function') {
                          (input as any).showPicker();
                        } else {
                          input.focus();
                          input.click();
                        }
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${
                      activePeriod === period
                        ? 'bg-[#C5A059] text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-[#C5A059]/10 hover:text-[#A98443]'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    {activePeriod === 'custom'
                      ? new Date(customDate).toLocaleDateString(undefined, {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : periodLabels[period]}
                  </button>

                  <input
                    ref={customDateInputRef}
                    type="date"
                    value={customDate}
                    max={toDateInputValue(new Date())}
                    onChange={(e) => {
                      if (e.target.value) {
                        setCustomDate(e.target.value);
                        setActivePeriod('custom');
                      }
                    }}
                    className="absolute top-full left-0 mt-1 w-px h-px opacity-0 pointer-events-none"
                    tabIndex={-1}
                  />
                </div>
              );
            }

            return (
              <button
                key={period}
                type="button"
                onClick={() => {
                  setActivePeriod(period);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${
                  activePeriod === period
                    ? 'bg-[#C5A059] text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-[#C5A059]/10 hover:text-[#A98443]'
                }`}
              >
                {periodLabels[period]}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white border border-neutral-200 rounded-sm">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neutral-200 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#C5A059] rounded-full animate-spin" />
            </div>

            <h3 className="mt-6 font-serif text-xl font-bold text-neutral-900">
              Loading Finance Data
            </h3>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Total Orders
                  </p>
                  <ClipboardList className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                  {filteredOrders.length}
                </h2>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {periodLabels[activePeriod]}
                </p>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Total Sales
                  </p>
                  <Banknote className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                  Rs. {totalSales.toLocaleString()}
                </h2>
                <p className="mt-1 text-[11px] text-neutral-400">
                  From {completedInPeriod.length} completed orders
                </p>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Avg. Order Value
                  </p>
                  <TrendingUp className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                  Rs.{' '}
                  {avgOrderValue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </h2>
                <p className="mt-1 text-[11px] text-neutral-400">Per completed order</p>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Best Selling Item
                  </p>
                  <Award className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h2 className="mt-3 text-lg font-bold text-neutral-900 truncate">
                  {topItem ? topItem.name : '—'}
                </h2>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {topItem ? `${topItem.quantity} sold` : 'No sales yet'}
                </p>
              </div>
            </div>

            {/* Secondary status row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-neutral-700">
                    Completed Orders
                  </p>
                </div>
                <p className="text-xl font-bold text-neutral-900">
                  {completedInPeriod.length}
                </p>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-semibold text-neutral-700">
                    Pending Orders
                  </p>
                </div>
                <p className="text-xl font-bold text-neutral-900">
                  {pendingInPeriod.length}
                </p>
              </div>
            </div>

            {/* Best Selling Items Table */}
            <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 bg-white">
                <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#C5A059]" />
                  Top Selling Items
                </h2>
                <p className="text-sm text-neutral-500">
                  Ranked by quantity sold — {periodLabels[activePeriod]}.
                </p>
              </div>

              {bestSellingItems.length === 0 ? (
                <div className="p-12 text-center">
                  <Award className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    No Completed Sales Yet
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    No completed orders found for {periodLabels[activePeriod].toLowerCase()}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-900 text-white">
                      <tr>
                        <th className="w-[8%] px-4 py-4 text-xs uppercase tracking-widest">
                          Rank
                        </th>
                        <th className="w-[42%] px-4 py-4 text-xs uppercase tracking-widest">
                          Item
                        </th>
                        <th className="w-[20%] px-4 py-4 text-xs uppercase tracking-widest">
                          Qty Sold
                        </th>
                        <th className="w-[20%] px-4 py-4 text-xs uppercase tracking-widest">
                          Revenue
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                      {bestSellingItems.map((item, index) => (
                        <tr key={item.name} className="hover:bg-[#C5A059]/[0.06] transition-colors">
                          <td className="px-4 py-4 font-bold text-neutral-500">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-neutral-100 shrink-0">
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
                                ) : null}
                              </div>
                              <span className="font-semibold text-neutral-900">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-neutral-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 font-bold text-neutral-900">
                            Rs. {item.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {showReportModal && (
        <AdminFinanceReportModal
          periodLabel={periodLabels[activePeriod]}
          rangeLabel={rangeLabel}
          stats={{
            totalOrders: filteredOrders.length,
            completedOrders: completedInPeriod.length,
            pendingOrders: pendingInPeriod.length,
            totalSales,
            avgOrderValue,
          }}
          bestSellingItems={bestSellingItems}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}