document.addEventListener('DOMContentLoaded', function() {
    // Mobile detection function
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }

    const isMobile = isMobileDevice();

    const askButton = document.getElementById("ask-button");
    const questionInput = document.getElementById("question");
    const magicSound = document.getElementById("sound");
    const ballAnswer = document.getElementById("ball-answer");
    const ball = document.querySelector(".ball");
    const innerCircle = document.querySelector(".inner-circle");
    const answerTriangle = document.querySelector(".answer-triangle");
    const ballOverlay = document.querySelector(".ball-overlay");
    const contentWrapper = document.querySelector(".content-wrapper");
    const askSection = document.getElementById("ask-section");
    const shadow = document.querySelector(".shadow");
    const voiceBtn = document.getElementById("voice-btn");
    const chatInputContainer = document.getElementById("chat-input-container");

    // Voice animation elements
    const voiceAnimation = document.getElementById('voiceAnimation');
    const voiceLoader = document.getElementById('voiceLoader');
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceBars = voiceLoader ? voiceLoader.querySelectorAll('div') : [];

    // Voice animation variables (for desktop only)
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;
    let isVoiceActive = false;
    let voiceRecognitionTimeout;

    // Hide voice animation on mobile
    if (isMobile) {
        voiceAnimation.style.display = 'none';
    }

    // Initialize button state
    updateSendButtonState();

    // Update send button state based on input
    function updateSendButtonState() {
        const hasText = questionInput.value.trim().length > 0;
        askButton.disabled = !hasText;
    }

    // Voice recognition functionality
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceBtn.addEventListener('click', () => {
            if (isVoiceActive) {
                stopVoiceRecognition();
            } else {
                startVoiceRecognition();
            }
        });

        function startVoiceRecognition() {
            if (isMobile) {
                // Simple voice recognition for mobile
                startSimpleVoiceRecognition();
            } else {
                // Full visualizer for desktop
                startDesktopVoiceRecognition();
            }
        }

        function startSimpleVoiceRecognition() {
            try {
                recognition.start();
                voiceBtn.classList.add('recording');
                isVoiceActive = true;
                voiceBtn.title = "Listening... Click to stop";
            } catch (error) {
                console.error('Speech recognition error:', error);
                alert('Error starting voice recognition. Please try again.');
                stopVoiceRecognition();
            }
        }

        function startDesktopVoiceRecognition() {
            // Smooth transition: hide search bar first
            chatInputContainer.classList.remove('visible');
            chatInputContainer.classList.add('hidden');
            
            // Wait for hide animation to complete, then show voice animation
            setTimeout(() => {
                voiceAnimation.classList.remove('fade-out');
                voiceAnimation.classList.add('active');
                
                // Start voice visualization
                startVoiceVisualization();
                
                try {
                    recognition.start();
                    voiceBtn.classList.add('recording');
                    voiceStatus.textContent = "Listening...";
                    voiceStatus.className = "voice-status";
                    voiceStatus.style.color = "#4facfe";
                    isVoiceActive = true;
                    
                    // Set timeout for auto-stop if no speech detected
                    clearTimeout(voiceRecognitionTimeout);
                    voiceRecognitionTimeout = setTimeout(() => {
                        if (isVoiceActive) {
                            voiceStatus.textContent = "No speech detected";
                            voiceStatus.classList.add('error');
                            setTimeout(stopVoiceRecognition, 1500);
                        }
                    }, 5000);
                    
                } catch (error) {
                    console.error('Speech recognition error:', error);
                    voiceStatus.textContent = "Error starting voice recognition";
                    voiceStatus.classList.add('error');
                    setTimeout(stopVoiceRecognition, 1500);
                }
            }, 300);
        }

        function stopVoiceRecognition() {
            clearTimeout(voiceRecognitionTimeout);
            
            if (!isMobile) {
                // First fade out voice animation (desktop only)
                voiceAnimation.classList.remove('active');
                voiceAnimation.classList.add('fade-out');
                
                // Stop voice visualization (desktop only)
                stopVoiceVisualization();
                
                // Wait for fade-out animation to complete, then show search bar
                setTimeout(() => {
                    chatInputContainer.classList.remove('hidden');
                    chatInputContainer.classList.add('visible');
                    
                    // Reset voice status for next use
                    setTimeout(() => {
                        voiceStatus.className = "voice-status";
                        voiceStatus.style.color = "";
                    }, 500);
                }, 300);
            }
            
            voiceBtn.classList.remove('recording');
            isVoiceActive = false;
            voiceBtn.title = "Speak your question";
            
            try {
                recognition.stop();
            } catch (error) {
                // Ignore stop errors
            }
        }

        // Voice visualization functions (desktop only)
        function startVoiceVisualization() {
            if (isMobile) return;
            
            isVoiceActive = true;
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.warn('getUserMedia not supported');
                return;
            }
            
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(function(stream) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioContext.createAnalyser();
                    microphone = audioContext.createMediaStreamSource(stream);
                    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
                    
                    analyser.smoothingTimeConstant = 0.8;
                    analyser.fftSize = 1024;
                    
                    microphone.connect(analyser);
                    analyser.connect(javascriptNode);
                    javascriptNode.connect(audioContext.destination);
                    
                    javascriptNode.onaudioprocess = function() {
                        if (!isVoiceActive) return;
                        
                        const array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        
                        let values = 0;
                        const length = array.length;
                        
                        for (let i = 0; i < length; i++) {
                            values += array[i];
                        }
                        
                        const average = values / length;
                        updateVoiceBars(average);
                    };
                })
                .catch(function(err) {
                    console.error('Error accessing microphone:', err);
                    voiceStatus.textContent = "Microphone access failed";
                    voiceStatus.classList.add('error');
                    setTimeout(stopVoiceRecognition, 1500);
                });
        }

        function stopVoiceVisualization() {
            if (isMobile) return;
            
            if (javascriptNode) {
                javascriptNode.disconnect();
            }
            if (microphone) {
                microphone.disconnect();
            }
            if (analyser) {
                analyser.disconnect();
            }
            if (audioContext) {
                audioContext.close();
            }
            
            // Smoothly reset bars to original size
            voiceBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.height = '12px';
                    bar.style.background = 'linear-gradient(to top, #4facfe, #00f2fe)';
                    bar.style.transform = 'scale(1)';
                }, index * 30);
            });
        }

        function updateVoiceBars(volume) {
            if (isMobile) return;
            
            const maxHeight = 30;
            const baseHeight = 12;
            const normalizedVolume = Math.min(volume / 100, 1);
            const heightVariation = (maxHeight - baseHeight) * normalizedVolume;
            
            voiceBars.forEach((bar, index) => {
                setTimeout(() => {
                    const newHeight = baseHeight + heightVariation;
                    bar.style.height = `${newHeight}px`;
                    
                    // Add slight scale effect for more dynamic animation
                    const scale = 1 + (normalizedVolume * 0.2);
                    bar.style.transform = `scale(${scale})`;
                    
                    // Change color based on volume intensity
                    if (normalizedVolume > 0.7) {
                        bar.style.background = 'linear-gradient(to top, #1e40af, #3b82f6)';
                    } else if (normalizedVolume > 0.4) {
                        bar.style.background = 'linear-gradient(to top, #3b82f6, #60a5fa)';
                    } else {
                        bar.style.background = 'linear-gradient(to top, #93c5fd, #bfdbfe)';
                    }
                }, index * 50);
            });
        }

        recognition.onresult = (event) => {
            clearTimeout(voiceRecognitionTimeout);
            const transcript = event.results[0][0].transcript;
            console.log('Speech recognized:', transcript);
            
            // Update the input field
            questionInput.value = transcript;
            
            // Update send button state
            updateSendButtonState();
            
            if (!isMobile) {
                // Show success message with smooth animation (desktop only)
                voiceStatus.textContent = "Question received!";
                voiceStatus.classList.add('success');
                
                // Wait a moment then close animation and show search bar
                setTimeout(() => {
                    stopVoiceRecognition();
                }, 1200);
            } else {
                // Mobile: stop immediately
                stopVoiceRecognition();
                
                // Auto-focus on input after voice input for mobile
                setTimeout(() => {
                    questionInput.focus();
                }, 100);
            }
        };
        
        recognition.onend = () => {
            if (isVoiceActive) {
                // Only stop if we're still active (not already stopping)
                setTimeout(stopVoiceRecognition, 100);
            }
        };

        recognition.onerror = (event) => {
            clearTimeout(voiceRecognitionTimeout);
            console.error('Speech recognition error:', event.error);
            
            if (isMobile) {
                // Simple error handling for mobile
                let errorMessage = "Voice recognition error";
                if (event.error === 'audio-capture') {
                    errorMessage = "No microphone found";
                } else if (event.error === 'not-allowed') {
                    errorMessage = "Microphone access denied";
                } else {
                    errorMessage = "Error: " + event.error;
                }
                alert(errorMessage);
                stopVoiceRecognition();
            } else {
                // Desktop error handling with visual feedback
                if (event.error === 'audio-capture') {
                    voiceStatus.textContent = "No microphone found";
                } else if (event.error === 'not-allowed') {
                    voiceStatus.textContent = "Microphone access denied";
                } else {
                    voiceStatus.textContent = "Error: " + event.error;
                }
                
                voiceStatus.classList.add('error');
                
                setTimeout(() => {
                    stopVoiceRecognition();
                }, 2000);
            }
        };

    } else {
        // Browser doesn't support speech recognition
        voiceBtn.addEventListener('click', () => {
            alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or another supported browser.');
        });
        voiceBtn.style.opacity = '0.5';
        voiceBtn.style.cursor = 'not-allowed';
        voiceBtn.title = 'Voice input not supported';
    }

    // Handle Enter key press
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !askButton.disabled) {
            askButton.click();
        }
    });

    // Update send button state on input change
    questionInput.addEventListener('input', updateSendButtonState);

    // Focus input when clicking on the container
    chatInputContainer.addEventListener('click', (e) => {
        if (e.target === chatInputContainer) {
            questionInput.focus();
        }
    });

    askButton.addEventListener("click", function () {
        const question = questionInput.value;
        if (!question.trim()) {
            alert("Please ask a question!");
            return;
        }

        const answers = [
            "Yes, definitely", "Yes, absolutely", "You can count on it",
            "Most likely", "Yes", "Outlook good", "Yes, in due time",
            "Without a doubt", "Definitely not", "My sources say yes",
            "No", "No, not at all", "My sources say no", "Very unlikely",
            "Don't count on it", "Ask again later", "Cannot predict now",
            "Concentrate and ask again", "Not sure, try again", "My reply is no"
        ];

        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

        // Start everything
        magicSound.currentTime = 0;
        magicSound.play();
        
        // Hide ask section with smooth transition
        contentWrapper.classList.add("hide-elements");
        askSection.style.opacity = "0";
        askSection.style.visibility = "hidden";
        askSection.style.transform = "translateY(10px)";

        // Add rotating class to start the rotation animation
        ball.classList.add("rotating");

        // STEP 1: Gradually increase ball size over 1.5s and move shadow down
        ball.style.width = "250px";
        ball.style.height = "250px";
        shadow.style.width = "150px";
        shadow.style.height = "25px";
        shadow.style.top = "270px";
        shadow.style.opacity = "0.6";

        // STEP 2: fade out white circle and 8 (1.5s) with scale effect
        innerCircle.style.opacity = "0";
        innerCircle.style.visibility = "hidden";
        innerCircle.style.transform = "scale(0.8)";

        // STEP 3: wait 4s (1.5s fade out + 2.5s delay) → then show answer
        setTimeout(() => {
            ballAnswer.textContent = randomAnswer;
            
            // Sync the answer triangle with the final rotation position
            const computedStyle = window.getComputedStyle(ballOverlay);
            const matrix = new DOMMatrixReadOnly(computedStyle.transform);
            const angle = Math.atan2(matrix.b, matrix.a) * (180/Math.PI);
            answerTriangle.style.transform = `rotate(${-angle}deg)`;
            
            // Add reveal animation class
            answerTriangle.classList.add("answer-reveal");
            ballAnswer.classList.add("answer-reveal");
            
            answerTriangle.style.opacity = "1";
            answerTriangle.style.visibility = "visible";
            ballAnswer.style.opacity = "1";
            ballAnswer.style.transform = "scale(1)";
            
            // Stop the rotation animation but preserve final state
            ball.classList.remove("rotating");
        }, 4000);

        // STEP 4: after 7s total → fade out answer with smooth transition
        setTimeout(() => {
            answerTriangle.style.opacity = "0";
            ballAnswer.style.opacity = "0";
            answerTriangle.style.visibility = "hidden";
            answerTriangle.style.transform = "scale(0.9)";
            ballAnswer.style.transform = "scale(0.9)";
            
            // Remove reveal classes
            answerTriangle.classList.remove("answer-reveal");
            ballAnswer.classList.remove("answer-reveal");
        }, 7000);

        // STEP 5: after 8.5s → restore ball size and 8-circle, show ask section
        setTimeout(() => {
            // Return ball to original size
            ball.style.width = "200px";
            ball.style.height = "200px";
            shadow.style.width = "120px";
            shadow.style.height = "20px";
            shadow.style.top = "230px";
            shadow.style.opacity = "0.4";
            
            // Reset inner circle with scale effect
            innerCircle.style.opacity = "1";
            innerCircle.style.visibility = "visible";
            innerCircle.style.transform = "scale(1)";
            
            // Reset transforms
            ballOverlay.style.transform = "rotate(0deg)";
            answerTriangle.style.transform = "rotate(0deg)";
            
            // Show ask section with smooth reappearance
            setTimeout(() => {
                contentWrapper.classList.remove("hide-elements");
                askSection.style.opacity = "1";
                askSection.style.visibility = "visible";
                askSection.style.transform = "translateY(0)";
            }, 300);
            
            magicSound.pause();
            magicSound.currentTime = 0;
            
            // Clear the question input and update button state
            questionInput.value = "";
            updateSendButtonState();
            
            // Focus back on input for better UX
            setTimeout(() => {
                questionInput.focus();
            }, 500);
        }, 8500);
    });
});
