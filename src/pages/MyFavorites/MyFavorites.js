import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { useAuthorization } from "../../hooks/useAuthorization";

const { REACT_APP_BACKEND_API } = process.env;

function MyFavorites() {
  const { userSession, userProfile } = useAuthorization();
  const navigate = useNavigate();
  const [myFavorites, setMyFavorites] = useState();
  const { idUser } = userProfile;

  useEffect(() => {
    if (!userSession) {
      navigate("/login");
    }
    async function getMyFavorites() {
      const config = {
        headers: {
          Authorization: `Bearer ${userSession}`,
        },
      };
      const response = await axios.get(
        `${REACT_APP_BACKEND_API}users/favorites`,
        config
      );
      console.log(response.data.data);
      setMyFavorites(response.data.data);
    }
    getMyFavorites();
  }, [userSession, navigate, idUser]);

  return (
    <div>
      <h1>Mis Favoritos</h1>
      {myFavorites ? (
        <ProductsGrid products={myFavorites} />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default MyFavorites;
