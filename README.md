![Magic 8 Ball](https://github.com/user-attachments/assets/808c8a32-5ea9-452d-baed-ec2135ce0676)

# Magic 8 Ball 🔮

### Project Description
This project is a highly animated, interactive Magic 8 Ball experience built using HTML, CSS, and JavaScript. Users can type or speak their yes/no questions, and receive random answers shown inside a beautifully animated floating 8-ball.

The ball grows, rotates with a 3D overlay, plays sound effects, reveals answers dramatically, and resets with smooth transitions. The interface includes a glass-like input bar, a desktop voice visualizer, a mobile-friendly voice mode, and a responsive design that adapts to all screen sizes.

### The Problem (that doesn't exist)
People keep treating Google like a spiritual advisor. Friends give uncertain answers. The universe remains cryptic. So who can you trust?

### The Solution (that nobody asked for)
The Magic 8 Ball Simulator: a glowing, rotating, cosmic decision-maker that delivers unpredictable wisdom. Simply type or speak your question, click the button, and the universe replies with flair—through floating animations, sound, and a dramatic answer reveal.

## Technical Details
### Technologies/Components Used
For Software:

* Languages used: HTML, CSS, JavaScript
* Frameworks used: None — entirely vanilla code
* Libraries used:
  * Font Awesome (icons)
  * Web Speech API (built-in browser feature for voice recognition)
  * Web Audio API (desktop voice visualizer)
* Tools used: Any modern browser (Chrome recommended for full voice support)

For Hardware:

None — this project runs 100% in the browser.

### Implementation
Software Implementation Highlights

Voice Input
* Desktop: animated audio bars using the Web Audio API
* Mobile: simple start/stop recognition
* Auto errors, timeouts, and status feedback
* Smooth transitions between input bar ↔ voice UI

Magic 8 Ball Animations
* Floating motion
* Glow pulse animation
* 3D rotating overlay texture
* Ball enlarges before revealing an answer
* Shadow morphs as the ball moves
* “8” fades out and returns smoothly

Answer Reveal Logic
* 20 randomized classic Magic-8-Ball answers
* Syncs rotation with ball’s final orientation
* Scale + fade animation for the reveal

UI Polish
* Frosted glass input bar
* Animated icons
* Auto-enable send button
* Enter key support
* Responsive across desktop, tablet, mobile

# Installation
No installation is required. Simply clone the project and open the HTML file in your browser.
~~~bash
git clone https://github.com/username/magic-8-ball.git  
cd magic-8-ball  
open index.html
~~~

# Run
Open index.html in any modern browser. Type or speak your question → click the send button → and let the 8-ball reveal your destiny.

# Screenshot

1. Initial State

<img width="1919" height="868" alt="Initial State" src="https://github.com/user-attachments/assets/ccfbbcb3-c605-4431-bedd-7f6ea013da8c" />

2. Voice Recognition Active

<img width="1918" height="862" alt="Listen State" src="https://github.com/user-attachments/assets/a98232aa-5a73-43d9-a52e-8b328e9f7a51" />

3. Answer Reveal State

<img width="1919" height="864" alt="Answer State" src="https://github.com/user-attachments/assets/7394a936-5f6d-40d4-bdd5-9ac4258cedbb" />

---
