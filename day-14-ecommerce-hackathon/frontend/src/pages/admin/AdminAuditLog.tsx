import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button, Stack, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { adminApi } from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

interface AuditEntry { _id: string; action: string; entity: string; note: string; createdAt: string; adminId: { name: string; email: string } | null; before: unknown; after: unknown }

const ENTITIES = ["", "Product", "Order", "User"];

const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entity, setEntity] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    setLoading(true);
    adminApi.getAuditLog({ page, limit: 20, entity: entity || undefined }).then(r => { setLogs(r.data.data); setMeta(r.data.meta); setLoading(false); }).catch(() => setLoading(false));
  }, [page, entity]);

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Prosto One", sans-serif', fontWeight: 400 }}>Audit Log</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Entity</InputLabel>
          <Select value={entity} label="Entity" onChange={e => { setEntity(e.target.value); setPage(1); }}>
            {ENTITIES.map(e => <MenuItem key={e} value={e}>{e || "All"}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box> : (
        <>
          <Box sx={{ overflowX: "auto", border: "1px solid var(--color-outline)" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead" sx={{ bgcolor: "var(--color-bg-variant)" }}>
                <Box component="tr">
                  {["Time", "Admin", "Action", "Entity", "Note"].map(h => (
                    <Box key={h} component="th" sx={{ p: 2, textAlign: "left", fontFamily: "Montserrat", fontSize: "12px", fontWeight: 600, color: "text.secondary", borderBottom: "1px solid var(--color-outline)" }}>{h}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {logs.length === 0 && <Box component="tr"><Box component="td" colSpan={5} sx={{ p: 4, textAlign: "center", fontFamily: "Montserrat", color: "text.secondary" }}>No audit entries.</Box></Box>}
                {logs.map(log => (
                  <Box component="tr" key={log._id} sx={{ "&:hover": { bgcolor: "var(--color-bg-variant)" }, borderBottom: "1px solid var(--color-outline)" }}>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "12px", color: "text.secondary", whiteSpace: "nowrap" }}>{new Date(log.createdAt).toLocaleString()}</Box>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "13px" }}>{log.adminId?.name || "—"}</Box>
                    <Box component="td" sx={{ p: 2 }}>
                      <Chip label={log.action} size="small" variant="outlined" sx={{ fontFamily: "Montserrat", fontSize: "11px" }} />
                    </Box>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "13px", color: "text.secondary" }}>{log.entity}</Box>
                    <Box component="td" sx={{ p: 2, fontFamily: "Montserrat", fontSize: "13px", maxWidth: 300 }}>{log.note || "—"}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontFamily: "Montserrat", fontSize: "14px", color: "text.secondary" }}>{meta.total} entries</Typography>
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

export default AdminAuditLog;
