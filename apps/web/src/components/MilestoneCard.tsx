"use client";

import { useEffect, useRef } from 'react';
import { ShoppingBag, Share2, Download } from 'lucide-react';
import { formatPrice } from '@bazar/shared/src/supabase';

interface MilestoneCardProps {
  sellerName: string;
  amount: number;
  period: string;
}

export default function MilestoneCard({ sellerName, amount, period }: MilestoneCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    gradient.addColorStop(0, '#10b981'); // emerald-500
    gradient.addColorStop(1, '#064e3b'); // emerald-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Draw Decorative Elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(1080, 0, 600, 0, Math.PI * 2);
    ctx.fill();

    // Draw Content
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'black 60px Inter';
    ctx.fillText('TENI MILESTONE', 540, 300);

    // Seller Name
    ctx.font = 'black 120px Inter';
    ctx.fillText(sellerName.toUpperCase(), 540, 700);

    // Middle Text
    ctx.font = 'bold 50px Inter';
    ctx.fillText('MADE', 540, 850);

    // Amount
    ctx.font = 'black 200px Inter';
    ctx.fillText(formatPrice(amount), 540, 1050);

    // Period
    ctx.font = 'bold 50px Inter';
    ctx.fillText(`THIS ${period.toUpperCase()}`, 540, 1150);

    // Tagline
    ctx.font = 'medium 40px Inter';
    ctx.fillText('PROUDLY SELLING FROM MOKOKCHUNG', 540, 1700);

    // Logo Placeholder
    ctx.font = 'black 80px Inter';
    ctx.fillText('TENI', 540, 1820);

  }, [sellerName, amount, period]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `teni-milestone-${sellerName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="w-full max-w-xs aspect-[9/16] bg-emerald-600 rounded-3xl shadow-2xl overflow-hidden relative border-4 border-white/20">
        <canvas 
          ref={canvasRef} 
          width={1080} 
          height={1920} 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex gap-4 w-full max-w-xs">
        <button 
          onClick={downloadCard}
          className="flex-1 bg-white border-2 border-neutral-100 py-4 rounded-2xl flex flex-col items-center gap-1 shadow-sm"
        >
          <Download size={20} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase">Download</span>
        </button>
        <button className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl flex flex-col items-center gap-1 shadow-xl">
          <Share2 size={20} />
          <span className="text-[10px] font-black uppercase">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
