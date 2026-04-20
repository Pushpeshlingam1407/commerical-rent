import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Card, CardContent, Typography, Button,
  Chip, TextField, MenuItem, Skeleton, Dialog
} from '@mui/material';
import { LocationOn, Favorite, FavoriteBorder } from '@mui/icons-material';
import api from '../../utils/api';

interface Property {
  id: number;
  propertyName: string;
  location: string;
  propertyType: string;
  monthlyRentAmount: number;
  availabilityStatus: string;
}

export const TenantBrowse: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState({
    propertyType: '',
    minRent: '',
    maxRent: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties');
      setProperties(res.data.filter((p: Property) => p.availabilityStatus === 'AVAILABLE'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredProperties = properties.filter(p => {
    if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
    if (filters.minRent && p.monthlyRentAmount < parseInt(filters.minRent)) return false;
    if (filters.maxRent && p.monthlyRentAmount > parseInt(filters.maxRent)) return false;
    return true;
  });

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Browse Available Properties</Typography>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', mb: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              label="Property Type"
              select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="COMMERCIAL">Commercial</MenuItem>
              <MenuItem value="INDUSTRIAL">Industrial</MenuItem>
              <MenuItem value="OFFICE">Office</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Min Rent (₹)"
              type="number"
              value={filters.minRent}
              onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
            />
            <TextField
              fullWidth
              label="Max Rent (₹)"
              type="number"
              value={filters.maxRent}
              onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
            />
            <Button variant="contained" fullWidth onClick={() => setFilters({ propertyType: '', minRent: '', maxRent: '' })}>
              Reset
            </Button>
          </Box>
        </Paper>

        {/* Results */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredProperties.length} properties found
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {loading ? (
            Array(6).fill(0).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={300} sx={{ borderRadius: 'var(--radius-lg)' }} />
            ))
          ) : filteredProperties.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed var(--border)', gridColumn: '1 / -1' }}>
              <Typography color="text.secondary">No properties match your filters</Typography>
            </Paper>
          ) : (
            filteredProperties.map((property) => (
              <Card
                key={property.id}
                elevation={0}
                sx={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-md)',
                  }
                  }}
                >
                  <CardContent sx={{ pb: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {property.propertyName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {property.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        startIcon={favorites.includes(property.id) ? <Favorite /> : <FavoriteBorder />}
                        onClick={() => toggleFavorite(property.id)}
                        color={favorites.includes(property.id) ? 'error' : 'inherit'}
                      />
                    </Box>

                    <Box sx={{ my: 3 }}>
                      <Chip label={property.propertyType} size="small" variant="outlined" sx={{ mr: 1 }} />
                      <Chip label={property.availabilityStatus} size="small" color="success" />
                    </Box>

                    <Typography variant="h5" sx={{ color: 'var(--primary)', fontWeight: 700, my: 2 }}>
                      ₹{property.monthlyRentAmount?.toLocaleString()}/month
                    </Typography>
                  </CardContent>

                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        setSelectedProperty(property);
                        setOpenDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              ))
          )}
        </Box>
      </Box>

      {/* Property Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        {selectedProperty && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {selectedProperty.propertyName}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Location</Typography>
                <Typography>{selectedProperty.location}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Typography>{selectedProperty.propertyType}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Monthly Rent</Typography>
                <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
                  ₹{selectedProperty.monthlyRentAmount?.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenDetails(false)}>Close</Button>
              <Button fullWidth variant="contained">Request Lease</Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
