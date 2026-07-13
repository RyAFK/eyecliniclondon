/** A referring practice. The `id` (UUID) is the immutable security boundary —
 * never the practice `name`, which staff can rename without affecting access control. */
export interface Practice {
  id: string;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PracticeInsert = Omit<Practice, 'id' | 'createdAt' | 'updatedAt'>;
