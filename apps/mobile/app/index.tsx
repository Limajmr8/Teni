import { Redirect } from 'expo-router';

export default function Index() {
  // Simplistic role check for MVP, redirecting to runner dashboard by default
  return <Redirect href="/(runner)/dashboard" />;
}
