import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ArrowBack, Mode } from "@mui/icons-material";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getTeamMembersSummary } from "../../services/managerService";

interface Team {
  employeeId: number;
  name: string;
  status: string;
}

interface TeamDetails {
  employeeId: number;
  employeeName: string;
  totalTasks: number;
  completedTask: number;
  pendingTask: number;
  overDueTask: number;
}

const TeamDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { teamId,teamName } = useParams<{ teamId: string ,teamName : string}>();
  const [teams, setTeams] = useState<TeamDetails[]>([]);
  const [loading, setLoading] = useState(true);

 
useEffect(() => {
  if (!teamId) return;

  (async () => {
    try {
      const data = await getTeamMembersSummary(teamId);
      setTeams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  })();
}, [teamId]);


  return (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5"> {teamName} Dashboard</Typography>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/manager-dashboard")}>
          Back to Dashboard
        </Button>
      </Toolbar>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Employee Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Total Tasks
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Completed
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Pending
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Overdue
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teams.map((emp) => (
              <TableRow key={emp.employeeId} hover>
                <TableCell align="center">
                  <MuiLink
                    onClick= {()=> navigate(`/Employee/id/${emp.employeeId}`,{state: { teamId, teamName,mode: "view" }})}
                     underline="hover"
                    sx={{ fontWeight: 500 }}
                  >
                  {emp.employeeName} </MuiLink></TableCell>
                <TableCell align="center" >{emp.totalTasks}</TableCell>
                <TableCell align="center" sx = {{
                  fontWeight: 500,
                  color: "rgb(103, 217, 171)"
                }}>{emp.completedTask}</TableCell>
                <TableCell align="center" sx = {{
                  fontWeight: 500,
                  color: "rgb(241, 201, 99)"
                }}>{emp.pendingTask}</TableCell>
                <TableCell align="center" sx = {{
                  fontWeight: 500,
                  color: "rgb(248, 47, 47)"
                }}>{emp.overDueTask}</TableCell>
                <TableCell>
                  <Button
                    onClick= {()=> navigate(`/Employee/id/${emp.employeeId}`,{state: { teamId, teamName,mode: "edit" },})}
                    variant="outlined"
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      px: 1.5,
                    }}
                  >
                    Edit
                  </Button>

                </TableCell>
              </TableRow>
            ))}

            {!loading && teams.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/manager-dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default TeamDashboard;
