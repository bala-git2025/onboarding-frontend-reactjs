import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from "@mui/material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import {
  getTaskDetail,
  updateTaskStatus,
  addTaskComment,
  TaskDetail as ImportedTaskDetailType
} from "../../services/employeeService";

interface CompleteTaskDetail extends ImportedTaskDetailType {
  status: string;
  description: string;
  comments: Array<{
    id: number;
    text: string;
    author: string;
    timestamp: string;
  }>;
  completedOn?: string | null;
  createdBy?: string;
}

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { employeeId, employeeName, userName } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [task, setTask] = useState<CompleteTaskDetail | null>(null);
  const [status, setStatus] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const isEditable = searchParams.get('edit') === 'true';
  const displayName = employeeName || userName || "Guest";

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (!taskId || !employeeId) {
        setError("Task ID or Employee ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const taskData = await getTaskDetail(employeeId, parseInt(taskId)) as CompleteTaskDetail;
        
        const transformedComments = taskData.comments.map(comment => ({
          ...comment,
          author: comment.author === "User" ? displayName : comment.author
        }));
        
        setTask({ ...taskData, comments: transformedComments });
        setStatus(taskData.status);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch task details", err);
        let errorMessage = "An unknown error occurred.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage || "Failed to load task details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [taskId, employeeId, displayName]);

  const handleStatusUpdate = async () => {
    if (!task || !taskId || !employeeId) return;

    try {
      setUpdating(true);
      await updateTaskStatus(employeeId, parseInt(taskId), status);
      setTask({ ...task, status });
      setError(null);
    } catch (error) {
      console.error("Failed to update task status", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task || !taskId || !employeeId) return;

    try {

      await addTaskComment(employeeId, parseInt(taskId), newComment);

      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        author: displayName,
        timestamp: new Date().toISOString()
      };

      setTask({
        ...task,
        comments: [...task.comments, newCommentObj]
      });

      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Failed to add comment", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  const getStatusColor = (status: string): "default" | "info" | "warning" | "success" | "secondary" => {
    switch (status) {
      case "New": return "info";
      case "In Progress": return "warning";
      case "Sent for Review": return "secondary";
      case "Complete": return "success";
      default: return "default";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatCompletedDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not completed';
    return formatDate(dateString);
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}><CircularProgress /></Box>;
  }

  if (!task && !error) {
    return <Typography sx={{ p: 3 }}>Task not found</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && task && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Task Details
          </Typography>

          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={() => navigate("/employee-dashboard")} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1 }}>
              {task.name}
            </Typography>
            <Chip label={task.status} color={getStatusColor(task.status)} />
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" flexWrap="wrap" gap={4}>
                <Box flexGrow={1} sx={{ minWidth: '250px' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Due Date</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(task.dueDate)}</Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Created On</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(task.createdOn)}</Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Completed On</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatCompletedDate(task.completedOn)}</Typography>
                </Box>

                <Box flexGrow={1} sx={{ minWidth: '250px' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Created By</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{task.createdBy || 'N/A'}</Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Point of Contact</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{task.pointOfContact}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>Task Description</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {task.description || "No description provided."}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="status-select-label"><strong>Update Task Status</strong></InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Update Task Status"
                      disabled={!isEditable}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Sent for Review">Sent for Review</MenuItem>
                    </Select>
                  </FormControl>
                  {isEditable && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>Note:</Box> Employees can only update the task status to <strong>New</strong>, <strong>In Progress</strong>, or <strong>Sent for Review</strong>.
                    </Typography>
                  )}
                </Box>
                {isEditable && (
                  <Box>
                    <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleStatusUpdate} disabled={updating || status === task.status}>
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Comments</Typography>

              {task.comments.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 2 }}>No comments yet.</Typography>
              ) : (
                <List sx={{ mb: 2 }}>
                  {task.comments.map((comment) => (
                    <ListItem
                      key={`${comment.id}-${comment.timestamp}`}
                      alignItems="flex-start"
                      sx={{ px: 0 }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {comment.author.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold">{comment.author}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(comment.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={comment.text}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!isEditable}
                />
                {isEditable && (
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()}>
                      Add Comment
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {!isEditable && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/employee-dashboard")}
              >
                Back to Dashboard
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TaskDetail;