/**
 * Audio synthesis & speech recognition utility for Korean pronunciation
 */

let cachedKoreanVoice: SpeechSynthesisVoice | null = null;

export function getKoreanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedKoreanVoice) return cachedKoreanVoice;

  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang.startsWith('ko') || v.lang.includes('KR') || v.name.toLowerCase().includes('korean'));
  if (koVoice) {
    cachedKoreanVoice = koVoice;
    return koVoice;
  }
  return null;
}

// Pre-load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    getKoreanVoice();
  };
}

export function playKoreanSpeech(text: string, speed: 'normal' | 'slow' = 'normal'): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = speed === 'slow' ? 0.65 : 0.95;
      utterance.pitch = 1.0;

      const voice = getKoreanVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      resolve(false);
    }
  });
}

// Browser Speech Recognition Helper
export class BrowserSpeechRecognizer {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ko-KR';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.isSupported = true;
      }
    }
  }

  public start(onResult: (transcript: string, isFinal: boolean) => void, onError: (error: any) => void): void {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser'));
      return;
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (err: any) => {
      onError(err);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }
}
