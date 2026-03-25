import React, { useState } from "react";
import {
    AppBar, Toolbar, Box, IconButton, Avatar, Menu, MenuItem,
    Tooltip, useMediaQuery, Drawer, List, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography,
} from "@mui/material";
import {
    Dashboard, ViewKanban, People, Menu as MenuIcon, Close,
    LightMode, DarkMode, Logout, Business, Person,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface NavbarProps {
    mode: "light" | "dark";
    toggleMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, toggleMode }) => {
    const { user, logout, isCompany } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleLogout = async () => {
        setAnchorEl(null);
        await logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { label: "Dashboard", path: "/dashboard", icon: <Dashboard fontSize="small" /> },
        { label: "Projects", path: "/projects", icon: <ViewKanban fontSize="small" /> },
        ...(isCompany() ? [{ label: "Team Members", path: "/members", icon: <People fontSize="small" /> }] : []),
    ];

    const NavItem = ({ label, path, icon }: { label: string; path: string; icon: React.ReactNode }) => (
        <ListItemButton
            component={Link}
            to={path}
            selected={isActive(path)}
            onClick={() => setDrawerOpen(false)}
            sx={{
                borderRadius: "var(--radius-sm)", mb: 0.5,
                color: isActive(path) ? "var(--color-primary)" : "var(--color-text-secondary)",
                bgcolor: isActive(path) ? "var(--color-primary-light)" : "transparent",
                "&:hover": { bgcolor: "var(--color-primary-light)", color: "var(--color-primary)" },
            }}
        >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontWeight: isActive(path) ? 600 : 400, fontSize: "0.875rem" }} />
        </ListItemButton>
    );

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", height: "var(--nav-height)", zIndex: 1200 }}>
                <Toolbar sx={{ height: "100%", px: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                        {isMobile && (
                            <IconButton size="small" onClick={() => setDrawerOpen(true)} sx={{ color: "var(--color-text-secondary)" }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box component={Link} to="/dashboard" sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none" }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>P</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)", display: { xs: "none", sm: "block" } }}>
                                Portal
                            </Typography>
                        </Box>
                    </Box>

                    {/* Desktop Nav */}
                    {!isMobile && (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            {navLinks.map((link) => (
                                <Box
                                    key={link.path}
                                    component={Link}
                                    to={link.path}
                                    sx={{
                                        display: "flex", alignItems: "center", gap: 0.75,
                                        px: 1.5, py: 0.75, borderRadius: "8px", textDecoration: "none",
                                        fontSize: "0.875rem", fontWeight: isActive(link.path) ? 600 : 500,
                                        color: isActive(link.path) ? "var(--color-primary)" : "var(--color-text-secondary)",
                                        bgcolor: isActive(link.path) ? "var(--color-primary-light)" : "transparent",
                                        transition: "all 0.2s ease",
                                        "&:hover": { bgcolor: "var(--color-primary-light)", color: "var(--color-primary)" },
                                    }}
                                >
                                    {link.icon}
                                    {link.label}
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: isMobile ? 0 : 1, justifyContent: "flex-end" }}>
                        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
                            <IconButton size="small" onClick={toggleMode} sx={{ color: "var(--color-text-secondary)" }}>
                                {mode === "dark" ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        {user && (
                            <Tooltip title={user.name}>
                                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                                    <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", fontWeight: 700, background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Dropdown */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { bgcolor: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-lg)", borderRadius: "var(--radius-md)", mt: 1, minWidth: 200 } }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text-primary)", fontSize: "0.875rem" }}>{user?.name}</Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{user?.email}</Typography>
                    <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 0.5 }}>
                        {user?.role === "company" ? <Business sx={{ fontSize: 12, color: "var(--color-primary)" }} /> : <Person sx={{ fontSize: 12, color: "var(--color-role-tm)" }} />}
                        <Typography sx={{ fontSize: "11px", fontWeight: 600, color: user?.role === "company" ? "var(--color-primary)" : "var(--color-role-tm)", textTransform: "capitalize" }}>
                            {user?.role === "company" ? "Company" : "Team Member"}
                        </Typography>
                    </Box>
                    {user?.role === "team_member" && user.createdBy && (
                        <Typography sx={{ fontSize: "0.7rem", color: "var(--color-text-muted)", mt: 1 }}>
                            Belongs to: <strong>{user.createdBy.name}</strong>
                        </Typography>
                    )}
                </Box>
                <Divider sx={{ borderColor: "var(--color-border)" }} />
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: "var(--color-error)", fontSize: "0.875rem", py: 1.25 }}>
                    <Logout fontSize="small" />
                    Logout
                </MenuItem>
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: 260, bgcolor: "var(--color-surface)", borderRight: "1px solid var(--color-border)" } }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Portal</Typography>
                        <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ color: "var(--color-text-muted)" }}><Close fontSize="small" /></IconButton>
                    </Box>
                    <List dense disablePadding>
                        {navLinks.map((link) => <NavItem key={link.path} {...link} />)}
                    </List>
                    <Divider sx={{ my: 1.5, borderColor: "var(--color-border)" }} />
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: "var(--radius-sm)", color: "var(--color-error)" }}>
                        <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}><Logout fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                    </ListItemButton>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
