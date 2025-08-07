window.onload = function() {
    // change bi-circle to bi-circle-fill on hover
    toggleCircleIcons();

    // while mouse down on the icon, toggle the fs-3 class
    growIconOnClick();

    // make all cards equal height
    makeCardsEqualHeight();

    // add border-success class on hover
    cardBorderOnHover();

    // New terminal navigation setup
    setupTerminalNavigation();

    // Previous experience icon setup
    setupPreviousExperienceIcons();
};


// Globals
let terminalActive = true;
const commandList = ['cls', 'clear', 'experience', 'help', 'projects']; // maybe separate into different categories
const commandHistory = [];
let historyIndex = -1;

function toggleCircleIcons() {
    const icons = document.querySelectorAll('.bi-circle');

    icons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.classList.remove('bi-circle');
            this.classList.add('bi-circle-fill');
        });

        icon.addEventListener('mouseout', function() {
            this.classList.remove('bi-circle-fill');
            this.classList.add('bi-circle');
        });
    });
}

function growIconOnClick() {
    const icons = document.querySelectorAll('.bi-circle, .bi-circle-fill');
    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            this.classList.add('fs-4');
            setTimeout(() => {
                this.classList.remove('fs-4');
            }, 500); // Toggle back after 1 second
        });
    });
}

function makeCardsEqualHeight() {
    const cards = document.querySelectorAll('.card');
    let maxHeight = 0;

    // Reset heights
    cards.forEach(card => {
        card.style.height = 'fit-content'; // Reset to auto height
    });

    // Find the maximum height
    cards.forEach(card => {
        if (card.offsetHeight > maxHeight) {
            maxHeight = card.offsetHeight;
        }
    });

    // Set all cards to the maximum height
    cards.forEach(card => {
        card.style.height = maxHeight + 'px';
    });
}

function cardBorderOnHover() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.classList.add('border-success');
            // add to card-header as well
            const header = this.querySelector('.card-header');
            if (header) {
                header.classList.add('border-success');
            }
        });

        card.addEventListener('mouseout', function() {
            this.classList.remove('border-success');
            // remove from card-header as well
            const header = this.querySelector('.card-header');
            if (header) {
                header.classList.remove('border-success');
            }
        });
    });
}

function setupTerminalNavigation() {
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalInput = document.querySelector('.terminal-input');
    const terminalButton = document.getElementById('terminal-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-content .menu-item');

    const terminalText = document.querySelector('.terminal-text');
    let tabCompletionIndex = 0;
    let originalInputValue = '';
    let matchingCommands = [];

    // Show the terminal on page load if on a desktop device
    if (window.innerWidth > 768) {
        terminalOverlay.style.display = 'flex';
        mobileMenuOverlay.style.display = 'none';
    }
    else {
        terminalOverlay.style.display = 'none'; // Hide terminal on mobile by default
        terminalButton.style.display = 'none'; // Show terminal button on mobile
        mobileMenuOverlay.style.display = 'flex'; // Show mobile menu overlay
    }

    // Toggle terminal on button click
    if (terminalButton) {
        terminalButton.addEventListener('click', () => {
            terminalActive = !terminalActive; // Toggle terminal active state
            if (terminalOverlay.style.display === 'none' || terminalOverlay.style.display === '') {
                terminalOverlay.style.display = 'flex';
                terminalInput.focus();
            } else {
                terminalOverlay.style.display = 'none';
            }
        });
    }

    // Handle terminal input
    if (terminalInput) {
        terminalInput.addEventListener('blur', (event) => {
            if (terminalActive)
                terminalInput.focus();
        })

        terminalInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();

                if (command !== '') {
                    commandHistory.push(command);
                    historyIndex = commandHistory.length; // Set index to the end of the history
                }

                //TODO: if command is in ['projects', 'about', 'experience', 'publications'], get by id and scroll to it
                //      (do this to avoid writing 50 if-else statements)
                if (['projects', 'experience'].indexOf(command) !== -1) { // add other sections to the ['projects'] array here
                    terminalOverlay.style.display = 'none';
                    const projectsSection = document.getElementById(command);
                    if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                else if (command === 'help'){
                    terminalText.textContent += 
`\nAvailable commands:\nPROJECTS\tView my personal Github projects.\nEXPERIENCE\tCheck out my previous job experience.\nCLS\t\tClears the screen.`;
                }
                else if (command === 'cls' || command === 'clear'){
                    terminalText.textContent = `Welcome to my portfolio terminal!\nTo view available commands, use the "help" command.\n\n`
                }
                else
                    terminalText.textContent += 
`\nCommand not recoginized. Use "help" to view available commands.\n`

                // Clear input after command
                terminalInput.value = '';
                // Reset tab completion state on Enter
                tabCompletionIndex = 0;
                originalInputValue = '';
                matchingCommands = [];
            }
            else if (event.key === 'Tab') {
                event.preventDefault(); // Prevent default tab behavior

                if (originalInputValue === '') {
                    originalInputValue = terminalInput.value.trim().toLowerCase();
                    return;
                }

                matchingCommands = commandList.filter(command => command.startsWith(originalInputValue));
                matchingCommands.push(originalInputValue);
                if (matchingCommands.length > 0) {
                    terminalInput.value = matchingCommands[tabCompletionIndex];
                    tabCompletionIndex = (tabCompletionIndex + 1) % matchingCommands.length;
                } else {
                    terminalInput.value = originalInputValue; // Revert to original input if no matches
                    tabCompletionIndex = 0;
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (commandHistory.length > 0) {
                    historyIndex = Math.max(0, historyIndex - 1);
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (commandHistory.length > 0) {
                    historyIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
                    terminalInput.value = commandHistory[historyIndex];
                }
            }
        });

        terminalInput.addEventListener('input', (event) => {
            originalInputValue = terminalInput.value.trim().toLowerCase();
            tabCompletionIndex = 0;
        })
    }

    // Mobile menu logic

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            terminalActive = !terminalActive; // Toggle terminal active state
            if (mobileMenuOverlay.style.display === 'none' || mobileMenuOverlay.style.display === '') {
                mobileMenuOverlay.style.display = 'flex';
            } else {
                mobileMenuOverlay.style.display = 'none';
            }
        });
    }

    mobileMenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            terminalActive = !terminalActive; // Toggle terminal active state

            event.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            mobileMenuOverlay.style.display = 'none';
        });
    });
}

window.addEventListener('resize', () => {
    ShowTerminalOrMobileNav();
    makeCardsEqualHeight(); // Recalculate card heights on resize
});

function ShowTerminalOrMobileNav() {
    const terminalOverlay = document.getElementById('terminal-overlay');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const terminalButton = document.getElementById('terminal-btn');
    const terminalInput = document.querySelector('.terminal-input');

    if (window.innerWidth > 768) {
        terminalButton.style.display = 'block'; // Hide terminal button on desktop
        if (terminalActive) {
            terminalOverlay.style.display = 'flex';
            terminalInput.focus();
        }
        mobileMenuOverlay.style.display = 'none';
    } else {
        terminalOverlay.style.display = 'none'; // Hide terminal on mobile
        terminalButton.style.display = 'none'; // Hide terminal button on mobile
        if (terminalActive) {
            mobileMenuOverlay.style.display = 'flex';
        }
    }
}


function setupPreviousExperienceIcons(){
    const jobIcons = document.querySelectorAll(".job-icon");
    
    jobIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            jobIcons.forEach(i => i.classList.remove("job-icon-clicked"))
            icon.classList.toggle("job-icon-clicked");
            event.stopPropagation(); //otherwise document 'click' listener will be run and no icon will appear selected
        });

        icon.addEventListener("dblclick", function(event) {
            alert("Icon double clicked");
        });
    });
}

document.addEventListener('click', function(event) {
    const clickedIcon = document.querySelector(".job-icon-clicked");
    if (clickedIcon)
        clickedIcon.classList.remove("job-icon-clicked");
})