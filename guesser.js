// Anatomy Data
const anatomyData = {
    bones: {
        skull: {
            name: "Skull",
            hint: "Protects your brain",
            funFact: "🧠 The skull has 22 bones! It protects your brain and gives your face its shape.",
            centerX: 200,
            centerY: 60
        },
        clavicle: {
            name: "Clavicle",
            hint: "Also called the collar bone",
            funFact: "🦴 The clavicle is one of the most commonly broken bones, often from falls or sports injuries!",
            centerX: 200,
            centerY: 107
        },
        ribs: {
            name: "Ribs",
            hint: "Protects your heart and lungs",
            funFact: "🫁 You have 24 ribs - 12 pairs! They form a protective cage around your vital organs.",
            centerX: 200,
            centerY: 200
        },
        humerus: {
            name: "Humerus",
            hint: "The upper arm bone",
            funFact: "💪 The humerus is the longest bone in your arm, extending from shoulder to elbow!",
            centerX: 120,
            centerY: 180
        },
        spine: {
            name: "Spine",
            hint: "Your backbone, made of many vertebrae",
            funFact: "🦴 Your spine has 33 vertebrae and allows you to bend, twist, and stand upright!",
            centerX: 200,
            centerY: 230
        },
        pelvis: {
            name: "Pelvis",
            hint: "Hip bones that support your body",
            funFact: "🦴 The pelvis supports your spine and protects organs in your lower abdomen!",
            centerX: 200,
            centerY: 340
        },
        femur: {
            name: "Femur",
            hint: "The longest bone in the human body",
            funFact: "🦴 The femur is the longest, strongest bone in your body! It can support 30x your body weight!",
            centerX: 180,
            centerY: 445
        },
        tibia: {
            name: "Tibia",
            hint: "The larger shin bone",
            funFact: "🦴 The tibia is the second-largest bone in your body and bears most of your weight when standing!",
            centerX: 175,
            centerY: 600
        }
    },
    organs: {
        brain: {
            name: "Brain",
            hint: "Controls all your thoughts and movements",
            funFact: "🧠 Your brain contains about 86 billion neurons and uses 20% of your body's energy!",
            centerX: 200,
            centerY: 60
        },
        heart: {
            name: "Heart",
            hint: "Pumps blood throughout your body",
            funFact: "❤️ Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood!",
            centerX: 200,
            centerY: 180
        },
        lungs: {
            name: "Lungs",
            hint: "Help you breathe oxygen",
            funFact: "🫁 Your lungs contain about 300 million alveoli for gas exchange!",
            centerX: 200,
            centerY: 200
        },
        liver: {
            name: "Liver",
            hint: "Filters toxins and produces bile",
            funFact: "🫀 The liver is the largest internal organ and can regenerate itself!",
            centerX: 220,
            centerY: 240
        },
        stomach: {
            name: "Stomach",
            hint: "Digests your food",
            funFact: "🫃 Your stomach acid is strong enough to dissolve metal, but your stomach lining protects you!",
            centerX: 200,
            centerY: 260
        },
        intestines: {
            name: "Intestines",
            hint: "Absorb nutrients from food",
            funFact: "🦠 Your small intestine is about 20 feet long! It's where most nutrient absorption happens.",
            centerX: 200,
            centerY: 320
        }
    }
};

// Game State
let gameState = {
    currentMode: 'bones',
    currentQuestion: null,
    userAnswer: null,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalQuestions: 0
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    loadNewQuestion();
});

function initializeGame() {
    // Load saved progress from localStorage
    const savedState = localStorage.getItem('anatomyGuesserState');
    if (savedState) {
        const saved = JSON.parse(savedState);
        gameState.score = saved.score || 0;
        gameState.streak = saved.streak || 0;
        gameState.correctAnswers = saved.correctAnswers || 0;
        updateUI();
    }
}

function setupEventListeners() {
    // Learning mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLearningMode(btn.dataset.mode);
        });
    });

    // Toggle between bones and organs
    document.getElementById('bones-toggle').addEventListener('click', () => {
        switchViewType('bones');
    });

    document.getElementById('organs-toggle').addEventListener('click', () => {
        switchViewType('organs');
    });

    // Body diagram clicks
    document.getElementById('body-svg').addEventListener('click', (e) => {
        handleBodyClick(e);
    });

    // Clickable regions
    document.querySelectorAll('.clickable-region').forEach(region => {
        region.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRegionClick(region);
        });
    });

    // Submit button
    document.getElementById('submit-btn').addEventListener('click', () => {
        checkAnswer();
    });

    // Next button
    document.getElementById('next-btn').addEventListener('click', () => {
        loadNewQuestion();
    });
}

function switchLearningMode(mode) {
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    // Hide all content
    document.querySelectorAll('.quiz-content, .video-content, .audio-content, .flashcard-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Show selected content
    switch(mode) {
        case 'quiz':
            document.getElementById('quiz-content').classList.remove('hidden');
            break;
        case 'video':
            document.getElementById('video-content').classList.remove('hidden');
            break;
        case 'audio':
            document.getElementById('audio-content').classList.remove('hidden');
            break;
        case 'flashcard':
            document.getElementById('flashcard-content').classList.remove('hidden');
            break;
    }
}

function switchViewType(type) {
    gameState.currentMode = type;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (type === 'bones') {
        document.getElementById('bones-toggle').classList.add('active');
        // Show skeleton, hide organs
        document.getElementById('skeleton').style.display = 'block';
        document.getElementById('organs-view').style.display = 'none';
        document.getElementById('bones-regions').style.display = 'block';
        document.getElementById('organs-regions').style.display = 'none';
    } else {
        document.getElementById('organs-toggle').classList.add('active');
        // Show organs, hide skeleton
        document.getElementById('skeleton').style.display = 'none';
        document.getElementById('organs-view').style.display = 'block';
        document.getElementById('bones-regions').style.display = 'none';
        document.getElementById('organs-regions').style.display = 'block';
    }
    
    // Load new question for the selected type
    loadNewQuestion();
}

function loadNewQuestion() {
    // Reset UI
    hideMarkers();
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('next-btn').style.display = 'none';
    gameState.userAnswer = null;

    // Get random anatomy part
    const data = anatomyData[gameState.currentMode];
    const parts = Object.keys(data);
    const randomPart = parts[Math.floor(Math.random() * parts.length)];
    
    gameState.currentQuestion = {
        partName: randomPart,
        ...data[randomPart]
    };

    // Update question display
    document.getElementById('target-name').textContent = gameState.currentQuestion.name;
    document.getElementById('hint').textContent = `💡 Hint: ${gameState.currentQuestion.hint}`;
}

function handleBodyClick(e) {
    const svg = document.getElementById('body-svg');
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (400 / rect.width);
    const y = (e.clientY - rect.top) * (800 / rect.height);
    
    placeMarker(x, y);
}

function handleRegionClick(region) {
    const partName = region.getAttribute('data-name');
    
    // Get center of the region
    let x, y;
    if (region.tagName === 'circle') {
        x = parseFloat(region.getAttribute('cx'));
        y = parseFloat(region.getAttribute('cy'));
    } else if (region.tagName === 'rect') {
        x = parseFloat(region.getAttribute('x')) + parseFloat(region.getAttribute('width')) / 2;
        y = parseFloat(region.getAttribute('y')) + parseFloat(region.getAttribute('height')) / 2;
    } else if (region.tagName === 'ellipse') {
        x = parseFloat(region.getAttribute('cx'));
        y = parseFloat(region.getAttribute('cy'));
    }
    
    placeMarker(x, y);
}

function placeMarker(x, y) {
    gameState.userAnswer = { x, y };
    
    // Show user marker
    const marker = document.getElementById('user-marker');
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', y);
    marker.setAttribute('opacity', '1');
    
    // Enable submit button
    document.getElementById('submit-btn').disabled = false;
}

function checkAnswer() {
    if (!gameState.userAnswer) return;
    
    const correctX = gameState.currentQuestion.centerX;
    const correctY = gameState.currentQuestion.centerY;
    const userX = gameState.userAnswer.x;
    const userY = gameState.userAnswer.y;
    
    // Calculate distance
    const distance = Math.sqrt(Math.pow(correctX - userX, 2) + Math.pow(correctY - userY, 2));
    
    // Show correct marker
    const correctMarker = document.getElementById('correct-marker');
    correctMarker.setAttribute('cx', correctX);
    correctMarker.setAttribute('cy', correctY);
    correctMarker.setAttribute('opacity', '1');
    
    // Check if answer is correct (within 50px radius)
    const isCorrect = distance < 50;
    
    // Update game state
    gameState.totalQuestions++;
    
    const feedback = document.getElementById('feedback');
    feedback.classList.add('show');
    
    if (isCorrect) {
        gameState.score += 10;
        gameState.correctAnswers++;
        gameState.streak++;
        
        feedback.classList.add('correct');
        feedback.innerHTML = `
            <div>🎉 Correct! +10 XP</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        
        playSound('correct');
    } else {
        feedback.classList.add('incorrect');
        feedback.innerHTML = `
            <div>❌ Not quite! The correct location is marked in green.</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        
        gameState.streak = 0;
        playSound('incorrect');
    }
    
    // Update UI
    updateUI();
    saveProgress();
    
    // Show next button
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
}

function hideMarkers() {
    document.getElementById('user-marker').setAttribute('opacity', '0');
    document.getElementById('correct-marker').setAttribute('opacity', '0');
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('correct').textContent = gameState.correctAnswers;
}

function saveProgress() {
    localStorage.setItem('anatomyGuesserState', JSON.stringify({
        score: gameState.score,
        streak: gameState.streak,
        correctAnswers: gameState.correctAnswers
    }));
}

function playSound(type) {
    // Placeholder for sound effects
    // In a full implementation, you would play actual audio files
    if (type === 'correct') {
        console.log('🔊 Playing success sound');
    } else {
        console.log('🔊 Playing try again sound');
    }
}

// Flashcard functionality
document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
    }
});
