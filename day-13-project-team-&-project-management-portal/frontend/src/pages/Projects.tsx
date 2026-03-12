import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Box, Grid, Typography, Button, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Chip, IconButton, CircularProgress,
    InputAdornment, Tooltip, LinearProgress, Avatar,
    Select, FormControl, InputLabel, Divider,
} from "@mui/material";
import {
    Add, Edit, Delete, Search, Close, FolderOpen, GroupAdd, PersonRemove, Check,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { projectsApi, membersApi } from "../services/api";
import { staggerScaleIn, pageEnter, dialogEnter } from "../utils/gsapUtils";

interface TeamMember {
    user: { _id: string; name: string; email: string; department?: string };
    permission: "edit" | "view";
}

interface Project {
    _id: string;
    title: string;
    description: string;
    techStack: string[];
    status: "planning" | "active" | "on_hold" | "completed";
    priority: "low" | "medium" | "high" | "critical";
    progress: number;
    startDate?: string;
    endDate?: string;
    owner: { _id: string; name: string; email: string };
    teamMembers: TeamMember[];
    myPermission?: "edit" | "view";
}

interface Member { _id: string; name: string; email: string; }

const projectSchema = yup.object({
    title: yup.string().min(3).max(100).required("Title is required"),
    description: yup.string().required("Description is required").max(1000),
    techStack: yup.string().optional().default(""),
    status: yup.string().oneOf(["planning", "active", "on_hold", "completed"]).required(),
    priority: yup.string().oneOf(["low", "medium", "high", "critical"]).required(),
    progress: yup.number().transform((v) => (isNaN(v) ? 0 : v)).min(0).max(100).optional().default(0),
    startDate: yup.string().optional().default(""),
    endDate: yup.string().optional().default(""),
});

type ProjectFormData = yup.InferType<typeof projectSchema>;

const Projects: React.FC = () => {
    const { isCompany } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialogs
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);

    const [editProject, setEditProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [assigningProject, setAssigningProject] = useState<Project | null>(null);

    // Multi-assign: list of pending assignments
    const [pendingAssignments, setPendingAssignments] = useState<{ userId: string; permission: "edit" | "view" }[]>([]);
    const [assignUserId, setAssignUserId] = useState("");
    const [assignPermission, setAssignPermission] = useState<"edit" | "view">("view");
    const [saving, setSaving] = useState(false);

    const pageRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, reset, setError, control, formState: { errors } } = useForm<ProjectFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(projectSchema) as any,
        defaultValues: { status: "planning", priority: "medium", progress: 0, techStack: "", startDate: "", endDate: "" },
    });

    const loadProjects = useCallback(async () => {
        try {
            const pRes = await projectsApi.getAll();
            setProjects(pRes.data.data.projects);
            if (isCompany()) {
                const mRes = await membersApi.getAll();
                setAllMembers(mRes.data.data.users);
            }
        } catch {
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, [isCompany]);

    useEffect(() => {
        if (pageRef.current) pageEnter(pageRef.current);
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        if (!loading && projects.length > 0) {
            const cards = document.querySelectorAll(".project-card");
            if (cards.length) staggerScaleIn(cards, 0.07);
        }
    }, [loading, projects]);

    const openCreate = () => {
        setEditProject(null);
        reset({ status: "planning", priority: "medium", progress: 0, techStack: "", startDate: "", endDate: "" });
        setProjectDialogOpen(true);
        setTimeout(() => { if (dialogRef.current) dialogEnter(dialogRef.current); }, 50);
    };

    const openEdit = (project: Project) => {
        setEditProject(project);
        reset({
            title: project.title,
            description: project.description,
            techStack: project.techStack.join(", "),
            status: project.status,
            priority: project.priority,
            progress: project.progress ?? 0,
            startDate: project.startDate ? project.startDate.substring(0, 10) : "",
            endDate: project.endDate ? project.endDate.substring(0, 10) : "",
        });
        setProjectDialogOpen(true);
        setTimeout(() => { if (dialogRef.current) dialogEnter(dialogRef.current); }, 50);
    };

    const openAssign = (project: Project) => {
        setAssigningProject(project);
        setPendingAssignments([]);
        setAssignUserId("");
        setAssignPermission("view");
        setAssignDialogOpen(true);
        setTimeout(() => { if (dialogRef.current) dialogEnter(dialogRef.current); }, 50);
    };

    // Add to pending list (not yet saved)
    const addToPending = () => {
        if (!assignUserId) return;
        // Don't duplicate
        if (pendingAssignments.some((a) => a.userId === assignUserId)) {
            toast.error("Already added this member to the list");
            return;
        }
        setPendingAssignments((prev) => [...prev, { userId: assignUserId, permission: assignPermission }]);
        setAssignUserId("");
        setAssignPermission("view");
    };

    const removePending = (userId: string) => {
        setPendingAssignments((prev) => prev.filter((a) => a.userId !== userId));
    };

    // Save ALL pending + existing assignments
    const handleAssign = async () => {
        if (!assigningProject) return;
        if (pendingAssignments.length === 0) {
            setAssignDialogOpen(false);
            return;
        }
        setSaving(true);
        try {
            // Sequential assigns
            for (const { userId, permission } of pendingAssignments) {
                await projectsApi.assignMember(assigningProject._id, userId, permission);
            }
            toast.success(`${pendingAssignments.length} member(s) assigned successfully`);
            setAssignDialogOpen(false);
            loadProjects();
        } catch (err: unknown) {
            toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to assign member");
        } finally {
            setSaving(false);
        }
    };

    const onSubmitProject = async (values: ProjectFormData) => {
        setSaving(true);
        try {
            const payload = {
                ...values,
                progress: Number(values.progress) || 0,
                techStack: values.techStack ? values.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
                startDate: values.startDate || undefined,
                endDate: values.endDate || undefined,
            };
            if (editProject) {
                await projectsApi.update(editProject._id, payload);
                toast.success("Project updated");
            } else {
                await projectsApi.create(payload);
                toast.success("Project created");
            }
            setProjectDialogOpen(false);
            loadProjects();
        } catch (err: unknown) {
            const error = err as any;
            if (error.response?.status === 422 && error.response.data.errors) {
                error.response.data.errors.forEach((e: any) => {
                    setError(e.field as any, { message: e.message });
                });
            }
            const msg = error.response?.data?.message || "Failed to save project";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!projectToDelete) return;
        try {
            await projectsApi.delete(projectToDelete._id);
            toast.success("Project deleted");
            setDeleteDialogOpen(false);
            loadProjects();
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const handleRemoveMember = async (projectId: string, userId: string) => {
        try {
            await projectsApi.removeMember(projectId, userId);
            toast.success("Member removed from project");
            // Also reflect in the assign dialog if it's open
            setAssigningProject((prev) => {
                if (!prev || prev._id !== projectId) return prev;
                return { ...prev, teamMembers: prev.teamMembers.filter((m) => m.user._id !== userId) };
            });
            loadProjects();
        } catch {
            toast.error("Failed to remove member");
        }
    };

    const canEdit = (project: Project) => {
        if (isCompany()) return true;
        return project.myPermission === "edit";
    };

    const filtered = projects.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Helper: find member name for pending list
    const getMemberName = (userId: string) => allMembers.find((m) => m._id === userId)?.name ?? userId;

    // Members not yet assigned and not in pending
    const availableMembers = allMembers.filter((m) => {
        const alreadyAssigned = assigningProject?.teamMembers.some((tm) => tm.user._id === m._id);
        const inPending = pendingAssignments.some((a) => a.userId === m._id);
        return !alreadyAssigned && !inPending;
    });

    return (
        <Box ref={pageRef} className="page-container" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Projects</Typography>
                    <Typography sx={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                        {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                    <TextField
                        size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "var(--color-text-muted)" }} /></InputAdornment> }}
                        sx={{ minWidth: 180 }}
                    />
                    <TextField select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
                        {["all", "planning", "active", "on_hold", "completed"].map((s) => (
                            <MenuItem key={s} value={s}>{s === "all" ? "All Status" : s.replace("_", " ")}</MenuItem>
                        ))}
                    </TextField>
                    {isCompany() && (
                        <Button
                            variant="contained" startIcon={<Add />} onClick={openCreate}
                            sx={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff", fontWeight: 600 }}
                        >
                            New Project
                        </Button>
                    )}
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress sx={{ color: "var(--color-primary)" }} /></Box>
            ) : filtered.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <FolderOpen sx={{ fontSize: 60, color: "var(--color-text-muted)", mb: 2 }} />
                    <Typography sx={{ color: "var(--color-text-muted)" }}>No projects found</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filtered.map((project) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project._id}>
                            <Card
                                className="project-card"
                                sx={{
                                    bgcolor: "var(--color-surface)", border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-lg)", height: "100%",
                                    transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s",
                                    "&:hover": { boxShadow: "var(--shadow-md)", transform: "translateY(-3px)", borderColor: "var(--color-primary)" },
                                }}
                            >
                                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {/* Title + Actions */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-primary)", flex: 1, pr: 1 }}>
                                            {project.title}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            {canEdit(project) && (
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => openEdit(project)} sx={{ color: "var(--color-text-muted)", "&:hover": { color: "var(--color-primary)" } }}>
                                                        <Edit sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {isCompany() && (
                                                <>
                                                    <Tooltip title="Assign members">
                                                        <IconButton size="small" onClick={() => openAssign(project)} sx={{ color: "var(--color-text-muted)", "&:hover": { color: "var(--color-success)" } }}>
                                                            <GroupAdd sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete project">
                                                        <IconButton size="small" onClick={() => { setProjectToDelete(project); setDeleteDialogOpen(true); }} sx={{ color: "var(--color-text-muted)", "&:hover": { color: "var(--color-error)" } }}>
                                                            <Delete sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Box>
                                    </Box>

                                    <Typography sx={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}>
                                        {project.description}
                                    </Typography>

                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        <span className={`badge badge-${project.status}`}>{project.status.replace("_", " ")}</span>
                                        <span className={`badge badge-${project.priority}`}>{project.priority}</span>
                                        {project.myPermission && (
                                            <span className={`badge badge-${project.myPermission === "edit" ? "pm" : "member"}`}>
                                                {project.myPermission}
                                            </span>
                                        )}
                                    </Box>

                                    {project.techStack.length > 0 && (
                                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                            {project.techStack.slice(0, 3).map((tech) => (
                                                <Chip key={tech} label={tech} size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "var(--color-primary-light)", color: "var(--color-primary)" }} />
                                            ))}
                                            {project.techStack.length > 3 && <Chip label={`+${project.techStack.length - 3}`} size="small" sx={{ height: 20, fontSize: "10px" }} />}
                                        </Box>
                                    )}

                                    <Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                            <Typography sx={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Progress</Typography>
                                            <Typography sx={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>{project.progress}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate" value={project.progress}
                                            sx={{ height: 4, borderRadius: 2, bgcolor: "var(--color-border)", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))", borderRadius: 2 } }}
                                        />
                                    </Box>

                                    {/* Assigned team members */}
                                    {project.teamMembers.length > 0 && (
                                        <Box>
                                            <Typography sx={{ fontSize: "0.7rem", color: "var(--color-text-muted)", mb: 0.75 }}>Team</Typography>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {project.teamMembers.map((tm) => (
                                                    <Tooltip
                                                        key={tm.user._id}
                                                        title={`${tm.user.name} — ${tm.permission} access${isCompany() ? " (click × to remove)" : ""}`}
                                                    >
                                                        <Chip
                                                            avatar={<Avatar sx={{ bgcolor: tm.permission === "edit" ? "var(--color-success)" : "var(--color-text-muted)", fontSize: "0.65rem" }}>{tm.user.name.charAt(0)}</Avatar>}
                                                            label={`${tm.user.name.split(" ")[0]} · ${tm.permission}`}
                                                            size="small"
                                                            onDelete={isCompany() ? () => handleRemoveMember(project._id, tm.user._id) : undefined}
                                                            deleteIcon={isCompany() ? <PersonRemove sx={{ fontSize: "14px !important" }} /> : undefined}
                                                            sx={{
                                                                height: 24, fontSize: "11px",
                                                                bgcolor: tm.permission === "edit" ? "rgba(16,185,129,0.1)" : "var(--color-primary-light)",
                                                                color: tm.permission === "edit" ? "var(--color-success)" : "var(--color-primary)",
                                                                "& .MuiChip-deleteIcon": { color: "var(--color-error)", "&:hover": { color: "var(--color-error)" } },
                                                            }}
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* ─── Create / Edit Project Dialog ───────────────────────────────── */}
            <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ ref: dialogRef }}>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>{editProject ? "Edit Project" : "New Project"}</Typography>
                    <IconButton size="small" onClick={() => setProjectDialogOpen(false)}><Close fontSize="small" /></IconButton>
                </DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmitProject)}>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <TextField
                            fullWidth label="Title" size="small"
                            {...register("title")} error={!!errors.title} helperText={errors.title?.message}
                        />
                        <TextField
                            fullWidth label="Description" size="small" multiline rows={3}
                            {...register("description")} error={!!errors.description} helperText={errors.description?.message}
                        />
                        <TextField
                            fullWidth label="Tech Stack (comma separated)" size="small"
                            {...register("techStack")} placeholder="React, Node.js, MongoDB"
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {/* Use Controller for Select fields so react-hook-form manages value correctly */}
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField fullWidth select label="Status" size="small" {...field}>
                                        {["planning", "active", "on_hold", "completed"].map((s) => (
                                            <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <TextField fullWidth select label="Priority" size="small" {...field}>
                                        {["low", "medium", "high", "critical"].map((p) => (
                                            <MenuItem key={p} value={p}>{p}</MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>
                        {/* Progress: use Controller to correctly handle number value */}
                        <Controller
                            name="progress"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth label="Progress (%)" size="small" type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                    value={field.value ?? 0}
                                    inputProps={{ min: 0, max: 100 }}
                                    error={!!errors.progress}
                                    helperText={errors.progress?.message}
                                />
                            )}
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                fullWidth label="Start Date" size="small" type="date"
                                {...register("startDate")} InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth label="End Date" size="small" type="date"
                                {...register("endDate")} InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button onClick={() => setProjectDialogOpen(false)} sx={{ color: "var(--color-text-secondary)" }}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={saving} sx={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff" }}>
                            {saving ? <CircularProgress size={18} color="inherit" /> : editProject ? "Save Changes" : "Create Project"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* ─── Assign Member Dialog (multi-add) ───────────────────────────── */}
            <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ ref: dialogRef }}>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                    <Box>
                        <Typography sx={{ fontWeight: 700 }}>Assign Team Members</Typography>
                        <Typography sx={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                            {assigningProject?.title}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setAssignDialogOpen(false)}><Close fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>

                    {/* Currently assigned */}
                    {assigningProject && assigningProject.teamMembers.length > 0 && (
                        <Box>
                            <Typography sx={{ fontSize: "0.75rem", color: "var(--color-text-muted)", mb: 0.75, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Already Assigned
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {assigningProject.teamMembers.map((tm) => (
                                    <Chip
                                        key={tm.user._id}
                                        label={`${tm.user.name} · ${tm.permission}`}
                                        size="small"
                                        onDelete={() => handleRemoveMember(assigningProject._id, tm.user._id)}
                                        deleteIcon={<PersonRemove sx={{ fontSize: "14px !important" }} />}
                                        sx={{
                                            bgcolor: tm.permission === "edit" ? "rgba(16,185,129,0.1)" : "var(--color-primary-light)",
                                            color: tm.permission === "edit" ? "var(--color-success)" : "var(--color-primary)",
                                            "& .MuiChip-deleteIcon": { color: "var(--color-error)" },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ borderColor: "var(--color-border)" }} />

                    {/* Add new members */}
                    <Typography sx={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Add Members
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", flexWrap: "wrap" }}>
                        <FormControl size="small" sx={{ flex: 2, minWidth: 160 }}>
                            <InputLabel>Team Member</InputLabel>
                            <Select value={assignUserId} label="Team Member" onChange={(e) => setAssignUserId(e.target.value)}>
                                {availableMembers.length === 0 ? (
                                    <MenuItem disabled>All members assigned or no members yet</MenuItem>
                                ) : (
                                    availableMembers.map((m) => (
                                        <MenuItem key={m._id} value={m._id}>
                                            {m.name} — {m.email}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ flex: 1, minWidth: 110 }}>
                            <InputLabel>Permission</InputLabel>
                            <Select value={assignPermission} label="Permission" onChange={(e) => setAssignPermission(e.target.value as "edit" | "view")}>
                                <MenuItem value="view">View only</MenuItem>
                                <MenuItem value="edit">Edit access</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined" startIcon={<Add />} onClick={addToPending}
                            disabled={!assignUserId}
                            sx={{ height: 40, borderColor: "var(--color-primary)", color: "var(--color-primary)", whiteSpace: "nowrap" }}
                        >
                            Add
                        </Button>
                    </Box>

                    {/* Pending (to be saved) */}
                    {pendingAssignments.length > 0 && (
                        <Box>
                            <Typography sx={{ fontSize: "0.75rem", color: "var(--color-text-muted)", mb: 0.75, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Pending ({pendingAssignments.length})
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {pendingAssignments.map(({ userId, permission }) => (
                                    <Chip
                                        key={userId}
                                        label={`${getMemberName(userId)} · ${permission}`}
                                        size="small"
                                        onDelete={() => removePending(userId)}
                                        sx={{
                                            bgcolor: "rgba(245,158,11,0.1)", color: "var(--color-warning, #f59e0b)",
                                            "& .MuiChip-deleteIcon": { color: "var(--color-error)" },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setAssignDialogOpen(false)} sx={{ color: "var(--color-text-secondary)" }}>Cancel</Button>
                    <Button
                        variant="contained" startIcon={<Check />} onClick={handleAssign}
                        disabled={saving || pendingAssignments.length === 0}
                        sx={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff" }}
                    >
                        {saving ? <CircularProgress size={18} color="inherit" /> : `Assign ${pendingAssignments.length || ""}`}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete Project?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: "var(--color-text-secondary)" }}>
                        Delete <strong>{projectToDelete?.title}</strong>? All team member assignments will be removed too.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "var(--color-text-secondary)" }}>Cancel</Button>
                    <Button variant="contained" onClick={handleDelete} sx={{ bgcolor: "var(--color-error)", color: "#fff", "&:hover": { bgcolor: "var(--color-error)" } }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Projects;
