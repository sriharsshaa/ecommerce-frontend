import { useEffect, useState } from "react";

function AdminProducts({ showNotification }) {
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
    description: "",
    storage: "",
    ram: "",
    screenSize: "",
    operatingSystem: "",
    modelName: "",
    hardDiskSize: "",
    cpuModel: "",
    ramMemoryInstalledSize: "",
    color: "",
    earPlacement: "",
    formFactor: "",
    noiseControl: "",
    connectivity: "",
    connectionType: "",
    compatibility: "",
    resolution: "",
    refreshRate: "",
    panelType: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  async function fetchProducts() {
    const token = localStorage.getItem("token");

    if (!token) {
      showNotification(
        "Please login as admin.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 403) {
        throw new Error(
          "Admin access required."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products."
        );
      }

      const data = await response.json();

      setProducts(data);

    } catch (error) {
      console.error(
        "Fetch admin products error:",
        error
      );

      showNotification(
        error.message,
        "error"
      );
    }
  }

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // =========================================================
  // HANDLE IMAGE SELECTION
  // =========================================================

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file);
    }
  }

  // =========================================================
  // RESET FORM
  // =========================================================

  function resetForm() {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      brand: "",
      description: "",
      storage: "",
      ram: "",
      screenSize: "",
      operatingSystem: "",
      modelName: "",
      hardDiskSize: "",
      cpuModel: "",
      ramMemoryInstalledSize: "",
      color: "",
      earPlacement: "",
      formFactor: "",
      noiseControl: "",
      connectivity: "",
      connectionType: "",
      compatibility: "",
      resolution: "",
      refreshRate: "",
      panelType: "",
    });

    setSelectedImage(null);
    setEditingProductId(null);
  }

  // =========================================================
  // ADD PRODUCT BUTTON
  // =========================================================

  function handleAddProduct() {
    resetForm();
    setShowForm(true);
  }

  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  function handleEditProduct(product) {
    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock ?? "",
      brand: product.brand || "",
      description: product.description || "",
      storage: product.storage || "",
      ram: product.ram || "",
      screenSize: product.screenSize || "",
      operatingSystem:
        product.operatingSystem || "",
      modelName: product.modelName || "",
      hardDiskSize:
        product.hardDiskSize || "",
      cpuModel: product.cpuModel || "",
      ramMemoryInstalledSize:
        product.ramMemoryInstalledSize || "",
      color: product.color || "",
      earPlacement:
        product.earPlacement || "",
      formFactor:
        product.formFactor || "",
      noiseControl:
        product.noiseControl || "",
      connectivity:
        product.connectivity || "",
      connectionType:
        product.connectionType || "",
      compatibility:
        product.compatibility || "",
      resolution:
        product.resolution || "",
      refreshRate:
        product.refreshRate || "",
      panelType:
        product.panelType || "",
    });

    setSelectedImage(null);

    setEditingProductId(product.id);
    setShowForm(true);
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  async function handleDeleteProduct(productId) {
    const token = localStorage.getItem("token");

    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete product."
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== productId
        )
      );

      showNotification(
        "Product deleted successfully.",
        "success"
      );

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      showNotification(
        "Failed to delete product.",
        "error"
      );
    }
  }

  // =========================================================
  // SUBMIT FORM
  // =========================================================

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      showNotification(
        "Please login as admin.",
        "error"
      );
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {

      // ======================================================
      // EDIT EXISTING PRODUCT
      // ======================================================

      if (editingProductId) {

        const formDataToSend =
          new FormData();

        // Product details
        formDataToSend.append(
          "product",
          new Blob(
            [JSON.stringify(productData)],
            {
              type: "application/json",
            }
          )
        );

        // New image is optional while editing
        if (selectedImage) {

          formDataToSend.append(
            "image",
            selectedImage
          );
        }

        const response = await fetch(
          `http://localhost:8080/api/admin/products/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to update product."
          );
        }

        const savedProduct =
          await response.json();

        setProducts((currentProducts) =>
          currentProducts.map(
            (product) =>
              product.id === editingProductId
                ? savedProduct
                : product
          )
        );

        showNotification(
          "Product updated successfully.",
          "success"
        );

        resetForm();
        setShowForm(false);

        return;
      }

      // ======================================================
      // ADD NEW PRODUCT WITH IMAGE
      // ======================================================

      const formDataToSend =
        new FormData();

      // Product details
      formDataToSend.append(
        "product",
        new Blob(
          [JSON.stringify(productData)],
          {
            type: "application/json",
          }
        )
      );

      // Product image
      if (selectedImage) {

        formDataToSend.append(
          "image",
          selectedImage
        );

      } else {

        showNotification(
          "Please select a product image.",
          "error"
        );

        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/admin/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add product."
        );
      }

      const savedProduct =
        await response.json();

      setProducts((currentProducts) => [
        ...currentProducts,
        savedProduct,
      ]);

      showNotification(
        "Product added successfully.",
        "success"
      );

      resetForm();
      setShowForm(false);

    } catch (error) {

      console.error(
        "Save product error:",
        error
      );

      showNotification(
        error.message ||
          "Failed to save product.",
        "error"
      );
    }
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="admin-products-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-products-header">

        <div>

          <p className="section-label">
            ADMIN
          </p>

          <h1>
            Products
          </h1>

          <p>
            Manage products in your store.
          </p>

        </div>

        <button
          className="admin-add-product-button"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>

      </div>

      {/* =====================================================
          PRODUCT FORM
      ===================================================== */}

      {showForm && (

        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-header">

            <h2>
              {editingProductId
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              ✕
            </button>

          </div>

          <div className="admin-form-grid">

            {/* Product Name */}

            <div className="admin-form-group">

              <label>
                Product Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

            </div>

            {/* Price */}

            <div className="admin-form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />

            </div>

            {/* Stock */}

            <div className="admin-form-group">

              <label>
                Stock Quantity
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                required
                placeholder="Example: 10"
              />

            </div>

            {/* Category */}

            <div className="admin-form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Select Category
                </option>

                <option value="Mobile">
                  Mobile
                </option>

                <option value="Laptop">
                  Laptop
                </option>

                <option value="Audio">
                  Audio
                </option>

                <option value="Wearable">
                  Wearable
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Monitor">
                  Monitor
                </option>

              </select>

            </div>

            {/* Brand */}

            <div className="admin-form-group">

              <label>
                Brand
              </label>

              <input
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />

            </div>

            {/* Product Description */}

            <div className="admin-form-group admin-description-group">

              <label>
                Product Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description of the product"
                rows="5"
              />

            </div>

            {/* =================================================
                PRODUCT IMAGE
            ================================================= */}

            <div className="admin-form-group">

              <label>
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingProductId}
              />

              {selectedImage && (
                <small>
                  Selected:{" "}
                  {selectedImage.name}
                </small>
              )}

              {editingProductId && (
                <small>
                  Image upload for editing will be
                  added separately.
                </small>
              )}

            </div>

            {/* =================================================
                MOBILE FIELDS
            ================================================= */}

            {formData.category === "Mobile" && (
              <>

                <div className="admin-form-group">

                  <label>
                    Storage
                  </label>

                  <input
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                    placeholder="Example: 256 GB"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    RAM
                  </label>

                  <input
                    name="ram"
                    value={formData.ram}
                    onChange={handleInputChange}
                    placeholder="Example: 8 GB"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Screen Size
                  </label>

                  <input
                    name="screenSize"
                    value={formData.screenSize}
                    onChange={handleInputChange}
                    placeholder="Example: 6.5 inches"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Operating System
                  </label>

                  <input
                    name="operatingSystem"
                    value={
                      formData.operatingSystem
                    }
                    onChange={handleInputChange}
                    placeholder="Example: Android 14"
                  />

                </div>

              </>
            )}

            {/* =================================================
                LAPTOP FIELDS
            ================================================= */}

            {formData.category === "Laptop" && (
              <>

                <div className="admin-form-group">

                  <label>
                    Model Name
                  </label>

                  <input
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Hard Disk Size
                  </label>

                  <input
                    name="hardDiskSize"
                    value={
                      formData.hardDiskSize
                    }
                    onChange={handleInputChange}
                    placeholder="Example: 512 GB"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    CPU Model
                  </label>

                  <input
                    name="cpuModel"
                    value={formData.cpuModel}
                    onChange={handleInputChange}
                    placeholder="Example: Intel Core i5"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    RAM Installed
                  </label>

                  <input
                    name="ramMemoryInstalledSize"
                    value={
                      formData.ramMemoryInstalledSize
                    }
                    onChange={handleInputChange}
                    placeholder="Example: 16 GB"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Screen Size
                  </label>

                  <input
                    name="screenSize"
                    value={
                      formData.screenSize
                    }
                    onChange={handleInputChange}
                    placeholder="Example: 15.6 inches"
                  />

                </div>

              </>
            )}

            {/* =================================================
                AUDIO FIELDS
            ================================================= */}

            {formData.category === "Audio" && (
              <>

                <div className="admin-form-group">

                  <label>
                    Color
                  </label>

                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Ear Placement
                  </label>

                  <input
                    name="earPlacement"
                    value={
                      formData.earPlacement
                    }
                    onChange={handleInputChange}
                    placeholder="Example: Over Ear"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Form Factor
                  </label>

                  <input
                    name="formFactor"
                    value={
                      formData.formFactor
                    }
                    onChange={handleInputChange}
                    placeholder="Example: Portable Speaker"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Noise Control
                  </label>

                  <input
                    name="noiseControl"
                    value={
                      formData.noiseControl
                    }
                    onChange={handleInputChange}
                  />

                </div>

              </>
            )}

            {/* =================================================
                WEARABLE FIELDS
            ================================================= */}

            {formData.category === "Wearable" && (
              <>

                <div className="admin-form-group">

                  <label>
                    Storage
                  </label>

                  <input
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Screen Size
                  </label>

                  <input
                    name="screenSize"
                    value={
                      formData.screenSize
                    }
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Operating System
                  </label>

                  <input
                    name="operatingSystem"
                    value={
                      formData.operatingSystem
                    }
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Color
                  </label>

                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Connectivity
                  </label>

                  <input
                    name="connectivity"
                    value={
                      formData.connectivity
                    }
                    onChange={handleInputChange}
                    placeholder="Example: GPS"
                  />

                </div>

              </>
            )}

            {/* =================================================
                ACCESSORIES FIELDS
            ================================================= */}

            {formData.category === "Accessories" && (
              <>

                <div className="admin-form-group">

                  <label>
                    Model Name
                  </label>

                  <input
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Color
                  </label>

                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Connection Type
                  </label>

                  <input
                    name="connectionType"
                    value={
                      formData.connectionType
                    }
                    onChange={handleInputChange}
                    placeholder="Example: Wireless"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Compatibility
                  </label>

                  <input
                    name="compatibility"
                    value={
                      formData.compatibility
                    }
                    onChange={handleInputChange}
                  />

                </div>

              </>
            )}

            {/* =================================================
                MONITOR FIELDS
            ================================================= */}

            {formData.category === "Monitor" && (
              <>

                <div className="admin-form-group">

                  <label>
                    Model Name
                  </label>

                  <input
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Screen Size
                  </label>

                  <input
                    name="screenSize"
                    value={
                      formData.screenSize
                    }
                    onChange={handleInputChange}
                    placeholder="Example: 27 inches"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Resolution
                  </label>

                  <input
                    name="resolution"
                    value={
                      formData.resolution
                    }
                    onChange={handleInputChange}
                    placeholder="Example: 1920 x 1080"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Refresh Rate
                  </label>

                  <input
                    name="refreshRate"
                    value={
                      formData.refreshRate
                    }
                    onChange={handleInputChange}
                    placeholder="Example: 75 Hz"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Panel Type
                  </label>

                  <input
                    name="panelType"
                    value={
                      formData.panelType
                    }
                    onChange={handleInputChange}
                    placeholder="Example: IPS"
                  />

                </div>

              </>
            )}

          </div>

          {/* =================================================
              FORM ACTIONS
          ================================================= */}

          <div className="admin-form-actions">

            <button
              type="button"
              className="admin-cancel-button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-save-button"
            >
              {editingProductId
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>

        </form>
      )}

      {/* =====================================================
          PRODUCT LIST
      ===================================================== */}

      <div className="admin-products-grid">

        {products.map((product) => {

          // =================================================
          // DYNAMIC IMAGE FROM BACKEND
          // =================================================

          const imageUrl = product.imageUrl
            ? `http://localhost:8080${product.imageUrl}`
            : null;

          return (

            <div
              className="admin-product-card"
              key={product.id}
            >

              {/* Product Image */}

              <div className="admin-product-image">

                {imageUrl ? (

                  <img
                    src={imageUrl}
                    alt={product.name}
                  />

                ) : (

                  <span>
                    No Image
                  </span>

                )}

              </div>

              {/* Product Information */}

              <div className="admin-product-info">

                <span className="admin-product-category">
                  {product.category}
                </span>

                <h3>
                  {product.name}
                </h3>

                <p className="admin-product-brand">
                  {product.brand}
                </p>

                <strong>
                  ₹
                  {Number(
                    product.price
                  ).toLocaleString("en-IN")}
                </strong>

                <p className="admin-product-stock">
                  Stock:{" "}
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock}
                </p>

              </div>

              {/* Actions */}

              <div className="admin-product-actions">

                <button
                  className="admin-edit-button"
                  onClick={() =>
                    handleEditProduct(product)
                  }
                >
                  Edit
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() =>
                    handleDeleteProduct(
                      product.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default AdminProducts;