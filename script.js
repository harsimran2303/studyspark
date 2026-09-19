// ===== STATE MANAGEMENT =====
let state = {
    subject: '',
    difficulty: '',
    timerInterval: null,
    timeLeft: 60,
    score: 0,
    challengeActive: false
};

// ===== CHALLENGE DATA =====
const challenges = {
    easy: [
        "Explain the basic concept of {subject} in 2-3 sentences",
        "List 3 key points about {subject}",
        "Create a simple definition for {subject}",
        "Give 2 real-world examples of {subject}",
        "Write down 4 important terms related to {subject}",
        "Summarize {subject} in one paragraph",
        "Explain how {subject} applies to your daily life",
        "Name 5 things you know about {subject}"
    ],
    medium: [
        "Compare and contrast two aspects of {subject}",
        "Explain the main principles behind {subject}",
        "Create a timeline of important events in {subject}",
        "Develop a mind map with {subject} at the center",
        "Explain how {subject} connects to other topics",
        "Write a detailed explanation of {subject}",
        "Analyze a problem related to {subject}",
        "Create 5 study questions about {subject}"
    ],
    hard: [
        "Critically analyze a complex concept in {subject}",
        "Develop a comprehensive study guide for {subject}",
        "Create an advanced problem-solving scenario using {subject}",
        "Synthesize information from {subject} and another discipline",
        "Propose a hypothesis related to {subject}",
        "Evaluate different theories or approaches in {subject}",
        "Design an experiment or project based on {subject}",
        "Create a detailed explanation of an advanced topic in {subject}"
    ]
};

// ===== MOTIVATIONAL MESSAGES =====
const motivationalMessages = [
    "🌟 Every challenge makes you smarter!",
    "💪 You're crushing it! Keep going!",
    "🚀 Progress over perfection!",
    "🎯 You've got this! Stay focused!",
    "⚡ Amazing effort! You're building knowledge!",
    "🏆 Consistency is key to mastery!",
    "💡 Great learning in progress!",
    "🔥 You're on fire! Keep studying!",
    "✨ Every minute counts toward your success!",
    "🎓 Learning is your superpower!",
    "👏 You're doing great! Keep pushing!",
    "🌈 Growth happens outside your comfort zone!",
    "📚 Knowledge is power! You're becoming powerful!",
    "⭐ Your effort today = Your success tomorrow!",
    "🎉 Never stop learning! You're amazing!"
];

// ===== DOM ELEMENTS =====
const subjectInput = document.getElementById('subject');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const generateBtn = document.getElementById('generateBtn');
const completeBtn = document.getElementById('completeBtn');
const newChallengeBtn = document.getElementById('newChallengeBtn');
const challengeSection = document.getElementById('challengeSection');
const challengeText = document.getElementById('challengeText');
const subjectTag = document.getElementById('subjectTag');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const motivationText = document.getElementById('motivationText');
const selectedDifficultyText = document.getElementById('selectedDifficulty');

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', selectDifficulty);
    });

    generateBtn.addEventListener('click', generateChallenge);
    completeBtn.addEventListener('click', completeChallenge);
    newChallengeBtn.addEventListener('click', newChallenge);
    subjectInput.addEventListener('focus', function() {
        if (state.challengeActive) {
            updateMotivation();
        }
    });
});

// ===== DIFFICULTY SELECTION =====
function selectDifficulty(e) {
    const difficulty = e.target.getAttribute('data-difficulty');
    
    // Remove active class from all buttons
    difficultyButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    // Update state
    state.difficulty = difficulty;
    
    // Update display text
    const difficultyLabels = {
        easy: 'Easy ⭐',
        medium: 'Medium ⭐⭐',
        hard: 'Hard ⭐⭐⭐'
    };
    selectedDifficultyText.textContent = `Selected: ${difficultyLabels[difficulty]}`;
    selectedDifficultyText.style.color = '#667eea';
}

// ===== GENERATE CHALLENGE =====
function generateChallenge() {
    const subject = subjectInput.value.trim();
    const difficulty = state.difficulty;
    
    // Validation
    if (!subject) {
        alert('Please enter a subject! 📚');
        subjectInput.focus();
        return;
    }
    
    if (!difficulty) {
        alert('Please select a difficulty level! 🎯');
        return;
    }
    
    // Get random challenge
    const challengeArray = challenges[difficulty];
    const randomChallenge = challengeArray[Math.floor(Math.random() * challengeArray.length)];
    const finalChallenge = randomChallenge.replace('{subject}', subject);
    
    // Update state
    state.subject = subject;
    state.challengeActive = true;
    state.timeLeft = 60;
    
    // Display challenge
    challengeText.textContent = finalChallenge;
    subjectTag.textContent = `📖 ${subject} • ${difficulty.toUpperCase()}`;
    
    // Show challenge section
    challengeSection.style.display = 'block';
    
    // Enable complete button
    completeBtn.disabled = false;
    
    // Reset and start timer
    clearInterval(state.timerInterval);
    timerDisplay.textContent = '60';
    timerDisplay.classList.remove('warning', 'danger');
    updateMotivation();
    startTimer();
    
    // Scroll to challenge
    setTimeout(() => {
        challengeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// ===== TIMER =====
function startTimer() {
    state.timerInterval = setInterval(function() {
        state.timeLeft--;
        timerDisplay.textContent = state.timeLeft;
        
        // Update timer color based on time left
        if (state.timeLeft <= 10 && state.timeLeft > 5) {
            timerDisplay.classList.add('warning');
            timerDisplay.classList.remove('danger');
        } else if (state.timeLeft <= 5) {
            timerDisplay.classList.add('danger');
        } else {
            timerDisplay.classList.remove('warning', 'danger');
        }
        
        // Time's up
        if (state.timeLeft <= 0) {
            endChallenge();
        }
    }, 1000);
}

// ===== COMPLETE CHALLENGE =====
function completeChallenge() {
    if (!state.challengeActive) return;
    
    // Add 10 points
    state.score += 10;
    scoreDisplay.textContent = state.score;
    
    // Animate score
    scoreDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
    }, 200);
    
    // Show celebration message
    updateMotivation();
    
    // Disable button and show new challenge button
    completeBtn.disabled = true;
    newChallengeBtn.style.display = 'inline-block';
}

// ===== END CHALLENGE =====
function endChallenge() {
    clearInterval(state.timerInterval);
    state.challengeActive = false;
    completeBtn.disabled = true;
    motivationText.textContent = "⏰ Time's up! Click 'New Challenge' to continue learning!";
}

// ===== NEW CHALLENGE =====
function newChallenge() {
    state.timeLeft = 60;
    state.challengeActive = true;
    
    // Reset timer display
    timerDisplay.textContent = '60';
    timerDisplay.classList.remove('warning', 'danger');
    
    // Clear challenge section
    challengeSection.style.display = 'none';
    
    // Reset form
    subjectInput.value = '';
    difficultyButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    selectedDifficultyText.textContent = 'Select a difficulty level';
    selectedDifficultyText.style.color = 'var(--text-light)';
    state.difficulty = '';
    
    // Reset buttons
    completeBtn.disabled = true;
    newChallengeBtn.style.display = 'none';
    
    // Clear timer
    clearInterval(state.timerInterval);
    
    // Update motivation
    updateMotivation();
    
    // Scroll to top
    subjectInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    subjectInput.focus();
}

// ===== UPDATE MOTIVATION =====
function updateMotivation() {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    motivationText.textContent = randomMessage;
}

// ===== INITIAL SETUP =====
window.addEventListener('load', function() {
    updateMotivation();
    scoreDisplay.textContent = state.score;
    timerDisplay.textContent = state.timeLeft;
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (state.challengeActive && !completeBtn.disabled) {
            completeChallenge();
        } else if (!state.challengeActive && !subjectInput.value.trim()) {
            subjectInput.focus();
        }
    }
});
