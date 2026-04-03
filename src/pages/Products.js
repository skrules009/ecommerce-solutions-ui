import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  filterProducts,
  searchProducts,
  clearFilters,
  setPage,
  selectAllCategories,
  selectPaginatedProducts,
} from '../redux/slices/productSlice';
import ProductCard from '../components/Products/ProductCard';
import '../styles/products.css';

function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const paginatedProducts = useSelector(selectPaginatedProducts);
  const categories = useSelector(selectAllCategories);
  const { filteredItems, pagination, filters, searchTerm } = useSelector((state) => state.products);

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [sortBy, setSortBy] = useState('default');
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || '',
    minPrice: filters.minPrice != null ? filters.minPrice : '',
    maxPrice: filters.maxPrice != null ? filters.maxPrice : '',
    minRating: filters.minRating != null ? filters.minRating : '',
    inStock: filters.inStock || false,
  });

  const debounceRef = useRef(null);

  // Apply category from URL query param on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const newFilters = { category: cat };
      setLocalFilters((prev) => ({ ...prev, category: cat }));
      dispatch(filterProducts(newFilters));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(searchProducts(localSearch));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch, dispatch]);

  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    const parsed = {
      ...(updated.category ? { category: updated.category } : {}),
      ...(updated.minPrice !== '' ? { minPrice: Number(updated.minPrice) } : {}),
      ...(updated.maxPrice !== '' ? { maxPrice: Number(updated.maxPrice) } : {}),
      ...(updated.minRating !== '' ? { minRating: Number(updated.minRating) } : {}),
      ...(updated.inStock ? { inStock: true } : {}),
    };
    dispatch(filterProducts(parsed));
    if (updated.category) {
      setSearchParams({ category: updated.category });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setLocalFilters({ category: '', minPrice: '', maxPrice: '', minRating: '', inStock: false });
    setLocalSearch('');
    setSortBy('default');
    setSearchParams({});
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side sorting of the paginated slice
  const sortedProducts = [...paginatedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = pagination.totalPages;
  const currentPage = pagination.currentPage;

  const hasActiveFilters =
    localFilters.category ||
    localFilters.minPrice !== '' ||
    localFilters.maxPrice !== '' ||
    localFilters.minRating !== '' ||
    localFilters.inStock ||
    localSearch;

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-page-header">
          <h1>Shop All Products</h1>
          <p>{filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search Bar */}
        <div className="products-search-bar">
          <input
            type="text"
            placeholder="Search products by name, description, or category…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            aria-label="Search products"
          />
          {localSearch && (
            <button onClick={() => { setLocalSearch(''); dispatch(searchProducts('')); }}>
              Clear
            </button>
          )}
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-panel" aria-label="Product filters">
            <div className="filters-panel-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="btn-clear-filters" onClick={handleClearFilters}>
                  Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div className="filter-group">
              <label htmlFor="filter-category">Category</label>
              <select
                id="filter-category"
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range ($)</label>
              <div className="filter-price-row">
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  value={localFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min={0}
                  value={localFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  aria-label="Maximum price"
                />
              </div>
            </div>

            {/* Min Rating */}
            <div className="filter-group">
              <label htmlFor="filter-rating">Min Rating</label>
              <select
                id="filter-rating"
                value={localFilters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4">4★ and up</option>
                <option value="3">3★ and up</option>
                <option value="2">2★ and up</option>
              </select>
            </div>

            {/* In Stock */}
            <div className="filter-group">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                In stock only
              </label>
            </div>
          </aside>

          {/* Products Main */}
          <main className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <span className="products-count">
                Showing {Math.min((currentPage - 1) * pagination.pageSize + 1, filteredItems.length)}–
                {Math.min(currentPage * pagination.pageSize, filteredItems.length)} of {filteredItems.length}
              </span>
              <select
                className="products-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>

            {/* Grid */}
            {sortedProducts.length === 0 ? (
              <div className="products-empty">
                <h3>No products found</h3>
                <p>Try adjusting your search or filters.</p>
                <button onClick={handleClearFilters} style={{ marginTop: '12px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="products-pagination" role="navigation" aria-label="Page navigation">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn${page === currentPage ? ' active' : ''}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;
