import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { Check, PlayArrow, Block } from "@mui/icons-material";
import { StatusBadge } from "../../components/StatusBadge";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export const LeaseManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leases");
      setLeases(res.data);
    } catch (error) {
      toast.error("Failed to fetch leases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleAction = async (id: number, action: string) => {
    if (!user) return;
    try {
      if (action === "approve") {
        await api.post(`/leases/${id}/approve?approverName=${user.name}`);
      } else {
        await api.post(`/leases/${id}/${action}`);
      }
      toast.success(`Lease successfully ${action}d!`);
      fetchLeases();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} lease`);
    }
  };

  return (
    <Box className="fade-in">
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}
      >
        Lease Approvals
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review, approve, and manage the lifecycle of lease requests.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "var(--background)" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leases.map((lease) => (
                  <TableRow key={lease.id} hover>
                    <TableCell>{lease.id}</TableCell>
                    <TableCell>
                      {lease.property?.propertyName ||
                        `Prop #${lease.property?.id}`}
                    </TableCell>
                    <TableCell>
                      {lease.tenant?.name || `Tenant #${lease.tenant?.id}`}
                    </TableCell>
                    <TableCell>
                      {lease.leaseStartDate} to {lease.leaseEndDate}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      ${lease.monthlyRentAmount}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lease.leaseStatus} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {lease.leaseStatus === "REQUESTED" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<Check />}
                              onClick={() => handleAction(lease.id, "approve")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleAction(lease.id, "cancel")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {lease.leaseStatus === "APPROVED" && (
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            startIcon={<PlayArrow />}
                            onClick={() => handleAction(lease.id, "activate")}
                          >
                            Activate
                          </Button>
                        )}
                        {lease.leaseStatus === "ACTIVE" && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Block />}
                            onClick={() => handleAction(lease.id, "terminate")}
                          >
                            Terminate
                          </Button>
                        )}
                        {["COMPLETED", "TERMINATED", "CANCELLED"].includes(
                          lease.leaseStatus,
                        ) && (
                          <Typography variant="caption" color="text.secondary">
                            Closed
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {leases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
