/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, ProfileResponse } from "../../services/authService";
import { formatLongDate } from "../../utils/dateUtils";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [originalProfile, setOriginalProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editField, setEditField] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setOriginalProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateProfile({
        email: profile.email,
        phone: profile.phone,
        primarySkill: profile.primarySkill,
      });
      const refreshed = await getProfile();
      setProfile(refreshed);
      setOriginalProfile(refreshed);
      setSuccess("Profile updated successfully!");
      setEditField(null);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setEditField(null);
    setError(null);
    setSuccess(null);
  };

  const renderField = (
    label: string,
    value: string | undefined,
    fieldKey: "email" | "phone" | "primarySkill"
  ) => {
    const isEditing = editField === fieldKey;
    return (
      <Box display="flex" alignItems="center" gap={1}>
        {isEditing ? (
          <TextField
            label={label}
            value={value || ""}
            onChange={(e) => setProfile({ ...profile!, [fieldKey]: e.target.value })}
            fullWidth
          />
        ) : (
          <Typography sx={{ flexGrow: 1 }}>
            <b>{label}:</b> {value || "N/A"}
          </Typography>
        )}
        <IconButton size="small" onClick={() => setEditField(fieldKey)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back arrow */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
          Profile Information
        </Typography>
      </Box>

      <Card sx={{ flexGrow: 1 }}>
        <CardContent>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {profile && (
            <Box display="grid" gridTemplateColumns="1fr" gap={2}>
              {/* Non-editable fields */}
              <Typography><b>ID:</b> {profile.id}</Typography>
              <Typography><b>Name:</b> {profile.name}</Typography>
              <Typography><b>Username:</b> {profile.username}</Typography>
              <Typography><b>Role:</b> {profile.role}</Typography>
              <Typography><b>Team:</b> {profile.teamName || "N/A"}</Typography>
              {profile.joiningDate && (
                <Typography><b>Joining Date:</b> {formatLongDate(profile.joiningDate)}</Typography>
              )}
              {profile.lastUpdated && (
                <Typography><b>Last Updated:</b> {formatLongDate(profile.lastUpdated)}</Typography>
              )}

              {/* Editable fields */}
              {renderField("Email", profile.email, "email")}
              {renderField("Mobile", profile.phone, "phone")}
              {renderField("Primary Skill", profile.primarySkill, "primarySkill")}

              {/* Password field (masked) */}
              <Box display="flex" alignItems="center" gap={1}>
                <Typography sx={{ flexGrow: 1 }}>
                  <b>Password:</b> {showPassword ? profile.password : "****"}
                </Typography>
                <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Box>

              {/* Save/Cancel buttons */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={!editField}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving || !editField}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;