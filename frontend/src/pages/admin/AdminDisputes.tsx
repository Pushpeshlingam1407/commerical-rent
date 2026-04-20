import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { StatusBadge } from '../../components/StatusBadge';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export const AdminDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await api.get('/disputes');
        setDisputes(res.data);
      } catch (error) {
        toast.error('Failed to fetch disputes');
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        All Disputes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System-wide view of all disputes.
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
                  <TableCell sx={{ fontWeight: 600 }}>Resolution</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id} hover>
                    <TableCell>{dispute.id}</TableCell>
                    <TableCell>{dispute.leaseAgreementId}</TableCell>
                    <TableCell>User #{dispute.raisedById}</TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dispute.disputeReason}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={dispute.disputeStatus} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.secondary' }}>
                      {dispute.resolutionRemark || '-'}
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
    </Box>
  );
};
