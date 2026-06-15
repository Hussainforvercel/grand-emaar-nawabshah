'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import { AlertCircle, HelpCircle, Save, X } from 'lucide-react';

interface AdminMenuFormProps {
  initialItem?: MenuItem | null; // If loaded, we are in Edit Mode
  onSubmit: (dish: Omit<MenuItem, 'id' | 'created_at'> & { id?: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function AdminMenuForm({
  initialItem,
  onSubmit,
  onCancel,
  isSubmitting,
}: AdminMenuFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const categories = [
    'Breakfast',
    'Fast Food',
    'Pakistani Food',
    'BBQ',
    'Chinese',
    'Beverages',
    'Desserts',
  ];

  // Load fields if loaded in editing mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialItem) {
        setName(initialItem.name || '');
        setPrice(initialItem.price ? String(initialItem.price) : '');
        setCategory(initialItem.category || 'Breakfast');
        setDescription(initialItem.description || '');
        setImageUrl(initialItem.image_url || '');
        setIsAvailable(initialItem.is_available !== undefined ? initialItem.is_available : true);
      } else {
        // Clear fields for fresh additions
        setName('');
        setPrice('');
        setCategory('Breakfast');
        setDescription('');
        setImageUrl('');
        setIsAvailable(true);
      }
      setErrorStatus(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);

    if (!name.trim()) {
      setErrorStatus('Please provide a unique, descriptive dish name.');
      return;
    }

    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      setErrorStatus('Please enter a valid price greater than 0.');
      return;
    }

    // Call submit function up
    onSubmit({
      id: initialItem?.id, // Preserve id if editing
      name: name.trim(),
      price: priceNum,
      category,
      description: description.trim(),
      image_url: imageUrl.trim(),
      is_available: isAvailable,
    });
  };

  return (
    <div className="bg-white border rounded-sm p-6 md:p-8 shadow-md text-left space-y-6">
      
      {/* Form header title */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-neutral-900">
            {initialItem ? 'Edit Existing Dish Details' : 'Register New Culinary Selection'}
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            {initialItem ? `Adjusting credentials of "${initialItem.name}"` : 'Ensure beautiful images and descriptions are set'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-neutral-400 hover:text-neutral-900 focus:outline-none p-1 shrink"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errorStatus && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorStatus}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dish Name */}
          <div className="space-y-1.5Col">
            <label htmlFor="dish-input-name" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Dish Name <span className="text-[#C5A059]">*</span>
            </label>
            <input
              id="dish-input-name"
              type="text"
              required
              placeholder="e.g. Mutton Karahi, Deluxe Fries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-sm pl-4 pr-4 py-3 rounded-sm focus:bg-white focus:border-[#C5A059] focus:outline-none transition-colors"
            />
          </div>

          {/* Dish Price in Rs. */}
          <div className="space-y-1.5Col">
            <label htmlFor="dish-input-price" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Price in Rupees (PKR) <span className="text-[#C5A059]">*</span>
            </label>
            <input
              id="dish-input-price"
              type="number"
              required
              min="1"
              placeholder="e.g. 850"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-sm pl-4 pr-4 py-3 rounded-sm focus:bg-white focus:border-[#C5A059] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dish Category Selector */}
          <div className="space-y-1.5Col">
            <label htmlFor="dish-input-category" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Dish Category <span className="text-[#C5A059]">*</span>
            </label>
            <select
              id="dish-input-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-sm pl-4 pr-4 py-3 rounded-sm focus:bg-white focus:border-[#C5A059] focus:outline-none transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Dish Image URL input */}
          <div className="space-y-1.5Col">
            <label htmlFor="dish-input-image" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Image URL (Optional)
            </label>
            <input
              id="dish-input-image"
              type="url"
              placeholder="https://images.unsplash.com/your-custom-dish.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-sm pl-4 pr-4 py-3 rounded-sm focus:bg-white focus:border-[#C5A059] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Dish Description Texarea */}
        <div className="space-y-1.5">
          <label htmlFor="dish-input-description" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
            Dish Description (Ingredients, Portion context)
          </label>
          <textarea
            id="dish-input-description"
            rows={3}
            placeholder="Introduce the portions, culinary details, or allergen instructions of this cooking selection..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-sm pl-4 pr-4 py-3 rounded-sm focus:bg-white focus:border-[#C5A059] focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Available Toggle Checkbox */}
        <div className="flex items-center gap-2.5 pt-1.5">
          <input
            id="dish-input-available"
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="w-4.5 h-4.5 rounded border-neutral-300 text-[#C5A059] focus:ring-[#C5A059]/35 cursor-pointer accent-[#C5A059]"
          />
          <label htmlFor="dish-input-available" className="text-sm font-medium text-neutral-700 cursor-pointer select-none">
            Is Available for Dine-in/Order
          </label>
        </div>

        {/* Form controls action block buttons */}
        <div className="pt-4 border-t flex justify-end gap-3.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 border rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            id="admin-dish-form-submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white rounded-sm text-xs font-bold uppercase tracking-widest transition-colors shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>{isSubmitting ? 'Saving...' : initialItem ? 'Update Dish' : 'Publish Dish'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
