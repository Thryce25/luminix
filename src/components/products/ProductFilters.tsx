'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface ProductFiltersProps {
  collections: FilterOption[];
  productTypes: FilterOption[];
  priceRanges?: FilterOption[];
}

const defaultPriceRanges: FilterOption[] = [
  { label: 'Under Rs.500', value: '0-500' },
  { label: 'Rs.500 - Rs.800', value: '500-800' },
  { label: 'Rs.800 - Rs.1,000', value: '800-1000' },
  { label: 'Over Rs.1,000', value: '1000-above' },
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'A-Z', value: 'title-asc' },
];

export default function ProductFilters({
  collections,
  productTypes,
  priceRanges = defaultPriceRanges,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const currentSort = searchParams.get('sort') || 'newest';
  const currentCategory = searchParams.get('category') || searchParams.get('collection') || '';
  const currentType = searchParams.get('type') || '';
  const currentPrice = searchParams.get('price') || '';
  const currentInStock = searchParams.get('instock') === 'true';

  // Update URL with filters
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear both 'category' and 'collection' when updating category filter
    if (key === 'category') {
      params.delete('collection');
    }
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Clear all filters
  const clearFilters = () => {
    router.push('/products', { scroll: false });
  };

  const hasActiveFilters = currentCategory || currentType || currentPrice || currentInStock;

  // Prevent body scroll when mobile filters open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileFiltersOpen]);

  return (
    <>
      {/* Top Bar - Sort & Mobile Filter Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs sm:text-sm text-burnt-lilac hover:text-mist-lilac transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-deep-purple/30 border border-mist-lilac/20 rounded-lg text-mist-lilac text-sm hover:border-burnt-lilac/50 transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-burnt-lilac text-white text-xs rounded-full flex items-center justify-center">
                {[currentCategory, currentType, currentPrice, currentInStock].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentSort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="w-full sm:w-auto appearance-none px-4 py-2.5 pr-10 bg-deep-purple/30 border border-mist-lilac/20 rounded-lg text-mist-lilac text-sm hover:border-burnt-lilac/50 focus:border-burnt-lilac focus:outline-none cursor-pointer transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-black">
                  {option.label}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-lilac/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-8">
        {/* Categories */}
        {collections.length > 0 && (
          <FilterSection title="Category">
            {collections.map((collection) => (
              <FilterCheckbox
                key={collection.value}
                label={collection.label}
                checked={currentCategory === collection.value}
                onChange={() => updateFilters('category', currentCategory === collection.value ? '' : collection.value)}
              />
            ))}
          </FilterSection>
        )}

        {/* Product Types */}
        {productTypes.length > 0 && (
          <FilterSection title="Product Type">
            {productTypes.map((type) => (
              <FilterCheckbox
                key={type.value}
                label={type.label}
                checked={currentType === type.value}
                onChange={() => updateFilters('type', currentType === type.value ? '' : type.value)}
              />
            ))}
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price">
          {priceRanges.map((range) => (
            <FilterCheckbox
              key={range.value}
              label={range.label}
              checked={currentPrice === range.value}
              onChange={() => updateFilters('price', currentPrice === range.value ? '' : range.value)}
            />
          ))}
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <FilterCheckbox
            label="In Stock Only"
            checked={currentInStock}
            onChange={() => updateFilters('instock', currentInStock ? '' : 'true')}
          />
        </FilterSection>
      </aside>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-black border-l border-deep-purple/30 flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-deep-purple/30">
              <h2 className="text-lg font-serif text-mist-lilac">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-mist-lilac hover:text-burnt-lilac transition-colors touch-manipulation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Categories */}
              {collections.length > 0 && (
                <FilterSection title="Category" mobile>
                  {collections.map((collection) => (
                    <FilterCheckbox
                      key={collection.value}
                      label={collection.label}
                      checked={currentCategory === collection.value}
                      onChange={() => updateFilters('category', currentCategory === collection.value ? '' : collection.value)}
                    />
                  ))}
                </FilterSection>
              )}

              {/* Product Types */}
              {productTypes.length > 0 && (
                <FilterSection title="Product Type" mobile>
                  {productTypes.map((type) => (
                    <FilterCheckbox
                      key={type.value}
                      label={type.label}
                      checked={currentType === type.value}
                      onChange={() => updateFilters('type', currentType === type.value ? '' : type.value)}
                    />
                  ))}
                </FilterSection>
              )}

              {/* Price Range */}
              <FilterSection title="Price" mobile>
                {priceRanges.map((range) => (
                  <FilterCheckbox
                    key={range.value}
                    label={range.label}
                    checked={currentPrice === range.value}
                    onChange={() => updateFilters('price', currentPrice === range.value ? '' : range.value)}
                  />
                ))}
              </FilterSection>

              {/* Availability */}
              <FilterSection title="Availability" mobile>
                <FilterCheckbox
                  label="In Stock Only"
                  checked={currentInStock}
                  onChange={() => updateFilters('instock', currentInStock ? '' : 'true')}
                />
              </FilterSection>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-deep-purple/30 space-y-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 text-burnt-lilac text-sm hover:text-mist-lilac transition-colors"
                >
                  Clear all filters
                </button>
              )}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-gothic py-3"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Filter Section Component
function FilterSection({
  title,
  children,
  mobile = false,
}: {
  title: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={mobile ? '' : 'border-b border-deep-purple/20 pb-6'}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3 text-left"
      >
        <h3 className="text-sm font-semibold text-mist-lilac uppercase tracking-wider">
          {title}
        </h3>
        <svg
          className={`w-4 h-4 text-mist-lilac/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
}

// Filter Checkbox Component
function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group touch-manipulation">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked
            ? 'bg-burnt-lilac border-burnt-lilac'
            : 'border-mist-lilac/30 group-hover:border-mist-lilac/50'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? 'text-mist-lilac' : 'text-mist-lilac/70'}`}>
        {label}
      </span>
    </label>
  );
}
