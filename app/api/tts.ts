export async function speak(text: string) {
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    audio.play();
  }
  