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
} from "@mui/material";
import { StatusBadge } from "../../components/StatusBadge";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const AllProperties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await api.get("/properties");
        setProperties(res.data);
      } catch (error) {
        toast.error("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  return (
    <Box className="fade-in">
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}
      >
        All Properties
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View all listed commercial properties across the system.
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
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rent/Mo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((prop) => (
                  <TableRow key={prop.id} hover>
                    <TableCell>{prop.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {prop.propertyName}
                    </TableCell>
                    <TableCell>{prop.location}</TableCell>
                    <TableCell>{prop.propertyType}</TableCell>
                    <TableCell>${prop.monthlyRentAmount}</TableCell>
                    <TableCell>
                      <StatusBadge status={prop.availabilityStatus} />
                    </TableCell>
                  </TableRow>
                ))}
                {properties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No properties found
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
