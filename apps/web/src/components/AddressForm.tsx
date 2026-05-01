"use client";

import { useState } from "react";
import { MapPin, Phone, User, Home, Landmark } from "lucide-react";

export interface DeliveryAddress {
  name: string;
  phone: string;
  line1: string;
  locality: string;
  landmark: string;
  lat: number;
  lng: number;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  name: "",
  phone: "",
  line1: "",
  locality: "Mokokchung",
  landmark: "",
  lat: 26.3267,
  lng: 94.5244,
};

export default function AddressForm({
  onAddressChange,
  savedAddress,
}: {
  onAddressChange: (address: DeliveryAddress) => void;
  savedAddress?: DeliveryAddress | null;
}) {
  const [address, setAddress] = useState<DeliveryAddress>(
    savedAddress || DEFAULT_ADDRESS
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const update = (field: keyof DeliveryAddress, value: string) => {
    const updated = { ...address, [field]: value };
    setAddress(updated);
    setErrors((prev) => ({ ...prev, [field]: false }));
    onAddressChange(updated);
  };

  const fields: {
    key: keyof DeliveryAddress;
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    type?: string;
    required?: boolean;
  }[] = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "e.g. Temjen Ao",
      icon: <User className="w-4 h-4" />,
      required: true,
    },
    {
      key: "phone",
      label: "Phone",
      placeholder: "+91 00000 00000",
      icon: <Phone className="w-4 h-4" />,
      type: "tel",
      required: true,
    },
    {
      key: "line1",
      label: "Address",
      placeholder: "e.g. Ward 5, House 42",
      icon: <Home className="w-4 h-4" />,
      required: true,
    },
    {
      key: "locality",
      label: "Locality",
      placeholder: "e.g. Mokokchung Town",
      icon: <MapPin className="w-4 h-4" />,
      required: true,
    },
    {
      key: "landmark",
      label: "Landmark",
      placeholder: "e.g. Near Ao Baptist Church",
      icon: <Landmark className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-xs font-black uppercase text-gray-800 tracking-wide flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500" />
          Delivery Address
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {field.label}{" "}
              {field.required && <span className="text-rose-400">*</span>}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {field.icon}
              </div>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={(address[field.key] as string) || ""}
                onChange={(e) => update(field.key, e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all ${
                  errors[field.key]
                    ? "border-rose-300 bg-rose-50/50"
                    : "border-gray-200"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
