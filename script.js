document.addEventListener('DOMContentLoaded', function() {
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
        
        // Hide ask section
        contentWrapper.classList.add("hide-elements");
        askSection.style.opacity = "0";
        askSection.style.visibility = "hidden";

        // Add rotating class to start the rotation animation
        ball.classList.add("rotating");

        // STEP 1: Gradually increase ball size over 1.5s and move shadow down
        ball.style.width = "250px";
        ball.style.height = "250px";
        shadow.style.width = "150px";
        shadow.style.height = "25px";
        shadow.style.top = "270px"; // Adjusted for enlarged ball

        // STEP 2: fade out white circle and 8 (1.5s)
        innerCircle.style.opacity = "0";
        innerCircle.style.visibility = "hidden";

        // STEP 3: wait 4s (1.5s fade out + 2.5s delay) → then show answer
        setTimeout(() => {
            ballAnswer.textContent = randomAnswer;
            
            // Sync the answer triangle with the final rotation position
            const computedStyle = window.getComputedStyle(ballOverlay);
            const matrix = new DOMMatrixReadOnly(computedStyle.transform);
            const angle = Math.atan2(matrix.b, matrix.a) * (180/Math.PI);
            answerTriangle.style.transform = `rotate(${-angle}deg)`;
            
            answerTriangle.style.opacity = "1";
            answerTriangle.style.visibility = "visible";
            ballAnswer.style.opacity = "1";
            
            // Stop the rotation animation but preserve final state
            ball.classList.remove("rotating");
        }, 4000);

        // STEP 4: after 7s total → fade out answer
        setTimeout(() => {
            answerTriangle.style.opacity = "0";
            ballAnswer.style.opacity = "0";
            answerTriangle.style.visibility = "hidden";
        }, 7000);

        // STEP 5: after 8.5s → restore ball size and 8-circle, show ask section
        setTimeout(() => {
            // Return ball to original size
            ball.style.width = "200px";
            ball.style.height = "200px";
            shadow.style.width = "120px";
            shadow.style.height = "20px";
            shadow.style.top = "230px"; // Return to corrected initial position
            
            innerCircle.style.opacity = "1";
            innerCircle.style.visibility = "visible";
            
            // Reset transforms
            ballOverlay.style.transform = "rotate(0deg)";
            answerTriangle.style.transform = "rotate(0deg)";
            
            // Show ask section with delay for smooth reappearance
            setTimeout(() => {
                contentWrapper.classList.remove("hide-elements");
                askSection.style.opacity = "1";
                askSection.style.visibility = "visible";
            }, 500);
            
            magicSound.pause();
            magicSound.currentTime = 0;
            
            // Clear the question input
            questionInput.value = "";
        }, 8500);
    });
});