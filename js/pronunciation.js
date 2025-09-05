(function () {
  const PHRASES = [
    'Good morning, how are you today?',
    'Could you please repeat that?',
    'The weather is beautiful this afternoon.',
    'I would like a cup of coffee, please.',
  ];

  const phraseSel = document.getElementById('phrase');
  const playBtn = document.getElementById('play');
  const recBtn = document.getElementById('record');
  const live = document.getElementById('live');
  const feedback = document.getElementById('feedback');

  PHRASES.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p; phraseSel.appendChild(opt);
  });

  playBtn.addEventListener('click', () => {
    window.AI.ttsSpeak(phraseSel.value);
  });

  let recognizing = false;
  let recognition = null;
  function ensureRecognizer() {
    if (recognition) return recognition;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      feedback.textContent = 'Speech Recognition is not supported in this browser.';
      recBtn.disabled = true;
      return null;
    }
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      live.textContent = transcript;
    };
    recognition.onerror = (e) => {
      feedback.textContent = 'Recognition error: ' + e.error;
    };
    recognition.onend = () => {
      recognizing = false;
      recBtn.textContent = 'Start Recording';
      evaluate(live.textContent, phraseSel.value);
    };
    return recognition;
  }

  function evaluate(said, target) {
    const clean = (s) => s.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
    const a = clean(said).split(' ');
    const b = clean(target).split(' ');
    const common = a.filter(x => b.includes(x)).length;
    const score = b.length ? Math.round((common / b.length) * 100) : 0;
    feedback.textContent = `Similarity: ${score}%`;
  }

  recBtn.addEventListener('click', () => {
    const r = ensureRecognizer();
    if (!r) return;
    if (recognizing) {
      r.stop();
    } else {
      live.textContent = '';
      feedback.textContent = 'Listening...';
      recognizing = true;
      recBtn.textContent = 'Stop Recording';
      r.start();
    }
  });
})();

