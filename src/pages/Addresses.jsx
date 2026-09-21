import { useEffect, useState } from "react";

function Addresses({ showNotification }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const token = localStorage.getItem("token");

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);

      if (showNotification) {
        showNotification("Failed to load addresses");
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // Add / Update address
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `http://localhost:8080/api/addresses/${editingId}`
        : "http://localhost:8080/api/addresses";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      if (showNotification) {
        showNotification(
          editingId
            ? "Address updated successfully"
            : "Address added successfully"
        );
      }

      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);

      if (showNotification) {
        showNotification("Failed to save address");
      }
    }
  };

  // Edit address
  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });

    setEditingId(address.id);
    setShowForm(true);
  };

  // Delete address
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      if (showNotification) {
        showNotification("Address deleted successfully");
      }

      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);

      if (showNotification) {
        showNotification("Failed to delete address");
      }
    }
  };

  // Set default address
  const handleSetDefault = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/addresses/${id}/default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      if (showNotification) {
        showNotification("Default address updated");
      }

      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);

      if (showNotification) {
        showNotification("Failed to update default address");
      }
    }
  };

  return (
    <div className="addresses-page">

      <div className="addresses-container">

        <div className="addresses-header">
          <div>
            <p className="addresses-label">ACCOUNT</p>
            <h1>My Addresses</h1>
            <p>
              Manage your delivery addresses
            </p>
          </div>

          {!showForm && (
            <button
              className="add-address-button"
              onClick={() => setShowForm(true)}
            >
              + Add New Address
            </button>
          )}
        </div>

        {showForm && (
          <div className="address-form-card">

            <h2>
              {editingId
                ? "Edit Address"
                : "Add New Address"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="address-form-grid">

                <div className="address-form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="address-form-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="address-form-group address-full-width">
                  <label>Address</label>

                  <textarea
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="address-form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="address-form-group">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="address-form-group">
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <label className="default-address-checkbox">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />

                <span>Set as default address</span>
              </label>

              <div className="address-form-actions">

                <button
                  type="button"
                  className="cancel-address-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-address-button"
                >
                  {editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>

              </div>

            </form>
          </div>
        )}

        <div className="addresses-list">

          {addresses.length === 0 && !showForm ? (
            <div className="no-addresses">
              <div className="no-addresses-icon">⌂</div>

              <h2>No saved addresses</h2>

              <p>
                Add an address to make checkout faster.
              </p>

              <button
                className="add-address-button"
                onClick={() => setShowForm(true)}
              >
                + Add Your First Address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                className={`address-card ${
                  address.isDefault
                    ? "default-address"
                    : ""
                }`}
                key={address.id}
              >

                <div className="address-card-header">

                  <div>
                    <h3>{address.fullName}</h3>

                    {address.isDefault && (
                      <span className="default-badge">
                        Default
                      </span>
                    )}
                  </div>

                  <span className="address-phone">
                    {address.phone}
                  </span>

                </div>

                <div className="address-card-body">

                  <p>{address.addressLine}</p>

                  <p>
                    {address.city}, {address.state} -{" "}
                    {address.pincode}
                  </p>

                </div>

                <div className="address-card-actions">

                  <button
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(address.id)
                    }
                  >
                    Delete
                  </button>

                  {!address.isDefault && (
                    <button
                      onClick={() =>
                        handleSetDefault(address.id)
                      }
                    >
                      Set as Default
                    </button>
                  )}

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Addresses;