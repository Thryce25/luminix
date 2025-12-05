import { Metadata } from 'next';
import CartPageContent from '@/components/cart/CartPageContent';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
  title: 'Shopping Cart | LUMINIX',
  description: 'View your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  return <CartPageClient />;
}
