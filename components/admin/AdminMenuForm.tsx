'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '@/types/menu';
import { AlertCircle, ImagePlus, Loader2, Save, Upload, X } from 'lucide-react';

interface AdminMenuFormProps {
  initialItem?: MenuItem | null;
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

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPopular, setIsPopular] = useState(false);
  const categories = [
    'Breakfast',
    'Fast Food',
    'Pakistani Food',
    'BBQ',
    'Chinese',
    'Beverages',
    'Desserts',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialItem) {
        setName(initialItem.name || '');
        setPrice(initialItem.price ? String(initialItem.price) : '');
        setCategory(initialItem.category || 'Breakfast');
        setDescription(initialItem.description || '');
        setImageUrl(initialItem.image_url || '');
        setIsPopular(initialItem?.is_popular ?? false);
        setIsAvailable(
          initialItem.is_available !== undefined ? initialItem.is_available : true
        );
      } else {
        setName('');
        setPrice('');
        setCategory('Breakfast');
        setDescription('');
        setImageUrl('');
        setIsAvailable(true);
        setIsPopular(false);
      }

      setSelectedImageFile(null);
      setLocalPreviewUrl('');
      setErrorStatus(null);
      setIsUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [initialItem]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setErrorStatus(null);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorStatus('Please select a valid image file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorStatus('Image size must be less than 5MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    setSelectedImageFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    setSelectedImageFile(null);
    setLocalPreviewUrl('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToS3 = async () => {
    // Edit mode mein agar new image select nahi ki, to old image URL preserve rahega.
    if (!selectedImageFile) {
      return imageUrl.trim();
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedImageFile);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to upload image.');
      }

      if (!result.imageUrl) {
        throw new Error('S3 image URL was not returned.');
      }

      setImageUrl(result.imageUrl);
      return result.imageUrl as string;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const finalImageUrl = await uploadImageToS3();

      onSubmit({
        id: initialItem?.id,
        name: name.trim(),
        price: priceNum,
        category,
        description: description.trim(),
        image_url: finalImageUrl,
        is_available: isAvailable,
      });
    } catch (error: any) {
      console.error('Image upload failed:', error);
      setErrorStatus(error?.message || 'Failed to upload image.');
    }
  };

  const previewSrc = localPreviewUrl || imageUrl;

  return (
    <div className="bg-white border rounded-sm p-6 md:p-8 shadow-md text-left space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-neutral-900">
            {initialItem
              ? 'Edit Existing Dish Details'
              : 'Register New Culinary Selection'}
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            {initialItem
              ? `Adjusting credentials of "${initialItem.name}"`
              : 'Upload dish image, set description and publish dish'}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-neutral-400 hover:text-neutral-900 focus:outline-none p-1 shrink"
          aria-label="Close form"
        >
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
          <div className="space-y-1.5">
            <label
              htmlFor="dish-input-name"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1"
            >
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

          <div className="space-y-1.5">
            <label
              htmlFor="dish-input-price"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1"
            >
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

          {/* Availability Section */}
<div className="space-y-1.5">
  ...
</div>

{/* ⭐ ADD THIS BELOW IT */}
<div className="space-y-1.5">
  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
    Popular Dish
  </label>

  <div className="h-[46px] flex items-center justify-between bg-yellow-50 border border-yellow-200 px-4 rounded-sm">
    
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isPopular}
        onChange={(e) => setIsPopular(e.target.checked)}
        className="w-4 h-4 accent-yellow-500 cursor-pointer"
      />

      <span className="text-sm font-medium text-neutral-700">
        Mark as Popular ⭐
      </span>
    </div>

    {isPopular && (
      <span className="text-xs font-bold text-yellow-600 uppercase">
        Featured
      </span>
    )}
  </div>

  <p className="text-[10px] text-neutral-400">
    Popular dishes will appear on the homepage featured section.
  </p>
</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="dish-input-category"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1"
            >
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

          <div className="space-y-1.5">
            <label
              htmlFor="dish-input-available"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1"
            >
              Availability
            </label>

            <div className="h-[46px] flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 px-4 rounded-sm">
              <input
                id="dish-input-available"
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-[#C5A059] focus:ring-[#C5A059]/35 cursor-pointer accent-[#C5A059]"
              />
              <label
                htmlFor="dish-input-available"
                className="text-sm font-medium text-neutral-700 cursor-pointer select-none"
              >
                Available for Dine-in/Order
              </label>
            </div>
          </div>
        </div>
        
        
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
            Upload Dish Image to S3
          </label>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
            <div className="w-full h-40 rounded-sm border border-dashed border-neutral-300 bg-neutral-50 overflow-hidden flex items-center justify-center">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Dish preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center text-neutral-400 space-y-2 px-3">
                  <ImagePlus className="w-8 h-8 mx-auto text-[#C5A059]" />
                  <p className="text-[10px] uppercase tracking-widest font-bold">
                    No Image Selected
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                id="dish-input-image-file"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-sm file:border-0 file:bg-[#C5A059] file:px-4 file:py-2.5 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-white hover:file:bg-[#A98443] file:cursor-pointer"
              />

              <p className="text-xs text-neutral-400 leading-relaxed">
                Select an image from your computer. When you publish/update the
                dish, the image will upload to S3 automatically and its URL will
                be saved in Supabase. Max size: 5MB.
              </p>

              {selectedImageFile && (
                <div className="flex items-center justify-between gap-3 rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 truncate">
                      {selectedImageFile.name}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                    aria-label="Remove selected image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {imageUrl && !selectedImageFile && (
                <div className="rounded-sm border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold">
                    Existing image saved
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Upload a new image only if you want to replace the existing
                    dish image.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="dish-input-description"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1"
          >
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

        <div className="pt-4 border-t flex justify-end gap-3.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isUploadingImage}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            id="admin-dish-form-submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white rounded-sm text-xs font-bold uppercase tracking-widest transition-colors shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploadingImage ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : selectedImageFile ? (
              <Upload className="w-4 h-4 shrink-0" />
            ) : (
              <Save className="w-4 h-4 shrink-0" />
            )}

            <span>
              {isUploadingImage
                ? 'Uploading Image...'
                : isSubmitting
                  ? 'Saving...'
                  : initialItem
                    ? 'Update Dish'
                    : 'Publish Dish'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}