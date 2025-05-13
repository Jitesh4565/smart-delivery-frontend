import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Assignment, AssignmentMetrics, DeliveryPartner, Order } from "../types";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material";

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderRes, partnerRes, metricsRes] = await Promise.all([
        axios.get("/orders"),
        axios.get("/partners"),
        axios.get("/assignments/metrics")
      ]);
      setOrders(orderRes.data);
      setPartners(partnerRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error("Error loading dashboard!!", error);
    }
  };

  const handleRunAssignment = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/assignments/run");
      setAssignments(res.data.results);
      fetchData();
    } catch (error) {
      console.error("Failed to run assignment", error);
    } finally {
      setLoading(false);
    }
  };

  const available = partners.filter(p => p.status === 'active' && p.currentLoad < 3).length;
  const busy = partners.filter(p => p.status === 'active' && p.currentLoad >= 3).length;
  const offline = partners.filter(p => p.status === 'inactive').length;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>

      {/* Run Assignment Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={handleRunAssignment} disabled={loading}>
          {loading ? "Running..." : "Run Assignment"}
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{orders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Partners</Typography>
              <Typography variant="h4">{partners.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Assigned</Typography>
              <Typography variant="h4">{metrics?.totalAssigned || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Success Rate</Typography>
              <Typography variant="h4">
                {metrics?.successRate?.toFixed(2) || "0"}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Partner Availability */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🟢 Partner Availability
            </Typography>
            <Typography>🟢 Available: {available}</Typography>
            <Typography>🟡 Busy: {busy}</Typography>
            <Typography>🔴 Offline: {offline}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Assignments */}
      {assignments.length > 0 && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🕒 Recent Assignments
              </Typography>
              <ul>
                {assignments.slice(-5).reverse().map((a, index) => (
                  <li key={index}>
                    Order ID: {a.orderId} — <strong>{a.status.toUpperCase()}</strong>
                    {a.status === "failed" && ` (Reason: ${a.reason})`}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
