import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { OwnerDashboard } from './owner/OwnerDashboard';
import { OwnerProperties } from './owner/OwnerProperties';
import { TenantDashboard } from './tenant/TenantDashboard';
import { TenantBrowse } from './tenant/TenantBrowse';
import { TenantPayments } from './tenant/TenantPayments';
import { AdminLeases as AdminLeasesPage } from './admin/AdminLeases';
import { AdminDisputes as AdminDisputesPage } from './admin/AdminDisputes';

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

// Export placeholder components
export const LeaseManagerDashboard = () => <PlaceholderDashboard title="Lease Approvals" desc="Review and approve lease requests." />;
export const DisputeManagerDashboard = () => <PlaceholderDashboard title="Dispute Resolution" desc="Manage and resolve tenant/owner disputes." />;
export const AdminLeases = AdminLeasesPage;
export const AdminDisputes = AdminDisputesPage;

// Export actual dashboard components
export { OwnerDashboard, OwnerProperties, TenantDashboard, TenantBrowse, TenantPayments };
