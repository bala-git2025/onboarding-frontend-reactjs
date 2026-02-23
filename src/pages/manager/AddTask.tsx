import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAvailableTasks,
  createTask,
  TaskOption,
  getEmployeeById,
  Employee,
} from "../../services/managerService";

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams<{ employeeId: string }>();

  const [availableTasks, setAvailableTasks] = useState<TaskOption[]>([]);
  const [taskId, setTaskId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [poc, setPoc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const location = useLocation();
  const { teamId, teamName } = location.state || {};


  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks = await getAvailableTasks();
        setAvailableTasks(Array.isArray(tasks) ? tasks : []);

        if (employeeId) {
          const emp = await getEmployeeById(Number(employeeId));
          setEmployee(emp);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to load data:", err.message);
          setError("Failed to load task list or employee details.");
        }
      } finally {
        setTasksLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createTask({
        taskId: Number(taskId),
        employeeId: Number(employeeId),
        status: "New",
        poc,
        dueDate: dueDate ? new Date(dueDate).toISOString() : "",
        createdBy: "manager",
        updatedBy: "manager",
        description,
        priority,
      });

      setSuccess("Task added successfully!");
      setTaskId("");
      setDueDate("");
      setDescription("");
      setPoc("");
      setPriority("Medium");

      setTimeout(() => {
        navigate(`/Employee/id/${employeeId}`,
          { state: { teamId, teamName } });
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error adding task:", err.message);
        setError(err.message);
      } else {
        setError("Failed to add task. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Card sx={{ maxWidth: 700, width: "100%" }}>
        <CardContent>
          {/* Back Button + Heading */}
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New Task
            </Typography>
          </Box>

          {tasksLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              flexDirection="column"
              gap={3}
              mt={2}
            >
              {/* Row 1: Task Name */}
              <TextField
                select
                label="Task Name"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                required
                disabled={!employee}
                fullWidth
              >
                {availableTasks.length > 0 ? (
                  availableTasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No tasks available</MenuItem>
                )}
              </TextField>

              {/* Row 2: Assign To + Priority + Due Date */}
              <Box display="flex" gap={2}>
                <TextField
                  label="Assign To"
                  value={employee?.name || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  select
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  fullWidth
                  disabled={!employee}
                >
                  {["Low", "Medium", "High"].map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Due Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  fullWidth
                  disabled={!employee}
                />
              </Box>

              {/* Row 3: Point of Contact */}
              <TextField
                label="Point of Contact (POC)"
                value={poc}
                onChange={(e) => setPoc(e.target.value)}
                required
                fullWidth
                disabled={!employee}
              />

              {/* Row 4: Description */}
              <TextField
                label="Description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                disabled={!employee}
              />

              {/* Error / Success */}
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              {/* Status Instruction */}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Status will be set to <strong>New</strong> automatically.
              </Typography>

              {/* Buttons aligned right */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !employee}
                >
                  {loading ? "Adding..." : "Add Task"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate(`/Employee/id/${employeeId}`, { state: { teamId, teamName } })}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddTaskPage;