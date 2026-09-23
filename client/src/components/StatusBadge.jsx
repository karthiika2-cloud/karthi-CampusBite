import React from 'react';
import { Clock, CheckCircle2, ChefHat, BellRing, CheckCheck, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  switch (status) {
    case 'Order Received':
      return (
        <span className="status-badge received">
          <Clock size={14} /> Order Received
        </span>
      );
    case 'Confirmed':
      return (
        <span className="status-badge confirmed">
          <CheckCircle2 size={14} /> Confirmed
        </span>
      );
    case 'Preparing':
      return (
        <span className="status-badge preparing">
          <ChefHat size={14} /> In Kitchen
        </span>
      );
    case 'Ready for Pickup':
      return (
        <span className="status-badge ready">
          <BellRing size={14} /> Ready for Pickup
        </span>
      );
    case 'Completed':
      return (
        <span className="status-badge completed">
          <CheckCheck size={14} /> Completed
        </span>
      );
    case 'Cancelled':
      return (
        <span className="status-badge cancelled">
          <XCircle size={14} /> Cancelled
        </span>
      );
    default:
      return <span className="status-badge received">{status}</span>;
  }
}
