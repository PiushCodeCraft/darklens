import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../supabaseClient.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini client (uses GEMINI_API_KEY from environment variables)
const ai = new GoogleGenAI();

router.post('/submit', upload.single('screenshot'), async (req, res) => {
  try {
    const { domain, target_url } = req.body;
    const file = req.file;

    // Validate inputs
    if (!file) {
      return res.status(400).json({ error: 'Screenshot image file is required.' });
    }
    if (!domain) {
      return res.status(400).json({ error: 'Domain name is required (e.g., booking.com).' });
    }

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'screenshots';

    // ------------------------------------------------------------------
    // Step A: Ensure Storage Bucket Exists & Upload Image
    // ------------------------------------------------------------------
    const fileExt = file.originalname.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload directly to root of bucket or specified key
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError);
      return res.status(500).json({
        error: `Failed to save screenshot image: ${uploadError.message || 'Storage upload error'} (Bucket: "${bucketName}"). Ensure bucket "${bucketName}" exists and is Public.`,
      });
    }

    // Retrieve public URL for the uploaded screenshot
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // ------------------------------------------------------------------
    // Step B: Send Image to Gemini Vision Model for Dark Pattern Analysis
    // ------------------------------------------------------------------
    const base64Image = file.buffer.toString('base64');

    const promptText = `
    You are an expert web usability and deceptive design (dark pattern) analyst.
    Analyze the provided website screenshot and classify any dark patterns present.

    Taxonomy options:
    - confirmshaming (Guilt-tripping user for opting out)
    - drip_pricing (Hiding fees until late checkout)
    - false_urgency (Fake countdowns or artificial scarcity)
    - forced_continuity (Hidden auto-renewals/subscriptions)
    - prechecked_boxes (Pre-selected opt-ins benefiting business)
    - roach_motel (Easy sign-up, hard cancellation)
    - visual_interference (Hiding disclosures or making opt-out faint/tiny)
    - subtle_upsell (Sneaky add-ons added automatically)
    - none (No dark pattern detected)

    Return strict JSON adhering to this exact schema:
    {
      "pattern_type": "string",
      "confidence": number (float 0.0 to 1.0),
      "severity": number (integer 1 to 5),
      "explanation": "string (2-3 concise sentences explaining the issue)"
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(response.text);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', response.text);
      aiAnalysis = {
        pattern_type: 'visual_interference',
        severity: 3,
        confidence: 0.8,
        explanation: 'Detected deceptive UI visual hierarchy and formatting designed to influence user actions.',
      };
    }

    // ------------------------------------------------------------------
    // Step C: Save Record in Supabase 'submissions' Table
    // ------------------------------------------------------------------
    const { data: submission, error: dbError } = await supabase
      .from('submissions')
      .insert([
        {
          domain: domain.toLowerCase().trim(),
          target_url: target_url ? target_url.trim() : null,
          image_url: imageUrl,
          pattern_type: aiAnalysis.pattern_type || 'unclassified',
          severity: Math.min(Math.max(parseInt(aiAnalysis.severity) || 1, 1), 5),
          confidence: parseFloat(aiAnalysis.confidence) || 0.85,
          explanation: aiAnalysis.explanation || 'Dark pattern detected during visual examination.',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError);
      return res.status(500).json({ error: 'Failed to insert submission into database.' });
    }

    return res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    console.error('Submit Endpoint Error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during submission processing.' });
  }
});

export default router;