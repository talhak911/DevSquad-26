import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { adminApi, productsApi } from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/forms/ProductForm";

interface Category { _id: string; name: string; slug: string }

const AdminProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await adminApi.getCategories();
      setCategories(catRes.data.data);

      if (isEdit) {
        const res = await productsApi.getOne(id!);
        setProductData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.updateProduct(id!, formData);
        toast.success("Product updated successfully!");
        // Re-fetch to update the form with latest data (especially image URLs)
        await fetchData();
      } else {
        await adminApi.createProduct(formData);
        toast.success("Product created successfully!");
        navigate("/admin/products");
      }
    } catch (e: any) {
      // Re-throw to let ProductForm handle the error message display
      throw e;
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate("/admin/products")}><ArrowBack /></IconButton>
        <Typography variant="h4" sx={{ fontFamily: '"Prosto One", sans-serif' }}>
          {isEdit ? "Edit Product" : "New Product"}
        </Typography>
      </Box>

      <ProductForm 
        initialData={productData}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/products")}
        isLoading={saving}
      />
    </AdminLayout>
  );
};

export default AdminProductForm;
