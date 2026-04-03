import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRelatedProducts,
  getProductReviews,
  selectProductById,
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
  const reviews = useSelector(selectProductReviews);
  const loading = useSelector((state) => state.products.loading);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Load related products and reviews when product changes
  useEffect(() => {
    if (product) {
      dispatch(getRelatedProducts(product.id));
      dispatch(getProductReviews(product.id));
    }
  }, [dispatch, product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set default variant selections when the product ID changes (e.g. navigating
  // from one product page to another via Related Products).
  useEffect(() => {
    if (product) {
      const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
      const colors = product.variants?.colors || product.color || [];
      setSelectedSize(sizes.length > 0 ? String(sizes[0]) : '');
      setSelectedColor(colors.length > 0 ? colors[0] : '');
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading product…</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
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

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    ...(product.category ? [{ label: product.category, path: `/?category=${encodeURIComponent(product.category)}` }] : []),
    ...(product.subcategory ? [{ label: product.subcategory }] : []),
    { label: product.name },
  ];

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

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
            productName={product.name}
          />

          {/* Right: Product Info */}
          <div className="product-right-col">
            <ProductInfoPanel product={product} />
            <VariantsSelector
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />
            <AddToCartSection
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
            />
            <ProductActionsBar product={product} />
          </div>
        </div>

        {/* Product Description */}
        <ProductDescription product={product} />

        {/* Shipping & Returns */}
        <ShippingInfo product={product} />

        {/* Ratings Overview */}
        <ProductRating product={{ ...product, reviews }} />

        {/* Customer Reviews */}
        <ReviewsSection reviews={reviews} />

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </div>
  );
}

export default ProductDetail;
