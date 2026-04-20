import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { CheckCircle, Info } from "@mui/icons-material";
import { toast } from "react-toastify";

export const PendingDisputes: React.FC = () => {
  const [disputes] = useState<any[]>([
    {
      id: 1,
      propertyName: "Downtown Office Suite",
      tenantName: "John Doe",
      ownerName: "Jane Smith",
      category: "Maintenance Issue",
      description: "Broken HVAC system not being repaired",
      submittedDate: "2026-04-15",
      status: "PENDING",
    },
    {
      id: 2,
      propertyName: "Commercial Space A",
      tenantName: "ABC Corp",
      ownerName: "Mike Johnson",
      category: "Rent Payment",
      description: "Dispute over late payment charges",
      submittedDate: "2026-04-16",
      status: "PENDING",
    },
  ]);
  const [loading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resolution, setResolution] = useState("");

  const handleAssignReview = async () => {
    try {
      if (!resolution) {
        toast.warning("Please enter resolution details");
        return;
      }
      toast.success("Dispute assigned for review");
      setOpenDialog(false);
      setResolution("");
      setSelectedDispute(null);
    } catch (error) {
      toast.error("Failed to assign dispute");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}>
          Pending Disputes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {disputes.length} disputes awaiting review
        </Typography>
      </Box>

      {disputes.length === 0 ? (
        <Card elevation={0} sx={{ p: 4, textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
          <Typography color="text.secondary">No pending disputes</Typography>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {disputes.map((dispute) => (
            <Card key={dispute.id} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", transition: "all 0.2s", "&:hover": { boxShadow: "var(--shadow-md)" } }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {dispute.propertyName}
                    </Typography>
                    <Chip label={dispute.category} size="small" variant="outlined" sx={{ mb: 1 }} />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Tenant:</strong> {dispute.tenantName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Owner:</strong> {dispute.ownerName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, p: 1.5, bgcolor: "var(--border)", borderRadius: "var(--radius-md)" }}>
                  {dispute.description}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  Submitted: {new Date(dispute.submittedDate).toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<Info />}
                    variant="outlined"
                    fullWidth
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<CheckCircle />}
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setOpenDialog(true);
                    }}
                  >
                    Start Review
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start Dispute Review</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedDispute && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Property:</strong> {selectedDispute.propertyName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Issue:</strong> {selectedDispute.category}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Initial Review Notes"
                placeholder="Enter your initial observations and next steps..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignReview} variant="contained">
            Assign to Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
