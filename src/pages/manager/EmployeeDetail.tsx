import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  Alert,
  useTheme,
  Toolbar
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEmployeeDetails, getEmployeeTasks, EmployeeTask } from "../../services/employeeService";
import { formatDate, formatLongDate } from "../../utils/dateUtils";
import { ArrowBack } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

/* ------------------ TYPES ------------------ */
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  joiningDate: string;
  primarySkill: string;
}

/* ------------------ STATUS COLOR ------------------ */
const getStatusColor = (
  status: string
): "default" | "info" | "warning" | "secondary" | "success" => {
  switch (status) {
    case "New":
      return "info";
    case "In Progress":
      return "warning";
    case "Sent for Review":
      return "secondary";
    case "Complete":
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const EmployeeDashboard: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const location = useLocation();
  const { teamId, teamName, mode } = location.state || {};
  const [employee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isViewMode = mode === "view";
  const managerDashboard = "Y";
  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    const loadDashboard = async () => {
      if (!employeeId) {
        console.error("No employeeId found in auth context.");
        setError("Employee ID missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const empData = await getEmployeeDetails(Number(employeeId));
        const taskData = await getEmployeeTasks(Number(employeeId));

        setEmployee(empData);
        setTasks(taskData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Dashboard load failed", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [employeeId]);

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading dashboard...</Typography>;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/manager-dashboard")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Employee Details</Typography>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(`/Team-DashBoard/id/${teamId}/teamName/${teamName}`)}>
          Back to Dashboard
        </Button>
      </Toolbar>
      {/* ================= SECTION 1: PERSONAL DETAILS ================= */}
      {employee && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Personal Details
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
              gap={2}
            >
              <Typography><b>Name:</b> {employee.name}</Typography>
              <Typography><b>Employee ID:</b> {employee.id}</Typography>
              <Typography><b>Email:</b> {employee.email}</Typography>
              <Typography><b>Date of Joining:</b> {formatLongDate(employee.joiningDate)}</Typography>
              <Typography><b>Phone:</b> {employee.phone}</Typography>
              <Typography><b>Primary Skill:</b> {employee.primarySkill}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ================= SECTION 2: TASK LIST ================= */}
      <Card>
        <CardContent>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" mb={2}>
              Task List
            </Typography>
            <Button variant="outlined"
             onClick={() => 
              navigate(`/manager-dashboard/employee/${employeeId}/add-task`,
                {state: {employeeId, teamId, teamName,managerDashboard}}
              )}
              disabled={isViewMode}>
              <AddIcon />  Add New Task
            </Button>
          </Toolbar>

          {tasks.length === 0 && (
            <Typography color="text.secondary">
              No tasks assigned.
            </Typography>
          )}

          {tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                mb: 2,
                p: 2,
                cursor: isViewMode ? "not-allowed" : "pointer",
                opacity: isViewMode ? 0.6 : 1,
                pointerEvents: isViewMode ? "none" : "auto",
                '&:hover': {
                  backgroundColor: isViewMode
                    ? "transparent"
                    : theme.palette.action.hover
                }
              }}
              onClick={() => { if (isViewMode) return; navigate(`/task/${task.id}`); }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight="bold">
                    {task.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Due Date: {formatDate(task.dueDate)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={isViewMode}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/task/${task.id}?edit=true`, {state: {employeeId, teamId, teamName,managerDashboard}});
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(`/Team-DashBoard/id/${teamId}/teamName/${teamName}`)}>
          Back to Dashboard
        </Button>
      </Toolbar>
    </Box>
  );
};

export default EmployeeDashboard;