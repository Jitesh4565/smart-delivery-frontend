import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Assignment, AssignmentMetrics } from "../types";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get("/assignments/metrics");
      setMetrics(res.data);
    } catch (error) {
      console.error("Error fetching assignment metrics", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRunAssignment = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/assignments/run");
      setAssignments(res.data.results); // set latest results
      await fetchMetrics();
    } catch (error) {
      console.error("Failed to run assignment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">📝 Assignments</Typography>
        <Button variant="contained" onClick={handleRunAssignment} disabled={loading}>
          {loading ? "Running..." : "Run Assignment"}
        </Button>
      </Box>

      {metrics && (
        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Assigned</Typography>
                <Typography variant="h4">{metrics.totalAssigned}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Success Rate</Typography>
                <Typography variant="h4">{metrics.successRate.toFixed(2)}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Time</Typography>
                <Typography variant="h4">{metrics.averageTime}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {metrics.failureReasons.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Failure Reasons</Typography>
                  <ul>
                    {metrics.failureReasons.map((fr, idx) => (
                      <li key={idx}>
                        {fr.reason}: {fr.count}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {assignments.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((a) => (
                <TableRow key={`${a.orderId}-${a.timestamp}`}> 
                  <TableCell>{a.orderId}</TableCell>
                  <TableCell>{a.partnerId}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell>{a.reason || "-"}</TableCell>
                  <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Assignments;
