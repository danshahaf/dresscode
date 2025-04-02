import { supabase } from './supabase';
import { decode } from 'base64-arraybuffer';
import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: `${process.env.EXPO_PUBLIC_OPENAI_API_KEY}` });

async function getOutfitScore(imageUrl: string): Promise<number> {
  try {
    console.log('Getting score for image:', imageUrl);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the provided image. 
If the image shows a human being wearing any clothing, rate the outfit based on the following criteria:
- Color harmony
- Fit & Silhouette
- Style coherence
- Accessorizing
- Trendiness
- Occasion match

Compute one overall ACCURATE (not always, but only if necessary, in increments of 5) style score between 0 and 100 that reflects the outfit’s quality and aesthetic. Do not provide any additional commentary or breakdown—output only the final score in this exact format:
Final Score: X

If the image does not clearly depict a person wearing clothing or if the person appears nude, output only:
No outfit detected`
            },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
      store: true,
    });
    
    console.log(response);
    const scoreText = response.choices[0]?.message?.content?.trim() || "";
    console.log("AI response text:", scoreText);
    
    if (scoreText.toLowerCase().includes("no outfit detected")) {
      return -1; // Sentinel value indicating no outfit was found.
    }
    
    // Use a capturing group to extract just the numeric score.
    const scoreMatch = scoreText.match(/Final Score:\s*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1], 10) : -3;
    
  } catch (error) {
    console.error('Error getting outfit score:', error);
    return -2;
  }
}

export async function uploadOutfitImage(
  imageUri: string,
  userId: string,
  location: string = 'Unknown'
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log('Starting image upload process for user:', userId);
    
    // 1. Use a single 'outfits' bucket with user-specific folders
    const bucketName = 'outfits';
    const userFolderPath = `${userId}/`;
    
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
    const filePath = `${userFolderPath}${fileName}`;
    
    console.log('Next outfit ID:', nextId, 'File path:', filePath);
    
    // 3. Prepare the image for upload
    let base64Image;
    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();
      base64Image = await new Promise((resolve) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          }
        };
        reader.readAsDataURL(blob);
      });
    } else {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        return { success: false, error: new Error('File does not exist') };
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
        upsert: true,
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
    
    // 7. If the score is negative, alert the user and abort insertion
    if (score < 0) {
      Alert.alert(
        "Analysis Error",
        "Something went wrong while analyzing the outfit. Please try uploading a different image."
      );
      return { success: false, error: "Negative score returned" };
    }
    
    // 8. Insert a record in the outfits table
    const { data: outfitData, error: insertError } = await supabase
      .from('outfits')
      .insert([
        {
          id: nextId,
          user_id: userId,
          image_url: imageUrl,
          score: score,
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
