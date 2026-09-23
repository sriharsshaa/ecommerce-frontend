import { useEffect, useState } from "react";

function AdminProducts({ showNotification }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  // =========================================================
  // EMPTY FORM
  // =========================================================

  const emptyFormData = {
    // COMMON
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    stock: "",

    // GENERAL
    productType: "",
    modelName: "",
    color: "",
    size: "",
    material: "",
    capacity: "",

    // ELECTRONICS
    storage: "",
    ram: "",
    screenSize: "",
    operatingSystem: "",
    cpuModel: "",
    hardDiskSize: "",
    ramMemoryInstalledSize: "",
    resolution: "",
    refreshRate: "",
    panelType: "",
    connectivity: "",
    connectionType: "",
    noiseControl: "",
    earPlacement: "",
    formFactor: "",
    compatibility: "",

    // FASHION
    fit: "",
    pattern: "",
    occasion: "",

    // TOYS
    ageGroup: "",
    batteryRequired: "",

    // BOOKS
    author: "",
    publisher: "",
    isbn: "",
    language: "",
    edition: "",
    format: "",
    pages: "",

    // HEALTH & HOUSEHOLD
    packSize: "",
    usage: "",
  };

  const [formData, setFormData] =
    useState(emptyFormData);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, []);

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
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
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
        error.message ||
          "Failed to fetch products.",
        "error"
      );
    }
  }

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  function handleInputChange(event) {
    const { name, value } = event.target;

    // -------------------------------------------------------
    // CATEGORY CHANGE
    // Clear category-specific values.
    // -------------------------------------------------------

    if (name === "category") {
      setFormData((current) => ({
        ...current,

        category: value,

        productType: "",
        modelName: "",
        color: "",
        size: "",
        material: "",
        capacity: "",

        storage: "",
        ram: "",
        screenSize: "",
        operatingSystem: "",
        cpuModel: "",
        hardDiskSize: "",
        ramMemoryInstalledSize: "",
        resolution: "",
        refreshRate: "",
        panelType: "",
        connectivity: "",
        connectionType: "",
        noiseControl: "",
        earPlacement: "",
        formFactor: "",
        compatibility: "",

        fit: "",
        pattern: "",
        occasion: "",

        ageGroup: "",
        batteryRequired: "",

        author: "",
        publisher: "",
        isbn: "",
        language: "",
        edition: "",
        format: "",
        pages: "",

        packSize: "",
        usage: "",
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // =========================================================
  // IMAGE
  // =========================================================

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file);
    }
  }

  // =========================================================
  // RESET
  // =========================================================

  function resetForm() {
    setFormData({
      ...emptyFormData,
    });

    setSelectedImage(null);
    setEditingProductId(null);
  }

  // =========================================================
  // ADD PRODUCT
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
      price: product.price ?? "",
      category: product.category || "",
      brand: product.brand || "",
      description: product.description || "",
      stock: product.stock ?? "",

      productType:
        product.productType || "",
      modelName:
        product.modelName || "",
      color: product.color || "",
      size: product.size || "",
      material:
        product.material || "",
      capacity:
        product.capacity || "",

      storage:
        product.storage || "",
      ram: product.ram || "",
      screenSize:
        product.screenSize || "",
      operatingSystem:
        product.operatingSystem || "",
      cpuModel:
        product.cpuModel || "",
      hardDiskSize:
        product.hardDiskSize || "",
      ramMemoryInstalledSize:
        product.ramMemoryInstalledSize || "",
      resolution:
        product.resolution || "",
      refreshRate:
        product.refreshRate || "",
      panelType:
        product.panelType || "",
      connectivity:
        product.connectivity || "",
      connectionType:
        product.connectionType || "",
      noiseControl:
        product.noiseControl || "",
      earPlacement:
        product.earPlacement || "",
      formFactor:
        product.formFactor || "",
      compatibility:
        product.compatibility || "",

      fit: product.fit || "",
      pattern:
        product.pattern || "",
      occasion:
        product.occasion || "",

      ageGroup:
        product.ageGroup || "",
      batteryRequired:
        product.batteryRequired || "",

      author:
        product.author || "",
      publisher:
        product.publisher || "",
      isbn:
        product.isbn || "",
      language:
        product.language || "",
      edition:
        product.edition || "",
      format:
        product.format || "",
      pages: product.pages ?? "",

      packSize:
        product.packSize || "",
      usage:
        product.usage || "",
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

    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

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
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
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
        error.message ||
          "Failed to delete product.",
        "error"
      );
    }
  }

  // =========================================================
  // SUBMIT
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

    if (!formData.category) {
      showNotification(
        "Please select a category.",
        "error"
      );
      return;
    }

    if (!formData.productType) {
      showNotification(
        "Please select a product type.",
        "error"
      );
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      pages: formData.pages
        ? Number(formData.pages)
        : null,
    };

    try {
      // =====================================================
      // UPDATE PRODUCT
      // =====================================================

      if (editingProductId) {
        const formDataToSend =
          new FormData();

        formDataToSend.append(
          "product",
          new Blob(
            [JSON.stringify(productData)],
            {
              type: "application/json",
            }
          )
        );

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
          const errorText =
            await response.text();

          throw new Error(
            errorText ||
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

      // =====================================================
      // ADD PRODUCT
      // =====================================================

      if (!selectedImage) {
        showNotification(
          "Please select a product image.",
          "error"
        );
        return;
      }

      const formDataToSend =
        new FormData();

      formDataToSend.append(
        "product",
        new Blob(
          [JSON.stringify(productData)],
          {
            type: "application/json",
          }
        )
      );

      formDataToSend.append(
        "image",
        selectedImage
      );

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
        const errorText =
          await response.text();

        console.error(
          "Backend add product error:",
          errorText
        );

        throw new Error(
          errorText ||
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
  // CATEGORY DETAILS
  // =========================================================

  function renderCategoryFields() {

    // =======================================================
    // ELECTRONICS
    // =======================================================

    if (
      formData.category ===
      "Electronics"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>
              Electronics Details
            </h3>

            <p>
              Select the product type and
              enter its relevant
              specifications.
            </p>
          </div>

          {/* PRODUCT TYPE */}

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
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

              <option value="Monitor">
                Monitor
              </option>

              <option value="Tablet">
                Tablet
              </option>

              <option value="Smart TV">
                Smart TV
              </option>

              <option value="Camera">
                Camera
              </option>

              <option value="Keyboard">
                Keyboard
              </option>

              <option value="Mouse">
                Mouse
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* MODEL NAME */}

          <div className="admin-form-group">
            <label>
              Model Name
            </label>

            <input
              name="modelName"
              value={formData.modelName}
              onChange={handleInputChange}
              placeholder="Example: Galaxy S25"
            />
          </div>

          {/* COLOR */}

          <div className="admin-form-group">
            <label>
              Color
            </label>

            <input
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Example: Black"
            />
          </div>

          {/* SCREEN SIZE */}

          {[
            "Mobile",
            "Tablet",
            "Laptop",
            "Smart TV",
            "Camera",
            "Wearable",
            "Monitor",
          ].includes(
            formData.productType
          ) && (
            <div className="admin-form-group">
              <label>
                Screen Size
              </label>

              <input
                name="screenSize"
                value={formData.screenSize}
                onChange={handleInputChange}
                placeholder="Example: 6.2 inches"
              />
            </div>
          )}

          {/* STORAGE */}

          {[
            "Mobile",
            "Tablet",
            "Laptop",
            "Wearable",
          ].includes(
            formData.productType
          ) && (
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
          )}

          {/* RAM */}

          {[
            "Mobile",
            "Tablet",
            "Laptop",
          ].includes(
            formData.productType
          ) && (
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
          )}

          {/* OPERATING SYSTEM */}

          {[
            "Mobile",
            "Tablet",
            "Laptop",
            "Smart TV",
            "Wearable",
          ].includes(
            formData.productType
          ) && (
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
                placeholder="Example: Android / Windows"
              />
            </div>
          )}

          {/* LAPTOP */}

          {formData.productType ===
            "Laptop" && (
            <>
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
                  Hard Disk / SSD
                </label>

                <input
                  name="hardDiskSize"
                  value={
                    formData.hardDiskSize
                  }
                  onChange={handleInputChange}
                  placeholder="Example: 1 TB SSD"
                />
              </div>
            </>
          )}

          {/* MONITOR / SMART TV */}

          {[
            "Monitor",
            "Smart TV",
          ].includes(
            formData.productType
          ) && (
            <>
              <div className="admin-form-group">
                <label>
                  Resolution
                </label>

                <input
                  name="resolution"
                  value={formData.resolution}
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
                  placeholder="Example: 120 Hz"
                />
              </div>
            </>
          )}

          {/* MONITOR PANEL */}

          {formData.productType ===
            "Monitor" && (
            <div className="admin-form-group">
              <label>
                Panel Type
              </label>

              <input
                name="panelType"
                value={formData.panelType}
                onChange={handleInputChange}
                placeholder="Example: IPS"
              />
            </div>
          )}

          {/* CONNECTIVITY */}

          {[
            "Audio",
            "Wearable",
            "Monitor",
            "Smart TV",
            "Camera",
            "Keyboard",
            "Mouse",
          ].includes(
            formData.productType
          ) && (
            <div className="admin-form-group">
              <label>
                Connectivity
              </label>

              <input
                name="connectivity"
                value={formData.connectivity}
                onChange={handleInputChange}
                placeholder="Example: Bluetooth / Wi-Fi"
              />
            </div>
          )}

          {/* AUDIO */}

          {formData.productType ===
            "Audio" && (
            <>
              <div className="admin-form-group">
                <label>
                  Form Factor
                </label>

                <input
                  name="formFactor"
                  value={formData.formFactor}
                  onChange={handleInputChange}
                  placeholder="Example: Headphones / Earbuds / Speaker"
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
                  placeholder="Example: In Ear / On Ear / Over Ear"
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
                  placeholder="Example: Active Noise Cancellation"
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
                  placeholder="Example: Wireless / Wired"
                />
              </div>
            </>
          )}

          {/* KEYBOARD */}

          {formData.productType ===
            "Keyboard" && (
            <>
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
                  placeholder="Example: Wireless / Bluetooth / USB"
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
                  placeholder="Example: Windows, macOS"
                />
              </div>
            </>
          )}

          {/* MOUSE */}

          {formData.productType ===
            "Mouse" && (
            <>
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
                  placeholder="Example: Wireless / Bluetooth / USB"
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
                  placeholder="Example: Windows, macOS"
                />
              </div>
            </>
          )}

          {/* OTHER ELECTRONICS */}

          {formData.productType ===
            "Other" && (
            <>
              <div className="admin-form-group">
                <label>
                  Connectivity
                </label>

                <input
                  name="connectivity"
                  value={formData.connectivity}
                  onChange={handleInputChange}
                  placeholder="Example: Bluetooth / Wi-Fi / USB"
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
        </>
      );
    }

    // =======================================================
    // HOME & KITCHEN
    // =======================================================

    if (
      formData.category ===
      "Home & Kitchen"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>
              Home &amp; Kitchen Details
            </h3>

            <p>
              Enter specifications relevant
              to the household product.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
              </option>

              <option value="Refrigerator">
                Refrigerator
              </option>

              <option value="Microwave Oven">
                Microwave Oven
              </option>

              <option value="Mixer Grinder">
                Mixer Grinder
              </option>

              <option value="Electric Kettle">
                Electric Kettle
              </option>

              <option value="Cookware">
                Cookware
              </option>

              <option value="Furniture">
                Furniture
              </option>

              <option value="Vacuum Cleaner">
                Vacuum Cleaner
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

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
              Capacity
            </label>

            <input
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Example: 180 L / 1.5 L"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Material
            </label>

            <input
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Example: Stainless Steel"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Size
            </label>

            <input
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Example: Medium"
            />
          </div>
        </>
      );
    }

    // =======================================================
    // LUGGAGE
    // =======================================================

    if (
      formData.category ===
      "Luggage"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>Luggage Details</h3>

            <p>
              Add luggage size, capacity
              and material information.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
              </option>

              <option value="Trolley Bag">
                Trolley Bag
              </option>

              <option value="Suitcase">
                Suitcase
              </option>

              <option value="Travel Backpack">
                Travel Backpack
              </option>

              <option value="Laptop Bag">
                Laptop Bag
              </option>

              <option value="Duffel Bag">
                Duffel Bag
              </option>

              <option value="Cabin Bag">
                Cabin Bag
              </option>

              <option value="Travel Organizer">
                Travel Organizer
              </option>
            </select>
          </div>

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
              Size
            </label>

            <input
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Example: Cabin / Medium / Large"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Capacity
            </label>

            <input
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Example: 55 L"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Material
            </label>

            <input
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Example: Polycarbonate"
            />
          </div>
        </>
      );
    }

    // =======================================================
    // MEN'S FASHION
    // =======================================================

    if (
      formData.category ===
      "Men's Fashion"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>
              Men&apos;s Fashion Details
            </h3>

            <p>
              Enter clothing or
              fashion-specific information.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
              </option>

              <option value="T-Shirt">
                T-Shirt
              </option>

              <option value="Shirt">
                Shirt
              </option>

              <option value="Jeans">
                Jeans
              </option>

              <option value="Trousers">
                Trousers
              </option>

              <option value="Jacket">
                Jacket
              </option>

              <option value="Hoodie">
                Hoodie
              </option>

              <option value="Formal Shoes">
                Formal Shoes
              </option>

              <option value="Sneakers">
                Sneakers
              </option>

              <option value="Wallet">
                Wallet
              </option>

              <option value="Belt">
                Belt
              </option>
            </select>
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
              Size
            </label>

            <input
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Example: S / M / L / XL"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Material
            </label>

            <input
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Example: Cotton"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Fit
            </label>

            <input
              name="fit"
              value={formData.fit}
              onChange={handleInputChange}
              placeholder="Example: Regular Fit"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Pattern
            </label>

            <input
              name="pattern"
              value={formData.pattern}
              onChange={handleInputChange}
              placeholder="Example: Solid"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Occasion
            </label>

            <input
              name="occasion"
              value={formData.occasion}
              onChange={handleInputChange}
              placeholder="Example: Casual"
            />
          </div>
        </>
      );
    }

    // =======================================================
    // WOMEN'S FASHION
    // =======================================================

    if (
      formData.category ===
      "Women's Fashion"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>
              Women&apos;s Fashion Details
            </h3>

            <p>
              Enter clothing and
              fashion-specific information.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
              </option>

              <option value="Saree">
                Saree
              </option>

              <option value="Kurti">
                Kurti
              </option>

              <option value="Dress">
                Dress
              </option>

              <option value="Top">
                Top
              </option>

              <option value="Jeans">
                Jeans
              </option>

              <option value="Handbag">
                Handbag
              </option>

              <option value="Sandals">
                Sandals
              </option>

              <option value="Heels">
                Heels
              </option>

              <option value="Scarf">
                Scarf
              </option>

              <option value="Women's Watch">
                Women&apos;s Watch
              </option>
            </select>
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
              Size
            </label>

            <input
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Example: S / M / L / XL"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Material
            </label>

            <input
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Example: Cotton"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Fit
            </label>

            <input
              name="fit"
              value={formData.fit}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label>
              Pattern
            </label>

            <input
              name="pattern"
              value={formData.pattern}
              onChange={handleInputChange}
              placeholder="Example: Floral"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Occasion
            </label>

            <input
              name="occasion"
              value={formData.occasion}
              onChange={handleInputChange}
              placeholder="Example: Casual / Party"
            />
          </div>
        </>
      );
    }

    // =======================================================
    // TOYS
    // =======================================================

    if (
      formData.category ===
      "Toys"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>Toy Details</h3>

            <p>
              Enter toy-specific information.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
              </option>

              <option value="Remote Control Car">
                Remote Control Car
              </option>

              <option value="Building Blocks">
                Building Blocks
              </option>

              <option value="Teddy Bear">
                Teddy Bear
              </option>

              <option value="Doll">
                Doll
              </option>

              <option value="Toy Train">
                Toy Train
              </option>

              <option value="Puzzle">
                Puzzle
              </option>

              <option value="Action Figure">
                Action Figure
              </option>

              <option value="Board Game">
                Board Game
              </option>
            </select>
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
              Age Group
            </label>

            <input
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleInputChange}
              placeholder="Example: 6+ Years"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Material
            </label>

            <input
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Example: Plastic"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Battery Required
            </label>

            <select
              name="batteryRequired"
              value={
                formData.batteryRequired
              }
              onChange={handleInputChange}
            >
              <option value="">
                Select
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>
            </select>
          </div>
        </>
      );
    }

    // =======================================================
    // BOOKS
    // =======================================================

    if (
      formData.category ===
      "Books"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>Book Details</h3>

            <p>
              Enter publication and
              book-specific information.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Book Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Book Type
              </option>

              <option value="Fiction">
                Fiction
              </option>

              <option value="Programming">
                Programming
              </option>

              <option value="DSA">
                DSA
              </option>

              <option value="Python">
                Python
              </option>

              <option value="Self-Help">
                Self-Help
              </option>

              <option value="Competitive Exam">
                Competitive Exam
              </option>

              <option value="Children's">
                Children&apos;s
              </option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>
              Author
            </label>

            <input
              name="author"
              value={formData.author}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label>
              Publisher
            </label>

            <input
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label>
              ISBN
            </label>

            <input
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label>
              Language
            </label>

            <input
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              placeholder="Example: English"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Edition
            </label>

            <input
              name="edition"
              value={formData.edition}
              onChange={handleInputChange}
              placeholder="Example: 3rd Edition"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Format
            </label>

            <select
              name="format"
              value={formData.format}
              onChange={handleInputChange}
            >
              <option value="">
                Select Format
              </option>

              <option value="Paperback">
                Paperback
              </option>

              <option value="Hardcover">
                Hardcover
              </option>

              <option value="eBook">
                eBook
              </option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>
              Pages
            </label>

            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
              min="1"
            />
          </div>
        </>
      );
    }

    // =======================================================
    // HEALTH & HOUSEHOLD
    // =======================================================

    if (
      formData.category ===
      "Health & Household"
    ) {
      return (
        <>
          <div className="admin-category-heading">
            <h3>
              Health &amp; Household Details
            </h3>

            <p>
              Enter relevant household or
              daily-use product information.
            </p>
          </div>

          <div className="admin-form-group">
            <label>
              Product Type
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select Product Type
              </option>

              <option value="First Aid Kit">
                First Aid Kit
              </option>

              <option value="Digital Thermometer">
                Digital Thermometer
              </option>

              <option value="Hand Wash">
                Hand Wash
              </option>

              <option value="Sanitizer">
                Sanitizer
              </option>

              <option value="Water Bottle">
                Water Bottle
              </option>

              <option value="Cleaning Supplies">
                Cleaning Supplies
              </option>

              <option value="Air Freshener">
                Air Freshener
              </option>

              <option value="Dustbin">
                Dustbin
              </option>

              <option value="Other">
                Other
              </option>
            </select>
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
              Material
            </label>

            <input
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Example: Stainless Steel"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Capacity / Size
            </label>

            <input
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Example: 1 L"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Pack Size
            </label>

            <input
              name="packSize"
              value={formData.packSize}
              onChange={handleInputChange}
              placeholder="Example: Pack of 2"
            />
          </div>

          <div className="admin-form-group">
            <label>
              Usage
            </label>

            <input
              name="usage"
              value={formData.usage}
              onChange={handleInputChange}
              placeholder="Example: Drinking Water"
            />
          </div>
        </>
      );
    }

    return null;
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

          <h1>Products</h1>

          <p>
            Manage products in your store.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-product-button"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (
        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >

          {/* FORM HEADER */}

          <div className="admin-form-header">

            <div>
              <p className="section-label">
                PRODUCT
              </p>

              <h2>
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              aria-label="Close form"
            >
              ✕
            </button>

          </div>

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="admin-form-section">

            <div className="admin-form-section-heading">

              <h3>
                Basic Information
              </h3>

              <p>
                Enter the general product
                details.
              </p>

            </div>

            <div className="admin-form-grid">

              {/* PRODUCT NAME */}

              <div className="admin-form-group">

                <label>
                  Product Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Example: Samsung Galaxy S25"
                />

              </div>

              {/* PRICE */}

              <div className="admin-form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                  placeholder="Example: 65000"
                />

              </div>

              {/* STOCK */}

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

              {/* CATEGORY */}

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

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Home & Kitchen">
                    Home &amp; Kitchen
                  </option>

                  <option value="Luggage">
                    Luggage
                  </option>

                  <option value="Men's Fashion">
                    Men&apos;s Fashion
                  </option>

                  <option value="Women's Fashion">
                    Women&apos;s Fashion
                  </option>

                  <option value="Toys">
                    Toys
                  </option>

                  <option value="Books">
                    Books
                  </option>

                  <option value="Health & Household">
                    Health &amp; Household
                  </option>
                </select>

              </div>

              {/* BRAND */}

              <div className="admin-form-group">

                <label>
                  Brand
                </label>

                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Example: Samsung"
                />

              </div>

              {/* IMAGE */}

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
                    Leave empty to keep the
                    current image.
                  </small>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className="admin-form-group admin-description-group">

                <label>
                  Product Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Describe the product, its key features and benefits."
                />

              </div>

            </div>

          </div>

          {/* =================================================
              CATEGORY DETAILS
          ================================================= */}

          {formData.category && (
            <div className="admin-form-section">

              <div className="admin-form-section-heading">

                <h3>
                  Category Details
                </h3>

                <p>
                  Only fields relevant to{" "}
                  <strong>
                    {formData.category}
                  </strong>{" "}
                  are shown.
                </p>

              </div>

              <div className="admin-form-grid">

                {renderCategoryFields()}

              </div>

            </div>
          )}

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

          const imageUrl = product.imageUrl
            ? `http://localhost:8080${product.imageUrl}`
            : null;

          return (
            <div
              className="admin-product-card"
              key={product.id}
            >

              {/* IMAGE */}

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

              {/* INFO */}

              <div className="admin-product-info">

                <span className="admin-product-category">
                  {product.category}
                </span>

                <h3>
                  {product.name}
                </h3>

                {product.brand && (
                  <p className="admin-product-brand">
                    {product.brand}
                  </p>
                )}

                <strong>
                  ₹
                  {Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}
                </strong>

                <p className="admin-product-stock">
                  Stock:{" "}
                  {Number(product.stock || 0) ===
                  0
                    ? "Out of Stock"
                    : product.stock}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="admin-product-actions">

                <button
                  type="button"
                  className="admin-edit-button"
                  onClick={() =>
                    handleEditProduct(product)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
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