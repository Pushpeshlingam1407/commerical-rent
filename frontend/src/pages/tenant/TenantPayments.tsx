import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Dialog, TextField, Alert, CircularProgress, MenuItem
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

  const stats = {
    totalDue: payments.filter(p => p.paymentStatus !== 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0),
    totalPaid: payments.filter(p => p.paymentStatus === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingCount: payments.filter(p => p.paymentStatus === 'PENDING' || p.paymentStatus === 'OVERDUE').length,
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Payment History</Typography>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
          {[
            { label: 'Total Paid', value: `₹${stats.totalPaid.toLocaleString()}`, icon: '✓', color: '#10B981' },
            { label: 'Amount Due', value: `₹${stats.totalDue.toLocaleString()}`, icon: '!', color: '#EF4444' },
            { label: 'Pending Payments', value: stats.pendingCount, icon: '⏱', color: '#F59E0B' },
          ].map((stat, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: stat.color }}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Warnings */}
        {stats.pendingCount > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You have {stats.pendingCount} pending payment(s). Please process them at the earliest.
          </Alert>
        )}

        {/* Payments Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--border)' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--surface-hover)' }}>
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
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', p: 4 }}>
                      No payment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Payment Dialog */}
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Record Payment</Typography>
          {selectedPayment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Amount to Pay</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)', mt: 1 }}>
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
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Transaction ID / Reference"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
                <Button variant="contained" onClick={handlePayment}>Confirm Payment</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};
