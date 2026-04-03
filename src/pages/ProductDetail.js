import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedProduct,
  getRelatedProducts,
  getProductReviews,
  selectProductById,
  selectSelectedProduct,
  selectProductReviews,
} from '../redux/slices/productSlice';
import Breadcrumb from '../components/Common/Breadcrumb';
import ImageGallery from '../components/Products/ImageGallery';
import ProductInfoPanel from '../components/Products/ProductInfoPanel';
import VariantsSelector from '../components/Products/VariantsSelector';
import AddToCartSection from '../components/Products/AddToCartSection';
import ProductActionsBar from '../components/Products/ProductActionsBar';
import ProductDescription from '../components/Products/ProductDescription';
import ShippingInfo from '../components/Products/ShippingInfo';
import ProductRating from '../components/Products/ProductRating';
import ReviewsSection from '../components/Products/ReviewsSection';
import RelatedProducts from '../components/Products/RelatedProducts';
import '../styles/productDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => selectProductById(state, id));
  const selectedProduct = useSelector(selectSelectedProduct);
  const reviews = useSelector(selectProductReviews);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Load product data into Redux state
  useEffect(() => {
    if (product) {
      dispatch(setSelectedProduct(product));
      dispatch(getRelatedProducts(product.id));
      dispatch(getProductReviews(product.id));
    }
  }, [dispatch, product]);

  // Set default variant selections
  useEffect(() => {
    if (product) {
      const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
      const colors = product.variants?.colors || product.color || [];
      if (sizes.length > 0 && !selectedSize) setSelectedSize(String(sizes[0]));
      if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
    }
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  // Product not found
  if (!product && !selectedProduct) {
    return (
      <div className="product-detail-page">
        <div className="container not-found-page">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentProduct = product || selectedProduct;

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    ...(currentProduct.category ? [{ label: currentProduct.category }] : []),
    ...(currentProduct.subcategory ? [{ label: currentProduct.subcategory }] : []),
    { label: currentProduct.name },
  ];

  const productImages = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : [currentProduct.image];

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container">
        {/* Main Product Grid */}
        <div className="product-main-grid">
          {/* Left: Image Gallery */}
          <ImageGallery
            images={productImages}
            productName={currentProduct.name}
          />

          {/* Right: Product Info */}
          <div className="product-right-col">
            <ProductInfoPanel product={currentProduct} />
            <VariantsSelector
              product={currentProduct}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />
            <AddToCartSection
              product={currentProduct}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
            />
            <ProductActionsBar product={currentProduct} />
          </div>
        </div>

        {/* Product Description */}
        <ProductDescription product={currentProduct} />

        {/* Shipping & Returns */}
        <ShippingInfo product={currentProduct} />

        {/* Ratings Overview */}
        <ProductRating product={{ ...currentProduct, reviews }} />

        {/* Customer Reviews */}
        <ReviewsSection reviews={reviews} />

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </div>
  );
}

export default ProductDetail;
