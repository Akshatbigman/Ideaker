document.addEventListener('DOMContentLoaded', () => {
    // Three.js Background Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background').appendChild(renderer.domElement);

    // Create animated background
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff6f61,
        wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 5;

    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Achievement and XP System
    const achievementsConfig = [
        { 
            id: 'first_idea', 
            name: 'First Spark', 
            description: 'Generate your first project idea', 
            xpReward: 10,
            unlocked: false
        },
        { 
            id: 'polyglot', 
            name: 'Polyglot Innovator', 
            description: 'Generate ideas in 5 different programming languages', 
            xpReward: 50,
            unlocked: false,
            condition: (state) => state.languagesUsed.size >= 5
        },
        { 
            id: 'versatile_creator', 
            name: 'Versatile Creator', 
            description: 'Generate ideas for 5 different project types', 
            xpReward: 50,
            unlocked: false,
            condition: (state) => state.projectTypesUsed.size >= 5
        },
        { 
            id: 'idea_collector', 
            name: 'Idea Collector', 
            description: 'Generate 10 unique project ideas', 
            xpReward: 75,
            unlocked: false,
            condition: (state) => state.totalIdeasGenerated >= 10
        },
        { 
            id: 'custom_explorer', 
            name: 'Custom Path Explorer', 
            description: 'Use a custom language or project type', 
            xpReward: 25,
            unlocked: false
        }
    ];

    // Game State Management
    const gameState = {
        level: 1,
        xp: 0,
        totalXpEarned: 0,
        unlockedAchievements: [],
        languagesUsed: new Set(),
        projectTypesUsed: new Set(),
        totalIdeasGenerated: 0,
        
        addXP(amount) {
            this.xp += amount;
            this.totalXpEarned += amount;
            
            // Level up calculation
            if (this.xp >= 100) {
                this.level++;
                this.xp -= 100;
                this.showLevelUpNotification();
            }
            
            this.updateUIStats();
        },
        
        showLevelUpNotification() {
            const notification = document.createElement('div');
            notification.classList.add('level-up-notification');
            notification.innerHTML = `
                <h2>Level Up! 🎉</h2>
                <p>You are now Level ${this.level}!</p>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        },
        
        checkAchievements() {
            achievementsConfig.forEach(achievement => {
                // Check if achievement is already unlocked
                if (this.unlockedAchievements.some(a => a.id === achievement.id)) return;
                
                // Check condition-based achievements
                if (achievement.condition) {
                    if (achievement.condition(this)) {
                        this.unlockAchievement(achievement);
                    }
                }
            });
        },
        
        unlockAchievement(achievement) {
    this.unlockedAchievements.push(achievement);
    this.addXP(achievement.xpReward);
    
    // Create achievement popup
    const achievementPopup = document.createElement('div');
    achievementPopup.classList.add('achievement-popup', 'top-right');
    achievementPopup.innerHTML = `
        <div class="achievement-content">
            <h3>Achievement Unlocked! 🏆</h3>
            <p class="achievement-name">${achievement.name}</p>
            <p class="achievement-description">${achievement.description}</p>
            <p class="achievement-xp">+${achievement.xpReward} XP</p>
        </div>
    `;
    
    // Add confetti container
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-container');
    achievementPopup.appendChild(confettiContainer);
    
    // Generate confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        confetti.style.backgroundColor = this.getRandomColor();
        confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(achievementPopup);
    
    // Animate popup
    setTimeout(() => {
        achievementPopup.classList.add('show');
    }, 10);
    
    // Remove popup after 3 seconds
    setTimeout(() => {
        achievementPopup.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(achievementPopup);
        }, 500);
    }, 3000);
},

// Helper method to generate random confetti colors
getRandomColor() {
    const colors = [
        '#ff6f61', // Coral
        '#6f61ff', // Bright Purple
        '#61ff6f', // Bright Green
        '#ff61a1', // Pink
        '#61ffca', // Turquoise
        '#ffa361'  // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
},
        
        updateUIStats() {
            // Update level and XP in UI
            document.getElementById('userLevel').textContent = `Level: ${this.level}`;
            document.getElementById('userXP').textContent = `XP: ${this.xp}/100`;
        },
        
        renderAchievements() {
            const unlockedAchievementsContainer = document.getElementById('unlockedAchievements');
            const achievementListContainer = document.getElementById('achievementList');
            const currentLevelContainer = document.getElementById('currentLevel');
            const totalXPContainer = document.getElementById('totalXP');
            const achievementCountContainer = document.getElementById('achievementCount');

            // Current level and stats
            currentLevelContainer.innerHTML = `
                <h3>Current Level: ${this.level}</h3>
                <p>Total XP Earned: ${this.totalXpEarned}</p>
            `;

            // Unlocked achievements
            unlockedAchievementsContainer.innerHTML = this.unlockedAchievements.length > 0 
                ? this.unlockedAchievements.map(a => `
                    <div class="achievement-item">
                        <strong>${a.name}</strong>
                        <p>${a.description}</p>
                    </div>
                `).join('') 
                : '<p>No achievements unlocked yet.</p>';

            // All achievements list
            achievementListContainer.innerHTML = achievementsConfig.map(a => `
                <div class="achievement-item ${this.unlockedAchievements.some(ua => ua.id === a.id) ? 'unlocked' : 'locked'}">
                    <strong>${a.name}</strong>
                    <p>${a.description}</p>
                    <p>XP Reward: ${a.xpReward}</p>
                </div>
            `).join('');

            // Achievement count
            achievementCountContainer.innerHTML = `
                <h3>Achievements: ${this.unlockedAchievements.length}/${achievementsConfig.length}</h3>
            `;
        }
    };

    // Modify existing code to integrate achievements
    const languages = [
        "JavaScript", "Python", "Java", "C++", "Ruby",
        "PHP", "Swift", "Go", "Rust", "TypeScript"
    ];
    
    const projectTypes = [
        "Web App", "Mobile App", "Game", "CLI Tool",
        "API", "Database", "AI/ML", "Desktop App"
    ];
    const ideaHistory = [];

    // Unique Idea Prompts
    const uniquePrompts = [
        "Create an innovative and unconventional project that solves an unexpected problem.",
        "Design a project that combines two seemingly unrelated technologies in a creative way.",
        "Develop a solution that pushes the boundaries of traditional application design.",
        "Conceptualize a project that addresses a niche but impactful technological challenge.",
        "Imagine a project that transforms a mundane task into an engaging experience."
    ];

    let selectedLanguage = null;
    let selectedType = null;

    // Get references to DOM elements
    const languageButtons = document.getElementById('languageButtons');
    const typeButtons = document.getElementById('typeButtons');
    const generateButton = document.getElementById('generateButton');
    const ideaPopup = document.getElementById('ideaPopup');
    const ideaPopupContent = document.getElementById('ideaPopupContent');
    const historyIcon = document.getElementById('historyIcon');
    const otherLanguagePopup = document.getElementById('otherLanguagePopup');
    const otherTypePopup = document.getElementById('otherTypePopup');

    // Populate language buttons
    languages.forEach((lang) => {
        const button = document.createElement('button');
        button.textContent = lang;
        button.addEventListener('click', () => {
            // Remove 'selected' from all language buttons
            languageButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedLanguage = lang;
        });
        languageButtons.appendChild(button);
    });

    // Populate type buttons
    projectTypes.forEach((type) => {
        const button = document.createElement('button');
        button.textContent = type;
        button.addEventListener('click', () => {
            // Remove 'selected' from all type buttons
            typeButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedType = type;
        });
        typeButtons.appendChild(button);
    });

    // Enter Button
    const enterButton = document.getElementById('enterButton');
    const landingPage = document.getElementById('landing');
    const generatorPage = document.getElementById('generator');
    
    enterButton.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        generatorPage.classList.remove('hidden');
    });

    // Other Language Button
    const otherLanguageButton = document.getElementById('otherLanguageButton');
    
    otherLanguageButton.addEventListener('click', () => {
        otherLanguagePopup.style.display = 'flex';
    });

    // Other Type Button
    const otherTypeButton = document.getElementById('otherTypeButton');
    
    otherTypeButton.addEventListener('click', () => {
        otherTypePopup.style.display = 'flex';
    });

    // Close Popup Buttons
    const closePopupButtons = document.querySelectorAll('.close-popup');
    
    closePopupButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const popup = e.target.closest('.popup');
            popup.style.display = 'none';
        });
    });

    // Stats Icon
    document.getElementById('statsIcon').addEventListener('click', () => {
        gameState.renderAchievements();
        document.getElementById('statsPopup').style.display = 'flex';
    });

    // Confirm Other Language
    document.getElementById('confirmOtherLanguage').addEventListener('click', () => {
        const customLanguage = document.getElementById('customLanguageInput').value.trim();
        if (customLanguage) {
            // Remove 'selected' from all language buttons
            languageButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
            selectedLanguage = customLanguage;
            otherLanguagePopup.style.display = 'none';
            
            // Unlock custom explorer achievement
            gameState.unlockAchievement(
                achievementsConfig.find(a => a.id === 'custom_explorer')
            );
        }
    });

    // Confirm Other Type
    document.getElementById('confirmOtherType').addEventListener('click', () => {
        const customType = document.getElementById('customTypeInput').value.trim();
        if (customType) {
            // Remove 'selected' from all type buttons
            typeButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
            selectedType = customType;
            otherTypePopup.style.display = 'none';
            
            // Unlock custom explorer achievement
            gameState.unlockAchievement(
                achievementsConfig.find(a => a.id === 'custom_explorer')
            );
        }
    });

    // Generate Idea Button
    generateButton.addEventListener('click', async () => {
        if (!selectedLanguage || !selectedType) {
            alert('Please select both a language and a project type.');
            return;
        }

        ideaPopupContent.textContent = 'Generating unique idea...';
        ideaPopup.style.display = 'flex';

        try {
            const response = await fetch('https://jamsapi.hackclub.dev/openai/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer XPVII6L7AMIKG0TON1BVPT40VC3MBVQENMPAWPKP34PDOB3A1QB36IKH8MBIT1J3',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { 
                            role: 'system', 
                            content: `Generate a highly innovative and unconventional project idea. 
                            Focus on creativity, uniqueness, and solving problems in unexpected ways. 
                            Provide a concise, punchy title and a brief two-line description.` 
                        },
                        { 
                            role: 'user', 
                            content: `Create a unique ${selectedType} project using ${selectedLanguage} that follows this prompt: ${uniquePrompts[Math.floor(Math.random() * uniquePrompts.length)]}` 
                        },
                    ],
                    max_tokens: 100
                }),
            });

            const data = await response.json();
            const idea = data.choices[0].message.content.trim();
            
            // Format the idea with centered title and description
            const formattedIdea = `Title:
${idea.split('\n')[0]}

Description:
${idea.split('\n').slice(1).join('\n').trim()}`;
            
            // Save to history
            ideaHistory.push(formattedIdea);
            
            ideaPopupContent.innerHTML = formattedIdea.replace(/\n/g, '<br>');

            // Update game state and check achievements
            gameState.totalIdeasGenerated++;
            gameState.languagesUsed.add(selectedLanguage);
            gameState.projectTypesUsed.add(selectedType);

            // First Idea Achievement
            if (gameState.totalIdeasGenerated === 1) {
                gameState.unlockAchievement(
                    achievementsConfig.find(a => a.id === 'first_idea')
                );
            }

            // Check other achievement conditions
            gameState.checkAchievements();

            // Add XP for generating an idea
            gameState.addXP(15);

        } catch (error) {
            ideaPopupContent.textContent = 'Error generating idea. Please try again.';
            console.error(error);
        }
    });

    // History Icon
    historyIcon.addEventListener('click', () => {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; // Clear previous list

        if (ideaHistory.length === 0) {
            historyList.innerHTML = '<p>No previous ideas yet.</p>';
        } else {
            ideaHistory.forEach((idea, index) => {
                const listItem = document.createElement('div');
                listItem.innerHTML = `${index + 1}. ${idea.replace(/\n/g, '<br>')}`;
                historyList.appendChild(listItem);
            });
        }

        document.getElementById('historyPopup').style.display = 'flex';
    });
});