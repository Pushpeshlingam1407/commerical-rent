import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Check, Close, Description, Info, Edit } from "@mui/icons-material";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export const LeaseApprovals: React.FC = () => {
  const { user } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leases");
      setLeases(res.data.filter((l: any) => l.leaseStatus === "REQUESTED"));
    } catch (error) {
      toast.error("Failed to fetch lease requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleOpenDialog = (lease: any) => {
    setSelectedLease(lease);
    setOpenDialog(true);
  };

  const handleApprove = async () => {
    if (!user || !selectedLease) return;
    try {
      await api.post(`/leases/${selectedLease.id}/approve?approverName=${user.name}`);
      toast.success("Lease approved successfully!");
      setOpenDialog(false);
      setNotes("");
      fetchLeases();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve lease");
    }
  };

  const handleReject = async () => {
    if (!selectedLease) return;
    try {
      await api.post(`/leases/${selectedLease.id}/reject`);
      toast.success("Lease rejected successfully!");
      setOpenDialog(false);
      setNotes("");
      fetchLeases();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject lease");
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}>
          Lease Approval Requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and approve new lease requests from tenants
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <CircularProgress />
        </Box>
      ) : leases.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No pending lease requests
          </Typography>
          <Typography variant="caption" color="text.secondary">
            All leases have been reviewed
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {leases.map((lease) => (
            <Grid item xs={12} sm={6} lg={4} key={lease.id}>
              <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {lease.property?.propertyName || "Property"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{lease.id}
                      </Typography>
                    </Box>
                    <Chip label="PENDING" size="small" color="warning" />
                  </Box>

                  <Box sx={{ mb: 3, p: 2, bgcolor: "var(--background)", borderRadius: "var(--radius-md)" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      Tenant
                    </Typography>
                    <Typography sx={{ fontWeight: 600, mb: 2 }}>
                      {lease.tenant?.name || "Tenant"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      Lease Period
                    </Typography>
                    <Typography sx={{ fontWeight: 500, mb: 2 }}>
                      {lease.leaseStartDate} to {lease.leaseEndDate}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      Monthly Rent
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: "var(--primary)", fontSize: "1.25rem" }}>
                      ₹{lease.monthlyRentAmount?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", gap: 1, fontSize: "0.85rem" }}>
                      <Typography variant="caption">
                        <strong>Property:</strong> {lease.property?.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, fontSize: "0.85rem" }}>
                      <Typography variant="caption">
                        <strong>Deposit:</strong> ₹{lease.securityDeposit?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, borderTop: "1px solid var(--border)", display: "flex", gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<Check />}
                    onClick={() => handleOpenDialog(lease)}
                  >
                    Approve
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Close />}
                    onClick={() => {
                      setSelectedLease(lease);
                      handleReject();
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Approval Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Check sx={{ color: "success.main" }} />
            Approve Lease Request
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLease && (
            <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="info" icon={<Info />}>
                You are about to approve this lease agreement.
              </Alert>

              <Box sx={{ p: 2, bgcolor: "var(--background)", borderRadius: "var(--radius-md)" }}>
                <Typography variant="caption" color="text.secondary">
                  Property
                </Typography>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedLease.property?.propertyName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Tenant
                </Typography>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedLease.tenant?.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Monthly Rent
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "var(--primary)" }}>
                  ₹{selectedLease.monthlyRentAmount?.toLocaleString()}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Approval Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                variant="outlined"
                placeholder="Add any notes about this approval..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-md)" } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleApprove} variant="contained" color="success" startIcon={<Check />}>
            Approve Lease
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
