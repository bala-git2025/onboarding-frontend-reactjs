/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Avatar,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    fieldKey?: "email" | "phone" | "primarySkill"
  ) => {
    const isEditing = editField === fieldKey;
    return (
      <TableRow>
        <TableCell sx={{ fontWeight: 600, width: 180 }}>{label}</TableCell>
        <TableCell>
          {isEditing && fieldKey ? (
            <TextField
              value={value || ""}
              onChange={(e) => setProfile({ ...profile!, [fieldKey]: e.target.value })}
              size="small"
              fullWidth
            />
          ) : (
            <Typography>{value || "N/A"}</Typography>
          )}
        </TableCell>
        <TableCell align="right" sx={{ width: 50 }}>
          {fieldKey && (
            <IconButton size="small" onClick={() => setEditField(fieldKey)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
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
          Personal Details
        </Typography>
      </Box>

      <Card sx={{ flexGrow: 1 }}>
        <CardContent>
          {profile && (
            <>
              {/* Avatar + Name */}
              <Box display="flex" alignItems="center" flexDirection="column" mb={3}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" mt={1}>{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.role}</Typography>
              </Box>

              {/* Personal Info Section */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: 700,
                  mx: "auto",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Personal Information
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, width: 180 }}>ID</TableCell>
                      <TableCell>{profile.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                      <TableCell>{profile.username}</TableCell>
                    </TableRow>
                    {renderField("Email", profile.email, "email")}
                    {renderField("Mobile", profile.phone, "phone")}
                  </TableBody>
                </Table>
              </Paper>

              {/* Work Info Section */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: 700,
                  mx: "auto",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Work Information
                </Typography>
                <Table>
                  <TableBody>
                    {renderField("Primary Skill", profile.primarySkill, "primarySkill")}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Team</TableCell>
                      <TableCell>{profile.teamName || "N/A"}</TableCell>
                    </TableRow>
                    {profile.joiningDate && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Joining Date</TableCell>
                        <TableCell>{formatLongDate(profile.joiningDate)}</TableCell>
                      </TableRow>
                    )}
                    {profile.lastUpdated && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                        <TableCell>{formatLongDate(profile.lastUpdated)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>

              {/* Save/Cancel buttons */}
              <Box display="flex" justifyContent="center" gap={2} mt={3}>
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
                  {saving ? <CircularProgress size={20} /> : "Save Changes"}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Snackbar feedback */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        message={success}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  );
};

export default Profile;