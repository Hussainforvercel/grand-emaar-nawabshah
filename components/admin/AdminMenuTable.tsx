'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { Edit2, Trash2, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';

interface AdminMenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string | undefined, name: string) => void;
}

export default function AdminMenuTable({
  items,
  onEdit,
  onDelete,
}: AdminMenuTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed rounded-sm border-neutral-300 max-w-lg mx-auto space-y-4">
        <UtensilsCrossed className="w-12 h-12 text-[#C5A059] mx-auto opacity-40 animate-pulse" />
        <h3 className="font-serif text-lg font-bold text-neutral-800">No Dishes in the System</h3>
        <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
          Create some mouthwatering Pakistan Handis, Chinese sautés or sweet desserts by clicking the {"\"Add New Dish\""} button above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-neutral-900 text-white uppercase text-[10px] tracking-widest font-bold">
              <th className="py-4 px-6 font-serif">Dish Preview</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price (PKR)</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700 text-sm">
            {items.map((item, idx) => {
              const imageSrc = item.image_url || `https://picsum.photos/seed/${encodeURIComponent(item.name)}/100/100`;

              return (
                <tr key={item.id || item.name} className="hover:bg-neutral-50/50 transition-colors">
                  
                  {/* Photo thumbnail cell */}
                  <td className="py-4 px-6">
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-neutral-200 select-none bg-neutral-100">
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Name column */}
                  <td className="py-4 px-6 font-medium">
                    <div className="font-semibold text-neutral-900">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-neutral-400 font-light max-w-xs truncate">{item.description}</div>
                    )}
                  </td>

                  {/* Category cell */}
                  <td className="py-4 px-6">
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 border border-neutral-200 rounded-sm">
                      {item.category}
                    </span>
                  </td>

                  {/* Price cell */}
                  <td className="py-4 px-6 font-mono font-medium">
                    Rs. {Number(item.price).toLocaleString()}
                  </td>

                  {/* Status Cell */}
                  <td className="py-4 px-6">
                    {item.is_available ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 uppercase font-bold tracking-widest font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 uppercase font-bold tracking-widest font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        SOLDOUT
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex gap-2 justify-end">
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(item)}
                        id={`btn-edit-dish-${idx}`}
                        className="p-2 border border-neutral-200 hover:border-[#C5A059] hover:bg-[#C5A059]/5 text-neutral-500 hover:text-[#C5A059] rounded transition-colors cursor-pointer select-none"
                        title="Edit Dish Info"
                      >
                        <Edit2 className="w-3.8 h-3.8" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(item.id, item.name)}
                        id={`btn-delete-dish-${idx}`}
                        className="p-2 border border-neutral-200 hover:border-red-500 hover:bg-red-50 text-neutral-500 hover:text-red-600 rounded transition-colors cursor-pointer select-none"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.8 h-3.8" />
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
