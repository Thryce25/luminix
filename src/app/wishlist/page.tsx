import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Wishlist',
    description: 'Your saved items from Luminix gothic fashion collection.',
};

// This will be a client component to access wishlist
export default function WishlistPage() {
    // Redirect to a client component
    redirect('/wishlist/view');
}
