import React, { useEffect, useRef, useState } from "react";
import {
    Box, Grid, Typography, Card, CardContent, Chip, CircularProgress,
} from "@mui/material";
import {
    ViewKanban, CheckCircle, People, PlayArrow, Pending,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { projectsApi, membersApi } from "../services/api";
import { pageEnter, countUp, staggerFadeUp } from "../utils/gsapUtils";
import toast from "react-hot-toast";

interface ProjectStats { total: number; active: number; completed: number; planning: number; on_hold: number; }

const StatCard = ({
    icon, label, value, color, index,
}: { icon: React.ReactNode; label: string; value: number; color: string; index: number }) => {
    const numRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (numRef.current) {
            const t = setTimeout(() => { if (numRef.current) countUp(numRef.current, value, 1.5, index * 0.15); }, 300);
            return () => clearTimeout(t);
        }
    }, [value, index]);
    return (
        <Card
            sx={{
                bgcolor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
                "&:hover": { boxShadow: "var(--shadow-md)", transform: "translateY(-2px)" },
            }}
        >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box>
                        <Typography sx={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 500, mb: 0.5 }}>{label}</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1 }}>
                            <span ref={numRef}>0</span>
                        </Typography>
                    </Box>
                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", "& svg": { color } }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const Dashboard: React.FC = () => {
    const { user, isCompany } = useAuth();
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [pStats, setPStats] = useState<ProjectStats>({ total: 0, active: 0, completed: 0, planning: 0, on_hold: 0 });
    const [memberCount, setMemberCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recentProjects, setRecentProjects] = useState<Array<{ _id: string; title: string; status: string; progress: number; myPermission?: string }>>([]);

    useEffect(() => {
        if (pageRef.current) pageEnter(pageRef.current);
        if (heroRef.current) staggerFadeUp(heroRef.current.querySelectorAll(".hero-item"), 0.12, 0.05);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pRes = await projectsApi.getAll();
                const projects = pRes.data.data.projects;
                setRecentProjects(projects.slice(0, 4));
                setPStats({
                    total: projects.length,
                    active: projects.filter((p: { status: string }) => p.status === "active").length,
                    completed: projects.filter((p: { status: string }) => p.status === "completed").length,
                    planning: projects.filter((p: { status: string }) => p.status === "planning").length,
                    on_hold: projects.filter((p: { status: string }) => p.status === "on_hold").length,
                });
                if (isCompany()) {
                    const mRes = await membersApi.getStats();
                    setMemberCount(mRes.data.data.stats.total);
                }
            } catch {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isCompany]);

    const companyStats = [
        { icon: <ViewKanban />, label: "Total Projects", value: pStats.total, color: "var(--color-primary)" },
        { icon: <PlayArrow />, label: "Active", value: pStats.active, color: "var(--color-success)" },
        { icon: <CheckCircle />, label: "Completed", value: pStats.completed, color: "var(--color-secondary)" },
        { icon: <People />, label: "Team Members", value: memberCount, color: "var(--color-accent)" },
    ];

    const memberStats = [
        { icon: <ViewKanban />, label: "My Projects", value: pStats.total, color: "var(--color-primary)" },
        { icon: <PlayArrow />, label: "Active", value: pStats.active, color: "var(--color-success)" },
        { icon: <CheckCircle />, label: "Completed", value: pStats.completed, color: "var(--color-secondary)" },
        { icon: <Pending />, label: "Planning", value: pStats.planning, color: "var(--color-warning)" },
    ];

    const statCards = isCompany() ? companyStats : memberStats;

    return (
        <Box ref={pageRef} className="page-container" sx={{ py: 4 }}>
            {/* Hero */}
            <Box
                ref={heroRef}
                sx={{
                    mb: 4, p: { xs: 3, md: 4 }, borderRadius: "var(--radius-xl)",
                    background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                    position: "relative", overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.07)" }} />
                <Box sx={{ position: "absolute", bottom: -30, left: "30%", width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography className="hero-item" variant="h4" sx={{ fontWeight: 800, color: "#fff", mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
                        Welcome back, {user?.name?.split(" ")[0]} 👋
                    </Typography>
                    <Typography className="hero-item" sx={{ color: "rgba(255,255,255,0.8)", mb: 2, fontSize: "0.95rem" }}>
                        {isCompany()
                            ? "Manage your projects and team members from here."
                            : "View your assigned projects and track progress below."}
                    </Typography>
                    <Chip
                        className="hero-item"
                        icon={isCompany() ? <span>🏢</span> : <span>👤</span>}
                        label={isCompany() ? "Company Account" : "Team Member"}
                        sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, backdropFilter: "blur(4px)" }}
                    />
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "var(--color-primary)" }} /></Box>
            ) : (
                <>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {statCards.map((card, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={card.label}>
                                <StatCard {...card} index={i} />
                            </Grid>
                        ))}
                    </Grid>

                    {recentProjects.length > 0 && (
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)", mb: 2 }}>
                                {isCompany() ? "Recent Projects" : "My Assigned Projects"}
                            </Typography>
                            <Grid container spacing={2}>
                                {recentProjects.map((project, i) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={project._id}>
                                        <Card
                                            sx={{
                                                bgcolor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)",
                                                transition: "box-shadow 0.25s, transform 0.25s",
                                                "&:hover": { boxShadow: "var(--shadow-md)", transform: "translateY(-2px)" },
                                                animationDelay: `${i * 0.1}s`,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: "center" }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text-primary)" }}>{project.title}</Typography>
                                                    <Box sx={{ display: "flex", gap: 0.5 }}>
                                                        <span className={`badge badge-${project.status}`}>{project.status.replace("_", " ")}</span>
                                                        {project.myPermission && (
                                                            <span className={`badge badge-${project.myPermission === "edit" ? "pm" : "tm"}`}>
                                                                {project.myPermission}
                                                            </span>
                                                        )}
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Box sx={{ flex: 1, bgcolor: "var(--color-border)", borderRadius: 4, height: 4, overflow: "hidden" }}>
                                                        <Box sx={{ width: `${project.progress}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }} />
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.75rem", color: "var(--color-text-muted)", minWidth: 30 }}>{project.progress}%</Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Dashboard;
