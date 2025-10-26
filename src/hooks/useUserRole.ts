import { useState, useEffect } from 'react';
import { getExamResultsForAllUsers } from '@Services/exam';
import useAuthSession from './useAuthSession';

export default function useUserRole() {
  const [isSuperUser, setIsSuperUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthSession();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isAuthenticated) {
        setIsSuperUser(false);
        setLoading(false);
        return;
      }

      try {
        // Try to fetch all users' results to check if user has superuser permissions
        await getExamResultsForAllUsers();
        setIsSuperUser(true);
      } catch (err) {
        // If it fails with 403 or similar, user is not a superuser
        setIsSuperUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [isAuthenticated]);

  return { isSuperUser, loading };
}
