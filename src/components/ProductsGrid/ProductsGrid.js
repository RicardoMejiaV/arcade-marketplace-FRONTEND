import { useNavigate } from "react-router";
import imgDefault from "../../assets/imagen_articulo_por_defecto.jpg";
import "./ProductsGrid.css";

function ProductsGrid({ products }) {
  const navigate = useNavigate();
  function onClickProduct(id) {
    navigate(`/products/${id}`);
  }

  return (
    <div>
      {products.map((product) => (
        <article
          key={product.idProduct}
          onClick={() => onClickProduct(product.idProduct)}
          className="grid-product"
        >
          <img className="img-grid" src={imgDefault} alt="default-logo" />
          <div>
            <h1>{product.price}€</h1>
            <h2>{product.title}</h2>
            <h3>{product.category}</h3>
            <p>{product.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductsGrid;
