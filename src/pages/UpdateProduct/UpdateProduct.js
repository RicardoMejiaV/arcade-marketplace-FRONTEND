import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthorization } from "../../hooks/useAuthorization";
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
  Stack,
  Alert,
  AlertTitle,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Formik, Field } from "formik";
import GoBack from "../../components/GoBack/GoBack";
import { Box } from "@mui/system";
import DialogContentText from "@mui/material/DialogContentText";
import "../UpdateProduct/UpdateProduct.css";
import { DropzoneArea } from "material-ui-dropzone";
import theme from "../../theme/theme";

const { REACT_APP_BACKEND_API } = process.env;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UpdateProduct() {
  const { userSession } = useAuthorization();
  const navigate = useNavigate();
  const { idProduct } = useParams();
  const [productData, setProductData] = useState();
  const [error, setError] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const handleCloseIsDelete = () => setIsDelete(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const config = {
    headers: {
      Authorization: `Bearer ${userSession}`,
    },
  };

  async function deleteProduct() {
    try {
      handleClose();

      await axios.delete(
        `${REACT_APP_BACKEND_API}products/${idProduct}`,
        config
      );
      setIsDelete(true);
      setTimeout(() => {
        navigate("/my-products");
      }, 3000);
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  async function deleteImageProduct(imageUrl) {
    const config = {
      headers: {
        Authorization: `Bearer ${userSession}`,
      },
    };
    try {
      const imageUrlSplitted = imageUrl.split("/");

      const nameImage = imageUrlSplitted[imageUrlSplitted.length - 1];
      await axios.delete(
        `${REACT_APP_BACKEND_API}products/images/${nameImage}`,
        config
      );
      window.location.reload();
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  useEffect(() => {
    if (!userSession) {
      navigate("/login");
    }
    async function getProductoData() {
      try {
        const responseData = await axios.get(
          `${REACT_APP_BACKEND_API}products/${idProduct}`
        );
        setProductData(responseData.data.data);
      } catch (error) {
        setError(error.response.data.error);
      }
    }
    getProductoData();
  }, [userSession, navigate, idProduct]);

  return (
    <main className="updateProduct">
      <GoBack />
      <div>
        {productData && (
          <Paper
            className="upload-product-form"
            style={{ backgroundColor: "white", marginTop: "20px" }}
          >
            <Formik
              initialValues={{
                category: productData.category,
                title: productData.title,
                description: productData.description,
                price: productData.price,
                state: productData.state,
                location: productData.location,
              }}
              validate={(values) => {
                const errors = {};

                if (!values.title) {
                  errors.title = "T??tulo Required";
                }
                if (!values.description) {
                  errors.description = "description Required";
                }
                if (!values.price) {
                  errors.price = "price Required";
                }
                if (!values.state) {
                  errors.state = "state Required";
                }
                if (!values.location) {
                  errors.location = "location Required";
                }
                return errors;
              }}
              onSubmit={async (values) => {
                console.log("SUBMIT: ", values);
                const { category, title, description, price, state, location } =
                  values;

                try {
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userSession}`,
                    },
                  };
                  await axios.put(
                    `http://localhost:3000/api/v1/products/${idProduct}`,
                    {
                      category,
                      title,
                      description,
                      price,
                      state,
                      location,
                    },
                    config
                  );

                  if (files.length === 0) {
                    navigate(`/products/${idProduct}`);
                    return;
                  }

                  const formData = new FormData();

                  for (const file of files) {
                    formData.append("productImage", file);
                  }

                  await axios.post(
                    `${REACT_APP_BACKEND_API}products/images/${idProduct}`,
                    formData,
                    config
                  );
                } catch (error) {
                  console.log(error);
                  setError(error.response);
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <h2>
                    Categor??a <ListIcon />{" "}
                  </h2>
                  <div>
                    <label>
                      <Field type="radio" name="category" value="consolas" />{" "}
                      Consola
                    </label>
                    <label>
                      <Field type="radio" name="category" value="arcades" />{" "}
                      Arcades
                    </label>
                    <label>
                      <Field type="radio" name="category" value="videojuegos" />{" "}
                      Videojuegos
                    </label>
                    <label>
                      <Field type="radio" name="category" value="accesorios" />{" "}
                      Accesorios
                    </label>
                  </div>
                  <h2>Informaci??n</h2> <InfoIcon />
                  <div className="titulo-precio">
                    <TextField
                      margin="dense"
                      sx={{ marginRight: 1 }}
                      className="titulo-producto"
                      id="title"
                      label="T??tulo"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.title}
                      error={errors.title && touched.title}
                      helperText={touched.title && errors.title}
                    />

                    <TextField
                      margin="dense"
                      id="price"
                      label="Precio (???)"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.price}
                      error={errors.price && touched.price}
                      helperText={touched.price && errors.price}
                    />
                  </div>
                  <div>
                    <TextField
                      margin="dense"
                      id="description"
                      label="Descripci??n del producto"
                      multiline
                      rows={4}
                      variant="outlined"
                      onChange={handleChange}
                      value={values.description}
                      error={errors.description && touched.description}
                      helperText={touched.description && errors.description}
                      fullWidth
                    />
                  </div>
                  <div className="estado-localidad">
                    <FormControl
                      fullWidth
                      margin="dense"
                      sx={{ marginRight: 1 }}
                      variant="outlined"
                    >
                      <InputLabel id="state">Estado</InputLabel>

                      <Select
                        className="estado"
                        value={values.state}
                        id="state"
                        name="state"
                        label="Estado"
                        variant="standard"
                        onChange={handleChange}
                        error={errors.state && touched.state}
                        state
                      >
                        <MenuItem value="" disabled>
                          Selecciona el estado del producto
                        </MenuItem>
                        <MenuItem value={"nuevo"}>Nuevo</MenuItem>
                        <MenuItem value={"seminuevo"}>Seminuevo</MenuItem>
                        {/* <MenuItem value={"buen estado"}>Buen estado</MenuItem> */}
                        <MenuItem value={"usado"}>Usado</MenuItem>
                        {/* <MenuItem value={"Malas condiciones"}>
                      Malas condiciones
                    </MenuItem> */}
                      </Select>
                    </FormControl>

                    <TextField
                      margin="dense"
                      id="location"
                      label="Localidad"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.location}
                      error={errors.location && touched.location}
                      helperText={touched.location && errors.location}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <AddLocationIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <h2>Imagenes</h2>
                  {Array.isArray(productData.imagesURL) ? (
                    <div className="img-container-preview">
                      <ImageList sx={{ width: 400, height: 250 }}>
                        <ImageListItem key="Subheader" cols={2}></ImageListItem>
                        {productData.imagesURL.map((item) => (
                          <ImageListItem key={item}>
                            <img
                              src={`${item}?w=248&fit=crop&auto=format`}
                              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                              alt={"img"}
                              loading="lazy"
                            />
                            <ImageListItemBar
                              title={productData.title}
                              subtitle={`Creada : ${productData.createdAt.toString()}`}
                              actionIcon={
                                <IconButton
                                  onClick={() => deleteImageProduct(item)}
                                  sx={{
                                    color: "rgba(255, 255, 255, 0.54)",
                                  }}
                                  aria-label="delete"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              }
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </div>
                  ) : (
                    <div>
                      <img
                        className="img-preview"
                        src={productData.imagesURL}
                        alt="product-img"
                      />
                    </div>
                  )}
                  <div>
                    <h2>Subir imagen</h2>
                    <Paper elevation={3} sx={{ padding: "12px" }}>
                      <DropzoneArea onChange={(file) => setFiles(file)} />
                    </Paper>
                  </div>
                  {error && (
                    <Stack sx={{ width: "100%", margin: 1 }} spacing={2}>
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error}
                      </Alert>
                    </Stack>
                  )}
                  {isDelete && (
                    <div>
                      <Modal
                        open={true}
                        onClose={handleCloseIsDelete}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box style={style}>
                          <Stack sx={{ width: "100%" }} spacing={2}>
                            <Alert severity="success">
                              <AlertTitle>Success</AlertTitle>
                              Producto borrado correctamente, redireccionando a
                              tus productos!
                              <strong>;)</strong>
                            </Alert>
                          </Stack>
                        </Box>
                      </Modal>
                    </div>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    theme={theme}
                    sx={{
                      width: 200,
                      marginBottom: 1,
                      marginTop: 2,
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    theme={theme}
                    sx={{
                      width: 200,
                      marginBottom: 1,
                      marginTop: 2,
                      marginLeft: 1,
                    }}
                    variant="outlined"
                    onClick={handleClickOpen}
                  >
                    Elimniar
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      ??Estas seguro de borrar este producto?
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Este proceso es irreversible y cancelar?? todas las
                        ordenes de compra de este producto
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancelar</Button>
                      <Button onClick={deleteProduct} autoFocus>
                        Eliminar
                      </Button>
                    </DialogActions>
                  </Dialog>
                </form>
              )}
            </Formik>
          </Paper>
        )}
      </div>
    </main>
  );
}

export default UpdateProduct;
