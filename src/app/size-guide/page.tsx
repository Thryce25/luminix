'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FloatingBackground from '@/components/common/FloatingBackground';

type Category = 'men-oversized-tshirt' | 'women-oversized-tshirt' | 'men-hoodie' | 'women-hoodie' | 
                'men-sweatshirt' | 'women-sweatshirt' | 'men-regular-tshirt' | 'women-regular-tshirt' | 
                'men-pant' | 'women-pant' | 'women-crop-top';

export default function SizeGuidePage() {
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('men');
  const [activeCategory, setActiveCategory] = useState<Category>('men-oversized-tshirt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Size data for all categories
  const sizeData = {
    'men-oversized-tshirt': {
      title: "Men's Oversized T-Shirt",
      fit: "Relaxed / Streetwear Oversized",
      headers: ['Size', 'Chest', 'Length', 'Shoulder'],
      rows: [
        { size: 'S', chest: '42', length: '27', shoulder: '20' },
        { size: 'M', chest: '44', length: '28', shoulder: '21' },
        { size: 'L', chest: '46', length: '29', shoulder: '22' },
        { size: 'XL', chest: '48', length: '30', shoulder: '23' },
        { size: 'XXL', chest: '50', length: '31', shoulder: '24' },
      ]
    },
    'women-oversized-tshirt': {
      title: "Women's Oversized T-Shirt",
      fit: "Relaxed / Streetwear Oversized",
      headers: ['Size', 'Chest', 'Length', 'Shoulder'],
      rows: [
        { size: 'XS', chest: '38', length: '25', shoulder: '18' },
        { size: 'S', chest: '40', length: '26', shoulder: '19' },
        { size: 'M', chest: '42', length: '27', shoulder: '20' },
        { size: 'L', chest: '44', length: '28', shoulder: '21' },
        { size: 'XL', chest: '46', length: '29', shoulder: '22' },
      ]
    },
    'men-hoodie': {
      title: "Men's Hoodie",
      fit: "Regular Fit",
      headers: ['Size', 'Chest', 'Length', 'Sleeve'],
      rows: [
        { size: 'S', chest: '42', length: '26', sleeve: '24' },
        { size: 'M', chest: '44', length: '27', sleeve: '25' },
        { size: 'L', chest: '46', length: '28', sleeve: '26' },
        { size: 'XL', chest: '48', length: '29', sleeve: '27' },
        { size: 'XXL', chest: '50', length: '30', sleeve: '28' },
      ]
    },
    'women-hoodie': {
      title: "Women's Hoodie",
      fit: "Regular Fit",
      headers: ['Size', 'Chest', 'Length', 'Sleeve'],
      rows: [
        { size: 'XS', chest: '38', length: '24', sleeve: '22' },
        { size: 'S', chest: '40', length: '25', sleeve: '23' },
        { size: 'M', chest: '42', length: '26', sleeve: '24' },
        { size: 'L', chest: '44', length: '27', sleeve: '25' },
        { size: 'XL', chest: '46', length: '28', sleeve: '26' },
      ]
    },
    'men-sweatshirt': {
      title: "Men's Sweatshirt",
      fit: "Regular Fit",
      headers: ['Size', 'Chest', 'Length', 'Sleeve'],
      rows: [
        { size: 'S', chest: '40', length: '26', sleeve: '24' },
        { size: 'M', chest: '42', length: '27', sleeve: '25' },
        { size: 'L', chest: '44', length: '28', sleeve: '26' },
        { size: 'XL', chest: '46', length: '29', sleeve: '27' },
        { size: 'XXL', chest: '48', length: '30', sleeve: '28' },
      ]
    },
    'women-sweatshirt': {
      title: "Women's Sweatshirt",
      fit: "Regular Fit",
      headers: ['Size', 'Chest', 'Length', 'Sleeve'],
      rows: [
        { size: 'XS', chest: '36', length: '24', sleeve: '22' },
        { size: 'S', chest: '38', length: '25', sleeve: '23' },
        { size: 'M', chest: '40', length: '26', sleeve: '24' },
        { size: 'L', chest: '42', length: '27', sleeve: '25' },
        { size: 'XL', chest: '44', length: '28', sleeve: '26' },
      ]
    },
    'men-regular-tshirt': {
      title: "Men's Regular T-Shirt",
      fit: "Regular Fit",
      headers: ['Size', 'Chest', 'Length'],
      rows: [
        { size: 'S', chest: '38', length: '26' },
        { size: 'M', chest: '40', length: '27' },
        { size: 'L', chest: '42', length: '28' },
        { size: 'XL', chest: '44', length: '29' },
        { size: 'XXL', chest: '46', length: '30' },
      ]
    },
    'women-regular-tshirt': {
      title: "Women's Regular T-Shirt",
      fit: "Regular Fit",
      headers: ['Size', 'Chest', 'Length'],
      rows: [
        { size: 'XS', chest: '34', length: '24' },
        { size: 'S', chest: '36', length: '25' },
        { size: 'M', chest: '38', length: '26' },
        { size: 'L', chest: '40', length: '27' },
        { size: 'XL', chest: '42', length: '28' },
      ]
    },
    'men-pant': {
      title: "Men's Pant",
      fit: "Regular Fit",
      headers: ['Size', 'Waist', 'Length'],
      rows: [
        { size: 'S', waist: '28–30', length: '40' },
        { size: 'M', waist: '30–32', length: '41' },
        { size: 'L', waist: '32–34', length: '42' },
        { size: 'XL', waist: '34–36', length: '43' },
        { size: 'XXL', waist: '36–38', length: '44' },
      ]
    },
    'women-pant': {
      title: "Women's Pant",
      fit: "Regular Fit",
      headers: ['Size', 'Waist', 'Length'],
      rows: [
        { size: 'XS', waist: '24–26', length: '38' },
        { size: 'S', waist: '26–28', length: '39' },
        { size: 'M', waist: '28–30', length: '40' },
        { size: 'L', waist: '30–32', length: '41' },
        { size: 'XL', waist: '32–34', length: '42' },
      ]
    },
    'women-crop-top': {
      title: "Women's Crop Top",
      fit: "Fitted",
      headers: ['Size', 'Bust', 'Length'],
      rows: [
        { size: 'XS', bust: '30–32', length: '15' },
        { size: 'S', bust: '32–34', length: '16' },
        { size: 'M', bust: '34–36', length: '17' },
        { size: 'L', bust: '36–38', length: '18' },
        { size: 'XL', bust: '38–40', length: '19' },
      ]
    },
  };

  const menCategories = [
    { id: 'men-oversized-tshirt' as Category, label: 'Oversized T-Shirt' },
    { id: 'men-hoodie' as Category, label: 'Hoodie' },
    { id: 'men-sweatshirt' as Category, label: 'Sweatshirt' },
    { id: 'men-regular-tshirt' as Category, label: 'Regular T-Shirt' },
    { id: 'men-pant' as Category, label: 'Pants' },
  ];

  const womenCategories = [
    { id: 'women-oversized-tshirt' as Category, label: 'Oversized T-Shirt' },
    { id: 'women-hoodie' as Category, label: 'Hoodie' },
    { id: 'women-sweatshirt' as Category, label: 'Sweatshirt' },
    { id: 'women-regular-tshirt' as Category, label: 'Regular T-Shirt' },
    { id: 'women-pant' as Category, label: 'Pants' },
    { id: 'women-crop-top' as Category, label: 'Crop Top' },
  ];

  const handleGenderChange = (gender: 'men' | 'women') => {
    setActiveGender(gender);
    setActiveCategory(gender === 'men' ? 'men-oversized-tshirt' : 'women-oversized-tshirt');
  };

  const tshirtIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 6L19 3L21 5L18 8V11H6V8L3 5L5 3L8 6C8 4.5 9.5 3 12 3C14.5 3 16 4.5 16 6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 11H18V21H6V11Z" />
    </svg>
  );

  const measurementTips = [
    { 
      area: 'Chest/Bust', 
      tip: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
      icon: tshirtIcon
    },
    { 
      area: 'Waist', 
      tip: 'Measure around your natural waistline, keeping the tape comfortably loose.',
      icon: tshirtIcon
    },
    { 
      area: 'Hips', 
      tip: 'Measure around the fullest part of your hips, about 8 inches below your waist.',
      icon: tshirtIcon
    },
    { 
      area: 'Sleeve', 
      tip: 'Measure from the center back of your neck, over your shoulder, down to your wrist.',
      icon: tshirtIcon
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Jaw-dropping Animated Background */}
      <FloatingBackground />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-overlay"
                style={{
                  width: `${Math.random() * 80 + 20}px`,
                  height: `${Math.random() * 80 + 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 2 === 0 
                    ? 'linear-gradient(135deg, rgba(111,78,124,0.3), transparent)'
                    : 'linear-gradient(135deg, rgba(214,197,220,0.2), transparent)',
                  animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Perfect Fit</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Size
            <br />
            <span className="italic">Guide</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            Find your perfect fit with our comprehensive size charts and measuring tips.
          </p>
        </div>
      </section>

      {/* Size Charts */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Gender Tab Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => handleGenderChange('men')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeGender === 'men'
                  ? 'bg-burnt-lilac text-white'
                  : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50'
              }`}
            >
              Men&apos;s
            </button>
            <button
              onClick={() => handleGenderChange('women')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeGender === 'women'
                  ? 'bg-burnt-lilac text-white'
                  : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50'
              }`}
            >
              Women&apos;s
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {(activeGender === 'men' ? menCategories : womenCategories).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-burnt-lilac/20 text-burnt-lilac border-2 border-burnt-lilac'
                    : 'bg-deep-purple/20 text-mist-lilac/70 border border-mist-lilac/20 hover:border-burnt-lilac/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Size Table */}
          <div className="relative rounded-2xl overflow-hidden border border-mist-lilac/10 bg-gradient-to-br from-deep-purple/20 to-black mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-burnt-lilac/5 to-transparent" />
            
            {/* Category Title */}
            <div className="relative p-6 border-b border-mist-lilac/10">
              <h2 className="text-2xl font-serif text-mist-lilac mb-1">
                {sizeData[activeCategory].title}
              </h2>
              <p className="text-sm text-burnt-lilac">
                Fit: {sizeData[activeCategory].fit} • All measurements in inches
              </p>
            </div>
            
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-mist-lilac/10">
                    {sizeData[activeCategory].headers.map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-mist-lilac font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeData[activeCategory].rows.map((row, idx) => (
                    <tr 
                      key={row.size}
                      className={`border-b border-mist-lilac/5 hover:bg-burnt-lilac/5 transition-colors ${
                        idx % 2 === 0 ? 'bg-deep-purple/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-mist-lilac font-semibold">{row.size}</td>
                      {Object.entries(row).slice(1).map(([key, value]) => (
                        <td key={key} className="px-6 py-4 text-mist-lilac/80">
                          {value}"
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Size Tip */}
          <div className="mt-6 p-4 rounded-xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center gap-3">
            <svg className="w-5 h-5 text-burnt-lilac shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-mist-lilac/70 text-sm">
              <span className="text-burnt-lilac font-medium">Tip:</span> If you&apos;re between sizes, we recommend sizing up for a more comfortable fit.
            </p>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Get It Right</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-mist-lilac mt-4">How to Measure</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {measurementTips.map((item, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-mist-lilac mb-2">{item.area}</h3>
                    <p className="text-mist-lilac/60 text-sm leading-relaxed">{item.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-burnt-lilac/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-deep-purple/40 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-mist-lilac mb-4">Still Not Sure?</h2>
              <p className="text-mist-lilac/60 mb-8 max-w-xl mx-auto">
                Our team is happy to help you find the perfect size. Contact us with your measurements and we will recommend the best fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-colors"
                >
                  Get Help
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-4 bg-transparent border border-mist-lilac/30 text-mist-lilac font-semibold rounded-full hover:bg-mist-lilac/10 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
