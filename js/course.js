(function () {
  function getResult() {
    try {
      const raw = localStorage.getItem('lingualift_quiz_result');
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  const result = getResult();
  const summary = document.getElementById('summary');
  const modulesEl = document.getElementById('modules');
  const activityEl = document.getElementById('activity');

  if (!result) {
    summary.innerHTML = '<p>Please take the placement quiz first.</p><p><a class="btn primary" href="./quiz.html">Start Quiz</a></p>';
    modulesEl.style.display = 'none';
    return;
  }

  const plan = window.AI.generateCoursePlan(result);

  summary.innerHTML = `
    <div><strong>Level:</strong> ${plan.level}</div>
    <div><strong>Focus areas:</strong> ${plan.focus.join(', ')}</div>
    <div class="muted">Grammar: ${result.sectionScores.grammar}/5 · Reading: ${result.sectionScores.reading}/5 · Listening: ${result.sectionScores.listening}/5</div>
  `;

  modulesEl.innerHTML = '';
  for (const mod of plan.modules) {
    const div = document.createElement('div');
    div.className = 'mod';
    div.innerHTML = `
      <div style="font-weight:800">${mod.title}</div>
      <div class="muted">Topic: ${mod.topic}</div>
      <div>${mod.activities.map(a => `<span class="activity">${a.type}</span>`).join('')}</div>
      <div style="margin-top:10px"><button class="btn ghost" data-mod="${mod.id}">Start</button></div>
    `;
    modulesEl.appendChild(div);
  }

  modulesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mod]');
    if (!btn) return;
    const modId = btn.getAttribute('data-mod');
    const mod = plan.modules.find(m => m.id === modId);
    if (!mod) return;

    startActivity(mod);
  });

  function startActivity(mod) {
    activityEl.style.display = 'block';
    const { lesson, meta } = window.AI.generateLesson(result, mod.area, plan.level, mod.topic);
    renderLesson(lesson, meta);
  }

  function renderLesson(lesson, meta) {
    activityEl.innerHTML = '';

    // Header with title and download link
    const header = document.createElement('div');
    header.className = 'card2';
    header.innerHTML = `<div style="font-weight:800">${lesson.title}</div>`;
    const blob = new Blob([JSON.stringify(lesson, null, 2)], { type: 'application/json' });
    const dl = document.createElement('a');
    dl.href = URL.createObjectURL(blob);
    dl.download = 'lesson.json';
    dl.textContent = 'Download lesson.json';
    dl.style.display = 'inline-block';
    dl.style.marginTop = '6px';
    header.appendChild(dl);
    activityEl.appendChild(header);

    // Content paragraphs
    const content = lesson.content && lesson.content[0];
    if (content) {
      const c = document.createElement('div');
      c.className = 'card2';
      c.innerHTML = content.text.map(t => `<p>${t}</p>`).join('') + (content.pronunciation_help ? '<div class="muted">Tip: Click a paragraph to hear it.</div>' : '');
      activityEl.appendChild(c);
      if (content.pronunciation_help) {
        c.querySelectorAll('p').forEach(p => p.addEventListener('click', () => window.AI.ttsSpeak(p.textContent)));
      }
    }

    // Questions
    const qwrap = document.createElement('div');
    qwrap.id = 'qwrap';
    activityEl.appendChild(qwrap);
    lesson.questions.forEach((q, idx) => {
      const d = document.createElement('div');
      d.className = 'card2';
      d.style.marginTop = '8px';
      d.innerHTML = `
        <div style="font-weight:600">${idx + 1}. ${q.question}</div>
        ${q.options.map((o, i) => `<label style=\"display:block;margin-top:6px\"><input type=\"radio\" name=\"q${idx}\" value=\"${i}\" style=\"margin-right:6px\"/>${o}</label>`).join('')}
        <div class="muted" id="exp${idx}" style="display:none;margin-top:6px"></div>
      `;
      qwrap.appendChild(d);
    });
    const submit = document.createElement('button');
    submit.className = 'btn primary';
    submit.textContent = 'Check answers';
    submit.style.marginTop = '10px';
    activityEl.appendChild(submit);
    const out = document.createElement('div');
    out.className = 'muted';
    out.style.marginTop = '8px';
    activityEl.appendChild(out);
    submit.addEventListener('click', () => {
      let score = 0;
      lesson.questions.forEach((q, idx) => {
        const sel = activityEl.querySelector(`input[name=\"q${idx}\"]:checked`);
        const correct = meta.answers[idx];
        const exp = meta.explanations[idx];
        const expEl = activityEl.querySelector(`#exp${idx}`);
        if (sel && Number(sel.value) === correct) score++;
        if (q.ai_assistant_explanation) {
          expEl.style.display = 'block';
          expEl.textContent = 'Explanation: ' + exp;
        }
      });
      out.textContent = `You scored ${score}/${lesson.questions.length}.`;
    });

    // Vocabulary
    if (lesson.vocabulary && lesson.vocabulary.length) {
      const v = document.createElement('div');
      v.className = 'card2';
      v.style.marginTop = '12px';
      v.innerHTML = `<div style=\"font-weight:600\">Vocabulary</div>${lesson.vocabulary.map(x => `<span class=\"activity\">${x}</span>`).join(' ')}`;
      activityEl.appendChild(v);
    }
  }
})();

