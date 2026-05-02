document.addEventListener("DOMContentLoaded", () => {
    // Hook into the start timing depending on if boot sequence is running
    if (document.querySelector('.boot-overlay')) {
        document.addEventListener('bootSequenceComplete', () => {
            setTimeout(startDecryption, 300);
        });
    } else {
        setTimeout(startDecryption, 500);
    }

    function startDecryption() {
        const titleContainer = document.querySelector('.decryption-title');
        if (!titleContainer) return;
        
        const titleSpan = titleContainer.querySelector('span:first-child');
        const targetText = titleContainer.getAttribute('data-target');
        
        if(!titleSpan || !targetText) return;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
        let iteration = 0;
        let decoded = 0;

        const interval = setInterval(() => {
            titleSpan.innerText = targetText.split("")
                .map((letter, index) => {
                    if (index < decoded) return targetText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (decoded >= targetText.length) {
                clearInterval(interval);
                // Trigger the mock shell sequence next
                setTimeout(startMockShell, 500);
            }
            
            iteration += 1;
            if (iteration > 2) { // Determine resolution speed
                decoded += 1;
                iteration = 0;
            }
        }, 30);
    }

    function typeCommand(element, text, callback) {
        element.parentElement.classList.remove('hidden');
        let i = 0;
        element.innerHTML = "";
        
        const typer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typer);
                setTimeout(callback, 300);
            }
        }, 50); // Typing speed
    }

    function startMockShell() {
        const cmd1 = document.getElementById('cmd-1');
        if(!cmd1) return;
        
        const text1 = cmd1.querySelector('.typing-text').getAttribute('data-cmd');
        const out1 = document.getElementById('out-1');

        typeCommand(cmd1.querySelector('.typing-text'), text1, () => {
            out1.classList.remove('hidden');
            out1.style.animation = "fadeIn 0.3s ease-out forwards";
            
            setTimeout(() => {
                const cmd2 = document.getElementById('cmd-2');
                const text2 = cmd2.querySelector('.typing-text').getAttribute('data-cmd');
                const out2 = document.getElementById('out-2');

                typeCommand(cmd2.querySelector('.typing-text'), text2, () => {
                    out2.classList.remove('hidden');
                    out2.style.animation = "fadeIn 0.3s ease-out forwards";
                    
                    // Show live feed shortly after everything finishes
                    setTimeout(initLiveFeed, 600);
                });
            }, 500);
        });
    }

    function initLiveFeed() {
        const feed = document.querySelector('.live-feed');
        if(!feed) return;
        
        feed.classList.remove('hidden');
        // Fade it in smoothly
        feed.style.opacity = "1";
        feed.style.animation = "fadeIn 0.8s ease-out forwards";
        
        const content = document.getElementById('live-feed-content');
        
        const possibleLogs = [
            "[OK] Syncing LeetCode user data...",
            "User 'coder123' solved [Easy: Two Sum] -> +1pt",
            "User 'ninja_dev' reached Top 3!",
            "User 'hacker99' solved [Hard: N-Queens] -> +5pt",
            "[SYSTEM] Rank recalculation completed",
            "User 'pvg_student' submitted solution... accepted",
            "User 'algo_master' resolved [Medium: LRU Cache] -> +3pt",
            "Daily challenge rollover in 02:45:00",
            "[INFO] 4 new users registered today",
            "Connection to API stable at 24ms"
        ];
        
        function appendLog() {
            const line = document.createElement('div');
            line.className = 'feed-log-line';
            
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
            const logText = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
            
            line.innerHTML = `<span class="feed-time">[${timestamp}]</span> ${logText}`;
            content.appendChild(line);
            
            // Keep only the most recent logs
            if(content.children.length > 5) {
                content.removeChild(content.firstChild);
            }
            
            content.scrollTop = content.scrollHeight;
            
            // Random delay between 2 to 6 seconds for authentic pacing
            setTimeout(appendLog, Math.random() * 4000 + 2000); 
        }
        
        // Start populating
        appendLog();
    }
});
