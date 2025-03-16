// dailyNotification.js
const { Expo } = require('expo-server-sdk');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with your service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a new Expo SDK client
let expo = new Expo();



async function sendNotifications() {
  try {
    // Query profiles that haven't uploaded any outfit
    // Assumes you have an "outfits" table with a "user_id" column
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, push_token')
      // Only select profiles for which there is no corresponding outfit record
      .not('user_id', 'in', `(select distinct user_id from outfits)`);
    
    if (error) throw error;
    
    let messages = [];
    
    for (let profile of profiles) {
      if (!profile.push_token || !Expo.isExpoPushToken(profile.push_token)) {
        console.warn(`Invalid or missing push token for user ${profile.user_id}`);
        continue;
      }
      messages.push({
        to: profile.push_token,
        sound: 'default',
        body: "Upload you styled outfit and let your vibe shine!",
        data: { userId: profile.user_id },
      });
    }
    
    // Chunk messages to avoid exceeding Expo limits
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log('Notification tickets:', ticketChunk);
      } catch (chunkError) {
        console.error('Error sending chunk:', chunkError);
      }
    }
  } catch (err) {
    console.error('Error in sendNotifications:', err);
  }
}

// Run the function (you could also export this function for Supabase Edge Functions)
sendNotifications();
