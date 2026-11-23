import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id,
    name: "",
    brand: "",
    desc: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    available: true,
  });

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        const data = response.data;

        setProduct({
          ...data,
          desc: data.desc || data.description || "",
        });

        if (data.imageName) {
          const imageResponse = await axios.get(`/product/${id}/image`, {
            responseType: "blob",
          });

          setImageUrl(URL.createObjectURL(imageResponse.data));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Clean up image preview URLs
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const formData = new FormData();
      const { imageDate, imageData, imageName, imageType, ...cleanProduct } =
        product;
      const productData = {
        ...cleanProduct,
        price: Number(product.price),
        stockQuantity: Number(product.stockQuantity),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
          type: "application/json",
        }),
      );

      if (image) {
        formData.append("imageFile", image);
      }

      await axios.put(`/product/${id}`, formData);

      alert("Product updated successfully");

      navigate(`/product/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="containers">
      {/* LEFT COLUMN: PRODUCT IMAGE */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          width: "50%",
        }}
      >
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName || product.name}
          style={{
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />

        <div style={{ width: "90%", maxWidth: "400px" }}>
          <label className="form-label " style={{ fontWeight: "bold" }}>
            Change Product Image
          </label>

          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: PRODUCT DETAILS FORM */}
      <div className="right-column">
        <form onSubmit={handleSubmit}>
          <div className="product-description">
            <span>{product.category}</span>

            <h1>Update Product</h1>

            {/* Product Name */}
            <label className="form-label fw-bold">Product Name</label>

            <input
              type="text"
              className="form-control mb-1"
              name="name"
              value={product.name || ""}
              onChange={handleChange}
              required
            />

            {/* Brand */}
            <label className="form-label fw-bold">Brand</label>

            <input
              type="text"
              className="form-control mb-2"
              name="brand"
              value={product.brand || ""}
              onChange={handleChange}
              required
            />

            {/* Category */}
            <label className="form-label fw-bold">Category</label>

            <input
              type="text"
              className="form-control"
              name="category"
              value={product.category || ""}
              onChange={handleChange}
              required
            />

            {/* Description */}
            <label className="form-label fw-bold">Description</label>

            <textarea
              className="form-control mb"
              name="desc"
              rows="4"
              value={product.desc || ""}
              onChange={handleChange}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* PRICE AND STOCK */}
          <div className="product-price">
            {/* Price */}
            <label className="form-label fw-bold">Price ($)</label>

            <input
              type="number"
              className="form-control "
              name="price"
              value={product.price ?? ""}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            {/* Stock */}
            <label className="form-label fw-bold">Stock Quantity</label>

            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              value={product.stockQuantity ?? ""}
              onChange={handleChange}
              min="0"
              required
            />

            {/* Release Date */}
            <label className="form-label fw-bold">Release Date</label>

            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={
                product.releaseDate ? product.releaseDate.split("T")[0] : ""
              }
              onChange={handleChange}
            />

            {/* Availability */}
            <div className="form-check form-switch mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                name="available"
                checked={!!product.available}
                onChange={handleChange}
              />

              <label className="form-check-label fw-bold">
                Product Available
              </label>
            </div>
          </div>

          {/* BUTTONS */}
          <div
            className="update-button"
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-success"
              type="submit"
              disabled={updating}
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate(`/product/${id}`)}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
