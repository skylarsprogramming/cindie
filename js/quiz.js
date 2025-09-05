(function () {
  const QUESTIONS = [
    // Grammar (1-5)
    { id: 'g1', type: 'grammar', q: 'Choose the correct form: She ____ to school every day.', options: ['go', 'goes', 'is go'], a: 1 },
    { id: 'g2', type: 'grammar', q: 'Select the correct article: I bought ____ umbrella.', options: ['a', 'an', 'the'], a: 1 },
    { id: 'g3', type: 'grammar', q: 'Pick the correct tense: They ____ dinner when I called.', options: ['were having', 'are having', 'have'], a: 0 },
    { id: 'g4', type: 'grammar', q: 'Which is correct?', options: ['He don\'t like tea.', 'He doesn\'t like tea.', 'He not like tea.'], a: 1 },
    { id: 'g5', type: 'grammar', q: 'Choose the modal: You ____ see a doctor.', options: ['should', 'can to', 'must to'], a: 0 },
    // Reading (6-10)
    { id: 'r1', type: 'reading', q: 'Reading: "Tom works from 9 to 5." When does Tom finish?', options: ['At 9', 'At 5', 'At 3'], a: 1 },
    { id: 'r2', type: 'reading', q: 'Reading: "The museum is closed on Mondays." Which day is closed?', options: ['Monday', 'Wednesday', 'Sunday'], a: 0 },
    { id: 'r3', type: 'reading', q: 'Reading: "Sarah rarely eats meat." How often?', options: ['Often', 'Rarely', 'Always'], a: 1 },
    { id: 'r4', type: 'reading', q: 'Reading: "We prefer trains because they are faster." Why trains?', options: ['Cheaper', 'Faster', 'Quieter'], a: 1 },
    { id: 'r5', type: 'reading', q: 'Reading: "Bring your ID to enter." What do you need?', options: ['Ticket', 'ID', 'Cash'], a: 1 },
    // Listening (11-15) using TTS prompt
    { id: 'l1', type: 'listening', q: 'Listen: "What time is the meeting? 2 PM." Select the answer.', options: ['2 PM', '10 AM', '4 PM'], a: 0, tts: 'What time is the meeting? Two PM.' },
    { id: 'l2', type: 'listening', q: 'Listen: "Please call me tomorrow morning." What should you do?', options: ['Email tonight', 'Call tomorrow morning', 'Visit now'], a: 1, tts: 'Please call me tomorrow morning.' },
    { id: 'l3', type: 'listening', q: 'Listen: "Turn left at the bank and go straight." Which direction first?', options: ['Right', 'Left', 'Back'], a: 1, tts: 'Turn left at the bank and go straight.' },
    { id: 'l4', type: 'listening', q: 'Listen: "I\'m allergic to peanuts." What can\'t they eat?', options: ['Peanuts', 'Chocolate', 'Milk'], a: 0, tts: "I'm allergic to peanuts." },
    { id: 'l5', type: 'listening', q: 'Listen: "The train is delayed by 15 minutes." What happened?', options: ['Arrived early', 'On time', 'Delayed'], a: 2, tts: 'The train is delayed by fifteen minutes.' },
  ];

  let index = 0;
  const answers = [];
  const sectionScores = { grammar: 0, reading: 0, listening: 0 };
  const sectionMax = { grammar: 5, reading: 5, listening: 5 };

  const card = document.getElementById('quiz-card');
  const bar = document.getElementById('bar');
  const pill = document.getElementById('pill');

  function render() {
    const q = QUESTIONS[index];
    const progress = Math.round(((index) / QUESTIONS.length) * 100);
    bar.style.width = progress + '%';
    pill.textContent = `Question ${index + 1} / 15 • ${q.type[0].toUpperCase()}${q.type.slice(1)}`;

    const optionsHtml = q.options.map((opt, i) => `
      <label>
        <input type="radio" name="opt" value="${i}" style="display:none" />
        ${opt}
      </label>
    `).join('');

    card.innerHTML = `
      <div class="q-meta">${q.type.toUpperCase()}</div>
      <div class="q-title">${q.q}</div>
      <div class="q-options">${optionsHtml}</div>
      <div class="q-controls">
        <button class="btn ghost" id="prev" ${index === 0 ? 'disabled' : ''}>Back</button>
        <button class="btn primary" id="next">${index === QUESTIONS.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    `;

    if (q.type === 'listening' && q.tts) {
      setTimeout(() => window.AI.ttsSpeak(q.tts), 200);
    }

    card.querySelectorAll('label').forEach(label => {
      label.addEventListener('click', () => {
        card.querySelectorAll('label').forEach(l => l.style.borderColor = 'var(--border)');
        label.style.borderColor = 'var(--accent)';
        const input = label.querySelector('input');
        input.checked = true;
      });
    });

    card.querySelector('#prev').addEventListener('click', () => {
      if (index > 0) {
        index--;
        render();
      }
    });

    card.querySelector('#next').addEventListener('click', () => {
      const selected = card.querySelector('input[name="opt"]:checked');
      if (!selected) {
        alert('Please choose an answer.');
        return;
      }
      const choice = Number(selected.value);
      answers[index] = choice;
      if (choice === QUESTIONS[index].a) {
        const area = QUESTIONS[index].type;
        sectionScores[area] += 1;
      }
      if (index < QUESTIONS.length - 1) {
        index++;
        render();
      } else {
        const total = Object.values(sectionScores).reduce((a, b) => a + b, 0);
        const max = 15;
        const result = { answers, sectionScores, sectionMax, total, max, finishedAt: Date.now() };
        try {
          localStorage.setItem('lingualift_quiz_result', JSON.stringify(result));
        } catch (_) {}
        window.location.href = './course.html';
      }
    });
  }

  render();
})();

