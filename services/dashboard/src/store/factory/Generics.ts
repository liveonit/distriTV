export type Id = string | number;

export type ParcialWithId<T> = { [k in keyof T]?: T[k] } & { id: Id }