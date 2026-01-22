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
  Avatar
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { 
  getTaskDetail, 
  updateTaskStatus, 
  addTaskComment,
  TaskDetail as TaskDetailType
} from "../../services/employeeService";

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { employeeId } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetailType | null>(null);
  const [status, setStatus] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        if (taskId && employeeId) {
          const taskData = await getTaskDetail(employeeId, parseInt(taskId));
          setTask(taskData);
          setStatus(taskData.status);
        }
      } catch (error) {
        console.error("Failed to fetch task details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [taskId, employeeId]);

  const handleStatusUpdate = async () => {
    if (!task || !taskId || !employeeId) return;
    
    try {
      setUpdating(true);
      await updateTaskStatus(employeeId, parseInt(taskId), status);
      setTask({ ...task, status });
    } catch (error) {
      console.error("Failed to update task status", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task || !taskId || !employeeId) return;
    
    try {
      const tempComment = {
          id: Date.now(),
          text: newComment,
          author: "You",
          timestamp: new Date().toISOString()
      };
      setTask({ 
        ...task, 
        comments: [tempComment, ...task.comments] 
      });
      
      await addTaskComment(employeeId, parseInt(taskId), newComment);
      
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  const getStatusColor = (status: string): "default" | "info" | "warning" | "success" | "secondary" => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading task details...</Typography>;
  }

  if (!task) {
    return <Typography sx={{ p: 3 }}>Task not found</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f4f6fb", minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/employee-dashboard")} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Task Details
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            {task.name}
          </Typography>

          <Box display="flex" flexWrap="wrap" mb={2} sx={{ gap: 2 }}>
            <Box flex="1" minWidth={300}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Status
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                  size="small"
                />
                <TextField
                  select
                  size="small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ minWidth: 150 }}
                  SelectProps={{ native: true }}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Sent for Review">Sent for Review</option>
                  <option value="Complete">Complete</option>
                </TextField>
              </Box>
            </Box>

            <Box flex="1" minWidth={300}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Due Date
              </Typography>
              <Typography>
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexWrap="wrap" mb={2} sx={{ gap: 2 }}>
            <Box flex="1" minWidth={300}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Created On
              </Typography>
              <Typography>
                {formatDate(task.createdOn)}
              </Typography>
            </Box>

            <Box flex="1" minWidth={300}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Point of Contact
              </Typography>
              <Typography>{task.pointOfContact}</Typography>
            </Box>
          </Box>

          <Box mt={2} mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Task Description
            </Typography>
            <Typography>{task.description || "No description provided."}</Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStatusUpdate}
              disabled={updating || status === task.status}
            >
              {updating ? "Updating..." : "Update Status"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Comments
          </Typography>

          <Box mb={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Add Comment
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {task.comments.length === 0 ? (
            <Typography color="text.secondary">
              No comments yet.
            </Typography>
          ) : (
            <List>
              {task.comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {comment.author.charAt(0)}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">{comment.author}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(comment.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.text}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskDetail;