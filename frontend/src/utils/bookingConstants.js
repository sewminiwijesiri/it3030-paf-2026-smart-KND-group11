export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: 'bg-amber-50 text-amber-600 border-amber-100',
  [BOOKING_STATUS.APPROVED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  [BOOKING_STATUS.REJECTED]: 'bg-rose-50 text-rose-600 border-rose-100',
  [BOOKING_STATUS.CANCELLED]: 'bg-slate-50 text-slate-400 border-slate-100',
};

export const STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.APPROVED]: 'Approved',
  [BOOKING_STATUS.REJECTED]: 'Rejected',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
};
