'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, X, Table2, Phone } from 'lucide-react';

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

interface AdminInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function AdminInvoiceModal({
  order,
  onClose,
}: AdminInvoiceModalProps) {
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 print:static print:bg-white print:p-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 print:hidden"
        aria-label="Close invoice modal"
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[92vh] rounded-sm shadow-2xl flex flex-col overflow-hidden print:max-h-none print:shadow-none print:max-w-none print:w-full">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 print:hidden">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Grand Emaar Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Grand Emaar
              </p>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Customer Invoice
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 border border-neutral-200 inline-flex items-center justify-center rounded-sm hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 print:overflow-visible">
          <div id="invoice-print-area" className="p-5 sm:p-6 print:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-neutral-200 pb-4">
              <div className="flex items-start gap-4">
                <Image
                  src="/logo.png"
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
                    Restaurant Invoice
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
                  Invoice No
                </p>

                <p className="font-mono text-sm font-bold text-neutral-900">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>

                <p className="mt-3 text-xs text-neutral-400 uppercase tracking-widest">
                  Date
                </p>

                <p className="text-sm font-semibold text-neutral-900">
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <p className="mt-3 text-xs text-neutral-400 uppercase tracking-widest">
                  Status
                </p>

                <span className="inline-flex mt-1 px-2 py-1 border rounded-sm text-[10px] font-bold uppercase tracking-wider bg-neutral-50 text-neutral-700 border-neutral-200">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-neutral-200">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                  Customer Details
                </p>

                <p className="mt-2 text-sm font-bold text-neutral-900">
                  {order.customer_name}
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  {order.phone}
                </p>

                {order.address && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                    <Table2 className="w-4 h-4 text-[#C5A059]" />
                    <span>
                      <span className="font-bold text-neutral-800">
                        Table No:
                      </span>{' '}
                      {order.address}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                  Notes
                </p>

                <p className="mt-2 text-sm text-neutral-600">
                  {order.notes || 'No special instructions.'}
                </p>
              </div>
            </div>

            <div className="py-4 overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 text-xs uppercase tracking-widest text-neutral-400">
                      Item
                    </th>
                    <th className="text-center py-3 text-xs uppercase tracking-widest text-neutral-400">
                      Qty
                    </th>
                    <th className="text-right py-3 text-xs uppercase tracking-widest text-neutral-400">
                      Price
                    </th>
                    <th className="text-right py-3 text-xs uppercase tracking-widest text-neutral-400">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index} className="border-b border-neutral-100">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-neutral-200 shrink-0 print:hidden">
                            <Image
                              src={item.image_url || '/placeholder-food.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <p className="font-semibold text-neutral-900">
                            {item.name}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 text-center text-neutral-600">
                        {item.quantity}
                      </td>

                      <td className="py-3 text-right text-neutral-600">
                        Rs. {Number(item.price).toLocaleString()}
                      </td>

                      <td className="py-3 text-right font-semibold text-neutral-900">
                        Rs. {Number(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t border-neutral-200 pt-4">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span>Rs. {Number(order.total_amount).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Tax</span>
                  <span>Rs. 0</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-neutral-900 border-t border-neutral-200 pt-3">
                  <span>Total</span>
                  <span>Rs. {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center border-t border-neutral-100 pt-4">
              <p className="font-serif text-lg font-bold text-neutral-900">
                Thank you for ordering from Grand Emaar
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                This invoice is generated from Grand Emaar Admin Dashboard.
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
            onClick={printInvoice}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}