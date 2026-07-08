'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  ImageIcon,
  BellRing,
  Search,
  X,
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

interface MenuImageItem {
  name: string;
  image_url: string | null;
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

const normalizeName = (name: string) => name.trim().toLowerCase();

export default function AdminOrdersPage() {
  const router = useRouter();

  const orderBellAudioRef = useRef<HTMLAudioElement | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] =
    useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<Order | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Queue for incoming orders: if a new-order popup is already open and another
  // order arrives, we no longer overwrite/lose it — it goes into this queue and
  // is shown automatically right after the admin closes the current popup.
  const [orderAlertQueue, setOrderAlertQueue] = useState<Order[]>([]);

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  //  Tab state: "recent" (last 24 hours) or "history" (older than 24 hours)
  const [activeTab, setActiveTab] = useState<'recent' | 'history'>('recent');

  //  Search state: works across both Recent and History tabs
  const [searchQuery, setSearchQuery] = useState('');

  const isWithinLast24Hours = (dateString: string) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffInHours =
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const stats = useMemo(() => {
    const completedOrders = orders.filter(
      (order) => 
        order.status === 'completed'
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

  //  Split orders into Recent (last 24hr AND not completed/cancelled) and
  //  History (older than 24hr OR already completed OR cancelled).
  //  NOTE: Cancelled orders move to History immediately, exactly like
  //  Completed orders — this was already working, kept as-is on purpose.
  const recentOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          isWithinLast24Hours(order.created_at) &&
          order.status !== 'completed' &&
          order.status !== 'cancelled'
      ),
    [orders]
  );

  const historyOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          !isWithinLast24Hours(order.created_at) ||
          order.status === 'completed' ||
          order.status === 'cancelled'
      ),
    [orders]
  );

  const baseOrders = activeTab === 'recent' ? recentOrders : historyOrders;

  //  Search filters on top of whichever tab is active
  const displayedOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return baseOrders;

    return baseOrders.filter((order) => {
      const idMatch = order.id.toLowerCase().includes(q);
      const nameMatch = order.customer_name.toLowerCase().includes(q);
      const phoneMatch = order.phone.toLowerCase().includes(q);
      const tableMatch = (order.address || '').toLowerCase().includes(q);
      const itemMatch = order.items?.some((item) =>
        item.name.toLowerCase().includes(q)
      );

      return idMatch || nameMatch || phoneMatch || tableMatch || itemMatch;
    });
  }, [baseOrders, searchQuery]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem('admin-session');
    router.push('/admin-login');
  };

  // Plays the bell sound for every new order, automatically.
  // Browsers block audio autoplay until the page has received at least one
  // user interaction (click/keypress) — see the "unlock" effect below, which
  // silently primes the audio in the background with no visible button.
  const playOrderBell = async () => {
    try {
      if (!orderBellAudioRef.current) return;

      orderBellAudioRef.current.currentTime = 0;
      orderBellAudioRef.current.volume = 0.9;
      await orderBellAudioRef.current.play();
    } catch (error) {
      // Will only happen if the admin hasn't interacted with the page at all yet
      console.log('Order bell sound blocked by browser:', error);
    }
  };

  const attachRealDishImages = (
    ordersData: Order[],
    menuItemsData: MenuImageItem[]
  ) => {
    const imageMap = new Map<string, string>();

    menuItemsData.forEach((menuItem) => {
      if (menuItem.name && menuItem.image_url) {
        imageMap.set(normalizeName(menuItem.name), menuItem.image_url);
      }
    });

    return ordersData.map((order) => ({
      ...order,
      items: (order.items || []).map((item) => ({
        ...item,
        image_url:
          item.image_url || imageMap.get(normalizeName(item.name)) || null,
      })),
    }));
  };

  const fetchMenuImages = async () => {
    if (!supabase) return [];

    const { data } = await supabase.from('menu_items').select('name, image_url');
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

    const [{ data: ordersData, error: ordersError }, menuData] =
      await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }),
        fetchMenuImages(),
      ]);

    if (!ordersError && ordersData) {
      setOrders(attachRealDishImages(ordersData as Order[], menuData));
    }

    setLoading(false);
  };

  const fetchSingleOrder = async (orderId: string) => {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) return null;

    return attachRealDishImages([data as Order], menuItems)[0];
  };

  // Handles a freshly inserted order in real time:
  // 1. Bell always rings immediately, regardless of whether a popup is showing.
  // 2. Desktop notification always fires.
  // 3. Popup: if none is open, show this order now. If one IS already open,
  //    push this order into the queue instead of replacing the visible one —
  //    it will automatically be shown next once the admin closes the current popup.
  const showNewOrderNotification = (order: Order) => {
    playOrderBell();

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Order Received', {
        body: `${order.customer_name} - Rs. ${Number(
          order.total_amount
        ).toLocaleString()} - Table No: ${order.address || 'N/A'}`,
      });
    }

    setNewOrderAlert((current) => {
      if (current) {
        setOrderAlertQueue((queue) => [...queue, order]);
        return current;
      }
      return order;
    });
  };

  // Closes the currently visible new-order popup and, if there are more
  // orders waiting in the queue, immediately shows the next one.
  const closeNewOrderAlert = () => {
    setOrderAlertQueue((queue) => {
      if (queue.length > 0) {
        const [nextOrder, ...remaining] = queue;
        setNewOrderAlert(nextOrder);
        return remaining;
      }

      setNewOrderAlert(null);
      return queue;
    });
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
  if (!supabase) return;

  const { error } = await supabase.from('orders').delete().eq('id', orderId);

  if (!error) {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  }

  setOrderToDelete(null);
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

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Silently "unlocks" audio autoplay in the background — no visible button.
  // Browsers require at least one user interaction (click/keypress anywhere
  // on the page) before allowing audio.play() to work. This listens for the
  // very first click/keypress on the page, quietly plays+pauses the bell
  // once to unlock it, then removes itself. After that, every new order
  // will ring the bell automatically without any admin action.
  useEffect(() => {
    const unlockAudio = () => {
      const audio = orderBellAudioRef.current;

      if (audio) {
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {
            // Ignore — will simply retry unlocking on the next interaction
          });
      }
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  //  Reset search when switching tabs so old queries don't confuse the next tab
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        async (payload) => {
          const insertedOrder = payload.new as Order;

          const orderWithImage =
            (await fetchSingleOrder(insertedOrder.id)) ||
            attachRealDishImages([insertedOrder], menuItems)[0];

          setOrders((prev) => {
            const alreadyExists = prev.some(
              (order) => order.id === orderWithImage.id
            );

            if (alreadyExists) return prev;

            return [orderWithImage, ...prev];
          });

          showNewOrderNotification(orderWithImage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        async (payload) => {
          const updatedOrder = payload.new as Order;

          const orderWithImage =
            (await fetchSingleOrder(updatedOrder.id)) ||
            attachRealDishImages([updatedOrder], menuItems)[0];

          setOrders((prev) =>
            prev.map((order) =>
              order.id === orderWithImage.id ? orderWithImage : order
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const deletedOrder = payload.old as Order;

          setOrders((prev) =>
            prev.filter((order) => order.id !== deletedOrder.id)
          );
        }
      )
      .subscribe((status) => {
        console.log('Orders realtime status:', status);
      });

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [menuItems]);

  return (
    <>
      <audio
        ref={orderBellAudioRef}
        src="/order-bell.mp3"
        preload="auto"
      />

      {newOrderAlert && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:hidden"
          onClick={closeNewOrderAlert}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#C5A059]/30 animate-[pulse_1.4s_ease-in-out_1]"
          >
            <div className="flex items-center justify-between gap-4 bg-gradient-to-br from-neutral-950 to-neutral-900 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/15">
                  <BellRing className="w-5 h-5 text-[#C5A059]" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                    New Order Received
                    {orderAlertQueue.length > 0 && (
                      <span className="ml-2 text-white/70">
                        (+{orderAlertQueue.length} more waiting)
                      </span>
                    )}
                  </p>
                  <h2 className="mt-0.5 font-serif text-lg font-bold text-white">
                    {newOrderAlert.customer_name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeNewOrderAlert}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Phone
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    {newOrderAlert.phone}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Table No
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
                    <Table2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    {newOrderAlert.address || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  <ChefHat className="w-3.5 h-3.5 text-[#C5A059]" />
                  Order Items
                </p>

                <div className="space-y-2">
                  {newOrderAlert.items?.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 px-3 py-2.5 rounded-lg"
                    >
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-neutral-200 shrink-0 ring-1 ring-neutral-200">
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
                          <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-800 break-words">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-neutral-700 whitespace-nowrap">
                        Rs. {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {newOrderAlert.notes && (
                <div className="bg-[#C5A059]/10 text-[#8A6A2F] border border-[#C5A059]/20 p-3 rounded-lg text-sm">
                  <span className="font-bold">Note: </span>
                  {newOrderAlert.notes}
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-neutral-950 to-neutral-900 px-4 py-3.5">
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-white">
                  Rs. {Number(newOrderAlert.total_amount).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={closeNewOrderAlert}
                className="w-full rounded-sm bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold uppercase tracking-widest py-3 transition-colors"
              >
                {orderAlertQueue.length > 0 ? 'Got It — Next Order' : 'Got It'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                Realtime orders enabled. New orders will appear automatically.
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
            <div className="px-5 py-4 border-b border-neutral-100 bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Orders
                </h2>
                <p className="text-sm text-neutral-500">
                  Live customer orders with real dish images, table number,
                  status and invoice action.
                </p>
              </div>

              {/*  Recent / History Tabs - right side, golden theme */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${
                    activeTab === 'recent'
                      ? 'bg-[#C5A059] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-[#C5A059]/10 hover:text-[#A98443]'
                  }`}
                >
                  Recent Orders
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${
                    activeTab === 'history'
                      ? 'bg-[#C5A059] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-[#C5A059]/10 hover:text-[#A98443]'
                  }`}
                >
                  History
                </button>
              </div>
            </div>

            {/*  Search bar - centered, works for whichever tab (Recent/History) is active */}
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/60">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-full max-w-lg">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${
                      activeTab === 'recent' ? 'recent orders' : 'history'
                    } by name, phone, table or item...`}
                    className="w-full border border-neutral-200 bg-white pl-10 pr-9 py-2.5 rounded-sm text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all text-center placeholder:text-center"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <p className="text-xs text-neutral-500">
                    Found{' '}
                    <span className="font-bold text-neutral-800">
                      {displayedOrders.length}
                    </span>{' '}
                    of {baseOrders.length}{' '}
                    {activeTab === 'recent' ? 'recent' : 'history'} orders
                  </p>
                )}
              </div>
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
            ) : displayedOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-3" />

                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  {searchQuery
                    ? 'No Matching Orders'
                    : activeTab === 'recent'
                    ? 'No Recent Orders'
                    : 'No Order History'}
                </h2>

                <p className="text-sm text-neutral-500 mt-1">
                  {searchQuery
                    ? `No orders match "${searchQuery}" in ${
                        activeTab === 'recent' ? 'recent orders' : 'history'
                      }.`
                    : activeTab === 'recent'
                    ? 'No orders in the last 24 hours.'
                    : 'No past order history found.'}
                </p>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#A98443] hover:text-[#C5A059]"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear Search
                  </button>
                )}
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
                    {displayedOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrderDetails(order)}
                          className="hover:bg-[#C5A059]/[0.06] cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-5 align-top break-words">
                            <p className="font-bold text-neutral-900 break-words">
                              {order.customer_name}
                            </p>

                            <div className="mt-2 space-y-1.5">
                              <p className="flex items-center gap-2 text-xs text-neutral-600">
                                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                <span className="break-words">
                                  {order.phone}
                                </span>
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
                                  key={`${item.name}-${index}`}
                                  className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 px-2 py-2 rounded-sm"
                                >
                                  <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-neutral-200 shrink-0">
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
                                      <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                                        <ImageIcon className="w-5 h-5" />
                                      </div>
                                    )}
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

                          <td
                            className="px-4 py-5 align-top"
                            onClick={(e) => e.stopPropagation()}
                          >
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

                          <td
                            className="px-4 py-5 align-top"
                            onClick={(e) => e.stopPropagation()}
                          >
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
  onClick={() => setOrderToDelete(order)}
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

      {selectedOrderDetails && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:hidden"
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-lg max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#C5A059]/30"
          >
            
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-br from-neutral-950 to-neutral-900 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-950">
                  <img
                    src="/logo/logo.png"
                    alt="Grand Emaar Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                    Grand Emaar
                  </p>
                  <h2 className="mt-0.5 font-serif text-lg font-bold text-white">
                    Order Details
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                    selectedOrderDetails.status
                  )}`}
                >
                  {(() => {
                    const DetailStatusIcon = getStatusIcon(
                      selectedOrderDetails.status
                    );
                    return <DetailStatusIcon className="w-3 h-3" />;
                  })()}
                  {selectedOrderDetails.status}
                </span>

                <span className="bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500 font-mono rounded-sm">
                  #{selectedOrderDetails.id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">
                    {selectedOrderDetails.customer_name}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Phone
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-700">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    {selectedOrderDetails.phone}
                  </p>
                </div>

                {selectedOrderDetails.address && (
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      Table No
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-700">
                      <Table2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      {selectedOrderDetails.address}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Date & Time
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-700">
                    <CalendarDays className="w-3.5 h-3.5 text-[#C5A059]" />
                    {new Date(
                      selectedOrderDetails.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  <ChefHat className="w-3.5 h-3.5 text-[#C5A059]" />
                  Order Items
                </p>

                <div className="space-y-2">
                  {selectedOrderDetails.items?.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 px-3 py-2.5 rounded-lg transition-colors hover:border-[#C5A059]/30"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 shrink-0 ring-1 ring-neutral-200">
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
                          <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-800 break-words">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-neutral-700 whitespace-nowrap">
                        Rs. {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrderDetails.notes && (
                <div className="bg-[#C5A059]/10 text-[#8A6A2F] border border-[#C5A059]/20 p-3 rounded-lg text-sm">
                  <span className="font-bold">Note: </span>
                  {selectedOrderDetails.notes}
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-neutral-950 to-neutral-900 px-4 py-3.5">
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-white">
                  Rs. {Number(selectedOrderDetails.total_amount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {orderToDelete && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:hidden"
    onClick={() => setOrderToDelete(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#C5A059]/30"
    >
      <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>

        <h2 className="mt-4 font-serif text-lg font-bold text-neutral-900">
          Delete This Order?
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-neutral-800">
            {orderToDelete.customer_name}
          </span>
          's order? This action cannot be undone.
        </p>

        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={() => setOrderToDelete(null)}
            className="flex-1 rounded-sm border border-neutral-200 bg-white py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => deleteOrder(orderToDelete.id)}
            className="flex-1 rounded-sm bg-red-600 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}