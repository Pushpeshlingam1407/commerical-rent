import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Chip 
} from '@mui/material';
import { Gavel } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StatusBadge } from '../../components/StatusBadge';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  resolutionRemark: yup.string().required('Resolution remark is required'),
  disputeStatus: yup.string().oneOf(['RESOLVED', 'REJECTED']).required('Select an outcome'),
});

export const DisputeManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/disputes');
      setDisputes(res.data);
    } catch (error) {
      toast.error('Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleOpenResolve = (dispute: any) => {
    setSelectedDispute(dispute);
  };

  const onSubmit = async (data: any) => {
    if (!user || !selectedDispute) return;
    setSubmitting(true);
    try {
      const payload = {
        ...selectedDispute,
        disputeStatus: data.disputeStatus,
        resolutionRemark: data.resolutionRemark,
        resolvedById: user.id
      };
      
      await api.put(`/disputes/${selectedDispute.id}`, payload);
      toast.success(`Dispute successfully marked as ${data.disputeStatus}!`);
      setSelectedDispute(null);
      reset();
      fetchDisputes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resolve dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        Dispute Resolution
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage and resolve tenant and owner disputes.
      </Typography>

      <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--background)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Lease ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Raised By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id} hover>
                    <TableCell>{dispute.id}</TableCell>
                    <TableCell>{dispute.leaseAgreementId}</TableCell>
                    <TableCell>User #{dispute.raisedById}</TableCell>
                    <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dispute.disputeReason}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={dispute.disputeStatus} />
                    </TableCell>
                    <TableCell>
                      {['OPEN', 'UNDER_REVIEW'].includes(dispute.disputeStatus) ? (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary" 
                          startIcon={<Gavel />}
                          onClick={() => handleOpenResolve(dispute)}
                          sx={{ textTransform: 'none', borderRadius: 'var(--radius-md)' }}
                        >
                          Resolve
                        </Button>
                      ) : (
                        <Chip label={dispute.disputeStatus} size="small" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {disputes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No disputes found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Resolve Dispute Modal */}
      <Dialog open={!!selectedDispute} onClose={() => setSelectedDispute(null)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 'var(--radius-lg)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border)', pb: 2 }}>
          Resolve Dispute #{selectedDispute?.id}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Dispute Reason:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {selectedDispute?.disputeReason}
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resolution Remarks"
                placeholder="Enter details about how this was resolved..."
                {...register('resolutionRemark')}
                error={!!errors.resolutionRemark}
                helperText={errors.resolutionRemark?.message as string}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" value="RESOLVED" {...register('disputeStatus')} defaultChecked />
                  <Typography>Approve & Resolve</Typography>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" value="REJECTED" {...register('disputeStatus')} />
                  <Typography color="error">Reject Dispute</Typography>
                </label>
              </Box>
              {errors.disputeStatus && (
                <Typography variant="caption" color="error">{errors.disputeStatus.message as string}</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid var(--border)' }}>
            <Button onClick={() => setSelectedDispute(null)} color="inherit" sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ bgcolor: 'var(--primary)', fontWeight: 600, '&:hover': { bgcolor: 'var(--primary-hover)' } }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Resolution'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
