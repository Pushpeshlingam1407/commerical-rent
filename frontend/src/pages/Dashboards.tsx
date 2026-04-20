import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PlaceholderDashboard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <Box className="fade-in">
    <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      {desc}
    </Typography>
    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <Typography variant="h6" color="text.secondary">
        This dashboard module is currently under construction.
      </Typography>
    </Paper>
  </Box>
);

export const OwnerDashboard = () => <PlaceholderDashboard title="Owner Dashboard" desc="Manage your commercial properties." />;
export const OwnerProperties = () => <PlaceholderDashboard title="My Properties" desc="View and add new properties." />;

export const TenantDashboard = () => <PlaceholderDashboard title="Tenant Dashboard" desc="Overview of your leases and rent payments." />;
export const TenantBrowse = () => <PlaceholderDashboard title="Browse Properties" desc="Find available commercial spaces." />;
export const TenantPayments = () => <PlaceholderDashboard title="My Payments" desc="View payment history and pay rent." />;

export const LeaseManagerDashboard = () => <PlaceholderDashboard title="Lease Approvals" desc="Review and approve lease requests." />;
export const DisputeManagerDashboard = () => <PlaceholderDashboard title="Dispute Resolution" desc="Manage and resolve tenant/owner disputes." />;

export const AdminLeases = () => <PlaceholderDashboard title="All Leases" desc="System-wide lease agreements." />;
export const AdminDisputes = () => <PlaceholderDashboard title="All Disputes" desc="System-wide disputes." />;
