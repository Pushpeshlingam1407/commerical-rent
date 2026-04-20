import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { StatusBadge } from '../../components/StatusBadge';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export const AdminLeases: React.FC = () => {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const res = await api.get('/leases');
        setLeases(res.data);
      } catch (error) {
        toast.error('Failed to fetch leases');
      } finally {
        setLoading(false);
      }
    };
    fetchLeases();
  }, []);

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        All Leases
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System-wide view of all lease agreements.
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
                  <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leases.map((lease) => (
                  <TableRow key={lease.id} hover>
                    <TableCell>{lease.id}</TableCell>
                    <TableCell>{lease.property?.propertyName || `Prop #${lease.property?.id}`}</TableCell>
                    <TableCell>{lease.tenant?.name || `Tenant #${lease.tenant?.id}`}</TableCell>
                    <TableCell>{lease.leaseStartDate} to {lease.leaseEndDate}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>${lease.monthlyRentAmount}</TableCell>
                    <TableCell>
                      <StatusBadge status={lease.leaseStatus} />
                    </TableCell>
                  </TableRow>
                ))}
                {leases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No lease agreements found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};
