import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

// Backend User entity has: name, email, phoneNumber, role — NO password field
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  role: yup
    .string()
    .oneOf(["TENANT", "PROPERTY_OWNER"], "Select a valid role")
    .required("Role is required"),
});

type FormData = yup.InferType<typeof schema>;

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "TENANT",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Only send the fields the backend User entity accepts
      const payload = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
      };
      await api.post("/users", payload);
      toast.success("Registration successful! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Email or phone may already be taken.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "var(--background)",
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        className="glass-panel hover-lift fade-in"
        sx={{
          p: 5,
          maxWidth: 500,
          width: "100%",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}
          >
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join RentFlow to manage your commercial leasing effortlessly.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "var(--radius-md)",
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "var(--radius-md)",
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "var(--radius-md)",
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              select
              label="I am a..."
              variant="outlined"
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role?.message}
              defaultValue="TENANT"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "var(--radius-md)",
                },
              }}
            >
              <MenuItem value="TENANT">Tenant (Looking to Rent)</MenuItem>
              <MenuItem value="PROPERTY_OWNER">
                Property Owner (Listing Spaces)
              </MenuItem>
            </TextField>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: "var(--radius-md)",
              bgcolor: "var(--primary)",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "var(--shadow-md)",
              "&:hover": { bgcolor: "var(--primary-hover)" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
