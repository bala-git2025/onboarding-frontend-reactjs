/* eslint-disable @typescript-eslint/no-explicit-any */
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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getEmployeeDetails,
  getEmployeeTasks,
  EmployeeTask,
} from "../../services/employeeService";
import { formatDate } from "../../utils/dateUtils";

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

/* ------------------ TASK ITEM COMPONENT ------------------ */
const TaskItem: React.FC<{ task: EmployeeTask; onClick: () => void; onEdit: () => void }> = ({
  task,
  onClick,
  onEdit,
}) => {
  const theme = useTheme();
  const isOverdue =
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed" &&
    task.status !== "Complete";

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 1,
        cursor: "pointer",
        "&:focus-visible": { 
            outline: `2px solid ${theme.palette.primary.main}`, 
            outlineOffset: "2px",
            backgroundColor: theme.palette.action.hover 
        },
        "&:hover": { backgroundColor: theme.palette.action.hover },
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View task details for ${task.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography component="h4" variant="subtitle1" sx={{ fontWeight: 600 }}>
            {task.name}
          </Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Due Date: {formatDate(task.dueDate)}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {/* Show overdue chip if overdue */}
          {isOverdue && <Chip label="Overdue" color="error" size="small" />}
          <Chip 
            label={task.status} 
            color={getStatusColor(task.status)} 
            size="small" 
            aria-label={`Status: ${task.status}`}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label={`Edit task ${task.name}`}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

const EmployeeDashboard: React.FC = () => {
  const { employeeId } = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    const loadDashboard = async () => {
      if (!employeeId) {
        setError("Employee ID missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const empData = await getEmployeeDetails(employeeId);
        const taskData = await getEmployeeTasks(employeeId);

        setEmployee(empData);
        setTasks(taskData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [employeeId]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress aria-label="Loading tasks" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }} role="alert">
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  /* ------------------ TASK SUMMARY COUNTS ------------------ */
  const totalTasks = tasks.length;
  const newTasks = tasks.filter((t) => t.status === "New").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const reviewTasks = tasks.filter((t) => t.status === "Sent for Review").length;
  const completedTasks = tasks.filter(
    (t) => t.status === "Completed" || t.status === "Complete"
  ).length;

  /* ------------------ SORT TASKS BY DUE DATE ASCENDING ------------------ */
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Box
      role="main"
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* ================= SECTION 1: TASK SUMMARY ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Task Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="space-around" textAlign="center" aria-label="Task Summary Statistics">
            <Box>
              <Typography variant="h5" color="primary">{totalTasks}</Typography>
              <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="info.main">{newTasks}</Typography>
              <Typography variant="body2" color="text.secondary">New</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="warning.main">{inProgressTasks}</Typography>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="secondary.main">{reviewTasks}</Typography>
              <Typography variant="body2" color="text.secondary">Sent for Review</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="success.main">{completedTasks}</Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ================= SECTION 2: TASK LIST ================= */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Task List
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {sortedTasks.length === 0 && (
             <Typography color="text.secondary" role="status">No tasks assigned.</Typography>
          )}

          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={() => navigate(`/task/${task.id}`)}
              onEdit={() => navigate(`/task/${task.id}?edit=true`)}
            />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDashboard;