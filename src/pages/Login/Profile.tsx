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
  Alert,
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
    const labelId = `label-${fieldKey}`; // Generate unique ID for accessibility
    const isEditing = editField === fieldKey;
    return (
      <TableRow hover>
        <TableCell 
          component="th" 
          scope="row" 
          id={labelId} 
          sx={{ 
            fontWeight: 700, 
            width: 200, 
            fontSize: '1rem',
            color: 'text.secondary' 
          }}
        >
          {label}
        </TableCell>
        <TableCell sx={{ fontSize: '1rem' }}>
          {isEditing && fieldKey ? (
            <TextField
              value={value || ""}
              onChange={(e) => setProfile({ ...profile!, [fieldKey]: e.target.value })}
              size="small"
              fullWidth
              autoFocus
              inputProps={{ 
                'aria-labelledby': labelId,
                autoComplete: fieldKey === 'email' ? 'email' : (fieldKey === 'phone' ? 'tel' : 'off')
              }}
            />
          ) : (
            <Typography id={labelId} variant="body1" sx={{ color: 'text.primary' }}>
              {value || "N/A"}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right" sx={{ width: 60 }}>
          {fieldKey && (
            <IconButton 
              size="small" 
              onClick={() => setEditField(fieldKey)}
              aria-label={`Edit ${label}`}
              sx={{ color: 'text.secondary' }}
            >
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
        <CircularProgress aria-label="Loading profile" />
      </Box>
    );
  }

  return (
    <Box
      role="main"
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
        <IconButton 
          onClick={() => navigate(-1)} 
          aria-label="Go back to dashboard"
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Personal Details
        </Typography>
      </Box>

      <Card sx={{ flexGrow: 1, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {profile && (
            <>
              {/* Avatar + Name */}
              <Box display="flex" alignItems="center" flexDirection="column" mb={3}>
                <Avatar 
                  sx={{ width: 80, height: 80, bgcolor: "primary.main" }}
                  aria-label={`Profile avatar for ${profile.name}`}
                >
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" mt={1}>{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.role}</Typography>
              </Box>

              {/* Personal Info Section */}
              <Paper
                elevation={2}
                sx={{
                  p: 0,
                  mb: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: 800,
                  mx: "auto",
                  border: '1px solid rgba(0,0,0,0.08)',
                  overflow: "hidden"
                }}
              >
                <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Personal Information</Typography>
                </Box>
                <Table size="medium">
                  <TableBody>
                    <TableRow hover>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700, width: 200, fontSize: '1rem', color: 'text.secondary' }}>ID</TableCell>
                      <TableCell sx={{ fontSize: '1rem' }}>{profile.id}</TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow hover>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.secondary' }}>Username</TableCell>
                      <TableCell sx={{ fontSize: '1rem' }}>{profile.username}</TableCell>
                      <TableCell />
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
                  p: 0,
                  mb: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: 800,
                  mx: "auto",
                  border: '1px solid rgba(0,0,0,0.08)',
                  overflow: "hidden"
                }}
              >
                <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Work Information</Typography>
                </Box>
                <Table size="medium">
                  <TableBody>
                    {renderField("Primary Skill", profile.primarySkill, "primarySkill")}
                    <TableRow hover>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.secondary' }}>Team</TableCell>
                      <TableCell sx={{ fontSize: '1rem' }}>{profile.teamName || "N/A"}</TableCell>
                      <TableCell />
                    </TableRow>
                    {profile.joiningDate && (
                      <TableRow hover>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.secondary' }}>Joining Date</TableCell>
                        <TableCell sx={{ fontSize: '1rem' }}>{formatLongDate(profile.joiningDate)}</TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                    {profile.lastUpdated && (
                      <TableRow hover>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.secondary' }}>Last Updated</TableCell>
                        <TableCell sx={{ fontSize: '1rem' }}>{formatLongDate(profile.lastUpdated)}</TableCell>
                        <TableCell />
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
                  sx={{ px: 4, borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving || !editField}
                  sx={{ px: 4, borderRadius: 2 }}
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Snackbar feedback - Using Alert for better ARIA roles */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;