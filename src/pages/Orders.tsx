import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Order } from "../types";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  TextField,
  SelectChangeEvent
} from "@mui/material";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [areaFilter, setAreaFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Apply filters to the orders list
  const filteredOrders = orders.filter((order) => {
    const byStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
    const byArea = areaFilter.length === 0 || areaFilter.includes(order.area);
    const byDate =
      !dateFilter || new Date(order.createdAt).toISOString().slice(0, 10) === dateFilter;
    return byStatus && byArea && byDate;
  });

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        📦 Orders
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        {/* Status Filter */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={statusFilter}
            onChange={(e: SelectChangeEvent<string[]>) =>
              setStatusFilter(e.target.value as string[])
            }
            renderValue={(selected) => (selected as string[]).join(", ")}
            label="Status"
          >
            {['pending', 'assigned', 'picked', 'delivered'].map((status) => (
              <MenuItem key={status} value={status}>
                <Checkbox checked={statusFilter.includes(status)} />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Area Filter */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Area</InputLabel>
          <Select
            multiple
            value={areaFilter}
            onChange={(e: SelectChangeEvent<string[]>) =>
              setAreaFilter(e.target.value as string[])
            }
            renderValue={(selected) => (selected as string[]).join(", ")}
            label="Area"
          >
            {Array.from(new Set(orders.map((o) => o.area))).map((area) => (
              <MenuItem key={area} value={area}>
                <Checkbox checked={areaFilter.includes(area)} />
                <ListItemText primary={area} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Filter */}
        <TextField
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{order.area}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.scheduledFor}</TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e: SelectChangeEvent<string>) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="assigned">Assigned</MenuItem>
                    <MenuItem value="picked">Picked</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
