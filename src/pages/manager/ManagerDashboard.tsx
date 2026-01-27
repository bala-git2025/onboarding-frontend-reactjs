import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
 
// 🔹 ICONS (Images before fields)
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
 
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
              teamName:item.teamName,
              members: 0,
              completed: 0,
              pending: 0,
            };
          }
 
          grouped[item.teamId].members += 1;
 
          if (item.status === "Completed") {
            grouped[item.teamId].completed += 1;
          } else {
            grouped[item.teamId].pending += 1;
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
          <Card key={team.teamId} sx={{ height: "100%" }}>
            <CardContent>
              {/* 🔹 TEAM HEADER */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.teamId}`}
                  sx={{ width: 56, height: 56 }}
                />
                <Typography variant="h6">
                  {team.teamName}
                </Typography>
              </Box>
 
              {/* 🔹 MEMBERS */}
              <Box
                onClick={() => navigate(`/manager/id=${team.teamId}`)}
                sx={statusBox("rgb(218, 240, 161)")}
              >
                <GroupOutlinedIcon color="primary" />
                <Typography>
                  Members: <b>{team.members}</b>
                </Typography>
              </Box>
 
              {/* 🔹 COMPLETED */}
              <Box
                onClick={() =>
                  navigate(`/manager/id=${team.teamId}?tab=completed`)
                }
                sx={statusBox("rgb(220, 231, 190)")}
              >
                <CheckCircleOutlineOutlinedIcon sx={{ color: "#2E7D32" }} />
                <Typography>
                  Completed: <b>{team.completed}</b>
                </Typography>
              </Box>
 
              {/* 🔹 PENDING */}
              <Box
                onClick={() =>
                  navigate(`/manager/id=${team.teamId}?tab=pending`)
                }
                sx={statusBox("#daebae")}
              >
                <AccessTimeOutlinedIcon sx={{ color: "#F9A825" }} />
                <Typography>
                  Pending: <b>{team.pending}</b>
                </Typography>
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
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  p: 1.5,
  mb: 1,
  borderRadius: 1,
  backgroundColor: bgColor,
  cursor: "pointer",
  transition: "0.2s",
  "&:hover": {
    boxShadow: 3,
    transform: "translateY(-2px)",
  },
});
 
export default ManagerDashboard;