import type { Metadata } from 'next';
import AuthPageClient from '@/components/AuthPageClient';

export const metadata: Metadata = {
  title: 'Sign Up | BharatBN™ - Sovereign Business & People Network',
  description: 'Create your free BharatBN account for your business or personal profile and join India\'s trusted sovereign business network.',
};

export default function SignUpPage() {
  return <AuthPageClient initialMode="signup" />;
}
