import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useFormError = () => {
  const handleError = useCallback((error) => {
    // Handle API errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message, { autoClose: 5000 });
      return;
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Please check your internet connection', { autoClose: 5000 });
      return;
    }

    // Handle validation errors
    if (error.inner) {
      error.inner.forEach((err) => {
        toast.error(err.message, { autoClose: 5000 });
      });
      return;
    }

    // Handle other errors
    toast.error(error.message || 'Something went wrong', { autoClose: 5000 });
  }, []);

  return { handleError };
};
