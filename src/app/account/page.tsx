import { Metadata } from 'next';
import AccountPageClient from './AccountPageClient';

export const metadata: Metadata = {
  title: 'My Account | Luminix',
  description: 'Sign in to your Luminix account to view orders, wishlist, and manage your profile.',
};

export default function AccountPage() {
  return <AccountPageClient />;
}
