# AI English Learning Hub

A comprehensive English learning website powered by AI tools, featuring interactive quizzes, personalized courses, educational games, and pronunciation training.

## Features

### 🎯 **Assessment Quiz**
- 15 AI-generated questions covering grammar, reading, and listening
- Automatic level assessment (Beginner, Intermediate, Advanced)
- Progress tracking and detailed scoring

### 📚 **Personalized Courses**
- AI-generated course content based on quiz results
- Level-appropriate lessons and exercises
- Interactive learning modules with progress tracking

### 🎮 **Educational Games**
- **Vocabulary Match**: Match words with their meanings
- **Grammar Challenge**: Interactive grammar exercises
- **Spelling Bee**: Word unscrambling and spelling practice
- **Listen & Learn**: Audio comprehension games

### 🗣️ **Pronunciation Trainer**
- Speech recognition technology
- Real-time pronunciation scoring
- Audio visualization
- Practice words with phonetic transcriptions

### 🎨 **Modern UI/UX**
- Beautiful 3D animated landing page
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js
- **Animations**: GSAP (GreenSock)
- **Audio**: Web Audio API, Speech Recognition API
- **Styling**: Modern CSS with Flexbox/Grid

## Getting Started

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose "main"
4. Your site will be available at `https://yourusername.github.io/ai-english-learning-hub`

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-english-learning-hub.git
   ```
2. Open `index.html` in your web browser
3. For best experience, serve via a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## Browser Compatibility

- **Chrome/Edge**: Full feature support
- **Firefox**: Full feature support
- **Safari**: Full feature support (iOS 14.5+)
- **Mobile**: Responsive design, touch-friendly

## Features Overview

### Landing Page
- Interactive 3D particle system
- Floating animated cards
- Smooth scroll navigation
- Call-to-action buttons

### Quiz System
- Dynamic question generation
- Multiple question types (Grammar, Reading, Listening)
- Progress bar and question counter
- Immediate feedback and scoring

### Course Generation
- AI-powered content based on assessment results
- Structured learning modules
- Difficulty-appropriate lessons
- Interactive lesson cards

### Games
- **Vocabulary Match**: Drag-and-drop word matching
- **Grammar Challenge**: Multiple choice grammar questions
- **Spelling Game**: Unscramble words
- **Listening Game**: Audio transcription

### Pronunciation Tool
- Microphone access for recording
- Audio visualization
- Pronunciation scoring simulation
- Multiple practice words
- Phonetic transcription display

## Customization

### Adding New Questions
Edit the `questionBank` object in `script.js`:

```javascript
const questionBank = {
    grammar: [
        {
            type: 'Grammar',
            question: 'Your question here',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correct: 0, // Index of correct answer
            explanation: 'Explanation of the correct answer'
        }
    ]
    // ... more categories
};
```

### Adding New Games
Create new game functions in `script.js` and add them to the games grid in `index.html`.

### Styling Customization
Modify `styles.css` to change colors, fonts, animations, and layout.

## Performance Optimization

- Lazy loading of 3D assets
- Efficient audio handling
- Responsive images and media queries
- Optimized animations for smooth performance

## Future Enhancements

- [ ] Integration with real AI language models
- [ ] User accounts and progress saving
- [ ] More advanced speech recognition
- [ ] Additional game types
- [ ] Multi-language support
- [ ] Offline mode capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions, please open an issue on GitHub.

---

**Made with ❤️ for English learners worldwide**