// ManagerDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { ErrorOutline } from "@mui/icons-material";

// ✅ Import types + service
import { TeamSummary, getManagerTeamsSummary } from"../../services/managerService";

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // If your API requires managerId, pass it here (e.g., from auth/user context)
        // const data = await getManagerTeamsSummary(managerId);
        const data = await getManagerTeamsSummary(); // current endpoint: /manager/id
        if (mounted) setTeams(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Team Overview
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={2}
      >
        {teams.map((team) => (
          <Card key={team.teamId}>
            <CardContent>
              {/* TEAM HEADER */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.teamId}`}
                  sx={{ width: 56, height: 56 }}
                />
                <Typography variant="h6">{team.teamName}</Typography>
              </Box>

              {/* ROW 1 */}
              <Box display="flex" gap={2} mb={2}>
                <Box
                  onClick={() =>
                    navigate(
                      `/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`
                    )
                  }
                  sx={statusBox("rgb(218, 240, 161)")}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupOutlinedIcon color="primary" />
                    <Typography variant="body2">Members</Typography>
                  </Box>
                  <Typography variant="h6">{team.members}</Typography>
                </Box>

                <Box
                  onClick={() =>
                    navigate(
                      `/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`
                    )
                  }
                  sx={statusBox("rgb(220, 231, 190)")}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleOutlineOutlinedIcon sx={{ color: "#2E7D32" }} />
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <Typography variant="h6">{team.completed}</Typography>
                </Box>
              </Box>

              {/* ROW 2 */}
              <Box display="flex" gap={2} mb={2}>
                <Box
                  onClick={() =>
                    navigate(
                      `/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`
                    )
                  }
                  sx={statusBox("#daebae")}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeOutlinedIcon sx={{ color: "#F9A825" }} />
                    <Typography variant="body2">Pending</Typography>
                  </Box>
                  <Typography variant="h6">{team.pending}</Typography>
                </Box>

                <Box
                  onClick={() =>
                    navigate(
                      `/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`
                    )
                  }
                  sx={statusBox("#f8d7da")}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <ErrorOutline sx={{ color: "#C62828" }} />
                    <Typography variant="body2">Overdue</Typography>
                  </Box>
                  <Typography variant="h6">{team.Overdue}</Typography>
                </Box>
              </Box>

              {/* VIEW BUTTON */}
              <Button
                variant="contained"
                component={Link}
                to={`/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`}
                fullWidth
                sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
              >
                View Team Members
              </Button>
            </CardContent>
          </Card>
        ))}

      </Box>
    </Box>
  );
};

/* ================= STYLES ================= */

const statusBox = (bgColor: string) => ({
  flex: 1,
  aspectRatio: "1 / 1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 0.5,
  borderRadius: 1,
  backgroundColor: bgColor,
  cursor: "pointer",
  textAlign: "center",
  transition: "0.2s",
  "&:hover": {
    boxShadow: 3,
    transform: "translateY(-2px)",
  },
});

export default ManagerDashboard;
