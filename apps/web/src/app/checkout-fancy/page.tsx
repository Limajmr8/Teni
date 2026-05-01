"use client";

import { InteractiveCheckout } from "@/components/ui/interactive-checkout";

export default function CheckoutFancyPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                        BAZAR <span className="text-emerald-600">Checkout</span>
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Interactive checkout powered by UI/UX Pro Max.
                    </p>
                </div>
                
                <InteractiveCheckout />
            </div>
        </div>
    );
}
