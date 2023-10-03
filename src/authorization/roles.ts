export const ROLES = ['ADMIN', 'USER'] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_INHERITANCES: Partial<Record<Role, Role[]>> = {
  ADMIN: ['USER'],
};

export function checkRole(role: Role, requiredRole: Role): boolean {
  if (role == requiredRole) return true;
  const parents = ROLE_INHERITANCES[role];
  if (parents !== undefined) {
    return parents.some((parent) => checkRole(parent, requiredRole));
  }
  return false;
}
