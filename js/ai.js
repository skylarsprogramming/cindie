(function () {
  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function pickRandom(array, seed) {
    const idx = Math.floor(seededRandom(seed) * array.length);
    return array[idx];
  }

  function analyzeScores(result) {
    const totals = {
      grammar: 0,
      reading: 0,
      listening: 0,
      max: 0
    };
    for (const k of ['grammar', 'reading', 'listening']) {
      totals[k] = result.sectionScores?.[k] ?? 0;
      totals.max += result.sectionMax?.[k] ?? 0;
    }
    const percent = Math.round((result.total / (result.max || totals.max || 1)) * 100);
    let level = 'A1';
    if (percent >= 85) level = 'C1';
    else if (percent >= 70) level = 'B2';
    else if (percent >= 55) level = 'B1';
    else if (percent >= 40) level = 'A2';
    return { percent, level, totals };
  }

  function generateCoursePlan(result) {
    const { level, totals } = analyzeScores(result);
    const focus = Object.entries(totals)
      .filter(([k]) => k !== 'max')
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([k]) => k);

    const seed = Math.round(result.total * 13 + (result.sectionScores?.grammar || 0) * 7);

    const topics = {
      grammar: [
        'Present Simple vs Continuous',
        'Past Simple and Irregular Verbs',
        'Articles: a/an/the',
        'Countable vs Uncountable Nouns',
        'Modal Verbs for Ability and Advice'
      ],
      reading: [
        'Short News Articles',
        'Emails and Messages',
        'Travel Blogs',
        'Product Reviews',
        'Biographies of Innovators'
      ],
      listening: [
        'Daily Conversations',
        'Customer Service Calls',
        'Podcast Intros',
        'Short Presentations',
        'Weather Reports'
      ]
    };

    const modules = [
      {
        id: 'm1',
        title: `${level} Core Grammar`,
        area: 'grammar',
        topic: pickRandom(topics.grammar, seed + 1),
        activities: [
          { type: 'explain', title: 'Concept Overview' },
          { type: 'drill', title: '10 Quick Checks' },
          { type: 'apply', title: 'Fill-in-the-Blank Practice' },
        ]
      },
      {
        id: 'm2',
        title: `${level} Reading Skills`,
        area: 'reading',
        topic: pickRandom(topics.reading, seed + 2),
        activities: [
          { type: 'read', title: 'Guided Passage' },
          { type: 'quiz', title: 'Comprehension Questions' },
        ]
      },
      {
        id: 'm3',
        title: `${level} Listening Lab`,
        area: 'listening',
        topic: pickRandom(topics.listening, seed + 3),
        activities: [
          { type: 'listen', title: 'Audio Prompt' },
          { type: 'type', title: 'Dictation Practice' },
        ]
      },
      {
        id: 'm4',
        title: 'Speaking & Pronunciation',
        area: 'speaking',
        topic: 'Intonation and Stress',
        activities: [
          { type: 'shadow', title: 'Shadow the Phrase' },
          { type: 'record', title: 'Say It Yourself' },
        ]
      }
    ];

    // Move weak areas first
    modules.sort((a, b) => {
      const pa = focus.includes(a.area) ? -1 : 1;
      const pb = focus.includes(b.area) ? -1 : 1;
      return pa - pb;
    });

    return { level, focus, modules };
  }

  function generateLesson(result, area, levelHint, topicHint) {
    const { level } = analyzeScores(result);
    const lvl = levelHint || level;
    const areaTitle = area ? area[0].toUpperCase() + area.slice(1) : 'Skills';
    const title = `${lvl} ${areaTitle}: ${topicHint || 'Core Practice'}`;

    const contentBank = {
      grammar: [
        'Many learners confuse the present simple and present continuous. Use present simple for routines and facts. Use present continuous for actions happening now or temporary situations.',
        'Signal words for present simple include often, usually, always, sometimes. Signal words for present continuous include now, at the moment, right now.',
        'Be careful with state verbs (know, like, love, believe). These verbs rarely appear in continuous forms.'
      ],
      reading: [
        'City Park is expanding its bike lanes this summer to reduce traffic and pollution. Local shops expect more visitors as cyclists stop for coffee and snacks.',
        'Residents are invited to a community meeting next Tuesday at 6 pm to discuss the final design and safety measures near schools.',
        'Officials estimate the project will finish in October, just before the rainy season begins.'
      ],
      listening: [
        'Welcome to the morning update. Today we expect mild temperatures with a chance of light showers in the afternoon.',
        'Remember to bring an umbrella and leave early if you are commuting downtown because of ongoing road work.',
        'In other news, the library is hosting a free language workshop this evening at 7 pm.'
      ]
    };

    const questionsBank = {
      grammar: [
        {
          q: 'Choose the correct sentence for a routine:',
          options: ['I am going to work every day.', 'I go to work every day.', 'I going to work every day.', 'I do go to work now.'],
          answerIndex: 1,
          why: 'Routines use present simple: "I go" not continuous.'
        },
        {
          q: 'Select the correct use of present continuous:',
          options: ['She cooks dinner on Fridays.', 'She is cooking dinner right now.', 'She cook dinner now.', 'She are cooking dinner every day.'],
          answerIndex: 1,
          why: 'Actions happening now use present continuous: is + verb-ing.'
        }
      ],
      reading: [
        {
          q: 'When is the community meeting?',
          options: ['Tonight at 7 pm', 'Next Tuesday at 6 pm', 'Tomorrow morning', 'This Friday at noon'],
          answerIndex: 1,
          why: 'The passage states Tuesday at 6 pm.'
        },
        {
          q: 'Why are bike lanes being expanded?',
          options: ['To reduce traffic and pollution', 'To increase parking', 'To build a new mall', 'To widen sidewalks'],
          answerIndex: 0,
          why: 'It explicitly mentions reducing traffic and pollution.'
        }
      ],
      listening: [
        {
          q: 'What is the weather update for the afternoon?',
          options: ['Heavy snow', 'Strong winds', 'Light showers', 'Heatwave'],
          answerIndex: 2,
          why: 'The audio text says light showers in the afternoon.'
        },
        {
          q: 'What time is the language workshop?',
          options: ['7 pm', '9 am', 'Noon', '5 pm'],
          answerIndex: 0,
          why: 'It mentions a workshop at 7 pm.'
        }
      ]
    };

    const vocabBank = {
      grammar: ['routine', 'temporary', 'state verb', 'continuous', 'signal word'],
      reading: ['expand', 'pollution', 'resident', 'design', 'estimate'],
      listening: ['forecast', 'commute', 'workshop', 'umbrella', 'update']
    };

    const areaKey = area in contentBank ? area : 'grammar';
    const texts = contentBank[areaKey];
    const qset = questionsBank[areaKey];
    const vocab = vocabBank[areaKey];

    const lesson = {
      title,
      content: [
        {
          text: texts,
          pronunciation_help: true
        }
      ],
      questions: qset.map(item => ({
        type: 'multiple_choice',
        question: item.q,
        options: item.options,
        ai_assistant_explanation: true
      })),
      vocabulary: vocab
    };

    const meta = {
      answers: qset.map(x => x.answerIndex),
      explanations: qset.map(x => x.why)
    };

    return { lesson, meta };
  }

  function ttsSpeak(text) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.98;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }

  window.AI = {
    analyzeScores,
    generateCoursePlan,
    generateLesson,
    ttsSpeak,
  };
})();

