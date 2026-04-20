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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Edit, Close, Info, DateRange } from "@mui/icons-material";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const ActiveLeases: React.FC = () => {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leases");
      setLeases(res.data.filter((l: any) => l.leaseStatus === "ACTIVE"));
    } catch (error) {
      toast.error("Failed to fetch active leases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleTerminate = async () => {
    if (!selectedLease) return;
    try {
      await api.post(`/leases/${selectedLease.id}/terminate`, {
        reason: terminationReason,
      });
      toast.success("Lease terminated successfully!");
      setOpenDialog(false);
      setTerminationReason("");
      fetchLeases();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to terminate lease");
    }
  };

  const getRemainingDays = (endDate: string): number => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}>
          Active Leases
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and monitor currently active lease agreements
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <CircularProgress />
        </Box>
      ) : leases.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
          <Typography color="text.secondary">No active leases</Typography>
        </Paper>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "var(--background)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Monthly Rent</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Days Left</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leases.map((lease) => {
                    const daysLeft = getRemainingDays(lease.leaseEndDate);
                    const isExpiringSoon = daysLeft <= 30;

                    return (
                      <TableRow key={lease.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>#{lease.id}</TableCell>
                        <TableCell>{lease.property?.propertyName || "N/A"}</TableCell>
                        <TableCell>{lease.tenant?.name || "N/A"}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "var(--primary)" }}>
                          ₹{lease.monthlyRentAmount?.toLocaleString()}
                        </TableCell>
                        <TableCell>{lease.leaseEndDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${daysLeft} days`}
                            size="small"
                            color={isExpiringSoon ? "error" : "default"}
                            variant={isExpiringSoon ? "filled" : "outlined"}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Close />}
                              onClick={() => {
                                setSelectedLease(lease);
                                setOpenDialog(true);
                              }}
                            >
                              Terminate
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {leases.some((l) => getRemainingDays(l.leaseEndDate) <= 30) && (
            <Alert severity="warning" sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <DateRange sx={{ fontSize: "1.25rem" }} />
              <Box>
                <strong>Attention:</strong> {leases.filter((l) => getRemainingDays(l.leaseEndDate) <= 30).length} lease(s) expiring within 30 days
              </Box>
            </Alert>
          )}
        </>
      )}

      {/* Termination Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Close sx={{ color: "error.main" }} />
            Terminate Lease
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLease && (
            <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="error" icon={<Info />}>
                This action will terminate the lease agreement. Please provide a reason.
              </Alert>

              <Box sx={{ p: 2, bgcolor: "var(--background)", borderRadius: "var(--radius-md)" }}>
                <Typography variant="caption" color="text.secondary">
                  Lease Details
                </Typography>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedLease.property?.propertyName} - {selectedLease.tenant?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  End Date: {selectedLease.leaseEndDate}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Termination Reason"
                multiline
                rows={3}
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                variant="outlined"
                placeholder="Explain why this lease is being terminated..."
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-md)" } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleTerminate}
            variant="contained"
            color="error"
            disabled={!terminationReason.trim()}
            startIcon={<Close />}
          >
            Terminate Lease
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
