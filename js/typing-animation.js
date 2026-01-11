document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing cursors to avoid duplicates
    const existingCursors = document.querySelectorAll('.mouse-cursor');
    existingCursors.forEach(c => c.remove());

    // Create a custom mouse cursor element that appears only during typing
    const cursor = document.createElement('div');
    cursor.className = 'mouse-cursor';
    cursor.style.display = 'none';
    document.body.appendChild(cursor);

    // Initially hide line numbers for empty lines
    const allCodeLines = document.querySelectorAll('.code-line');
    allCodeLines.forEach(line => {
        const content = line.querySelector('.code-content');
        if (content && content.innerHTML.trim() === '') {
            line.classList.add('empty-line');
        } else {
            line.classList.remove('empty-line');
        }
    });

    // Initially hide the cursor until typing starts
    cursor.style.opacity = '0';
    cursor.style.transform = 'scale(0)';

    // Define the content to be typed - each array element represents one line
    const codeLinesContent = [
        '<span class="code-comment"># Comprehensive Nagatoro Novel Game Script</span>',
        '<span class="code-comment"># This script contains multiple interconnected dialogues</span>',
        '<span class="code-directive">name:</span> <span class="code-parameter">OpeningScene</span>',
        '<span class="code-directive">Start</span>',
        '<span class="code-function">Show Background</span> <span class="code-parameter">beachBackground</span>',
        '<span class="code-parameter">Nagatoro</span> <span class="code-keyword">says</span> <span class="code-dialogue">Welcome to our story!.</span>',
        '<span class="code-parameter">Player</span> <span class="code-keyword">says</span> <span class="code-dialogue">Hi Nagatoro! What are we going to do today?</span>',
        '<span class="code-function">Wait</span> <span class="code-parameter">2</span> <span class="code-keyword">seconds</span>',
        '<span class="code-function">call</span> <span class="code-parameter">beachActivity</span>',
        '<span class="code-function">Jump To</span> <span class="code-parameter">BeachExploration</span>',
        '', // Empty line
        '<span class="code-function">function</span> <span class="code-parameter">beachActivity</span>',
        '<span class="code-parameter">Nagatoro</span> <span class="code-keyword">says</span> <span class="code-dialogue">Look at all these seashells! Want to collect some?</span>',
        '<span class="code-parameter">Player</span> <span class="code-keyword">says</span> <span class="code-dialogue">Sure, that sounds fun!</span>',
        '<span class="code-function">Show</span> <span class="code-parameter">Nagatoro</span> <span class="code-keyword">with emotion</span> <span class="code-parameter">happy</span>',
        '<span class="code-function">end</span>',
        '', // Empty line
        '<span class="code-directive">name:</span> <span class="code-parameter">BeachExploration</span>',
        '<span class="code-directive">Start</span>',
        '<span class="code-function">Show Background</span> <span class="code-parameter">beachBackground</span>',
        '<span class="code-parameter">Nagatoro</span> <span class="code-keyword">says</span> <span class="code-dialogue">Did you enjoy our time at the beach?</span>',
        '<span class="code-function">Jump To</span> <span class="code-parameter">ClassroomArrival</span>',
        '<span class="code-directive">End</span>'
    ];

    // Helper function to get all text nodes within an element (including whitespace)
    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        return textNodes;
    }

    // Function to get position of specific character in the editor
    function getCharPosition(lineElement, charIndex) {
        // If charIndex is 0, return the start position of the line
        if (charIndex === 0) {
            const rect = lineElement.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
            };
        }

        const range = document.createRange();
        const textNodes = getTextNodes(lineElement);
        let currentCharIndex = 0;

        for (const node of textNodes) {
            const nodeLength = node.textContent.length;
            if (charIndex <= currentCharIndex + nodeLength) {
                try {
                    const offset = charIndex - currentCharIndex;
                    range.setStart(node, offset);
                    range.setEnd(node, offset);
                    const rect = range.getBoundingClientRect();
                    return {
                        x: rect.left + window.scrollX,
                        y: rect.top + window.scrollY
                    };
                } catch (e) {
                    // If setting range fails, return the end position of the line
                    break;
                }
            }
            currentCharIndex += nodeLength;
        }

        // If we couldn't find the exact position, return the end of the line
        const lineRect = lineElement.getBoundingClientRect();
        return {
            x: lineRect.right + window.scrollX,
            y: lineRect.top + window.scrollY
        };
    }

    // Add scroll event listener to sync cursor position with scrolling
    window.addEventListener('scroll', function() {
        // Update cursor position when page scrolls
        if (cursor.style.display !== 'none') {
            // Get the current cursor position and adjust for scroll
            const currentLeft = parseFloat(cursor.style.left || 0);
            const currentTop = parseFloat(cursor.style.top || 0);

            // Since the cursor position is already calculated with scrollX/scrollY,
            // we don't need to adjust it further - it should stay in the right position
        }
    });

    // Function to simulate typing for each line
    function typeLine(lineIndex) {
        const codeLines = document.querySelectorAll('.code-line');
        const codeLineContents = document.querySelectorAll('.code-line .code-content');

        if (lineIndex >= codeLines.length || lineIndex >= codeLinesContent.length) {
            // Keep the typing cursor visible and make it blink at the end
            // Find the last line that has content
            const lastLineIndex = Math.min(codeLineContents.length, codeLinesContent.length) - 1;
            if (lastLineIndex >= 0) {
                const lastLineElement = codeLineContents[lastLineIndex];
                // Position cursor at the end of the last line
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = codeLinesContent[lastLineIndex];
                const lastLineText = tempDiv.textContent || tempDiv.innerText;

                const pos = getCharPosition(lastLineElement, lastLineText.length);
                cursor.style.left = pos.x + 'px';
                cursor.style.top = pos.y + 'px';

                // Add blinking animation to the cursor
                cursor.style.animation = 'blink 1s infinite';

                // Add scroll event listener for the final cursor position
                function updateCursorPositionOnScroll() {
                    if (cursor.style.display !== 'none') {
                        const newPos = getCharPosition(lastLineElement, lastLineText.length);
                        cursor.style.left = newPos.x + 'px';
                        cursor.style.top = newPos.y + 'px';
                    }
                }

                // Listen for scroll events to update cursor position
                window.addEventListener('scroll', updateCursorPositionOnScroll);
                document.addEventListener('scroll', updateCursorPositionOnScroll);
            }
            return;
        }

        const lineElement = codeLineContents[lineIndex];
        const fullLineElement = codeLines[lineIndex]; // The full line element with line number
        const fullContent = codeLinesContent[lineIndex];

        // If it's an empty line, just move to the next line
        if (!fullContent) {
            // Mark this line as empty to hide the line number
            fullLineElement.classList.add('empty-line');
            setTimeout(() => {
                typeLine(lineIndex + 1);
            }, 300);
            return;
        }

        // Make sure line number is visible for non-empty lines
        fullLineElement.classList.remove('empty-line');

        // Create a temporary element to extract plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullContent;
        const plainText = tempDiv.textContent || tempDiv.innerText;

        // Clear the line initially
        lineElement.innerHTML = '';
        cursor.style.display = 'block';
        // Fade in the cursor when typing starts
        setTimeout(() => {
            cursor.style.opacity = '1';
            cursor.style.transform = 'scale(1)';
        }, 10);
        cursor.style.animation = 'none'; // Remove any existing animation during typing

        let charIndex = 0;

        function typeChar() {
            if (charIndex <= plainText.length) {
                // Update the text content
                lineElement.textContent = plainText.substring(0, charIndex);

                // Update cursor position using requestAnimationFrame for better performance
                requestAnimationFrame(() => {
                    const pos = getCharPosition(lineElement, charIndex);
                    cursor.style.left = pos.x + 'px';
                    cursor.style.top = pos.y + 'px';

                    if (charIndex === plainText.length) {
                        // At the end of the line, insert the formatted content
                        lineElement.innerHTML = fullContent;
                        // Move to the next line after a pause
                        setTimeout(() => typeLine(lineIndex + 1), 300);
                    } else {
                        charIndex++;
                        // Randomize typing speed to simulate human-like typing with pauses
                        let delay = 40; // Base speed

                        // Add random variations to typing speed
                        if (Math.random() < 0.1) { // 10% chance of a longer pause (thinking)
                            delay = 150 + Math.random() * 100; // 150-250ms pause
                        } else if (Math.random() < 0.15) { // 15% chance of slightly slower typing
                            delay = 60 + Math.random() * 40; // 60-100ms
                        } else if (Math.random() < 0.1) { // 10% chance of faster typing
                            delay = 15 + Math.random() * 25; // 15-40ms
                        }

                        setTimeout(typeChar, delay);
                    }
                });
            }
        }

        typeChar();
    }

    // Setup intersection observer to trigger typing animation when editor comes into view
    const editorElement = document.querySelector('.fake-code-editor');

    if (editorElement) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start typing effect when editor becomes visible
                    setTimeout(() => typeLine(0), 500);
                    // Stop observing once animation starts
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        // Start observing the editor element
        observer.observe(editorElement);
    } else {
        // Fallback: start animation after delay if editor element is not found
        setTimeout(() => typeLine(0), 500);
    }
});