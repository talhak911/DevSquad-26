import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Chip, CircularProgress, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

interface User { _id: string; name: string; email: string; role: string; isBlocked: boolean; createdAt: string }

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const fetch = () => {
    setLoading(true);
    adminApi.getUsers({ page, limit: 20, q: q || undefined }).then(r => { setUsers(r.data.data); setMeta(r.data.meta); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, q]);

  const toggleBlock = async (id: string, blocked: boolean) => {
    await adminApi.blockUser(id, !blocked);
    fetch();
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Prosto One", sans-serif', fontWeight: 400 }}>Customers</Typography>
      </Box>
      <TextField placeholder="Search..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} size="small"
        sx={{ mb: 3, width: { xs: "100%", sm: 350 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />

      {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box> : (
        <>
          <Box sx={{ overflowX: "auto", border: "1px solid var(--color-outline)" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead" sx={{ bgcolor: "var(--color-bg-variant)" }}>
                <Box component="tr">
                  {["Name", "Email", "Status", "Joined", "Actions"].map(h => (
                    <Box key={h} component="th" sx={{ p: 2, textAlign: "left", fontFamily: "Montserrat", fontSize: "12px", fontWeight: 600, color: "text.secondary", borderBottom: "1px solid var(--color-outline)" }}>{h}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {users.length === 0 && <Box component="tr"><Box component="td" colSpan={5} sx={{ p: 4, textAlign: "center", fontFamily: "Montserrat", color: "text.secondary" }}>No customers.</Box></Box>}
                {users.map(u => (
                  <Box component="tr" key={u._id} sx={{ "&:hover": { bgcolor: "var(--color-bg-variant)" }, borderBottom: "1px solid var(--color-outline)" }}>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "13px", fontWeight: 500 }}>{u.name}</Box>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "13px", color: "text.secondary" }}>{u.email}</Box>
                    <Box component="td" sx={{ p: 2 }}>
                      <Chip label={u.isBlocked ? "Blocked" : "Active"} size="small" color={u.isBlocked ? "error" : "success"} variant="outlined" sx={{ fontFamily: "Montserrat", fontSize: "11px" }} />
                    </Box>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "12px", color: "text.secondary" }}>{new Date(u.createdAt).toLocaleDateString()}</Box>
                    <Box component="td" sx={{ p: 2 }}>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" component={Link} to={`/admin/orders?userId=${u._id}`} variant="outlined" sx={{ fontFamily: "Montserrat", fontSize: "12px", borderRadius: 0 }}>Orders</Button>
                        <Button size="small" color={u.isBlocked ? "success" : "error"} variant="outlined" onClick={() => toggleBlock(u._id, u.isBlocked)} sx={{ fontFamily: "Montserrat", fontSize: "12px", borderRadius: 0 }}>
                          {u.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontFamily: "Montserrat", fontSize: "14px", color: "text.secondary" }}>{meta.total} customers</Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" disabled={page <= 1} onClick={() => setPage(p => p - 1)} variant="outlined" sx={{ borderRadius: 0 }}>Prev</Button>
              <Button size="small" disabled variant="outlined" sx={{ borderRadius: 0 }}>{page} / {meta.totalPages}</Button>
              <Button size="small" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} variant="outlined" sx={{ borderRadius: 0 }}>Next</Button>
            </Stack>
          </Box>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
