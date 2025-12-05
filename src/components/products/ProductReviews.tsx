'use client';

import { useState } from 'react';

interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    verified: boolean;
    helpful: number;
}

interface ProductReviewsProps {
    productId: string;
}

// Mock reviews - in production, these would come from an API
const mockReviews: Review[] = [
    {
        id: '1',
        author: 'Luna Darkwood',
        rating: 5,
        date: '2024-11-15',
        title: 'Absolutely stunning piece!',
        content: 'The craftsmanship is exceptional. The fabric quality exceeded my expectations and the fit is perfect. This has become my favorite piece in my gothic wardrobe.',
        verified: true,
        helpful: 12,
    },
    {
        id: '2',
        author: 'Raven Nightshade',
        rating: 4,
        date: '2024-11-10',
        title: 'Beautiful but runs small',
        content: 'Gorgeous design and excellent quality materials. However, I recommend sizing up as it runs a bit small. The details are intricate and well-made.',
        verified: true,
        helpful: 8,
    },
    {
        id: '3',
        author: 'Morticia V.',
        rating: 5,
        date: '2024-11-05',
        title: 'Perfect gothic aesthetic',
        content: 'Everything I hoped for and more. The dark elegance is exactly what I was looking for. Fast shipping and beautiful packaging too!',
        verified: false,
        helpful: 15,
    },
];

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews] = useState<Review[]>(mockReviews);
    const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
    const [filterRating, setFilterRating] = useState<number | null>(null);

    // Calculate average rating
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const ratingCounts = [5, 4, 3, 2, 1].map(
        (rating) => reviews.filter((r) => r.rating === rating).length
    );

    // Sort and filter reviews
    const displayReviews = reviews
        .filter((r) => (filterRating ? r.rating === filterRating : true))
        .sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (sortBy === 'helpful') {
                return b.helpful - a.helpful;
            } else {
                return b.rating - a.rating;
            }
        });

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            <div className="border border-deep-purple/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Average Rating */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <span className="text-5xl font-bold text-mist-lilac">
                                {averageRating.toFixed(1)}
                            </span>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.round(averageRating)
                                                    ? 'text-burnt-lilac fill-current'
                                                    : 'text-mist-lilac/30'
                                                }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-mist-lilac/70">
                                    Based on {reviews.length} reviews
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating, index) => (
                            <button
                                key={rating}
                                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                                className="w-full flex items-center gap-3 group"
                            >
                                <span className="text-sm text-mist-lilac w-8">{rating}★</span>
                                <div className="flex-1 h-2 bg-deep-purple/30 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${filterRating === rating ? 'bg-burnt-lilac' : 'bg-burnt-lilac/70 group-hover:bg-burnt-lilac'
                                            }`}
                                        style={{ width: `${(ratingCounts[index] / reviews.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-mist-lilac/70 w-12">
                                    {ratingCounts[index]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-xl font-serif text-mist-lilac">
                    Customer Reviews {filterRating && `(${filterRating} stars)`}
                </h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-black/50 border border-deep-purple/50 rounded-md text-mist-lilac text-sm focus:outline-none focus:border-burnt-lilac"
                >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="rating">Highest Rating</option>
                </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {displayReviews.map((review) => (
                    <div
                        key={review.id}
                        className="border border-deep-purple/30 rounded-lg p-6 hover:border-burnt-lilac/30 transition-colors"
                    >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-mist-lilac">{review.author}</span>
                                    {review.verified && (
                                        <span className="text-xs bg-burnt-lilac/20 text-burnt-lilac px-2 py-0.5 rounded">
                                            Verified Purchase
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating
                                                    ? 'text-burnt-lilac fill-current'
                                                    : 'text-mist-lilac/30'
                                                }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-mist-lilac/50">
                                    {new Date(review.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Review Content */}
                        <h4 className="font-medium text-mist-lilac mb-2">{review.title}</h4>
                        <p className="text-mist-lilac/70 leading-relaxed mb-4">{review.content}</p>

                        {/* Review Actions */}
                        <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-mist-lilac/70 hover:text-burnt-lilac transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                    />
                                </svg>
                                Helpful ({review.helpful})
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {displayReviews.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-mist-lilac/50 mb-4">No reviews match your filter</p>
                    <button
                        onClick={() => setFilterRating(null)}
                        className="text-burnt-lilac hover:text-mist-lilac transition-colors"
                    >
                        Clear filter
                    </button>
                </div>
            )}

            {/* Write Review Button */}
            <div className="text-center pt-6 border-t border-deep-purple/30">
                <button className="btn-gothic">Write a Review</button>
            </div>
        </div>
    );
}
