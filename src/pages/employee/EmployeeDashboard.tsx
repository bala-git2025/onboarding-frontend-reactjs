import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const EmployeeDashboard: React.FC = () => {
  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <Card sx={{ flex: "1 1 320px" }}>
          <CardContent>
            <Typography variant="h6">Tasks</Typography>
            <Typography variant="body2" color="text.secondary">
              Your latest tasks will appear here.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 320px" }}>
          <CardContent>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              Recent updates and notifications.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;