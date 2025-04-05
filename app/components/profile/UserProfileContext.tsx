import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface UserProfile {
  profileImage: string;
  firstName: string;
  lastName: string;
  location: string;
  subscription: string;
  // add other fields as needed
}

interface UserProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  setProfile: () => {},
});

export const UserProfileProvider: React.FC<{ children: React.ReactChild }> = ({ children}) => {//+
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch the user profile once when user logs in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (!error && data) {
        // Map the fields as needed:
        setProfile({
          profileImage: data.profile_image || '',
          firstName: data.first_name || 'User',
          lastName: data.last_name || '',
          location: data.location || '-',
          subscription: (data.subscription_plan || 'Free') + ' Plan',
          // etc.
        });
      }
    };
    fetchUserProfile();
  }, [user]);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
