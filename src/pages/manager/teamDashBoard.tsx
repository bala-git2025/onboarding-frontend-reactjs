import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Team{
    employeeId : number;
    teamId : number;
    task: number;
    employeeName : string;
    status : string;
    teamName : string;
    taskName : string;
}

interface teamDetails{
    employeeId : number;
    employeeName : string;
    totalTasks: number;
    completedTask: number;
    pendingTask : number;
    overDueTask : number;
}

const TeamDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { teamId,teamName } = useParams<{ teamId: string,teamName : string }>();
    const [teams, setTeams] = useState<teamDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/manager/team/${teamId}`)
        .then((res) => {
             const teamList: Team[] = res.data.teamList || [];
             const grouped: Record<number, teamDetails> = {};
            teamList.forEach((item) => {
          if (!grouped[item.teamId]) {
            grouped[item.teamId] = {
              employeeId : item.employeeId,
              employeeName: item.employeeName,
              totalTasks: 0,
              completedTask: 0,
              pendingTask: 0,
              overDueTask: 0,
            };
          }

          grouped[item.teamId].totalTasks += 1;

          if (item.status === "Completed") {
            grouped[item.teamId].completedTask += 1;
          } else if (item.status === "Pending") {
            grouped[item.teamId].pendingTask += 1;
          } else if (item.status === "Overdue") {
            grouped[item.teamId].overDueTask += 1;
          }
        });
             
        });
    },[]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Team ID: ${teamName}
      </Typography>
    </Box>
  );
};

export default TeamDashboard;
