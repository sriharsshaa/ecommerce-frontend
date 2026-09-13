import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const selectedProduct = data.find(
          (item) => item.id === Number(id)
        );

        setProduct(selectedProduct);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="product-details-page">

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <div className="product-details-container">

        {/* Product Image */}

        <div className="product-details-image">
          <img
            src={productImages[product.id]}
            alt={product.name}
          />
        </div>

        {/* Product Information */}

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-details-description">
            This is a high-quality{" "}
            {product.category.toLowerCase()} designed to
            provide excellent performance and a great user
            experience.
          </p>

          <button
            className="product-details-cart-button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>

        </div>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="product-specifications">

        <h2>Product Information</h2>

        <div className="specifications-table">

          {/* =================================================
              LAPTOP
          ================================================= */}

          {product.category === "Laptop" && (
            <>
              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>{product.modelName}</strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>{product.screenSize}</strong>
                </div>
              )}

              {product.hardDiskSize && (
                <div className="specification-row">
                  <span>Hard Disk Size</span>
                  <strong>{product.hardDiskSize}</strong>
                </div>
              )}

              {product.cpuModel && (
                <div className="specification-row">
                  <span>CPU Model</span>
                  <strong>{product.cpuModel}</strong>
                </div>
              )}

              {product.ramMemoryInstalledSize && (
                <div className="specification-row">
                  <span>RAM</span>
                  <strong>
                    {product.ramMemoryInstalledSize}
                  </strong>
                </div>
              )}
            </>
          )}

          {/* =================================================
              AUDIO
          ================================================= */}

          {product.category === "Audio" && (
            <>
              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.color && (
                <div className="specification-row">
                  <span>Color</span>
                  <strong>{product.color}</strong>
                </div>
              )}

              {product.formFactor && (
                <div className="specification-row">
                  <span>Form Factor</span>
                  <strong>{product.formFactor}</strong>
                </div>
              )}

              {product.noiseControl && (
                <div className="specification-row">
                  <span>Noise Control</span>
                  <strong>{product.noiseControl}</strong>
                </div>
              )}

              {product.earPlacement && (
                <div className="specification-row">
                  <span>Ear Placement</span>
                  <strong>{product.earPlacement}</strong>
                </div>
              )}
            </>
          )}

          {/* =================================================
              MOBILE
          ================================================= */}

          {product.category === "Mobile" && (
            <>
              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.storage && (
                <div className="specification-row">
                  <span>Storage</span>
                  <strong>{product.storage}</strong>
                </div>
              )}

              {product.ram && (
                <div className="specification-row">
                  <span>RAM</span>
                  <strong>{product.ram}</strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>{product.screenSize}</strong>
                </div>
              )}

              {product.operatingSystem && (
                <div className="specification-row">
                  <span>Operating System</span>
                  <strong>{product.operatingSystem}</strong>
                </div>
              )}
            </>
          )}

          {/* =================================================
              WEARABLE
          ================================================= */}

          {product.category === "Wearable" && (
            <>
              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>{product.modelName}</strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>{product.screenSize}</strong>
                </div>
              )}

              {product.storage && (
                <div className="specification-row">
                  <span>Storage</span>
                  <strong>{product.storage}</strong>
                </div>
              )}

              {product.operatingSystem && (
                <div className="specification-row">
                  <span>Operating System</span>
                  <strong>{product.operatingSystem}</strong>
                </div>
              )}

              {product.color && (
                <div className="specification-row">
                  <span>Color</span>
                  <strong>{product.color}</strong>
                </div>
              )}

              {product.connectivity && (
                <div className="specification-row">
                  <span>Connectivity</span>
                  <strong>{product.connectivity}</strong>
                </div>
              )}
            </>
          )}

          {/* =================================================
              ACCESSORIES
          ================================================= */}

          {product.category === "Accessories" && (
            <>
              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>{product.modelName}</strong>
                </div>
              )}

              {product.color && (
                <div className="specification-row">
                  <span>Color</span>
                  <strong>{product.color}</strong>
                </div>
              )}

              {product.connectionType && (
                <div className="specification-row">
                  <span>Connection Type</span>
                  <strong>{product.connectionType}</strong>
                </div>
              )}

              {product.compatibility && (
                <div className="specification-row">
                  <span>Compatibility</span>
                  <strong>{product.compatibility}</strong>
                </div>
              )}
            </>
          )}

          {/* =================================================
              MONITOR
          ================================================= */}

          {product.category === "Monitor" && (
            <>
              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>{product.modelName}</strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>{product.screenSize}</strong>
                </div>
              )}

              {product.resolution && (
                <div className="specification-row">
                  <span>Resolution</span>
                  <strong>{product.resolution}</strong>
                </div>
              )}

              {product.refreshRate && (
                <div className="specification-row">
                  <span>Refresh Rate</span>
                  <strong>{product.refreshRate}</strong>
                </div>
              )}

              {product.panelType && (
                <div className="specification-row">
                  <span>Panel Type</span>
                  <strong>{product.panelType}</strong>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* =====================================================
          ABOUT THIS PRODUCT
      ===================================================== */}

      <div className="about-product">

        <h2>About this product</h2>

        {/* IPHONE 15 */}

        {product.id === 1 && (
          <ul>
            <li>
              Premium Apple smartphone designed for everyday
              performance and entertainment.
            </li>
            <li>
              Compact and modern design makes it comfortable
              to use throughout the day.
            </li>
            <li>
              Designed for photography, communication,
              streaming, gaming, and daily productivity.
            </li>
            <li>
              Provides a smooth and responsive experience
              for everyday smartphone usage.
            </li>
          </ul>
        )}

        {/* DELL LAPTOP */}

        {product.id === 2 && (
          <ul>
            <li>
              Versatile Dell laptop designed for work, study,
              and everyday computing.
            </li>
            <li>
              Suitable for browsing, office applications,
              programming, and multimedia tasks.
            </li>
            <li>
              Designed to provide reliable performance for
              daily productivity.
            </li>
            <li>
              A practical choice for students and
              professionals.
            </li>
          </ul>
        )}

        {/* SONY HEADPHONES */}

        {product.id === 3 && (
          <ul>
            <li>
              Premium Sony headphones designed for an
              immersive listening experience.
            </li>
            <li>
              Suitable for music, movies, calls, and
              everyday entertainment.
            </li>
            <li>
              Designed to provide a comfortable listening
              experience for extended use.
            </li>
            <li>
              Noise control helps create a more focused
              audio experience.
            </li>
          </ul>
        )}

        {/* SAMSUNG GALAXY S24 */}

        {product.id === 4 && (
          <ul>
            <li>
              Premium Samsung smartphone designed for
              everyday performance and entertainment.
            </li>
            <li>
              Suitable for communication, photography,
              streaming, gaming, and productivity.
            </li>
            <li>
              Compact design makes it convenient to carry
              and use throughout the day.
            </li>
            <li>
              Designed to provide a smooth and responsive
              smartphone experience.
            </li>
          </ul>
        )}

        {/* HP PAVILION */}

        {product.id === 5 && (
          <ul>
            <li>
              HP Pavilion laptop designed for everyday
              productivity and entertainment.
            </li>
            <li>
              Suitable for students, professionals,
              browsing, office work, and multimedia tasks.
            </li>
            <li>
              Designed to handle everyday computing
              requirements efficiently.
            </li>
            <li>
              A practical laptop for work, study, and
              personal use.
            </li>
          </ul>
        )}

        {/* JBL BLUETOOTH SPEAKER */}

        {product.id === 6 && (
          <ul>
            <li>
              JBL Bluetooth speaker designed for convenient
              wireless audio entertainment.
            </li>
            <li>
              Portable design makes it suitable for home
              use, outings, and small gatherings.
            </li>
            <li>
              Easy to use for music, podcasts, videos, and
              everyday listening.
            </li>
            <li>
              Designed to provide a convenient and enjoyable
              audio experience.
            </li>
          </ul>
        )}

        {/* APPLE WATCH SERIES 9 */}

        {product.id === 7 && (
          <ul>
            <li>
              Apple Watch Series 9 designed to complement
              everyday activities and connectivity.
            </li>
            <li>
              Suitable for notifications, communication,
              fitness tracking, and daily use.
            </li>
            <li>
              Modern smartwatch design makes it suitable
              for both everyday and active lifestyles.
            </li>
            <li>
              Provides convenient access to useful features
              directly from your wrist.
            </li>
          </ul>
        )}

        {/* LOGITECH WIRELESS MOUSE */}

        {product.id === 8 && (
          <ul>
            <li>
              Logitech wireless mouse designed for
              comfortable everyday computer use.
            </li>
            <li>
              Wireless connectivity provides a clean and
              convenient desktop setup.
            </li>
            <li>
              Suitable for browsing, office work,
              programming, and general productivity.
            </li>
            <li>
              Compact design makes it easy to use at home,
              in the office, or while travelling.
            </li>
          </ul>
        )}

        {/* SAMSUNG 27-INCH MONITOR */}

        {product.id === 9 && (
          <ul>
            <li>
              Samsung 27-inch monitor designed for work,
              study, entertainment, and everyday computing.
            </li>
            <li>
              Large display provides a comfortable viewing
              area for applications and multimedia.
            </li>
            <li>
              Suitable for office work, browsing,
              programming, and entertainment.
            </li>
            <li>
              Modern monitor design fits well into home and
              office workspaces.
            </li>
          </ul>
        )}

      </div>

    </div>
  );
}

export default ProductDetails;