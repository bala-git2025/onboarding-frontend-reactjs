import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  getEmployeeDetails,
  getEmployeeTasks,
  Employee,
  EmployeeTask
} from "/services/employeeService";


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
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const EmployeeDashboard: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const emp = await getEmployeeDetails();
        const taskList = await getEmployeeTasks();
        setEmployee(emp);
        setTasks(taskList);
      } catch (error) {
        console.error("Failed to load employee dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f4f6fb", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Employee Dashboard
      </Typography>

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

          {tasks.length === 0 && (
            <Typography color="text.secondary">
              No tasks assigned.
            </Typography>
          )}

          {tasks.map((task) => (
            <Box key={task.id} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight="bold">
                    <Link to={`/task/${task.id}`} style={{ textDecoration: "none" }}>
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
                  <Button size="small" variant="outlined">
                    Edit
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDashboard;
