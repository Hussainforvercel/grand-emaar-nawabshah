'use client';

import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Loader2,
  Tag,
  X,
  UploadCloud,
} from 'lucide-react';

export type CategoryFormPayload = {
  name: string;
  image_url: string;
};

type InitialCategory = {
  name: string;
  image_url?: string | null;
};

type AdminCategoryFormProps = {
  initialCategory?: InitialCategory | null;
  onSubmit: (payload: CategoryFormPayload) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export default function AdminCategoryForm({
  initialCategory = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdminCategoryFormProps) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const isBusy = isSubmitting || isUploading;
  const previewImage = localPreviewUrl || imageUrl;

  useEffect(() => {
    setName(initialCategory?.name || '');
    setImageUrl(initialCategory?.image_url || '');
    setImageFile(null);
    setLocalPreviewUrl('');
    setUploadError('');
  }, [initialCategory]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');

    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      setImageFile(null);
      event.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError('Image size must be less than 5MB.');
      setImageFile(null);
      event.target.value = '';
      return;
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    setImageFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    setImageFile(null);
    setLocalPreviewUrl('');
    setImageUrl('');
    setUploadError('');
  };

  const uploadImageToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

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

    return String(result.imageUrl);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUploadError('');

    const cleanName = name.trim();

    if (!cleanName) {
      setUploadError('Category name is required.');
      return;
    }

    try {
      setIsUploading(true);

      let finalImageUrl = imageUrl.trim();

      if (imageFile) {
        finalImageUrl = await uploadImageToS3(imageFile);
      }

      await onSubmit({
        name: cleanName,
        image_url: finalImageUrl,
      });
    } catch (error: any) {
      setUploadError(error?.message || 'Failed to upload category image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="category-name"
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600"
        >
          Category Name
        </label>

        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Breakfast, BBQ, Fast Food"
            disabled={isBusy}
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-sm bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all disabled:opacity-60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="category-image"
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600"
        >
          Category Image
        </label>

        <label
          htmlFor="category-image"
          className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-[#C5A059]/50 bg-white px-4 py-6 text-center transition-all hover:bg-[#F9F6F0] hover:border-[#C5A059]"
        >
          <UploadCloud className="mb-3 h-9 w-9 text-[#C5A059]" />

          <p className="text-sm font-bold text-neutral-800">
            Click to upload category image
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            PNG, JPG, JPEG or WEBP. Max size 5MB.
          </p>

          {imageFile && (
            <p className="mt-3 rounded-sm bg-[#F9F6F0] px-3 py-1 text-xs font-medium text-neutral-700">
              {imageFile.name}
            </p>
          )}

          <input
            id="category-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isBusy}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}

      {previewImage && (
        <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
          <div className="aspect-[16/8] w-full bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Category preview"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ImageIcon className="h-4 w-4 text-[#C5A059]" />
              <span>
                {imageFile ? 'New image selected.' : 'Existing image saved.'}
              </span>
            </div>

            <button
              type="button"
              onClick={clearImage}
              disabled={isBusy}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-neutral-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="px-5 py-2.5 border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}

          {isUploading
            ? 'Uploading Image...'
            : isSubmitting
              ? 'Saving...'
              : initialCategory
                ? 'Update Category'
                : 'Save Category'}
        </button>
      </div>
    </form>
  );
}