import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export const OwnerDisputes: React.FC = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user) return;
      setLoading(true);

      const [propsRes, leasesRes, disputesRes] = await Promise.all([
        api.get('/properties'),
        api.get('/leases'),
        api.get('/disputes'),
      ]);

      // Filter properties by owner
      const ownerProps = propsRes.data.filter((p: any) => p.ownerId === user.id);

      // Filter leases for owner's properties
      const ownerLeases = leasesRes.data.filter((l: any) =>
        ownerProps.some((p: any) => p.propertyName === l.property) && 
        (l.leaseStatus === 'ACTIVE' || l.leaseStatus === 'APPROVED')
      );
      setLeases(ownerLeases);

      // Filter disputes for owner's properties
      const ownerDisputes = disputesRes.data.filter((d: any) =>
        ownerLeases.some((l: any) => l.id === d.leaseAgreementId)
      );
      setDisputes(ownerDisputes);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'RESOLVED':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleRaiseDispute = async () => {
    if (!reason.trim() || !selectedLease) {
      toast.warning('Please select a lease and enter a reason');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/disputes', {
        leaseAgreementId: selectedLease.id,
        raisedByEmail: user?.email,
        disputeReason: reason,
        disputeStatus: 'PENDING',
      });

      toast.success('Dispute raised successfully!');
      setOpenDialog(false);
      setReason('');
      setSelectedLease(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to raise dispute');
    } finally {
      setSubmitting(false);
    }
  };

  const activeLeases = leases;

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
            Property Disputes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage disputes on your properties and tenancies
          </Typography>
        </Box>
        <Button
          variant="contained"
          disabled={activeLeases.length === 0}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: 'var(--primary)' }}
        >
          Raise Dispute
        </Button>
      </Box>

      {/* Disputes List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : disputes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <CheckCircle sx={{ fontSize: '3rem', color: '#10B981', mb: 2 }} />
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No disputes on your properties
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {activeLeases.length} active lease{activeLeases.length !== 1 ? 's' : ''}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {disputes.map((dispute) => (
            <Card
              key={dispute.id}
              elevation={0}
              sx={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: 'var(--shadow-md)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {dispute.property}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tenant: {dispute.tenantName} • Raised: {new Date(dispute.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={dispute.disputeStatus}
                    color={getStatusColor(dispute.disputeStatus)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  <strong>Issue:</strong> {dispute.disputeReason}
                </Typography>

                {dispute.resolutionRemark && (
                  <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 'var(--radius-md)', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#10B981' }}>
                      <strong>Resolution:</strong> {dispute.resolutionRemark}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Raise Dispute Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--primary)' }}>
          Raise a Dispute
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {activeLeases.length === 0 ? (
            <Alert severity="info">
              You need active leases to raise a dispute. Add properties and leases first.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                select
                fullWidth
                label="Select Lease"
                value={selectedLease?.id || ''}
                onChange={(e) => {
                  const lease = activeLeases.find((l) => l.id === parseInt(e.target.value));
                  setSelectedLease(lease);
                }}
                slotProps={{ select: { native: true } }}
              >
                <option value="">-- Choose a lease --</option>
                {activeLeases.map((lease) => (
                  <option key={lease.id} value={lease.id}>
                    {lease.property} - {lease.tenant}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Dispute Reason"
                placeholder="Describe the issue (tenant behavior, property damage, maintenance issues, etc.)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid var(--border)' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRaiseDispute}
            variant="contained"
            disabled={submitting || activeLeases.length === 0}
            sx={{ bgcolor: 'var(--primary)' }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Raise Dispute'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
