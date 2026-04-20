import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { Download } from "@mui/icons-material";

export const ResolvedDisputes: React.FC = () => {
  const [loading] = useState(false);
  const [disputes] = useState<any[]>([
    {
      id: 1,
      propertyName: "Tech Hub Complex",
      tenantName: "TechStart Inc",
      ownerName: "Robert Davis",
      category: "Noise Complaint",
      resolution: "Agreed on quiet hours policy",
      resolvedDate: "2026-04-10",
      resolutionDays: 5,
    },
    {
      id: 2,
      propertyName: "Retail Strip",
      tenantName: "Fashion Store",
      ownerName: "Sarah Brown",
      category: "Maintenance",
      resolution: "Property owner repaired flooring",
      resolvedDate: "2026-04-05",
      resolutionDays: 8,
    },
  ]);

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
          Resolved Disputes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {disputes.length} disputes successfully resolved
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "var(--bg-secondary)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Property</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Resolution</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Days to Resolve</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Resolved Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disputes.map((dispute) => (
              <TableRow key={dispute.id} sx={{ "&:hover": { backgroundColor: "var(--bg-hover)" } }}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dispute.propertyName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dispute.tenantName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{dispute.category}</TableCell>
                <TableCell>
                  <Typography variant="body2">{dispute.resolution}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={`${dispute.resolutionDays} days`} size="small" color="success" variant="outlined" />
                </TableCell>
                <TableCell>{new Date(dispute.resolvedDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button size="small" startIcon={<Download />} variant="outlined">
                    Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
