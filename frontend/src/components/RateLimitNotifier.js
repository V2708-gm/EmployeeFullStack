// frontend/src/components/RateLimitNotifier.js
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRateLimitExceededInfo, clearRateLimitExceeded } from '../api';

export default function RateLimitNotifier() {
  useEffect(() => {
    const interval = setInterval(() => {
      const info = getRateLimitExceededInfo();
      if (info) {
        const remaining = Math.ceil((info.resetTime - Date.now()) / 1000);
        if (remaining > 0) {
          toast.error(`Rate limit exceeded. Try again in ${remaining}s`, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
            style: { backgroundColor: '#dc3545' }
          });
        } else {
          clearRateLimitExceeded();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // invisible component
}
