import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Paper,
  Rating,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthorization } from "../../hooks/useAuthorization";
import logo from "../../assets/logosinfondo.png";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import "./Settings.css";

function Settings() {
  const { userProfile, userSession, getUserProfile } = useAuthorization();
  const navigate = useNavigate();
  const [error, setError] = useState();

  useEffect(() => {
    if (!userSession) {
      navigate("/login");
    }
  }, [userSession]);
  console.log(userProfile);
  return (
    <div>
      <header className="header-Editar">
        <img className="img-register" src={logo} alt="logo" />
        <h1>Edita tu perfi</h1>
      </header>
      {userProfile ? (
        <Paper className="register-container">
          <header className="header-settings">
            <img
              className="img-settings"
              src={userProfile.image}
              alt="foto-perfil"
            />
            <div>
              <h1>{userProfile.nameUser}</h1>
              <Rating name="read-only" value={4} readOnly />
            </div>
          </header>
          <Formik
            initialValues={{
              email: userProfile.email,
              password: "",
              repeatedPassword: "",
              nameUser: userProfile.nameUser,
              bio: userProfile.bio,
              phone: userProfile.phone,
            }}
            validate={(values) => {
              const errors = {};

              if (!values.email) {
                errors.email = "Email requerido!";
              }

              if (!values.nameUser) {
                errors.nameUser = "Nombre requerido!";
              } else {
                // TODO: mas comprobaciones
              }

              if (!values.password) {
                errors.password = "Contraseña requerida!";
              }

              if (!values.bio) {
                errors.bio =
                  "Porfavor introduce una pequeña información sobre ti";
              }

              if (!values.phone) {
                error.phone = "Introduce tu numero de teléfono";
              }

              if (!values.repeatedPassword) {
                errors.repeatedPassword = "Repite la contraseña!";
              } else {
                if (values.password !== values.repeatedPassword) {
                  errors.repeatedPassword = "Contraseñas deben coincidir!";
                }
              }

              return errors;
            }}
            onSubmit={async (values) => {
              console.log("SUBMIT: ", values);
              const { nameUser, password, email, bio, phone } = values;

              try {
                const config = {
                  headers: {
                    Authorization: `Bearer ${userSession}`,
                  },
                };
                const response = await axios.put(
                  "http://localhost:3000/api/v1/users",
                  {
                    nameUser,
                    password,
                    email,
                    bio,
                    phone,
                  },
                  config
                );

                console.log("usuario modificado!: ", response.data);

                getUserProfile();

                setTimeout(() => {
                  navigate("/profile");
                }, 1000);
              } catch (error) {
                setError(error.response.data.error);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="field-container">
                  <h3>
                    <AssignmentIndOutlinedIcon /> Información personal{" "}
                  </h3>
                  <TextField
                    id="nameUser"
                    name="nameUser"
                    label="Nombre"
                    variant="standard"
                    onChange={handleChange}
                    value={values.nameUser}
                    error={errors.nameUser && touched.nameUser}
                    helperText={touched.nameUser && errors.nameUser}
                    fullWidth
                  />
                </div>
                <div className="field-container">
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    variant="standard"
                    onChange={handleChange}
                    value={values.email}
                    error={errors.email && touched.email}
                    helperText={touched.email && errors.email}
                    fullWidth
                  />
                </div>
                <div className="field-container">
                  <TextField
                    id="phone"
                    name="phone"
                    label="Teléfono"
                    type="tel"
                    variant="standard"
                    onChange={handleChange}
                    value={values.phone}
                    error={errors.phone && touched.phone}
                    helperText={touched.phone && errors.phone}
                    fullWidth
                  />
                </div>
                <div className="field-container">
                  <TextField
                    id="bio"
                    name="bio"
                    label="Descripción personal"
                    variant="outlined"
                    multiline
                    rows={4}
                    onChange={handleChange}
                    value={values.bio}
                    error={errors.bio && touched.bio}
                    helperText={touched.bio && errors.bio}
                    fullWidth
                  />
                </div>
                <h3>
                  <SecurityOutlinedIcon /> Seguridad
                </h3>
                <div className="field-container">
                  <TextField
                    id="password"
                    name="password"
                    type={"password"}
                    label="Contraseña"
                    variant="standard"
                    onChange={handleChange}
                    value={values.password}
                    error={errors.password && touched.password}
                    helperText={touched.password && errors.password}
                    fullWidth
                  />
                </div>
                <div className="field-container">
                  <TextField
                    id="repeated-password"
                    name="repeatedPassword"
                    type={"password"}
                    label="Repetir Contraseña"
                    variant="standard"
                    onChange={handleChange}
                    value={values.repeatedPassword}
                    error={errors.repeatedPassword && touched.repeatedPassword}
                    helperText={
                      touched.repeatedPassword && errors.repeatedPassword
                    }
                    fullWidth
                  />
                </div>
                {error && (
                  <Stack sx={{ width: "100%", margin: 1 }} spacing={2}>
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {error}
                    </Alert>
                  </Stack>
                )}
                <div className="button-submit-container">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#090D41",
                    }}
                  >
                    Comfirmar
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Paper>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default Settings;
