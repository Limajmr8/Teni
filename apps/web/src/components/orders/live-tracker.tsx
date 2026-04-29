'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface LiveTrackerProps {
  lat: number;
  lng: number;
}

export default function LiveTracker({ lat, lng }: LiveTrackerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

    instanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 13,
    });

    new mapboxgl.Marker({ color: '#1B4332' }).setLngLat([lng, lat]).addTo(instanceRef.current);

    return () => {
      instanceRef.current?.remove();
    };
  }, [lat, lng]);

  return <div ref={mapRef} className="h-64 w-full rounded-2xl" />;
}
