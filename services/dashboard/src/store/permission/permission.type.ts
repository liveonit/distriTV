export type PermissionT = {
  id: string
  name: string
  description: string
}

export type CreatePermissionT = {
  name: string
  description?: string
};

export type UpdatePermissionT = {
  id: string
  name?: string
  description?: string
};
