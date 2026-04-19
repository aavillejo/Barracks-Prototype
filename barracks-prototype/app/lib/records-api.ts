"use client";

import { useCustomerStorage, useStaffStorage, useInventoryStorage } from "@/app/Records/DataPersistence/Storage";
import type { Customer, StaffMember, InventoryItem } from "@/app/Records/DataPersistence/Storage";

// ==================== retrieve cuhs ====================
export function getAllCustomers(): Customer[] {
  const { customers } = useCustomerStorage();
  return customers;
}

// ==================== retrieve stah ====================
export function getAllStaff(): StaffMember[] {
  const { staff } = useStaffStorage();
  return staff;
}

// ==================== retrieve ihnv ====================
export function getAllInventory(): InventoryItem[] {
  const { inventoryItems } = useInventoryStorage();
  return inventoryItems;
}
