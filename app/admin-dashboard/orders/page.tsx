'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Trash2,
  RefreshCw,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
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

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem('admin-session');
    router.push('/admin-login');
  };

  const fetchOrders = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }

    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    }
  };

  const deleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order?'
    );

    if (!confirmDelete || !supabase) return;

    const { error } = await supabase.from('orders').delete().eq('id', orderId);

    if (!error) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
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

  return (
    <div className="h-screen bg-neutral-100 flex overflow-hidden">
      <div className="w-64 h-screen shrink-0 sticky top-0">
        <AdminSidebar
          onLogout={handleLogout}
          adminEmail={adminEmail}
          isDemoMode={!isSupabaseConfigured}
        />
      </div>

      <main className="flex-1 h-screen overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Grand Emaar Admin
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-900">
              Orders
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              View and manage customer food orders.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            type="button"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden">
{loading ? (
  <div className="flex flex-col items-center justify-center py-28 bg-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-neutral-200 rounded-full"></div>

      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#C5A059] rounded-full animate-spin"></div>
    </div>

    <h3 className="mt-6 font-serif text-xl font-bold text-neutral-900">
      Loading Orders
    </h3>

    <p className="mt-2 text-sm text-neutral-500">
      Please wait while we retrieve customer orders...
    </p>
  </div>
) : orders.length === 0 ? (
            <div className="p-10 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300 mb-3" />

              <h2 className="font-serif text-xl font-bold text-neutral-900">
                No Orders Received Yet
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Customer orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-widest">
                      Items
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-widest">
                      Total
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td className="px-4 py-4 align-top">
                        <p className="font-bold text-neutral-900">
                          {order.customer_name}
                        </p>

                        <p className="text-xs text-neutral-500">
                          {order.phone}
                        </p>

                        {order.address && (
                          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                            {order.address}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="space-y-1">
                          {order.items?.map((item, index) => (
                            <p key={index} className="text-xs text-neutral-600">
                              {item.quantity}x {item.name} — Rs. {item.price}
                            </p>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="mt-2 text-xs text-[#C5A059]">
                            Note: {order.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 align-top font-bold text-neutral-900">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="border border-neutral-200 bg-white px-3 py-2 rounded-sm text-xs font-semibold outline-none focus:border-[#C5A059]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-4 py-4 align-top text-xs text-neutral-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top text-right">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          type="button"
                          className="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}