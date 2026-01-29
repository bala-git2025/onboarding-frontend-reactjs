import React, { useEffect, useState } from "react";
import axios from "axios";
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

// 🔹 ICONS
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { ErrorOutline } from "@mui/icons-material";

/* ================= TYPES ================= */

interface TeamMember {
  teamId: number;
  teamName: string;
  status: string;
}

interface TeamSummary {
  teamId: number;
  teamName: string;
  members: number;
  completed: number;
  pending: number;
  Overdue: number;
}

/* ================= COMPONENT ================= */

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/manager/id")
      .then((res) => {
        const teamList: TeamMember[] = res.data.teamList || [];
        const grouped: Record<number, TeamSummary> = {};

        teamList.forEach((item) => {
          if (!grouped[item.teamId]) {
            grouped[item.teamId] = {
              teamId: item.teamId,
              teamName: item.teamName,
              members: 0,
              completed: 0,
              pending: 0,
              Overdue: 0,
            };
          }

          grouped[item.teamId].members += 1;

          if (item.status === "Completed") {
            grouped[item.teamId].completed += 1;
          } else if (item.status === "Pending") {
            grouped[item.teamId].pending += 1;
          } else if (item.status === "Overdue") {
            grouped[item.teamId].Overdue += 1;
          }
        });

        setTeams(Object.values(grouped));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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

              {/* ROW 1: MEMBERS + COMPLETED */}
              <Box display="flex" gap={2} mb={2}>
                <Box
                  onClick={() => navigate(`/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`)}
                  sx={statusBox("rgb(218, 240, 161)")}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    sx={{ maxWidth: "100%" }}
                  >
                    <GroupOutlinedIcon color="primary" />
                    <Typography variant="body2">Members</Typography>
                  </Box>
                  <Typography variant="h6">{team.members}</Typography>
                </Box>

                <Box
                  onClick={() =>
                    navigate(`/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`)
                  }
                  sx={statusBox("rgb(220, 231, 190)")}
                > <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  sx={{ maxWidth: "100%" }}
                >
                    <CheckCircleOutlineOutlinedIcon sx={{ color: "#2E7D32" }} />
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <Typography variant="h6">{team.completed}</Typography>
                </Box>
              </Box>

              {/* ROW 2: PENDING*/}
              <Box display="flex" gap={2} mb={2}>
                <Box
                  onClick={() =>
                    navigate(`/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`)
                  }
                  sx={statusBox("#daebae")}
                ><Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  sx={{ maxWidth: "100%" }}
                >
                    <AccessTimeOutlinedIcon sx={{ color: "#F9A825" }} />
                    <Typography variant="body2">Pending</Typography>
                  </Box>
                  <Typography variant="h6">{team.pending}</Typography>
                </Box>
                <Box
                 onClick={(e) => {
                      e.stopPropagation();
                    navigate(`/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`)
                  } }
                  sx={statusBox("#f8d7da")}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    sx={{ maxWidth: "100%" }}
                  >
                    <ErrorOutline sx={{ color: "#C62828" }} />
                    <Typography variant="body2">Overdue</Typography>
                  </Box>
                  <Typography variant="h6">{team.Overdue}</Typography>
                </Box>
              </Box>
              {/* FULL WIDTH VIEW BUTTON */}
              <Box mt={1}>
                <Button
                  variant="contained"
                  component={Link}
                  to={`/Team-DashBoard/id/${team.teamId}/teamName/${team.teamName}`}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 600,
                  }}
                >
                  View Team Members
                </Button>
              </Box>


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
