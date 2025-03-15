/**
 * Checks if the given user still has premium access.
 * Assumes that the user object contains:
 * - subscription_status: string (e.g., "active", "cancelled", or "free")
 * - subscription_expires_at: string (ISO date format)
 */
export const hasPremiumAccess = (user: {
    subscription_status?: string;
    subscription_expires_at?: string;
  }): boolean => {
    if (!user || !user.subscription_status) return false;
  
    const now = new Date();
  
    // If subscription is active, grant access.
    if (user.subscription_status === 'active') {
      return true;
    }
  
    // If subscription is cancelled, check if the current date is before the expiration date.
    if (user.subscription_status === 'cancelled' && user.subscription_expires_at) {
      const expiresAt = new Date(user.subscription_expires_at);
      if (expiresAt > now) {
        return true;
      }
    }
  
    // Otherwise, no premium access.
    return false;
  };