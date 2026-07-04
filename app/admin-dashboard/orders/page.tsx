'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Trash2,
  RefreshCw,
  ShoppingBag,
  ReceiptText,
  Phone,
  Table2,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Clock,
  Banknote,
  BadgeCheck,
  ChefHat,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminInvoiceModal from '@/components/admin/AdminInvoiceModal';

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

const statusOptions = [
  'pending',
  'confirmed',
  'preparing',
  'completed',
  'cancelled',
];

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: BadgeCheck,
  preparing: ChefHat,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] =
    useState<Order | null>(null);

  const stats = useMemo(() => {
    const completedOrders = orders.filter(
      (order) => order.status === 'completed'
    );

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === 'pending')
        .length,
      completedOrders: completedOrders.length,
      totalRevenue: completedOrders.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
      ),
    };
  }, [orders]);

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => statusIcons[status] || Clock;

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
    <>
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
                Orders Management
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Manage customer orders, update status, view details and print
                invoices.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              type="button"
              className="inline-flex w-fit items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Orders
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Total Orders
                </p>
                <ClipboardList className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                {stats.totalOrders}
              </h2>
            </div>

            <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Pending
                </p>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                {stats.pendingOrders}
              </h2>
            </div>

            <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Completed
                </p>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                {stats.completedOrders}
              </h2>
            </div>

            <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Revenue
                </p>
                <Banknote className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-neutral-900">
                Rs. {stats.totalRevenue.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 bg-white">
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Recent Orders
              </h2>
              <p className="text-sm text-neutral-500">
                Customer order list with items, table number, status and invoice
                action.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 bg-white">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-neutral-200 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#C5A059] rounded-full animate-spin" />
                </div>

                <h3 className="mt-6 font-serif text-xl font-bold text-neutral-900">
                  Loading Orders
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  Please wait while we retrieve customer orders...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-3" />

                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  No Orders Received Yet
                </h2>

                <p className="text-sm text-neutral-500 mt-1">
                  Customer orders will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left text-sm">
                  <thead className="bg-neutral-900 text-white">
                    <tr>
                      <th className="w-[16%] px-4 py-4 text-xs uppercase tracking-widest">
                        Customer Details
                      </th>
                      <th className="w-[30%] px-4 py-4 text-xs uppercase tracking-widest">
                        Order Items
                      </th>
                      <th className="w-[10%] px-4 py-4 text-xs uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="w-[18%] px-4 py-4 text-xs uppercase tracking-widest">
                        Order Status
                      </th>
                      <th className="w-[14%] px-4 py-4 text-xs uppercase tracking-widest">
                        Date & Time
                      </th>
                      <th className="w-[12%] px-4 py-4 text-xs uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {orders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);

                      return (
                        <tr key={order.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-5 align-top break-words">
                            <p className="font-bold text-neutral-900 break-words">
                              {order.customer_name}
                            </p>

                            <div className="mt-2 space-y-1.5">
                              <p className="flex items-center gap-2 text-xs text-neutral-600">
                                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                <span className="break-words">{order.phone}</span>
                              </p>

                              {order.address && (
                                <p className="flex items-start gap-2 text-xs text-neutral-600">
                                  <Table2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                                  <span className="break-words">
                                    <span className="font-bold text-neutral-800">
                                      Table No:
                                    </span>{' '}
                                    {order.address}
                                  </span>
                                </p>
                              )}
                            </div>

                            <p className="mt-3 inline-flex bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500 font-mono">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </td>

                          <td className="px-4 py-5 align-top">
                            <div className="space-y-2">
                              {order.items?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 px-2 py-2 rounded-sm"
                                >
                                  <div className="relative w-9 h-9 rounded-sm overflow-hidden bg-neutral-200 shrink-0">
                                    <img
                                      src={
                                        item.image_url ||
                                        `https://picsum.photos/seed/${encodeURIComponent(
                                          item.name
                                        )}/100/100`
                                      }
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
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-neutral-800 break-words">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] text-neutral-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>

                                  <p className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
                                    Rs. {Number(item.price).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {order.notes && (
                              <p className="mt-3 text-xs bg-[#C5A059]/10 text-[#8A6A2F] border border-[#C5A059]/20 p-2 rounded-sm break-words">
                                Note: {order.notes}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-5 align-top">
                            <p className="text-xs text-neutral-400 uppercase tracking-widest">
                              Total
                            </p>
                            <p className="mt-1 text-lg font-bold text-neutral-900 break-words">
                              Rs. {Number(order.total_amount).toLocaleString()}
                            </p>
                          </td>

                          <td className="px-4 py-5 align-top">
                            <span
                              className={`inline-flex items-center gap-1.5 mb-3 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {order.status}
                            </span>

                            <div className="relative">
                              <StatusIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(order.id, e.target.value)
                                }
                                className="w-full border border-neutral-200 bg-white pl-9 pr-8 py-2 rounded-sm text-xs font-semibold outline-none focus:border-[#C5A059] appearance-none"
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </option>
                                ))}
                              </select>

                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </td>

                          <td className="px-4 py-5 align-top">
                            <p className="flex items-start gap-2 text-xs text-neutral-600 break-words">
                              <CalendarDays className="w-4 h-4 text-[#C5A059] shrink-0" />
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </td>

                          <td className="px-4 py-5 align-top">
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => setSelectedInvoiceOrder(order)}
                                type="button"
                                className="inline-flex w-full items-center justify-center gap-2 px-3 h-9 bg-[#C5A059]/10 text-[#A98443] hover:bg-[#C5A059] hover:text-white rounded-sm transition-colors text-[10px] font-bold uppercase tracking-widest"
                              >
                                <ReceiptText className="w-4 h-4" />
                                View Invoice
                              </button>

                              <button
                                onClick={() => deleteOrder(order.id)}
                                type="button"
                                className="inline-flex w-full items-center justify-center gap-2 px-3 h-9 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors text-[10px] font-bold uppercase tracking-widest"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedInvoiceOrder && (
        <AdminInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </>
  );
}


// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
// import {
//   Trash2,
//   RefreshCw,
//   ShoppingBag,
//   ReceiptText,
//   Phone,
//   Table2,
//   CalendarDays,
//   ClipboardList,
//   CheckCircle2,
//   Clock,
//   Banknote,
//   BadgeCheck,
//   ChefHat,
//   XCircle,
//   ChevronDown,
// } from 'lucide-react';
// import AdminSidebar from '@/components/admin/AdminSidebar';
// import AdminInvoiceModal from '@/components/admin/AdminInvoiceModal';

// interface OrderItem {
//   name: string;
//   quantity: number;
//   price: number;
//   image_url?: string | null;
// }

// interface Order {
//   id: string;
//   customer_name: string;
//   phone: string;
//   address: string | null;
//   items: OrderItem[];
//   total_amount: number;
//   status: string;
//   notes: string | null;
//   created_at: string;
// }

// const statusOptions = [
//   'pending',
//   'confirmed',
//   'preparing',
//   'completed',
//   'cancelled',
// ];

// const statusIcons: Record<string, React.ElementType> = {
//   pending: Clock,
//   confirmed: BadgeCheck,
//   preparing: ChefHat,
//   completed: CheckCircle2,
//   cancelled: XCircle,
// };

// export default function AdminOrdersPage() {
//   const router = useRouter();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [adminEmail, setAdminEmail] = useState('');
//   const [selectedInvoiceOrder, setSelectedInvoiceOrder] =
//     useState<Order | null>(null);

//   const stats = useMemo(() => {
//     const completedOrders = orders.filter(
//       (order) => order.status === 'completed'
//     );

//     return {
//       totalOrders: orders.length,
//       pendingOrders: orders.filter((order) => order.status === 'pending')
//         .length,
//       completedOrders: completedOrders.length,
//       totalRevenue: completedOrders.reduce(
//         (sum, order) => sum + Number(order.total_amount || 0),
//         0
//       ),
//     };
//   }, [orders]);

//   const handleLogout = async () => {
//     if (supabase) {
//       await supabase.auth.signOut();
//     }

//     localStorage.removeItem('admin-session');
//     router.push('/admin-login');
//   };

//   const fetchOrders = async () => {
//     if (!isSupabaseConfigured || !supabase) {
//       setOrders([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     const { data, error } = await supabase
//       .from('orders')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (!error && data) {
//       setOrders(data as Order[]);
//     }

//     setLoading(false);
//   };

//   const updateOrderStatus = async (orderId: string, status: string) => {
//     if (!supabase) return;

//     const { error } = await supabase
//       .from('orders')
//       .update({ status })
//       .eq('id', orderId);

//     if (!error) {
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === orderId ? { ...order, status } : order
//         )
//       );
//     }
//   };

//   const deleteOrder = async (orderId: string) => {
//     const confirmDelete = window.confirm(
//       'Are you sure you want to delete this order?'
//     );

//     if (!confirmDelete || !supabase) return;

//     const { error } = await supabase.from('orders').delete().eq('id', orderId);

//     if (!error) {
//       setOrders((prev) => prev.filter((order) => order.id !== orderId));
//     }
//   };

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       case 'confirmed':
//         return 'bg-blue-50 text-blue-700 border-blue-200';
//       case 'preparing':
//         return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//       case 'cancelled':
//         return 'bg-red-50 text-red-700 border-red-200';
//       default:
//         return 'bg-neutral-100 text-neutral-700 border-neutral-200';
//     }
//   };

//   const getStatusIcon = (status: string) => statusIcons[status] || Clock;

//   useEffect(() => {
//     const loadAdmin = async () => {
//       if (!supabase) return;

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user?.email) {
//         setAdminEmail(user.email);
//       }
//     };

//     loadAdmin();
//     fetchOrders();
//   }, []);

//   return (
//     <>
//       <div className="h-screen bg-neutral-100 flex overflow-hidden">
//         <div className="w-64 h-screen shrink-0 sticky top-0 print:hidden">
//           <AdminSidebar
//             onLogout={handleLogout}
//             adminEmail={adminEmail}
//             isDemoMode={!isSupabaseConfigured}
//           />
//         </div>

//         <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden min-w-0 p-6 print:hidden">
//           <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
//                 Grand Emaar Admin
//               </p>

//               <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-900">
//                 Orders Management
//               </h1>

//               <p className="mt-1 text-sm text-neutral-500">
//                 Manage customer orders, update status, view details and print
//                 invoices.
//               </p>
//             </div>

//             <button
//               onClick={fetchOrders}
//               type="button"
//               className="inline-flex w-fit items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh Orders
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
//                   Total Orders
//                 </p>
//                 <ClipboardList className="w-5 h-5 text-[#C5A059]" />
//               </div>
//               <h2 className="mt-3 text-2xl font-bold text-neutral-900">
//                 {stats.totalOrders}
//               </h2>
//             </div>

//             <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
//                   Pending
//                 </p>
//                 <Clock className="w-5 h-5 text-yellow-600" />
//               </div>
//               <h2 className="mt-3 text-2xl font-bold text-neutral-900">
//                 {stats.pendingOrders}
//               </h2>
//             </div>

//             <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
//                   Completed
//                 </p>
//                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//               </div>
//               <h2 className="mt-3 text-2xl font-bold text-neutral-900">
//                 {stats.completedOrders}
//               </h2>
//             </div>

//             <div className="bg-white border border-neutral-200 p-5 rounded-sm shadow-sm">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
//                   Revenue
//                 </p>
//                 <Banknote className="w-5 h-5 text-[#C5A059]" />
//               </div>
//               <h2 className="mt-3 text-2xl font-bold text-neutral-900">
//                 Rs. {stats.totalRevenue.toLocaleString()}
//               </h2>
//             </div>
//           </div>

//           <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-neutral-100 bg-white">
//               <h2 className="font-serif text-xl font-bold text-neutral-900">
//                 Recent Orders
//               </h2>
//               <p className="text-sm text-neutral-500">
//                 Customer order list with items, table number, status and invoice
//                 action.
//               </p>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-28 bg-white">
//                 <div className="relative">
//                   <div className="w-16 h-16 border-4 border-neutral-200 rounded-full" />
//                   <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#C5A059] rounded-full animate-spin" />
//                 </div>

//                 <h3 className="mt-6 font-serif text-xl font-bold text-neutral-900">
//                   Loading Orders
//                 </h3>

//                 <p className="mt-2 text-sm text-neutral-500">
//                   Please wait while we retrieve customer orders...
//                 </p>
//               </div>
//             ) : orders.length === 0 ? (
//               <div className="p-12 text-center">
//                 <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-3" />

//                 <h2 className="font-serif text-xl font-bold text-neutral-900">
//                   No Orders Received Yet
//                 </h2>

//                 <p className="text-sm text-neutral-500 mt-1">
//                   Customer orders will appear here automatically.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-[1280px] text-left text-sm">
//                   <thead className="bg-neutral-900 text-white">
//                     <tr>
//                       <th className="px-5 py-4 text-xs uppercase tracking-widest">
//                         Customer Details
//                       </th>
//                       <th className="px-5 py-4 text-xs uppercase tracking-widest">
//                         Order Items
//                       </th>
//                       <th className="px-5 py-4 text-xs uppercase tracking-widest">
//                         Amount
//                       </th>
//                       <th className="px-5 py-4 text-xs uppercase tracking-widest">
//                         Order Status
//                       </th>
//                       <th className="px-5 py-4 text-xs uppercase tracking-widest">
//                         Date & Time
//                       </th>
//                       <th className="px-5 py-4 text-xs uppercase tracking-widest text-right">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-neutral-100">
//                     {orders.map((order) => {
//                       const StatusIcon = getStatusIcon(order.status);

//                       return (
//                         <tr key={order.id} className="hover:bg-neutral-50">
//                           <td className="px-5 py-5 align-top min-w-[250px]">
//                             <p className="font-bold text-neutral-900">
//                               {order.customer_name}
//                             </p>

//                             <div className="mt-2 space-y-1.5">
//                               <p className="flex items-center gap-2 text-xs text-neutral-600">
//                                 <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
//                                 <span>{order.phone}</span>
//                               </p>

//                               {order.address && (
//                                 <p className="flex items-center gap-2 text-xs text-neutral-600">
//                                   <Table2 className="w-3.5 h-3.5 text-[#C5A059]" />
//                                   <span>
//                                     <span className="font-bold text-neutral-800">
//                                       Table No:
//                                     </span>{' '}
//                                     {order.address}
//                                   </span>
//                                 </p>
//                               )}
//                             </div>

//                             <p className="mt-3 inline-flex bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500 font-mono">
//                               #{order.id.slice(0, 8).toUpperCase()}
//                             </p>
//                           </td>

//                           <td className="px-5 py-5 align-top min-w-[340px]">
//                             <div className="space-y-2">
//                               {order.items?.map((item, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 px-3 py-2 rounded-sm"
//                                 >
//                                   <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-neutral-200 shrink-0">
//                                     <img
//                                       src={
//                                         item.image_url ||
//                                         `https://picsum.photos/seed/${encodeURIComponent(
//                                           item.name
//                                         )}/100/100`
//                                       }
//                                       alt={item.name}
//                                       referrerPolicy="no-referrer"
//                                       className="w-full h-full object-cover"
//                                       onError={(event) => {
//                                         event.currentTarget.onerror = null;
//                                         event.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(
//                                           item.name
//                                         )}/100/100`;
//                                       }}
//                                     />
//                                   </div>

//                                   <div className="flex-1 min-w-0">
//                                     <p className="text-xs font-bold text-neutral-800 truncate">
//                                       {item.name}
//                                     </p>
//                                     <p className="text-[11px] text-neutral-500">
//                                       Qty: {item.quantity}
//                                     </p>
//                                   </div>

//                                   <p className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
//                                     Rs. {Number(item.price).toLocaleString()}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>

//                             {order.notes && (
//                               <p className="mt-3 text-xs bg-[#C5A059]/10 text-[#8A6A2F] border border-[#C5A059]/20 p-2 rounded-sm">
//                                 Note: {order.notes}
//                               </p>
//                             )}
//                           </td>

//                           <td className="px-5 py-5 align-top min-w-[130px]">
//                             <p className="text-xs text-neutral-400 uppercase tracking-widest">
//                               Total
//                             </p>
//                             <p className="mt-1 text-lg font-bold text-neutral-900">
//                               Rs. {Number(order.total_amount).toLocaleString()}
//                             </p>
//                           </td>

//                           <td className="px-5 py-5 align-top min-w-[170px]">
//                             <span
//                               className={`inline-flex items-center gap-1.5 mb-3 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
//                                 order.status
//                               )}`}
//                             >
//                               <StatusIcon className="w-3 h-3" />
//                               {order.status}
//                             </span>

//                             <div className="relative">
//                               <StatusIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

//                               <select
//                                 value={order.status}
//                                 onChange={(e) =>
//                                   updateOrderStatus(order.id, e.target.value)
//                                 }
//                                 className="w-full border border-neutral-200 bg-white pl-9 pr-8 py-2 rounded-sm text-xs font-semibold outline-none focus:border-[#C5A059] appearance-none"
//                               >
//                                 {statusOptions.map((status) => (
//                                   <option key={status} value={status}>
//                                     {status.charAt(0).toUpperCase() +
//                                       status.slice(1)}
//                                   </option>
//                                 ))}
//                               </select>

//                               <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                             </div>
//                           </td>

//                           <td className="px-5 py-5 align-top min-w-[180px]">
//                             <p className="flex items-start gap-2 text-xs text-neutral-600">
//                               <CalendarDays className="w-4 h-4 text-[#C5A059] shrink-0" />
//                               {new Date(order.created_at).toLocaleString()}
//                             </p>
//                           </td>

//                           <td className="px-5 py-5 align-top min-w-[160px]">
//                             <div className="flex flex-col items-end gap-2">
//                               <button
//                                 onClick={() => setSelectedInvoiceOrder(order)}
//                                 type="button"
//                                 className="inline-flex w-full items-center justify-center gap-2 px-3 h-9 bg-[#C5A059]/10 text-[#A98443] hover:bg-[#C5A059] hover:text-white rounded-sm transition-colors text-[10px] font-bold uppercase tracking-widest"
//                               >
//                                 <ReceiptText className="w-4 h-4" />
//                                 View Invoice
//                               </button>

//                               <button
//                                 onClick={() => deleteOrder(order.id)}
//                                 type="button"
//                                 className="inline-flex w-full items-center justify-center gap-2 px-3 h-9 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors text-[10px] font-bold uppercase tracking-widest"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                                 Delete
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {selectedInvoiceOrder && (
//         <AdminInvoiceModal
//           order={selectedInvoiceOrder}
//           onClose={() => setSelectedInvoiceOrder(null)}
//         />
//       )}
//     </>
//   );
// }

