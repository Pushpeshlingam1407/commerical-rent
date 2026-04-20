import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  HomeWork,
  Description,
  Payment,
  Gavel,
  People,
  Logout,
  Person,
  TrendingUp,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 260;

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "ADMIN":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/" },
          { text: "Users", icon: <People />, path: "/admin/users" },
          { text: "Properties", icon: <HomeWork />, path: "/admin/properties" },
          { text: "Leases", icon: <Description />, path: "/admin/leases" },
          { text: "Disputes", icon: <Gavel />, path: "/admin/disputes" },
        ];
      case "PROPERTY_OWNER":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/" },
          {
            text: "My Properties",
            icon: <HomeWork />,
            path: "/owner/properties",
          },
        ];
      case "TENANT":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/" },
          {
            text: "Browse Properties",
            icon: <HomeWork />,
            path: "/tenant/browse",
          },
          { text: "My Payments", icon: <Payment />, path: "/tenant/payments" },
        ];
      case "LEASE_MANAGER":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/manager/leases" },
          { text: "Lease Approvals", icon: <Description />, path: "/manager/approvals" },
          { text: "Active Leases", icon: <HomeWork />, path: "/manager/active" },
          { text: "Analytics", icon: <TrendingUp />, path: "/manager/analytics" },
        ];
      case "DISPUTE_MANAGER":
        return [{ text: "Disputes", icon: <Gavel />, path: "/" }];
      default:
        return [];
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ my: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            RentFlow
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Commercial Leasing Platform
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, flexGrow: 1 }}>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path))
              }
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "var(--radius-lg)",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "var(--primary-hover)" },
                  "& .MuiListItemIcon-root": { color: "#fff" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "var(--text-muted)" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                slotProps={{ primary: { sx: { fontWeight: 500 } } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: "1px solid var(--border)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "var(--primary)" }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              {user?.role.replace("_", " ").toLowerCase()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "var(--surface)",
          color: "var(--text-main)",
          boxShadow: "var(--shadow-sm)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: "var(--primary)" }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(var(--shadow-md))",
                    mt: 1.5,
                    borderRadius: "var(--radius-md)",
                    minWidth: 150,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{ color: "var(--status-error-text)" }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
              boxShadow: "var(--shadow-md)",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid var(--border)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
