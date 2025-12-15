import { useEffect, useState } from "react";

export interface GarageItem {
  id: string;
  vehicleName: string;
  brand: string;
  wheelId: string;
  wheelName: string;
  createdAt: string;
  vehicleImageUrl?: string;
  wheelImageUrl?: string;
}

const STORAGE_KEY = "garage_items_v1";

export function useGarage() {
  const [items, setItems] = useState<GarageItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load garage from storage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save garage to storage", e);
    }
  }, [items]);

  const addCombo = (payload: Omit<GarageItem, "id" | "createdAt">) => {
    const newItem: GarageItem = {
      id: (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`),
      createdAt: new Date().toISOString(),
      ...payload,
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const removeCombo = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => setItems([]);

  return { items, addCombo, removeCombo, clearAll };
}
