export type Role = 'owner' | 'manager' | 'staff' | 'customer' | 'admin' | 'superadmin';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  [role: string]: Permission[];
} 