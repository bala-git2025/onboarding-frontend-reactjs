import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const ManagerDashboard: React.FC = () => {
  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <Card sx={{ flex: "1 1 320px" }}>
          <CardContent>
            <Typography variant="h6">Team Overview</Typography>
            <Typography variant="body2" color="text.secondary">
              Metrics and status across your team.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 320px" }}>
          <CardContent>
            <Typography variant="h6">Reports</Typography>
            <Typography variant="body2" color="text.secondary">
              Latest reports and insights.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;