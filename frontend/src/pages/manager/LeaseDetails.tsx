import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowBack, Edit, Download, Phone, Email, Home, DoneAll } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const LeaseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedRent, setEditedRent] = useState("");

  const fetchLease = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/leases/${id}`);
      setLease(res.data);
      setEditedRent(res.data.monthlyRentAmount?.toString() || "");
    } catch (error) {
      toast.error("Failed to fetch lease details");
      navigate("/manager/leases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLease();
  }, [id]);

  const handleUpdateRent = async () => {
    if (!lease) return;
    try {
      await api.put(`/leases/${lease.id}`, {
        ...lease,
        monthlyRentAmount: parseFloat(editedRent),
      });
      toast.success("Rent amount updated successfully!");
      setOpenDialog(false);
      fetchLease();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update rent");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lease) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
        <Typography color="error">Lease not found</Typography>
      </Paper>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "REQUESTED":
        return "warning";
      case "TERMINATED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box className="fade-in">
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/manager/leases")}>
          Back to Leases
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--primary)" }}>
            Lease Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lease ID: #{lease.id}
          </Typography>
        </Box>
        <Chip
          label={lease.leaseStatus}
          color={getStatusColor(lease.leaseStatus) as any}
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Property Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Home sx={{ color: "var(--primary)" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Property Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Property Name
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.property?.propertyName || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.property?.location || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Property Type
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.property?.propertyType || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Owner
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.property?.ownerName || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tenant Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <DoneAll sx={{ color: "var(--primary)" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tenant Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tenant Name
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.tenant?.name || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Email sx={{ fontSize: "1rem" }} />
                    Email
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.tenant?.email || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Phone sx={{ fontSize: "1rem" }} />
                    Phone
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.tenant?.phoneNumber || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lease Terms */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Lease Terms
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.leaseStartDate}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lease.leaseEndDate}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Lease Duration
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {Math.round(
                      (new Date(lease.leaseEndDate).getTime() -
                        new Date(lease.leaseStartDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}{" "}
                    months
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Terms */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Financial Terms
                </Typography>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => setOpenDialog(true)}
                >
                  Edit Rent
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Monthly Rent
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "var(--primary)" }}>
                    ₹{lease.monthlyRentAmount?.toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Security Deposit
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    ₹{lease.securityDeposit?.toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Lease Value
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    ₹
                    {(
                      lease.monthlyRentAmount *
                      Math.round(
                        (new Date(lease.leaseEndDate).getTime() -
                          new Date(lease.leaseStartDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )
                    )?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" startIcon={<Download />}>
                Download PDF
              </Button>
              <Button variant="outlined" startIcon={<Edit />}>
                Edit Lease
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Rent Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Monthly Rent</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Current rent: ₹{lease.monthlyRentAmount?.toLocaleString()}
            </Alert>
            <TextField
              fullWidth
              label="New Monthly Rent (₹)"
              type="number"
              value={editedRent}
              onChange={(e) => setEditedRent(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-md)" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleUpdateRent} variant="contained">
            Update Rent
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
