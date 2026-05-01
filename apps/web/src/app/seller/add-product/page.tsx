"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { ArrowLeft, Camera, Plus, Trash2, Info, Loader2 } from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_in_rupees: "",
    unit: "500g",
    category_id: "",
    stock_quantity: "10",
    is_made_to_order: false,
    story: ""
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('product_categories').select('*');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 3)); // Max 3 images
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviews].slice(0, 3));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    
    setUploadingImage(true);
    const uploadedUrls: string[] = [];
    
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      uploadedUrls.push(publicUrl);
    }
    
    setUploadingImage(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    let sellerId = user?.id;
    
    if (!sellerId && typeof window !== 'undefined') {
      sellerId = localStorage.getItem('teni_demo_seller_id') || undefined;
    }
    
    if (!sellerId) {
      // Last resort: get any existing seller
      const { data: anySeller } = await supabase.from('seller_profiles').select('user_id').limit(1).single();
      sellerId = anySeller?.user_id;
    }
    
    if (!sellerId) {
      alert('Please onboard as a seller first.');
      router.push('/seller/onboarding');
      return;
    }

    let finalImageUrls = await uploadImagesToStorage();
    
    if (finalImageUrls.length === 0) {
      // Fallback if no image uploaded
      const productImages: Record<string, string> = {
        'pork': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400&auto=format&fit=crop',
        'chili': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400&auto=format&fit=crop',
        'pickle': 'https://images.unsplash.com/photo-1607530542923-dc0a58811db0?q=80&w=400&auto=format&fit=crop',
        'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop',
        'bamboo': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop',
      };
      const nameLC = formData.name.toLowerCase();
      const matchedImage = Object.entries(productImages).find(([key]) => nameLC.includes(key))?.[1]
        || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop';
      finalImageUrls = [matchedImage];
    }

    const { error } = await supabase
      .from('products')
      .insert({
        seller_id: sellerId,
        category_id: formData.category_id || null,
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price_in_rupees) * 100, // Convert to paise
        unit: formData.unit,
        stock_quantity: parseInt(formData.stock_quantity),
        is_made_to_order: formData.is_made_to_order,
        story: formData.story,
        images: finalImageUrls,
        is_active: true
      });

    if (!error) {
      router.push('/seller/dashboard');
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <header className="p-4 bg-white border-b border-gray-100 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-gray-50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Add New Product</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Photo Upload Area */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <label className="text-xs font-black uppercase text-gray-900 tracking-wide">Product Photos</label>
          <p className="text-[10px] text-gray-500 font-medium -mt-2 mb-2">Upload up to 3 real photos of your product</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {imagePreviewUrls.map((url, idx) => (
              <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            
            {images.length < 3 && (
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 gap-1 hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-6 h-6 text-emerald-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Add Photo</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              multiple 
              className="hidden" 
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-900 tracking-wide">Product Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Traditional Smoked Pork" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-900 tracking-wide">Category</label>
            <select 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Unit */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-900 tracking-wide">Price (₹)</label>
            <input 
              required
              type="number" 
              placeholder="0.00" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={formData.price_in_rupees}
              onChange={(e) => setFormData({...formData, price_in_rupees: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-900 tracking-wide">Unit</label>
            <input 
              required
              type="text" 
              placeholder="e.g. 500g" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
            />
          </div>
        </div>

        {/* Story Section - MANDATORY for TENI */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wide text-emerald-900">The Story (Required)</h3>
          </div>
          <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
            Tell the neighbor why this is special. Is it from Ungma village? Was it smoked for 3 days?
          </p>
          <textarea 
            required
            rows={4}
            placeholder="e.g. This pork is smoked using traditional methods in my home smokehouse in Ungma village for 4 days using local oak wood..."
            className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
            value={formData.story}
            onChange={(e) => setFormData({...formData, story: e.target.value})}
          />
        </div>

        {/* Stock & Delivery */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-black text-gray-900">Made to Order?</label>
              <p className="text-[10px] text-gray-500 font-medium">Item is fresh/ready only after order</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.is_made_to_order}
                onChange={(e) => setFormData({...formData, is_made_to_order: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="text-xs font-black uppercase text-gray-900 tracking-wide">Stock Quantity</label>
            <input 
              type="number" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || uploadingImage}
          className="w-full bg-rose-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wide shadow-lg shadow-rose-600/20 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors"
        >
          {loading || uploadingImage ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {uploadingImage ? 'UPLOADING...' : 'SAVING...'}</>
          ) : (
            "LIST PRODUCT"
          )}
        </button>
      </form>
    </div>
  );
}
