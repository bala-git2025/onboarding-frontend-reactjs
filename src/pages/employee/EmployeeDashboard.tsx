import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  Alert
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  getEmployeeDetails,
  getEmployeeTasks,
  Employee,
  EmployeeTask,
  ApiError
} from "../../services/employeeService";


const statusColor = (
  status: string
): "default" | "info" | "warning" | "success" | "secondary" => {
  switch (status) {
    case "New":
      return "info";
    case "In Progress":
      return "warning";
    case "Sent for Review":
      return "secondary";
    case "Complete":
      return "success";
    default:
      return "default";
  }
};

const EmployeeDashboard: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        console.log("Starting to load dashboard data...");
        setError(null);
        
        console.log("Fetching employee details...");
        const emp = await getEmployeeDetails();
        console.log("Employee data received:", emp);
        setEmployee(emp);
        
        localStorage.setItem("employeeId", emp.id.toString());
        
        console.log("Fetching employee tasks...");
        const taskList = await getEmployeeTasks();
        console.log("Tasks data received:", taskList);
        setTasks(taskList);
        
      } catch (error: unknown) {
        console.error("Failed to load employee dashboard", error);
        const err = error as ApiError;
        let errorMessage = "Failed to load data. Please try again.";
        
        if (err.response?.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userName");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");
          sessionStorage.removeItem("userName");
          window.location.href = "/";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f4f6fb", minHeight: "100vh" }}>
      {/* ================= Personal Details ================= */}
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
              <Typography><b>Date of Joining:</b> {employee.joiningDate}</Typography>
              <Typography><b>Phone:</b> {employee.phone}</Typography>
              <Typography><b>Primary Skill:</b> {employee.primarySkill}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ================= Task List ================= */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Task List
          </Typography>

          {tasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" mb={2}>
                No tasks assigned.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks assigned to you will appear here.
              </Typography>
            </Box>
          ) : (
            tasks.map((task) => (
              <Box key={task.id} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight="bold">
                      <Link 
                        to={`/task/${task.id}`} 
                        style={{ 
                          textDecoration: "none",
                          color: "inherit"
                        }}
                      >
                        {task.taskName}
                      </Link>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={2} alignItems="center">
                    <Chip
                      label={task.status}
                      color={statusColor(task.status)}
                      size="small"
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      component={Link}
                      to={`/task/${task.id}`}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDashboard;