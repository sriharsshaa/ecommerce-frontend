function ProductCard({ product, addToCart }) {
  const productImages = {
    1: "/images/iphone15.png",
    2: "/images/dell-laptop.png",
    3: "/images/sony_headphones.png",
    4: "/images/samsung_galaxy_s24.png",
    5: "/images/hp_pavilion.png",
    6: "/images/jbl_bluetooth_speaker.png",
    7: "/images/apple_watch_series_9.png",
    8: "/images/logitech_mouse.png",
    9: "/images/samsung_27inch_monitor.png",
};

  return (
    <div className="product-card">

      <div className="product-image-container">
        <img
          src={productImages[product.id]}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <p className="product-category">
          {product.category}
        </p>

        <h2>{product.name}</h2>

        <div className="product-bottom">
          <span className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <button
            className="add-cart-button"
            onClick={() => addToCart(product)}
          >
            🛒 Add
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;