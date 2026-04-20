import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { Download, Send, CheckCircle, AccessTime, Warning } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../utils/api';

interface RentPayment {
  id: number;
  leaseAgreement?: { propertyName: string };
  amount: number;
  paymentMonth: string;
  paymentDate?: string;
  paymentStatus: string;
  penaltyAmount?: number;
  referenceId?: string;
}

export const TenantPayments: React.FC = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rent-payments');
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment || !paymentMethod || !transactionId) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await api.put(`/rent-payments/${selectedPayment.id}`, {
        ...selectedPayment,
        paymentStatus: 'PAID',
        paymentDate: new Date().toISOString().split('T')[0],
        referenceId: transactionId,
      });
      toast.success('Payment recorded successfully');
      setOpenPayment(false);
      setPaymentMethod('');
      setTransactionId('');
      fetchPayments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle sx={{ color: 'var(--success)' }} />;
      case 'PENDING':
        return <AccessTime sx={{ color: 'var(--warning)' }} />;
      case 'OVERDUE':
        return <Warning sx={{ color: 'var(--danger)' }} />;
      default:
        return null;
    }
  };

  const totalPaid = payments
    .filter(p => p.paymentStatus === 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalDue = payments
    .filter(p => p.paymentStatus !== 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingCount = payments.filter(p => p.paymentStatus === 'PENDING').length;

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 3 }}>
          💳 Rent Payments
        </Typography>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <Typography variant="caption" color="text.secondary">Total Paid</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--primary)', mt: 1 }}>
              ₹{totalPaid.toLocaleString()}
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <Typography variant="caption" color="text.secondary">Total Due</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#EF4444', mt: 1 }}>
              ₹{totalDue.toLocaleString()}
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <Typography variant="caption" color="text.secondary">Pending Payments</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F59E0B', mt: 1 }}>
              {pendingCount}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Payments Table */}
      <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : payments.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No payment records found</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--background)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Paid Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>{payment.leaseAgreement?.propertyName || 'N/A'}</TableCell>
                    <TableCell>{payment.paymentMonth}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{payment.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>{payment.paymentDate || '—'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(payment.paymentStatus)}
                        <Chip
                          size="small"
                          label={payment.paymentStatus}
                          color={payment.paymentStatus === 'PAID' ? 'success' : payment.paymentStatus === 'OVERDUE' ? 'error' : 'warning'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {payment.paymentStatus !== 'PAID' && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Send />}
                            onClick={() => {
                              setSelectedPayment(payment);
                              setOpenPayment(true);
                            }}
                          >
                            Pay
                          </Button>
                        )}
                        <Button size="small" startIcon={<Download />}>
                          Invoice
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Payment Dialog */}
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedPayment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Property</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedPayment.leaseAgreement?.propertyName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Amount Due</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                  ₹{selectedPayment.amount?.toLocaleString()}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Payment Method"
                select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="bank">Bank Transfer</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Transaction ID/Reference"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={!paymentMethod || !transactionId}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
