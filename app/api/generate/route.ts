import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check if Replicate API key is available
    const replicateApiKey = process.env.REPLICATE_API_TOKEN;

    if (!replicateApiKey) {
      // Return a demo image if no API key
      return NextResponse.json({
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
        demo: true,
        message: 'Demo mode: Add REPLICATE_API_TOKEN to environment variables for AI generation'
      });
    }

    const replicate = new Replicate({
      auth: replicateApiKey,
    });

    // Using Stable Diffusion XL for high-quality human portraits
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `${prompt}, highly detailed, professional art, 8k quality, realistic human features`,
          negative_prompt: "ugly, deformed, distorted, bad anatomy, bad proportions, blurry, low quality",
          width: 1024,
          height: 1024,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
