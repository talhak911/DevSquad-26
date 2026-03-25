import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, CircularProgress, Tooltip, Avatar, Chip,
    InputAdornment, Switch, FormControlLabel,
} from "@mui/material";
import { Add, Edit, Delete, Search, Close, People } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { membersApi } from "../services/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pageEnter, staggerFadeUp, dialogEnter, successNotification, rowLeave } from "../utils/gsapUtils";

gsap.registerPlugin(useGSAP);

interface Member {
    _id: string;
    name: string;
    email: string;
    department: string;
    isActive: boolean;
    createdAt: string;
}

const createSchema = yup.object({
    name: yup.string().min(2).max(50).required("Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).required("Password is required (min 6 chars)"),
    department: yup.string().optional(),
});

const editSchema = yup.object({
    name: yup.string().min(2).max(50).required("Name is required"),
    department: yup.string().optional(),
    isActive: yup.boolean().optional(),
});

type CreateFormData = yup.InferType<typeof createSchema>;
type EditFormData = yup.InferType<typeof editSchema>;

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [saving, setSaving] = useState(false);
    const [addedMemberName, setAddedMemberName] = useState("");

    const pageRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const tableBodyRef = useRef<HTMLTableSectionElement>(null);
    const noticeRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createForm = useForm<CreateFormData>({ resolver: yupResolver(createSchema) as any });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editForm = useForm<EditFormData>({ resolver: yupResolver(editSchema) as any, defaultValues: { isActive: true } });

    const loadMembers = useCallback(async () => {
        try {
            const res = await membersApi.getAll();
            setMembers(res.data.data.users);
        } catch {
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    }, []);

    const hasAnimatedInitial = useRef(false);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    // 1. Page Entrance Animation
    useGSAP(() => {
        if (pageRef.current) pageEnter(pageRef.current);
    }, { scope: pageRef });

    // 2. Initial List Animation
    useGSAP(() => {
        if (!loading && tableBodyRef.current && !hasAnimatedInitial.current) {
            const rows = tableBodyRef.current.querySelectorAll("tr");
            if (rows.length) {
                staggerFadeUp(rows, 0.05, 0.1);
                hasAnimatedInitial.current = true;
            }
        }
    }, { dependencies: [loading], scope: pageRef });

    const openCreate = () => {
        setEditMember(null);
        createForm.reset({ department: "" });
        setDialogOpen(true);
        setTimeout(() => { if (dialogRef.current) dialogEnter(dialogRef.current); }, 50);
    };

    const openEdit = (member: Member) => {
        setEditMember(member);
        editForm.reset({ name: member.name, department: member.department, isActive: member.isActive });
        setDialogOpen(true);
        setTimeout(() => { if (dialogRef.current) dialogEnter(dialogRef.current); }, 50);
    };

    const onSubmitCreate = async (values: CreateFormData) => {
        setSaving(true);
        try {
            await membersApi.create(values);
            setAddedMemberName(values.name);
            setDialogOpen(false);
            if (noticeRef.current) successNotification(noticeRef.current);
            loadMembers();
        } catch (err: unknown) {
            const error = err as any;
            if (error.response?.status === 422 && error.response.data.errors) {
                error.response.data.errors.forEach((e: any) => {
                    createForm.setError(e.field as any, { message: e.message });
                });
            }
            const msg = error.response?.data?.message || "Failed to create member";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const onSubmitEdit = async (values: EditFormData) => {
        if (!editMember) return;
        setSaving(true);
        try {
            await membersApi.update(editMember._id, values);
            toast.success("Member updated");
            setDialogOpen(false);
            loadMembers();
        } catch (err: unknown) {
            const error = err as any;
            if (error.response?.status === 422 && error.response.data.errors) {
                error.response.data.errors.forEach((e: any) => {
                    editForm.setError(e.field as any, { message: e.message });
                });
            }
            const msg = error.response?.data?.message || "Failed to update member";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!memberToDelete) return;
        try {
            // Find row and animate
            const rows = tableBodyRef.current?.querySelectorAll("tr");
            const rowIdx = members.findIndex(m => m._id === memberToDelete._id);
            if (rows && rowIdx !== -1) {
                rowLeave(rows[rowIdx], async () => {
                    await membersApi.delete(memberToDelete._id);
                    toast.success("Team member removed");
                    setDeleteDialogOpen(false);
                    loadMembers();
                });
            } else {
                await membersApi.delete(memberToDelete._id);
                toast.success("Team member removed");
                setDeleteDialogOpen(false);
                loadMembers();
            }
        } catch {
            toast.error("Failed to delete member");
        }
    };

    const filtered = members.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box ref={pageRef} className="page-container" sx={{ py: 4, position: "relative" }}>
            {/* GSAP Notification */}
            <Box
                ref={noticeRef}
                sx={{
                    position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
                    zIndex: 9999, pointerEvents: "none", opacity: 0,
                }}
            >
                <Paper
                    sx={{
                        px: 3, py: 1.5, borderRadius: "50px", bgcolor: "var(--color-surface)",
                        border: "1px solid var(--color-success)", boxShadow: "var(--shadow-lg)",
                        display: "flex", alignItems: "center", gap: 1.5
                    }}
                >
                    <Avatar sx={{ width: 24, height: 24, bgcolor: "var(--color-success)", fontSize: "0.7rem", color: "#fff" }}>✓</Avatar>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                        {addedMemberName} added successfully!
                    </Typography>
                </Paper>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Team Members</Typography>
                    <Typography sx={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                        {filtered.length} member{filtered.length !== 1 ? "s" : ""}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <TextField
                        size="small" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "var(--color-text-muted)" }} /></InputAdornment> }}
                        sx={{ minWidth: 200 }}
                    />
                    <Button
                        variant="contained" startIcon={<Add />} onClick={openCreate}
                        sx={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff", fontWeight: 600 }}
                    >
                        Add Member
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress sx={{ color: "var(--color-primary)" }} /></Box>
            ) : filtered.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <People sx={{ fontSize: 60, color: "var(--color-text-muted)", mb: 2 }} />
                    <Typography sx={{ color: "var(--color-text-muted)" }}>
                        {members.length === 0 ? "No team members yet. Add your first member to get started." : "No members match your search."}
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ bgcolor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", boxShadow: "none" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ "& th": { bgcolor: "var(--color-bg-secondary)", fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text-secondary)", py: 1.5 } }}>
                                <TableCell>Member</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Added</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody ref={tableBodyRef}>
                            {filtered.map((member) => (
                                <TableRow
                                    key={member._id}
                                    sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "var(--color-bg-secondary)" }, transition: "background 0.15s ease" }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", fontWeight: 700, background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}>
                                                {member.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-primary)" }}>{member.name}</Typography>
                                                <Typography sx={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{member.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>{member.department || "—"}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={member.isActive ? "Active" : "Inactive"} size="small"
                                            sx={{
                                                height: 22, fontSize: "11px", fontWeight: 600,
                                                bgcolor: member.isActive ? "rgba(16,185,129,0.12)" : "rgba(148,163,184,0.12)",
                                                color: member.isActive ? "var(--color-success)" : "var(--color-text-muted)",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{new Date(member.createdAt).toLocaleDateString()}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => openEdit(member)} sx={{ color: "var(--color-text-muted)", "&:hover": { color: "var(--color-primary)" } }}>
                                                    <Edit sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => { setMemberToDelete(member); setDeleteDialogOpen(true); }} sx={{ color: "var(--color-text-muted)", "&:hover": { color: "var(--color-error)" } }}>
                                                    <Delete sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Create Dialog */}
            {!editMember && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ ref: dialogRef }}>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                        <Typography sx={{ fontWeight: 700 }}>Add Team Member</Typography>
                        <IconButton size="small" onClick={() => setDialogOpen(false)}><Close fontSize="small" /></IconButton>
                    </DialogTitle>
                    <Box component="form" onSubmit={createForm.handleSubmit(onSubmitCreate)}>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                            <TextField fullWidth label="Full Name" size="small" {...createForm.register("name")} error={!!createForm.formState.errors.name} helperText={createForm.formState.errors.name?.message} />
                            <TextField fullWidth label="Email Address" size="small" type="email" {...createForm.register("email")} error={!!createForm.formState.errors.email} helperText={createForm.formState.errors.email?.message} />
                            <TextField fullWidth label="Password" size="small" type="password" {...createForm.register("password")} error={!!createForm.formState.errors.password} helperText={createForm.formState.errors.password?.message} />
                            <TextField fullWidth label="Department (optional)" size="small" {...createForm.register("department")} />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2.5 }}>
                            <Button onClick={() => setDialogOpen(false)} sx={{ color: "var(--color-text-secondary)" }}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={saving} sx={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff" }}>
                                {saving ? <CircularProgress size={18} sx={{ color: "var(--color-text-on-primary)" }} /> : "Add Member"}
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            )}

            {/* Edit Dialog */}
            {editMember && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ ref: dialogRef }}>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                        <Typography sx={{ fontWeight: 700 }}>Edit Member</Typography>
                        <IconButton size="small" onClick={() => setDialogOpen(false)}><Close fontSize="small" /></IconButton>
                    </DialogTitle>
                    <Box component="form" onSubmit={editForm.handleSubmit(onSubmitEdit)}>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                            <TextField fullWidth label="Full Name" size="small" {...editForm.register("name")} error={!!editForm.formState.errors.name} helperText={editForm.formState.errors.name?.message} />
                            <TextField fullWidth label="Department" size="small" {...editForm.register("department")} />
                            <FormControlLabel
                                control={<Switch {...editForm.register("isActive")} defaultChecked={editMember.isActive} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-success)" } }} />}
                                label={<Typography sx={{ fontSize: "0.875rem" }}>Active Account</Typography>}
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2.5 }}>
                            <Button onClick={() => setDialogOpen(false)} sx={{ color: "var(--color-text-secondary)" }}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={saving} sx={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff" }}>
                                {saving ? <CircularProgress size={18} sx={{ color: "var(--color-text-on-primary)" }} /> : "Save Changes"}
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            )}

            {/* Delete Confirm */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Remove Team Member?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: "var(--color-text-secondary)" }}>
                        Remove <strong>{memberToDelete?.name}</strong>? They will be unassigned from all projects too.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "var(--color-text-secondary)" }}>Cancel</Button>
                    <Button variant="contained" onClick={handleDelete} sx={{ bgcolor: "var(--color-error)", color: "#fff", "&:hover": { bgcolor: "var(--color-error)" } }}>Remove</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Members;
