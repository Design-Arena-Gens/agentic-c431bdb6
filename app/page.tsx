'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramPassword, setInstagramPassword] = useState('');
  const [instagramCaption, setInstagramCaption] = useState('');

  const generateArt = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setGeneratedImage(null);
    setUploadStatus(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) {
        setUploadStatus(`Error: ${data.error}`);
      } else {
        setGeneratedImage(data.imageUrl);
        setUploadStatus('Gambar berhasil dibuat!');
      }
    } catch (error) {
      setUploadStatus('Error generating image');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const uploadToInstagram = async () => {
    if (!generatedImage || !instagramUrl || !instagramPassword) {
      setUploadStatus('Mohon isi username dan password Instagram');
      return;
    }

    setUploading(true);
    setUploadStatus('Mengunggah ke Instagram...');

    try {
      const response = await fetch('/api/upload-instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: generatedImage,
          username: instagramUrl,
          password: instagramPassword,
          caption: instagramCaption || 'AI Generated Art 🎨',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus('✅ Berhasil diunggah ke Instagram!');
      } else {
        setUploadStatus(`❌ ${data.error || 'Gagal mengunggah ke Instagram'}`);
      }
    } catch (error) {
      setUploadStatus('❌ Error uploading to Instagram');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const randomPrompts = [
    'beautiful portrait of a young woman with flowing hair, digital art style',
    'elderly wise man with a long beard, charcoal drawing style',
    'smiling child playing in a garden, watercolor painting',
    'elegant dancer in motion, ink sketch style',
    'mysterious person in a hooded cloak, oil painting style',
  ];

  const useRandomPrompt = () => {
    const random = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(random);
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎨 AI Art Instagram Agent
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Buat gambar seni manusia dengan AI dan unggah ke Instagram
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Generator Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🖼️ Generate Art</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Deskripsi Gambar
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: beautiful portrait of a young woman with flowing hair..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={useRandomPrompt}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              🎲 Random Prompt
            </button>
          </div>

          <button
            onClick={generateArt}
            disabled={generating || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {generating ? '⏳ Generating...' : '✨ Generate Art'}
          </button>

          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg ${uploadStatus.includes('Error') || uploadStatus.includes('❌') ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Instagram Upload Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📱 Upload to Instagram</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="username_anda"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Instagram Password
            </label>
            <input
              type="password"
              value={instagramPassword}
              onChange={(e) => setInstagramPassword(e.target.value)}
              placeholder="password_anda"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Caption (Optional)
            </label>
            <textarea
              value={instagramCaption}
              onChange={(e) => setInstagramCaption(e.target.value)}
              placeholder="AI Generated Art 🎨"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 min-h-[80px]"
            />
          </div>

          <button
            onClick={uploadToInstagram}
            disabled={uploading || !generatedImage || !instagramUrl || !instagramPassword}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload to Instagram'}
          </button>

          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
            ⚠️ Note: Instagram upload menggunakan API pihak ketiga. Pastikan akun Anda tidak menggunakan 2FA.
          </div>
        </div>
      </div>

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🖼️ Generated Art</h2>
          <div className="relative w-full aspect-square max-w-2xl mx-auto">
            <Image
              src={generatedImage}
              alt="Generated art"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">ℹ️ Cara Menggunakan</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Masukkan deskripsi gambar manusia yang ingin Anda buat</li>
          <li>Klik tombol "Generate Art" untuk membuat gambar</li>
          <li>Tunggu beberapa detik hingga gambar selesai dibuat</li>
          <li>Masukkan username dan password Instagram Anda</li>
          <li>Tambahkan caption (opsional)</li>
          <li>Klik "Upload to Instagram" untuk mengunggah</li>
        </ol>
      </div>
    </main>
  );
}
