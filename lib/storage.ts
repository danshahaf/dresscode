import { supabase } from './supabase';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import OpenAI from 'openai';

const openai = new OpenAI({apiKey: `${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`});


// Function to get a score for an outfit using a mock implementation
// In a real app, you would use OpenAI's API directly with fetch
async function getOutfitScore(imageUrl: string): Promise<number> {
  try {
    // For now, return a random score between 60 and 95
    // In a real implementation, you would call OpenAI's API here
    console.log('Getting score for image:', imageUrl);
    
    // // Mock implementation - replace with actual API call in production
    // const randomScore = Math.floor(Math.random() * 36) + 60; // Random score between 60-95
    // console.log('Generated mock score:', randomScore);
    
    // return randomScore;
    
    
    // Example of how you would call OpenAI API directly with fetch:
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "Rate this outfit on a scale from 0 to 100 based on style, fit, color coordination, and overall aesthetic. Only respond with a number between 0 and 100." },
                    { type: "image_url", image_url: { url: imageUrl } }
                ],
            },
        ],
        store: true,
    });
    
    console.log(response);
    const scoreText = response.choices[0]?.message?.content?.trim() || "-1";
    const scoreMatch = scoreText.match(/\d+/);
    return scoreMatch ? parseInt(scoreMatch[0], 10) : 70;
    
    
  } catch (error) {
    console.error('Error getting outfit score:', error);
    // Return a default score if there's an error
    return 70;
  }
}

// Function to upload an image to Supabase storage
export async function uploadOutfitImage(
  imageUri: string,
  userId: string,
  location: string = 'Unknown'
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log('Starting image upload process for user:', userId);
    
    // 1. Use a single 'outfits' bucket with user-specific folders
    const bucketName = 'outfits'; // Single bucket for all outfit images
    const userFolderPath = `${userId}/`; // User-specific folder within the bucket
    
    // 2. Get the next image ID by checking existing outfits
    const { data: existingOutfits, error: queryError } = await supabase
      .from('outfits')
      .select('id')
      .eq('user_id', userId)
      .order('id', { ascending: false })
      .limit(1);
    
    if (queryError) {
      console.error('Error querying existing outfits:', queryError);
      return { success: false, error: queryError };
    }
    
    const nextId = existingOutfits && existingOutfits.length > 0 
      ? existingOutfits[0].id + 1 
      : 1;
    
    // Create a simple filename without timestamp
    const fileName = `outfit_${nextId}.jpg`;
    // Full path including user folder
    const filePath = `${userFolderPath}${fileName}`;
    
    console.log('Next outfit ID:', nextId, 'File path:', filePath);
    
    // 3. Prepare the image for upload
    let base64Image;
    
    if (Platform.OS === 'web') {
      // Handle web platform
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();
      base64Image = await new Promise((resolve) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Remove the data URL prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          }
        };
        reader.readAsDataURL(blob);
      });
    } else {
      // Handle native platforms
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        return { 
          success: false, 
          error: new Error('File does not exist') 
        };
      }
      
      base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    
    // 4. Upload the image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, decode(base64Image as string), {
        contentType: 'image/jpeg',
        upsert: true, // Overwrite if needed
      });
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { success: false, error: uploadError };
    }
    
    console.log('Image uploaded successfully:', uploadData);
    
    // 5. Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    const imageUrl = publicUrlData.publicUrl;
    console.log('Public URL for image:', imageUrl);
    
    // 6. Get a score for the outfit using OpenAI
    const score = await getOutfitScore(imageUrl);
    console.log('Outfit score:', score);
    
    // 7. Insert a record in the outfits table
    const { data: outfitData, error: insertError } = await supabase
      .from('outfits')
      .insert([
        {
          id: nextId,
          user_id: userId,
          image_url: imageUrl,
          score: score,
        //   location: location,
          created_at: new Date().toISOString(),
        }
      ])
      .select();
    
    if (insertError) {
      console.error('Error inserting outfit record:', insertError);
      return { success: false, error: insertError };
    }
    
    console.log('Outfit record created successfully:', outfitData);
    
    return { 
      success: true, 
      data: { 
        id: nextId,
        imageUrl,
        score,
        outfitData 
      } 
    };
    
  } catch (error) {
    console.error('Unexpected error in uploadOutfitImage:', error);
    return { success: false, error };
  }
} 