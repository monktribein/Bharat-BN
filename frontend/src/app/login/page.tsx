import type { Metadata } from 'next';
import AuthPageClient from '@/components/AuthPageClient';

export const metadata: Metadata = {
  title: 'Log In | BharatBN™ - Sovereign Business & People Network',
  description: 'Log in to your BharatBN Business or Personal Profile to manage verification, updates, and community engagement.',
};

export default function LoginPage() {
  return <AuthPageClient initialMode="login" />;
}
