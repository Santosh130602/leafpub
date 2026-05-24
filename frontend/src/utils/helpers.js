import { format, formatDistanceToNow } from 'date-fns';

// Format currency in INR
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy');
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy, h:mm a');
};

// Time ago
export const timeAgo = (date) => {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Priority badge class
export const getPriorityClass = (priority) => {
  const map = {
    'Critical': 'badge-critical',
    'High': 'badge-high',
    'Medium': 'badge-medium',
    'Low': 'badge-low'
  };
  return map[priority] || 'badge-gray';
};

// Status badge class
export const getStatusClass = (status) => {
  const map = {
    'Open': 'badge-open',
    'In Progress': 'badge-inprogress',
    'Resolved': 'badge-resolved',
    'Closed': 'badge-closed'
  };
  return map[status] || 'badge-gray';
};

// Truncate text
export const truncate = (str, maxLength = 80) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Get error message from axios error
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

// Book production status color
export const getBookStatusColor = (status) => {
  if (status === 'Published & Live') return 'badge-green';
  if (['Printing', 'Distribution Setup'].includes(status)) return 'badge-amber';
  return 'badge-blue';
};
