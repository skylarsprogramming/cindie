// Global Variables
let currentQuestionIndex = 0;
let quizQuestions = [];
let userAnswers = [];
let quizScore = 0;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let currentWord = 'hello';

// 3D Scene Setup
let scene, camera, renderer, particles;

// Quiz Data - AI Generated Questions
const questionBank = {
    grammar: [
        {
            type: 'Grammar',
            question: 'Choose the correct form: "She _____ to school every day."',
            options: ['go', 'goes', 'going', 'gone'],
            correct: 1,
            explanation: 'Third person singular requires "goes"'
        },
        {
            type: 'Grammar',
            question: 'Which sentence is correct?',
            options: [
                'I have been waiting for two hours.',
                'I am waiting since two hours.',
                'I wait for two hours.',
                'I waiting two hours.'
            ],
            correct: 0,
            explanation: 'Present perfect continuous is used for actions that started in the past and continue to the present.'
        },
        {
            type: 'Grammar',
            question: 'Complete: "If I _____ rich, I would travel the world."',
            options: ['am', 'was', 'were', 'be'],
            correct: 2,
            explanation: 'Second conditional uses "were" for all persons.'
        },
        {
            type: 'Grammar',
            question: 'Choose the correct passive form: "They built this house in 1990."',
            options: [
                'This house built in 1990.',
                'This house was built in 1990.',
                'This house is built in 1990.',
                'This house has built in 1990.'
            ],
            correct: 1,
            explanation: 'Past passive voice uses "was/were + past participle".'
        },
        {
            type: 'Grammar',
            question: 'Select the correct article: "He is _____ honest man."',
            options: ['a', 'an', 'the', 'no article'],
            correct: 1,
            explanation: '"Honest" starts with a silent "h", so we use "an".'
        }
    ],
    reading: [
        {
            type: 'Reading',
            question: 'Read the passage: "Climate change is one of the most pressing issues of our time. Rising temperatures, melting ice caps, and extreme weather events are clear indicators of environmental changes." What is the main idea?',
            options: [
                'Weather is unpredictable',
                'Ice caps are melting quickly',
                'Climate change is a serious current problem',
                'Temperatures are always rising'
            ],
            correct: 2,
            explanation: 'The passage emphasizes climate change as a pressing current issue.'
        },
        {
            type: 'Reading',
            question: 'From the text: "The ancient library of Alexandria was considered one of the largest and most significant libraries of the ancient world." What does "significant" mean here?',
            options: ['Large', 'Old', 'Important', 'Beautiful'],
            correct: 2,
            explanation: '"Significant" means important or meaningful.'
        },
        {
            type: 'Reading',
            question: 'Read: "Despite the rain, the outdoor concert proceeded as planned." What does this sentence imply?',
            options: [
                'The concert was cancelled',
                'The concert happened even though it was raining',
                'The rain stopped before the concert',
                'The concert was moved indoors'
            ],
            correct: 1,
            explanation: '"Despite" indicates the concert continued in spite of the rain.'
        },
        {
            type: 'Reading',
            question: 'In the sentence: "Her performance was exemplary, setting a new standard for excellence." What does "exemplary" suggest?',
            options: ['Average', 'Terrible', 'Outstanding', 'Confusing'],
            correct: 2,
            explanation: '"Exemplary" means serving as a perfect example, outstanding.'
        },
        {
            type: 'Reading',
            question: 'From: "The committee will convene next Monday to discuss the proposal." When will they meet?',
            options: ['This Monday', 'Next Monday', 'Every Monday', 'Last Monday'],
            correct: 1,
            explanation: '"Next Monday" clearly indicates the upcoming Monday.'
        }
    ],
    listening: [
        {
            type: 'Listening',
            question: 'Listen to the audio and answer: What time does the store close?',
            audio: 'The store closes at 9 PM on weekdays and 10 PM on weekends.',
            options: ['8 PM', '9 PM on weekdays', '10 PM every day', '9 PM every day'],
            correct: 1,
            explanation: 'The audio states 9 PM on weekdays and 10 PM on weekends.'
        },
        {
            type: 'Listening',
            question: 'Audio content: What is the weather forecast for tomorrow?',
            audio: 'Tomorrow will be partly cloudy with a high of 75 degrees and a 20% chance of rain.',
            options: ['Sunny', 'Rainy', 'Partly cloudy', 'Stormy'],
            correct: 2,
            explanation: 'The forecast specifically mentions "partly cloudy".'
        },
        {
            type: 'Listening',
            question: 'Listen: How many people attended the meeting?',
            audio: 'The meeting had excellent attendance with 45 people present out of 50 invited.',
            options: ['50 people', '45 people', '40 people', '55 people'],
            correct: 1,
            explanation: '45 people were present at the meeting.'
        },
        {
            type: 'Listening',
            question: 'Audio: What is the speaker\'s main concern?',
            audio: 'I\'m worried about the increasing traffic in our neighborhood. It\'s becoming dangerous for children to play outside.',
            options: ['Noise pollution', 'Traffic safety', 'Property values', 'School quality'],
            correct: 1,
            explanation: 'The speaker is concerned about traffic safety for children.'
        },
        {
            type: 'Listening',
            question: 'Listen: What does the customer want to order?',
            audio: 'I\'d like a large pizza with pepperoni and mushrooms, and a side of garlic bread, please.',
            options: ['Small pizza', 'Large pizza with toppings', 'Just garlic bread', 'Medium pizza'],
            correct: 1,
            explanation: 'The customer orders a large pizza with pepperoni and mushrooms.'
        }
    ]
};

// Pronunciation data
const pronunciationWords = {
    'hello': { phonetic: '/həˈloʊ/', difficulty: 'easy' },
    'world': { phonetic: '/wɜrld/', difficulty: 'easy' },
    'beautiful': { phonetic: '/ˈbjutɪfəl/', difficulty: 'medium' },
    'pronunciation': { phonetic: '/prəˌnʌnsiˈeɪʃən/', difficulty: 'hard' },
    'communication': { phonetic: '/kəˌmjunɪˈkeɪʃən/', difficulty: 'hard' }
};

// Game data
const gameData = {
    vocabulary: {
        words: [
            { word: 'Happy', meaning: 'Feeling joy or pleasure', category: 'Emotions' },
            { word: 'Ocean', meaning: 'A large body of salt water', category: 'Nature' },
            { word: 'Computer', meaning: 'Electronic device for processing data', category: 'Technology' },
            { word: 'Library', meaning: 'Place where books are kept', category: 'Places' },
            { word: 'Adventure', meaning: 'Exciting or unusual experience', category: 'Activities' },
            { word: 'Friendship', meaning: 'Close relationship between friends', category: 'Relationships' },
            { word: 'Mountain', meaning: 'Very high hill', category: 'Geography' },
            { word: 'Knowledge', meaning: 'Information and understanding', category: 'Abstract' }
        ]
    },
    grammar: [
        { question: 'I _____ to the store yesterday.', options: ['go', 'went', 'gone', 'going'], correct: 1 },
        { question: 'She _____ English for 5 years.', options: ['studies', 'study', 'has studied', 'studied'], correct: 2 },
        { question: 'The book _____ on the table.', options: ['is', 'are', 'am', 'be'], correct: 0 }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    init3DScene();
    generateQuiz();
    initPronunciationTool();
    setupEventListeners();
    animateFloatingCards();
});

// 3D Scene Functions
function init3DScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 30;

    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);

    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', function() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Floating cards animation
function animateFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach((card, index) => {
        gsap.to(card, {
            y: "+=20",
            duration: 3 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// Quiz Functions
function generateQuiz() {
    quizQuestions = [];
    const categories = ['grammar', 'reading', 'listening'];
    
    // Select 5 questions from each category
    categories.forEach(category => {
        const categoryQuestions = questionBank[category];
        const selectedQuestions = categoryQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
        quizQuestions.push(...selectedQuestions);
    });
    
    // Shuffle all questions
    quizQuestions = quizQuestions.sort(() => 0.5 - Math.random());
}

function startAssessment() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = [];
    quizScore = 0;
    displayQuestion();
}

function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('question-type').textContent = question.type;
    document.getElementById('question-text').textContent = question.question;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Handle audio for listening questions
    const mediaDiv = document.getElementById('question-media');
    if (question.type === 'Listening' && question.audio) {
        mediaDiv.innerHTML = `
            <div class="audio-question">
                <button onclick="playAudio('${question.audio}')" class="btn-secondary">🔊 Play Audio</button>
                <div class="audio-text" style="margin-top: 1rem; font-style: italic; color: #718096;">
                    "${question.audio}"
                </div>
            </div>
        `;
    } else {
        mediaDiv.innerHTML = '';
    }
    
    // Display options
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        optionsDiv.appendChild(optionDiv);
    });
    
    document.getElementById('next-btn').disabled = true;
}

function selectOption(selectedIndex) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    document.querySelectorAll('.option')[selectedIndex].classList.add('selected');
    
    // Store answer
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    // Check if answer is correct
    const question = quizQuestions[currentQuestionIndex];
    if (userAnswers[currentQuestionIndex] === question.correct) {
        quizScore++;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('course').classList.remove('hidden');
    
    // Determine level based on score
    let level = 'Beginner';
    if (percentage >= 80) level = 'Advanced';
    else if (percentage >= 60) level = 'Intermediate';
    
    document.getElementById('level-badge').textContent = level;
    document.getElementById('final-score').textContent = percentage;
    
    generateCourse(level, percentage);
}

function generateCourse(level, score) {
    const courseContent = document.getElementById('course-content');
    
    const modules = getCourseModules(level);
    
    courseContent.innerHTML = '';
    
    modules.forEach((module, index) => {
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'module-card';
        moduleDiv.innerHTML = `
            <div class="module-header">
                <h3 class="module-title">${module.title}</h3>
                <span class="module-difficulty">${module.difficulty}</span>
            </div>
            <p class="module-description">${module.description}</p>
            <div class="module-lessons">
                ${module.lessons.map(lesson => `
                    <div class="lesson-item" onclick="startLesson('${lesson.id}')">
                        <span class="lesson-icon">${lesson.icon}</span>
                        <span class="lesson-title">${lesson.title}</span>
                        <span class="lesson-duration">${lesson.duration}</span>
                    </div>
                `).join('')}
            </div>
        `;
        courseContent.appendChild(moduleDiv);
    });
}

function getCourseModules(level) {
    const modules = {
        'Beginner': [
            {
                title: 'Basic Grammar Foundations',
                difficulty: 'Easy',
                description: 'Learn essential grammar rules including verb tenses, articles, and sentence structure.',
                lessons: [
                    { id: 'present-tense', icon: '📝', title: 'Present Tense Verbs', duration: '15 min' },
                    { id: 'articles', icon: '📖', title: 'Articles (a, an, the)', duration: '12 min' },
                    { id: 'plural-nouns', icon: '🔢', title: 'Plural Nouns', duration: '10 min' },
                    { id: 'basic-questions', icon: '❓', title: 'Asking Questions', duration: '18 min' }
                ]
            },
            {
                title: 'Essential Vocabulary',
                difficulty: 'Easy',
                description: 'Build your vocabulary with the most common English words and phrases.',
                lessons: [
                    { id: 'daily-words', icon: '🌅', title: 'Daily Life Vocabulary', duration: '20 min' },
                    { id: 'family-friends', icon: '👨‍👩‍👧‍👦', title: 'Family & Friends', duration: '15 min' },
                    { id: 'colors-numbers', icon: '🌈', title: 'Colors & Numbers', duration: '12 min' }
                ]
            }
        ],
        'Intermediate': [
            {
                title: 'Advanced Grammar Structures',
                difficulty: 'Medium',
                description: 'Master complex grammar including conditionals, passive voice, and reported speech.',
                lessons: [
                    { id: 'conditionals', icon: '🤔', title: 'Conditional Sentences', duration: '25 min' },
                    { id: 'passive-voice', icon: '🔄', title: 'Passive Voice', duration: '22 min' },
                    { id: 'reported-speech', icon: '💬', title: 'Reported Speech', duration: '20 min' },
                    { id: 'perfect-tenses', icon: '⏰', title: 'Perfect Tenses', duration: '28 min' }
                ]
            },
            {
                title: 'Reading Comprehension',
                difficulty: 'Medium',
                description: 'Improve your reading skills with various text types and comprehension strategies.',
                lessons: [
                    { id: 'news-articles', icon: '📰', title: 'News Articles', duration: '30 min' },
                    { id: 'short-stories', icon: '📚', title: 'Short Stories', duration: '35 min' },
                    { id: 'academic-texts', icon: '🎓', title: 'Academic Texts', duration: '40 min' }
                ]
            }
        ],
        'Advanced': [
            {
                title: 'Nuanced Language Use',
                difficulty: 'Hard',
                description: 'Refine your English with advanced vocabulary, idioms, and complex structures.',
                lessons: [
                    { id: 'idioms', icon: '🎭', title: 'Idioms & Expressions', duration: '30 min' },
                    { id: 'advanced-vocab', icon: '📖', title: 'Advanced Vocabulary', duration: '35 min' },
                    { id: 'formal-writing', icon: '✍️', title: 'Formal Writing', duration: '45 min' },
                    { id: 'debate-discussion', icon: '🗣️', title: 'Debate & Discussion', duration: '40 min' }
                ]
            },
            {
                title: 'Professional English',
                difficulty: 'Hard',
                description: 'Master English for professional and academic contexts.',
                lessons: [
                    { id: 'business-english', icon: '💼', title: 'Business English', duration: '50 min' },
                    { id: 'presentations', icon: '📊', title: 'Presentations', duration: '45 min' },
                    { id: 'academic-writing', icon: '📝', title: 'Academic Writing', duration: '60 min' }
                ]
            }
        ]
    };
    
    return modules[level] || modules['Beginner'];
}

// Game Functions
function startGame(gameType) {
    document.getElementById('game-modal').classList.remove('hidden');
    document.getElementById('game-title').textContent = getGameTitle(gameType);
    
    const gameContent = document.getElementById('game-content');
    
    switch(gameType) {
        case 'vocabulary':
            loadVocabularyGame(gameContent);
            break;
        case 'grammar':
            loadGrammarGame(gameContent);
            break;
        case 'spelling':
            loadSpellingGame(gameContent);
            break;
        case 'listening':
            loadListeningGame(gameContent);
            break;
    }
}

function getGameTitle(gameType) {
    const titles = {
        'vocabulary': 'Vocabulary Match Game',
        'grammar': 'Grammar Challenge',
        'spelling': 'Spelling Bee',
        'listening': 'Listen & Learn'
    };
    return titles[gameType];
}

function loadVocabularyGame(container) {
    const words = gameData.vocabulary.words.sort(() => 0.5 - Math.random()).slice(0, 6);
    
    container.innerHTML = `
        <div class="game-score">
            <h4>Score</h4>
            <div class="score-value" id="vocab-score">0</div>
        </div>
        <div class="word-match-game">
            <div class="word-column">
                <h4>Words</h4>
                ${words.map((item, index) => 
                    `<div class="match-item" data-type="word" data-index="${index}" onclick="selectMatchItem(this)">${item.word}</div>`
                ).join('')}
            </div>
            <div class="meaning-column">
                <h4>Meanings</h4>
                ${words.sort(() => 0.5 - Math.random()).map((item, index) => 
                    `<div class="match-item" data-type="meaning" data-word="${item.word}" onclick="selectMatchItem(this)">${item.meaning}</div>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Store game data
    window.currentVocabGame = { words, selectedWord: null, selectedMeaning: null, score: 0 };
}

function selectMatchItem(element) {
    const gameData = window.currentVocabGame;
    const type = element.dataset.type;
    
    if (type === 'word') {
        // Deselect previous word selection
        document.querySelectorAll('[data-type="word"].selected').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        gameData.selectedWord = element;
    } else {
        // Deselect previous meaning selection
        document.querySelectorAll('[data-type="meaning"].selected').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        gameData.selectedMeaning = element;
    }
    
    // Check for match
    if (gameData.selectedWord && gameData.selectedMeaning) {
        const wordIndex = gameData.selectedWord.dataset.index;
        const selectedWordObj = gameData.words[wordIndex];
        const meaningText = gameData.selectedMeaning.textContent;
        
        if (selectedWordObj.meaning === meaningText) {
            // Correct match
            gameData.selectedWord.classList.add('correct');
            gameData.selectedMeaning.classList.add('correct');
            gameData.score += 10;
            document.getElementById('vocab-score').textContent = gameData.score;
            
            // Remove click handlers
            gameData.selectedWord.onclick = null;
            gameData.selectedMeaning.onclick = null;
        }
        
        // Reset selections
        gameData.selectedWord = null;
        gameData.selectedMeaning = null;
    }
}

function loadGrammarGame(container) {
    const questions = gameData.grammar;
    let currentQuestion = 0;
    let score = 0;
    
    function displayGrammarQuestion() {
        if (currentQuestion >= questions.length) {
            container.innerHTML = `
                <div class="game-score">
                    <h4>Final Score</h4>
                    <div class="score-value">${score}/${questions.length}</div>
                    <p>Great job! ${score === questions.length ? 'Perfect score!' : 'Keep practicing!'}</p>
                    <button class="btn-primary" onclick="loadGrammarGame(document.getElementById('game-content'))">Play Again</button>
                </div>
            `;
            return;
        }
        
        const question = questions[currentQuestion];
        container.innerHTML = `
            <div class="game-score">
                <h4>Score: ${score}/${questions.length}</h4>
            </div>
            <div class="question-card">
                <div class="question-text">${question.question}</div>
                <div class="options">
                    ${question.options.map((option, index) => 
                        `<div class="option" onclick="checkGrammarAnswer(${index}, ${question.correct})">${option}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    window.checkGrammarAnswer = function(selected, correct) {
        const options = container.querySelectorAll('.option');
        options[selected].classList.add(selected === correct ? 'correct' : 'selected');
        if (selected !== correct) {
            options[correct].classList.add('correct');
        }
        
        if (selected === correct) score++;
        
        setTimeout(() => {
            currentQuestion++;
            displayGrammarQuestion();
        }, 1500);
        
        // Disable further clicks
        options.forEach(opt => opt.onclick = null);
    };
    
    displayGrammarQuestion();
}

function loadSpellingGame(container) {
    const words = ['beautiful', 'necessary', 'restaurant', 'definitely', 'separate', 'environment'];
    let currentWordIndex = 0;
    let score = 0;
    
    function displaySpellingWord() {
        if (currentWordIndex >= words.length) {
            container.innerHTML = `
                <div class="game-score">
                    <h4>Final Score</h4>
                    <div class="score-value">${score}/${words.length}</div>
                    <button class="btn-primary" onclick="loadSpellingGame(document.getElementById('game-content'))">Play Again</button>
                </div>
            `;
            return;
        }
        
        const word = words[currentWordIndex];
        const scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
        
        container.innerHTML = `
            <div class="game-score">
                <h4>Score: ${score}/${words.length}</h4>
            </div>
            <div class="spelling-game">
                <h3>Unscramble this word:</h3>
                <div class="scrambled-word">${scrambled}</div>
                <input type="text" id="spelling-input" placeholder="Type the correct spelling" class="spelling-input">
                <button onclick="checkSpelling('${word}')" class="btn-primary">Check</button>
                <div id="spelling-feedback"></div>
            </div>
        `;
        
        // Focus on input
        setTimeout(() => document.getElementById('spelling-input').focus(), 100);
    }
    
    window.checkSpelling = function(correctWord) {
        const input = document.getElementById('spelling-input');
        const feedback = document.getElementById('spelling-feedback');
        const userAnswer = input.value.toLowerCase().trim();
        
        if (userAnswer === correctWord.toLowerCase()) {
            feedback.innerHTML = '<div style="color: green;">✓ Correct!</div>';
            score++;
        } else {
            feedback.innerHTML = `<div style="color: red;">✗ Incorrect. The correct spelling is: <strong>${correctWord}</strong></div>`;
        }
        
        setTimeout(() => {
            currentWordIndex++;
            displaySpellingWord();
        }, 2000);
    };
    
    displaySpellingWord();
}

function loadListeningGame(container) {
    const sentences = [
        'The quick brown fox jumps over the lazy dog.',
        'She sells seashells by the seashore.',
        'How much wood would a woodchuck chuck?',
        'Peter Piper picked a peck of pickled peppers.'
    ];
    
    let currentSentence = 0;
    let score = 0;
    
    function displayListeningSentence() {
        if (currentSentence >= sentences.length) {
            container.innerHTML = `
                <div class="game-score">
                    <h4>Final Score</h4>
                    <div class="score-value">${score}/${sentences.length}</div>
                    <button class="btn-primary" onclick="loadListeningGame(document.getElementById('game-content'))">Play Again</button>
                </div>
            `;
            return;
        }
        
        const sentence = sentences[currentSentence];
        
        container.innerHTML = `
            <div class="game-score">
                <h4>Score: ${score}/${sentences.length}</h4>
            </div>
            <div class="listening-game">
                <h3>Listen and type what you hear:</h3>
                <button onclick="speakText('${sentence}')" class="btn-secondary">🔊 Play Audio</button>
                <textarea id="listening-input" placeholder="Type what you heard..." class="listening-input"></textarea>
                <button onclick="checkListening('${sentence}')" class="btn-primary">Check Answer</button>
                <div id="listening-feedback"></div>
            </div>
        `;
    }
    
    window.speakText = function(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech not supported in your browser');
        }
    };
    
    window.checkListening = function(correctSentence) {
        const input = document.getElementById('listening-input');
        const feedback = document.getElementById('listening-feedback');
        const userAnswer = input.value.toLowerCase().trim();
        const correct = correctSentence.toLowerCase();
        
        const similarity = calculateSimilarity(userAnswer, correct);
        
        if (similarity > 0.8) {
            feedback.innerHTML = '<div style="color: green;">✓ Excellent!</div>';
            score++;
        } else if (similarity > 0.6) {
            feedback.innerHTML = '<div style="color: orange;">✓ Good! Close enough.</div>';
            score++;
        } else {
            feedback.innerHTML = `<div style="color: red;">✗ Try again. Correct answer: "${correctSentence}"</div>`;
        }
        
        setTimeout(() => {
            currentSentence++;
            displayListeningSentence();
        }, 3000);
    };
    
    displayListeningSentence();
}

// Pronunciation Functions
function initPronunciationTool() {
    updateWordDisplay();
    setupAudioVisualization();
}

function updateWordDisplay() {
    const wordData = pronunciationWords[currentWord];
    document.getElementById('target-word').textContent = currentWord.charAt(0).toUpperCase() + currentWord.slice(1);
    document.getElementById('phonetic').textContent = wordData.phonetic;
}

function selectWord(word) {
    currentWord = word;
    updateWordDisplay();
    
    // Update active word chip
    document.querySelectorAll('.word-chip').forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
}

function playTargetAudio() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    }
}

function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Recording not supported in your browser');
        return;
    }
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            isRecording = true;
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                analyzePronunciation(audioBlob);
            };
            
            mediaRecorder.start();
            
            // Update UI
            const recordBtn = document.getElementById('record-btn');
            recordBtn.classList.add('recording');
            recordBtn.querySelector('.record-text').textContent = 'Stop Recording';
            recordBtn.querySelector('.record-icon').textContent = '⏹️';
            
            // Start visualization
            visualizeAudio(stream);
            
            // Auto-stop after 3 seconds
            setTimeout(() => {
                if (isRecording) stopRecording();
            }, 3000);
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check permissions.');
        });
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        
        // Update UI
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('.record-text').textContent = 'Start Recording';
        recordBtn.querySelector('.record-icon').textContent = '🎤';
        
        // Clear visualization
        document.getElementById('audio-visualizer').innerHTML = '';
    }
}

function visualizeAudio(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    microphone.connect(analyser);
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const visualizer = document.getElementById('audio-visualizer');
    visualizer.innerHTML = '';
    
    // Create bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = '10px';
        visualizer.appendChild(bar);
    }
    
    const bars = visualizer.querySelectorAll('.visualizer-bar');
    
    function updateVisualization() {
        if (!isRecording) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        bars.forEach((bar, index) => {
            const value = dataArray[index * 3] || 0;
            const height = Math.max(10, (value / 255) * 50);
            bar.style.height = height + 'px';
        });
        
        requestAnimationFrame(updateVisualization);
    }
    
    updateVisualization();
}

function analyzePronunciation(audioBlob) {
    // Simulate pronunciation analysis (in a real app, this would use speech recognition API)
    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    
    document.getElementById('pronunciation-score').textContent = score + '%';
    
    let feedback = '';
    if (score >= 90) {
        feedback = 'Excellent pronunciation! 🎉';
    } else if (score >= 80) {
        feedback = 'Very good! Keep practicing. 👍';
    } else if (score >= 70) {
        feedback = 'Good effort! Focus on clarity. 📈';
    } else {
        feedback = 'Keep practicing! Try speaking slower. 💪';
    }
    
    document.getElementById('feedback-text').textContent = feedback;
}

function setupAudioVisualization() {
    const visualizer = document.getElementById('audio-visualizer');
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = '10px';
        visualizer.appendChild(bar);
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function closeGame() {
    document.getElementById('game-modal').classList.add('hidden');
}

function playAudio(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function startLesson(lessonId) {
    alert(`Starting lesson: ${lessonId}\n\nThis would open the interactive lesson content. In a full implementation, this would load lesson materials, videos, exercises, and track progress.`);
}

// Event Listeners
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Close modal when clicking outside
    document.getElementById('game-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeGame();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGame();
        }
    });
}

// Initialize smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';