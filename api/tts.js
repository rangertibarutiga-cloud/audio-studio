import { EdgeTTS } from 'edge-tts-universal';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice, rate = '+0%', pitch = '+0Hz' } = req.body;
    if (!text || !voice) {
      return res.status(400).json({ error: 'Teks dan karakter suara wajib diisi.' });
    }

    const tts = new EdgeTTS(text, voice, { rate, pitch });
    const result = await tts.synthesize();
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    return res.status(200).send(audioBuffer);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Gagal menghasilkan suara.' });
  }
}
