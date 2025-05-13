import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { DeliveryPartner } from "../types";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent
} from "@mui/material";

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  const [formData, setFormData] = useState<Partial<DeliveryPartner>>({
    name: "",
    email: "",
    phone: "",
    status: "active",
    currentLoad: 0,
    areas: [],
    shift: { start: "", end: "" },
    metrics: { rating: 0, completedOrders: 0, cancelledOrders: 0 }
  });

  const fetchPartners = async () => {
    try {
      const res = await axios.get("/partners");
      setPartners(res.data);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shift: { ...prev.shift!, [name]: value }
    }));
  };

  const handleAreaChange = (e: any) => {
    setFormData((prev) => ({ ...prev, areas: e.target.value }));
  };

  const handleEdit = (partner: DeliveryPartner) => {
    setSelectedPartner(partner);
    setFormData(partner);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPartner(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "active",
      currentLoad: 0,
      areas: [],
      shift: { start: "", end: "" },
      metrics: { rating: 0, completedOrders: 0, cancelledOrders: 0 }
    });
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (selectedPartner) {
        await axios.put(`/partners/${selectedPartner._id}`, formData);
      } else {
        await axios.post("/partners", formData);
      }
      fetchPartners();
      handleClose();
    } catch (err) {
      console.error("Failed to save partner", err);
    }
  };

  const deletePartner = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;

    try {
      await axios.delete(`/partners/${id}`);
      fetchPartners();
    } catch (err) {
      console.error("Failed to delete partner", err);
    }
  };

  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">👤 Delivery Partners</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Partner
        </Button>
      </Box>

      <Grid container spacing={2}>
        {partners.map((partner) => (
          <Grid item xs={12} sm={6} md={4} key={partner._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{partner.name}</Typography>
                <Typography>Email: {partner.email}</Typography>
                <Typography>Phone: {partner.phone}</Typography>
                <Typography>Status: {partner.status}</Typography>
                <Typography>Load: {partner.currentLoad}/3</Typography>
                <Typography>Areas: {partner.areas.join(", ")}</Typography>
                <Typography>
                  Shift: {partner.shift.start} - {partner.shift.end}
                </Typography>
                <Typography>Rating: {partner.metrics.rating}</Typography>
                <Box display="flex" gap={1} mt={2}>
                  <Button variant="outlined" onClick={() => handleEdit(partner)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deletePartner(partner._id!)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{selectedPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleStatusChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Current Load"
            name="currentLoad"
            type="number"
            fullWidth
            value={formData.currentLoad}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Areas</InputLabel>
            <Select
              multiple
              value={formData.areas || []}
              onChange={handleAreaChange}
              input={<OutlinedInput label="Areas" />}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {["Andheri", "Bandra", "Dadar", "Powai", "Goregaon", "Borivali", "Colaba", "Kurla"].map(
                (area) => (
                  <MenuItem key={area} value={area}>
                    <Checkbox checked={formData.areas?.includes(area)} />
                    <ListItemText primary={area} />
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Shift Start"
              name="start"
              type="time"
              fullWidth
              value={formData.shift?.start || ""}
              onChange={handleShiftChange}
            />
            <TextField
              margin="dense"
              label="Shift End"
              name="end"
              type="time"
              fullWidth
              value={formData.shift?.end || ""}
              onChange={handleShiftChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Partners;
