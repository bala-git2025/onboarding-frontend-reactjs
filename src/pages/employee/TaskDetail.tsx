import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { taskService } from "../../services/taskService";

interface Task {
  id: number;
  name: string;
  status: string;
  description: string;
  createdOn: string;
  createdBy: number | string;
}

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) return;
      try {
        const data = await taskService.getTaskById(parseInt(taskId));
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId]);

  if (loading) return <div className="app-container">Loading...</div>;
  if (error) return <div className="app-container">Error: {error}</div>;
  if (!task) return <div className="app-container">No task found.</div>;

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Sent for Review': return 'status-review';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="app-container">
      <header style={{ marginBottom: '20px' }}>
        <Link to="/employee-dashboard" style={{ textDecoration: 'none', color: '#2c3e50' }}>
          &larr; Back to Dashboard
        </Link>
      </header>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: 0 }}>
              {task.name}
            </h1>
            <span className={`status-badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '20px 0' }} />

        <div style={{ marginBottom: '20px' }}>
          <h3 className="info-label">Description</h3>
          <p style={{ lineHeight: '1.6', color: '#34495e' }}>
            {task.description}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          <div>
            <span className="info-label">Created On:</span>
            <div className="info-value">{new Date(task.createdOn).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="info-label">Created By:</span>
            <div className="info-value">{task.createdBy}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;