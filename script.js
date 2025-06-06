// Price constants in SOL
const PRICES = {
    // Unique traits - positive values
    uniqueTraits: {
        eyeColor: {
            blue: 10,
            green: 15,
            amber: 20,
            gray: 12,
            hazel: 8,
            brown: 5
        },
        hairColor: {
            blonde: 15,
            red: 20,
            auburn: 18,
            ash: 12,
            black: 8,
            brown: 5
        },
        height: 5,
        iq: 25,
        leftHandedness: 8
    },
    // Health issues - negative values
    healthIssues: {
        severeAcne: -5,
        chronicPain: -8,
        osteoarthritis: -6,
        rheumatoidArthritis: -7,
        alcoholDependence: -10,
        celiacDisease: -5,
        type2Diabetes: -15,
        coronaryArteryDisease: -20,
        hypertension: -12,
        adhd: -8,
        alzheimersDisease: -25,
        anxietyDisorders: -10,
        bipolarDisorder: -15,
        depression: -12,
        insomnia: -7,
        migraine: -5
    },
    basePrice: 100 // Base price in SOL
};

// Current price display value
let currentPrice = PRICES.basePrice;
let displayPrice = currentPrice;

// Global variables to store embryo configuration
const embryoConfig = {
    sex: 'female',
    appearance: {
        eyeColor: 'blue',
        hairColor: 'brown',
        height: true,
        severeAcne: true
    },
    body: {
        bmi: true,
        chronicPain: true,
        leftHandedness: true,
        osteoarthritis: true,
        rheumatoidArthritis: true
    },
    foodDiet: {
        alcoholDependence: true,
        celiacDisease: true,
        type2Diabetes: true
    },
    heart: {
        coronaryArteryDisease: true,
        hypertension: true
    },
    mind: {
        adhd: true,
        alzheimersDisease: true,
        anxietyDisorders: true,
        bipolarDisorder: true,
        depression: true,
        insomnia: true,
        iq: true,
        migraine: true
    }
};

// Initialize toggle switches and dropdown selects values
// Create price display element
function createPriceDisplay() {
    const header = document.querySelector('header');
    if(!header) return;
    
    const priceDisplay = document.createElement('div');
    priceDisplay.classList.add('price-display');
    priceDisplay.innerHTML = `<span>Total: </span><span id="current-price" class="current-price">${displayPrice} SOL</span>`;
    header.appendChild(priceDisplay);
}

// Update price with animation
function updatePriceDisplay(newPrice) {
    const priceElement = document.getElementById('current-price');
    if (!priceElement) return;
    
    const oldPrice = displayPrice;
    displayPrice = newPrice;
    
    // Add animation class
    priceElement.classList.add('price-changing');
    
    // Animate the number change
    const duration = 1000; // 1 second animation
    const start = Date.now();
    
    const animate = () => {
        const now = Date.now();
        const progress = (now - start) / duration;
        
        if (progress < 1) {
            const currentValue = Math.round(oldPrice + progress * (newPrice - oldPrice));
            priceElement.textContent = `${currentValue} SOL`;
            requestAnimationFrame(animate);
        } else {
            priceElement.textContent = `${newPrice} SOL`;
            setTimeout(() => {
                priceElement.classList.remove('price-changing');
            }, 200);
        }
    };
    
    requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', function() {
    // Welcome Modal Logic
    // Only run this on the main page (index.html) - check for a unique element of index.html
    const isIndexPage = document.querySelector('main .card'); // A simple check for index page context

    if (isIndexPage) {
        const welcomeModal = document.getElementById('welcomeModal');
        const agreeButton = document.getElementById('agreeButton');

        if (welcomeModal && agreeButton) {
            // Show the modal if not previously agreed
            if (!localStorage.getItem('genesisModalAgreed')) {
                setTimeout(() => { // Slight delay to allow page to render smoothly
                    welcomeModal.classList.add('active');
                }, 500); // 0.5 second delay
            }

            // Hide the modal on button click and set agreement in localStorage
            agreeButton.addEventListener('click', function() {
                welcomeModal.classList.remove('active');
                localStorage.setItem('genesisModalAgreed', 'true');
            });
        }
    }
    // End Welcome Modal Logic

    // Load saved configuration if exists
    const savedConfig = localStorage.getItem('embryoConfig');
    if (savedConfig) {
        Object.assign(embryoConfig, JSON.parse(savedConfig));
    }

    // Set gender radio buttons
    if (document.querySelectorAll('input[name="gender"]').length > 0) {
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            if (radio.value === embryoConfig.sex) {
                radio.checked = true;
            }
        });
    }
    
    // Set eye color and hair color dropdowns
    if (document.getElementById('eye-color-select')) {
        document.getElementById('eye-color-select').value = embryoConfig.appearance.eyeColor;
    }
    
    if (document.getElementById('hair-color-select')) {
        document.getElementById('hair-color-select').value = embryoConfig.appearance.hairColor;
    }

    // Set toggle switches based on configuration
    const toggles = {
        'height-toggle': embryoConfig.appearance.height,
        'acne-toggle': embryoConfig.appearance.severeAcne,
        'bmi-toggle': embryoConfig.body.bmi,
        'pain-toggle': embryoConfig.body.chronicPain,
        'hand-toggle': embryoConfig.body.leftHandedness,
        'osteo-toggle': embryoConfig.body.osteoarthritis,
        'arthritis-toggle': embryoConfig.body.rheumatoidArthritis,
        'alcohol-toggle': embryoConfig.foodDiet.alcoholDependence,
        'celiac-toggle': embryoConfig.foodDiet.celiacDisease,
        'diabetes-toggle': embryoConfig.foodDiet.type2Diabetes,
        'cad-toggle': embryoConfig.heart.coronaryArteryDisease,
        'hypertension-toggle': embryoConfig.heart.hypertension,
        'adhd-toggle': embryoConfig.mind.adhd,
        'alzheimer-toggle': embryoConfig.mind.alzheimersDisease,
        'anxiety-toggle': embryoConfig.mind.anxietyDisorders,
        'bipolar-toggle': embryoConfig.mind.bipolarDisorder,
        'depression-toggle': embryoConfig.mind.depression,
        'insomnia-toggle': embryoConfig.mind.insomnia,
        'iq-toggle': embryoConfig.mind.iq,
        'migraine-toggle': embryoConfig.mind.migraine
    };

    // Initialize all toggle switches
    Object.entries(toggles).forEach(([id, value]) => {
        const toggleElement = document.getElementById(id);
        if (toggleElement) {
            toggleElement.checked = value;
            updateToggleText(toggleElement);
        }
    });

    // Add event listeners to dropdowns and toggles
    addInputEventListeners();

    // Scroll event listener to hide/show scroll indicator
    window.addEventListener('scroll', toggleScrollIndicator);
    
    // Price display logic, only for index.html (main configuration page)
    if (!document.getElementById('result-container')) {
        createPriceDisplay(); // Creates header price display
        currentPrice = calculatePrice(); // Calculates price based on current config
        updatePriceDisplay(currentPrice); // Updates header price display
    }
});

function addInputEventListeners() {
    // Sex Selection Radio Buttons
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    genderRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            embryoConfig.sex = e.target.value;
            saveEmbryoConfig();
            currentPrice = calculatePrice();
            updatePriceDisplay(currentPrice);
        });
    });

    // Appearance - Eye Color and Hair Color Dropdowns
    const eyeColorSelect = document.getElementById('eye-color-select');
    if (eyeColorSelect) {
        eyeColorSelect.addEventListener('change', (e) => {
            embryoConfig.appearance.eyeColor = e.target.value;
            saveEmbryoConfig();
            currentPrice = calculatePrice();
            updatePriceDisplay(currentPrice);
        });
    }

    const hairColorSelect = document.getElementById('hair-color-select');
    if (hairColorSelect) {
        hairColorSelect.addEventListener('change', (e) => {
            embryoConfig.appearance.hairColor = e.target.value;
            saveEmbryoConfig();
            currentPrice = calculatePrice();
            updatePriceDisplay(currentPrice);
        });
    }
    
    // Add event listeners to all toggle switches using a mapping
    const toggleMapping = {
        'height-toggle': (checked) => embryoConfig.appearance.height = checked,
        'acne-toggle': (checked) => embryoConfig.appearance.severeAcne = checked,
        'bmi-toggle': (checked) => embryoConfig.body.bmi = checked,
        'pain-toggle': (checked) => embryoConfig.body.chronicPain = checked,
        'hand-toggle': (checked) => embryoConfig.body.leftHandedness = checked,
        'osteo-toggle': (checked) => embryoConfig.body.osteoarthritis = checked,
        'arthritis-toggle': (checked) => embryoConfig.body.rheumatoidArthritis = checked,
        'alcohol-toggle': (checked) => embryoConfig.foodDiet.alcoholDependence = checked,
        'celiac-toggle': (checked) => embryoConfig.foodDiet.celiacDisease = checked,
        'diabetes-toggle': (checked) => embryoConfig.foodDiet.type2Diabetes = checked,
        'cad-toggle': (checked) => embryoConfig.heart.coronaryArteryDisease = checked,
        'hypertension-toggle': (checked) => embryoConfig.heart.hypertension = checked,
        'adhd-toggle': (checked) => embryoConfig.mind.adhd = checked,
        'alzheimer-toggle': (checked) => embryoConfig.mind.alzheimersDisease = checked,
        'anxiety-toggle': (checked) => embryoConfig.mind.anxietyDisorders = checked,
        'bipolar-toggle': (checked) => embryoConfig.mind.bipolarDisorder = checked,
        'depression-toggle': (checked) => embryoConfig.mind.depression = checked,
        'insomnia-toggle': (checked) => embryoConfig.mind.insomnia = checked,
        'iq-toggle': (checked) => embryoConfig.mind.iq = checked,
        'migraine-toggle': (checked) => embryoConfig.mind.migraine = checked
    };

    // Attach event listeners to all toggles
    Object.entries(toggleMapping).forEach(([toggleId, updateFn]) => {
        const toggleElement = document.getElementById(toggleId);
        if (toggleElement) {
            toggleElement.addEventListener('change', (e) => {
                // Update the configuration using the mapping function
                updateFn(e.target.checked);
                
                // Update toggle text
                updateToggleText(e.target);
                
                // Save config and update price
                saveEmbryoConfig();
                currentPrice = calculatePrice();
                updatePriceDisplay(currentPrice);
            });
        }
    });
}

// Function to save embryo configuration to localStorage
function saveEmbryoConfig() {
    localStorage.setItem('embryoConfig', JSON.stringify(embryoConfig));
}

// Function to update toggle text based on checked state
function updateToggleText(toggleElement) {
    const textElement = toggleElement.parentElement.querySelector('.toggle-text');
    if (textElement) {
        textElement.textContent = toggleElement.checked ? 'Yes' : 'No';
    }
}

// Update display value for a slider
function updateDisplayValue(sliderId, value, unit, isNegativeRed = false, isHighlight = false) {
    const slider = document.getElementById(sliderId);
    const valueElement = slider.parentElement.previousElementSibling.querySelector('span');
    
    // Format value display
    valueElement.textContent = value >= 0 ? `+${value}` : `${value}`;
    
    // Apply class for styling
    valueElement.className = 'point-change';
    if (isNegativeRed && value < 0) {
        valueElement.classList.add('negative');
    }
    if (isHighlight && Math.abs(value) >= 10) {
        valueElement.classList.add('highlight');
    }
}

// Toggle scroll indicator visibility
function toggleScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // Show indicator only when not at the bottom of the page
    if (scrollPosition + windowHeight < documentHeight - 100) {
        indicator.style.display = 'flex';
    } else {
        indicator.style.display = 'none';
    }
}

// Update strength selector display
function updateStrength() {
    const selector = document.getElementById('strength');
    const display = document.getElementById('current-strength');
    display.textContent = selector.options[selector.selectedIndex].text;
}

// Calculate price based on configuration
function calculatePrice() {
    // Start with base price
    let price = PRICES.basePrice;

    // Add unique traits
    // Eye color
    price += PRICES.uniqueTraits.eyeColor[embryoConfig.appearance.eyeColor] || 0;
    
    // Hair color
    price += PRICES.uniqueTraits.hairColor[embryoConfig.appearance.hairColor] || 0;
    
    // Height
    if (embryoConfig.appearance.height) {
        price += PRICES.uniqueTraits.height;
    }
    
    // Left-handedness
    if (embryoConfig.body.leftHandedness) {
        price += PRICES.uniqueTraits.leftHandedness;
    }
    
    // IQ
    if (embryoConfig.mind.iq) {
        price += PRICES.uniqueTraits.iq;
    }
    
    // Subtract health issues
    if (!embryoConfig.appearance.severeAcne) {
        price += PRICES.healthIssues.severeAcne;
    }
    
    if (!embryoConfig.body.chronicPain) {
        price += PRICES.healthIssues.chronicPain;
    }
    
    if (!embryoConfig.body.osteoarthritis) {
        price += PRICES.healthIssues.osteoarthritis;
    }
    
    if (!embryoConfig.body.rheumatoidArthritis) {
        price += PRICES.healthIssues.rheumatoidArthritis;
    }
    
    if (!embryoConfig.foodDiet.alcoholDependence) {
        price += PRICES.healthIssues.alcoholDependence;
    }
    
    if (!embryoConfig.foodDiet.celiacDisease) {
        price += PRICES.healthIssues.celiacDisease;
    }
    
    if (!embryoConfig.foodDiet.type2Diabetes) {
        price += PRICES.healthIssues.type2Diabetes;
    }
    
    if (!embryoConfig.heart.coronaryArteryDisease) {
        price += PRICES.healthIssues.coronaryArteryDisease;
    }
    
    if (!embryoConfig.heart.hypertension) {
        price += PRICES.healthIssues.hypertension;
    }
    
    if (!embryoConfig.mind.adhd) {
        price += PRICES.healthIssues.adhd;
    }
    
    if (!embryoConfig.mind.alzheimersDisease) {
        price += PRICES.healthIssues.alzheimersDisease;
    }
    
    if (!embryoConfig.mind.anxietyDisorders) {
        price += PRICES.healthIssues.anxietyDisorders;
    }
    
    if (!embryoConfig.mind.bipolarDisorder) {
        price += PRICES.healthIssues.bipolarDisorder;
    }
    
    if (!embryoConfig.mind.depression) {
        price += PRICES.healthIssues.depression;
    }
    
    if (!embryoConfig.mind.insomnia) {
        price += PRICES.healthIssues.insomnia;
    }
    
    if (!embryoConfig.mind.migraine) {
        price += PRICES.healthIssues.migraine;
    }
    
    // Ensure price doesn't go below minimum
    price = Math.max(price, 50);
    
    // Store price in localStorage
    localStorage.setItem('embryoPrice', price);
    
    // Store configuration in localStorage
    localStorage.setItem('embryoConfig', JSON.stringify(embryoConfig));
    
    return price;
}

// Calculate and display results
function calculateResults() {
    // Calculate final price
    const totalPrice = calculatePrice();
    
    // Redirect to results page
    window.location.href = 'results.html';
}

function loadResults() {
    // Check if we're on the results page
    if (document.getElementById('result-container')) {
        const savedConfig = JSON.parse(localStorage.getItem('embryoConfig'));
        const savedPrice = localStorage.getItem('embryoPrice');
        
        if (savedConfig && savedPrice) {
            const priceValue = parseInt(savedPrice);
            
            // Create price display element in header for animation
            // Header price display
            const header = document.querySelector('header');
            if (header) {
                // Remove any price display that might have been added by DOMContentLoaded (safeguard)
                const existingHeaderPriceDisplay = header.querySelector('.price-display');
                if (existingHeaderPriceDisplay) {
                    existingHeaderPriceDisplay.remove();
                }

                const headerPriceDiv = document.createElement('div');
                headerPriceDiv.classList.add('price-display');
                // Add "Total: " label and ensure #current-price ID. Initial text is "0 SOL".
                headerPriceDiv.innerHTML = `<span>Total: </span><span id="current-price" class="current-price">0 SOL</span>`;
                header.appendChild(headerPriceDiv);

                // Set global displayPrice for animation base, then update header display
                displayPrice = 0; // So animation in updatePriceDisplay goes from 0 to priceValue
                setTimeout(() => { // Delay for effect
                    updatePriceDisplay(priceValue);
                }, 500);
            }
            
            // Update the main price display with animation
            const priceContainer = document.getElementById('price-value');
            if (priceContainer) {
                // Set initial value
                priceContainer.textContent = '0 SOL';
                
                // Animate to final value
                setTimeout(() => {
                    animatePrice(0, priceValue, priceContainer);
                }, 500);
            }
            
            // Display sex and features
            document.getElementById('sex-value').textContent = savedConfig.sex === 'female' ? 'Female ♀' : 'Male ♂';
            
            // Display eye and hair color with price indicators
            document.getElementById('eye-color-value').textContent = 
                savedConfig.appearance.eyeColor + getPriceIndicator(PRICES.uniqueTraits.eyeColor[savedConfig.appearance.eyeColor] || 0);
                
            document.getElementById('hair-color-value').textContent = 
                savedConfig.appearance.hairColor + getPriceIndicator(PRICES.uniqueTraits.hairColor[savedConfig.appearance.hairColor] || 0);
            
            // Display toggle switch values with price indicators
            // Appearance
            document.getElementById('height-value').textContent = 
                (savedConfig.appearance.height ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.appearance.height ? PRICES.uniqueTraits.height : 0);
                
            document.getElementById('acne-value').textContent = 
                (savedConfig.appearance.severeAcne ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.appearance.severeAcne ? 0 : PRICES.healthIssues.severeAcne);
            
            // Body
            document.getElementById('bmi-value').textContent = 
                (savedConfig.body.bmi ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.body.bmi ? 0 : 0);
            
            document.getElementById('chronic-pain-value').textContent = 
                (savedConfig.body.chronicPain ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.body.chronicPain ? 0 : PRICES.healthIssues.chronicPain);
                
            document.getElementById('left-handedness-value').textContent = 
                (savedConfig.body.leftHandedness ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.body.leftHandedness ? PRICES.uniqueTraits.leftHandedness : 0);
                
            document.getElementById('osteoarthritis-value').textContent = 
                (savedConfig.body.osteoarthritis ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.body.osteoarthritis ? 0 : PRICES.healthIssues.osteoarthritis);
                
            document.getElementById('rheumatoid-arthritis-value').textContent = 
                (savedConfig.body.rheumatoidArthritis ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.body.rheumatoidArthritis ? 0 : PRICES.healthIssues.rheumatoidArthritis);
            
            // Food & Diet
            document.getElementById('alcohol-dependence-value').textContent = 
                (savedConfig.foodDiet.alcoholDependence ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.foodDiet.alcoholDependence ? 0 : PRICES.healthIssues.alcoholDependence);
                
            document.getElementById('celiac-disease-value').textContent = 
                (savedConfig.foodDiet.celiacDisease ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.foodDiet.celiacDisease ? 0 : PRICES.healthIssues.celiacDisease);
                
            document.getElementById('diabetes-value').textContent = 
                (savedConfig.foodDiet.type2Diabetes ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.foodDiet.type2Diabetes ? 0 : PRICES.healthIssues.type2Diabetes);
            
            // Heart
            document.getElementById('coronary-artery-disease-value').textContent = 
                (savedConfig.heart.coronaryArteryDisease ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.heart.coronaryArteryDisease ? 0 : PRICES.healthIssues.coronaryArteryDisease);
                
            document.getElementById('hypertension-value').textContent = 
                (savedConfig.heart.hypertension ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.heart.hypertension ? 0 : PRICES.healthIssues.hypertension);
            
            // Mind
            document.getElementById('adhd-value').textContent = 
                (savedConfig.mind.adhd ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.adhd ? 0 : PRICES.healthIssues.adhd);
                
            document.getElementById('alzheimers-value').textContent = 
                (savedConfig.mind.alzheimersDisease ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.alzheimersDisease ? 0 : PRICES.healthIssues.alzheimersDisease);
                
            document.getElementById('anxiety-value').textContent = 
                (savedConfig.mind.anxietyDisorders ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.anxietyDisorders ? 0 : PRICES.healthIssues.anxietyDisorders);
                
            document.getElementById('bipolar-value').textContent = 
                (savedConfig.mind.bipolarDisorder ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.bipolarDisorder ? 0 : PRICES.healthIssues.bipolarDisorder);
                
            document.getElementById('depression-value').textContent = 
                (savedConfig.mind.depression ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.depression ? 0 : PRICES.healthIssues.depression);
                
            document.getElementById('insomnia-value').textContent = 
                (savedConfig.mind.insomnia ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.insomnia ? 0 : PRICES.healthIssues.insomnia);
                
            document.getElementById('iq-value').textContent = 
                (savedConfig.mind.iq ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.iq ? PRICES.uniqueTraits.iq : 0);
                
            document.getElementById('migraine-value').textContent = 
                (savedConfig.mind.migraine ? 'Yes' : 'No') + 
                getPriceIndicator(savedConfig.mind.migraine ? 0 : PRICES.healthIssues.migraine);
            
            populateAdvantagesDisadvantages(savedConfig);
        }
    }
}

// Helper function to get price indicator string for result display
function getPriceIndicator(price) {
    if (price === 0) return '';
    return price > 0 ? ` (+${price} SOL)` : ` (${price} SOL)`;
}

// Animate price counter
function animatePrice(startPrice, endPrice, element) {
    const duration = 1500; // 1.5 seconds animation
    const start = Date.now();
    
    const animate = () => {
        const now = Date.now();
        const progress = (now - start) / duration;
        
        if (progress < 1) {
            const currentValue = Math.round(startPrice + progress * (endPrice - startPrice));
            element.textContent = `${currentValue} SOL`;
            requestAnimationFrame(animate);
        } else {
            element.textContent = `${endPrice} SOL`;
            element.classList.add('price-changing');
            setTimeout(() => {
                element.classList.remove('price-changing');
            }, 300);
        }
    };
    
    requestAnimationFrame(animate);
}

function populateAdvantagesDisadvantages(config) {
    // Get advantages and disadvantages list elements
    const advantagesList = document.getElementById('advantages-list');
    const disadvantagesList = document.getElementById('disadvantages-list');
    
    // Clear existing items
    advantagesList.innerHTML = '';
    disadvantagesList.innerHTML = '';
    
    // Add advantages based on configuration
    // We'll count prevention as an advantage (when true)
    if (config.appearance.height) {
        addListItem(advantagesList, 'Height prevention');
    }
    if (config.appearance.severeAcne) {
        addListItem(advantagesList, 'Severe acne prevention');
    }
    if (config.body.bmi) {
        addListItem(advantagesList, 'BMI control');
    }
    if (config.body.chronicPain) {
        addListItem(advantagesList, 'Chronic pain prevention');
    }
    if (config.body.leftHandedness) {
        addListItem(advantagesList, 'Left-handedness prevention');
    }
    if (config.body.osteoarthritis) {
        addListItem(advantagesList, 'Osteoarthritis prevention');
    }
    if (config.body.rheumatoidArthritis) {
        addListItem(advantagesList, 'Rheumatoid arthritis prevention');
    }
    if (config.foodDiet.alcoholDependence) {
        addListItem(advantagesList, 'Alcohol dependence prevention');
    }
    if (config.foodDiet.celiacDisease) {
        addListItem(advantagesList, 'Celiac disease prevention');
    }
    if (config.foodDiet.type2Diabetes) {
        addListItem(advantagesList, 'Type 2 diabetes prevention');
    }
    if (config.heart.coronaryArteryDisease) {
        addListItem(advantagesList, 'Coronary artery disease prevention');
    }
    if (config.heart.hypertension) {
        addListItem(advantagesList, 'Hypertension prevention');
    }
    if (config.mind.adhd) {
        addListItem(advantagesList, 'ADHD prevention');
    }
    if (config.mind.alzheimersDisease) {
        addListItem(advantagesList, 'Alzheimer\'s disease prevention');
    }
    if (config.mind.anxietyDisorders) {
        addListItem(advantagesList, 'Anxiety disorders prevention');
    }
    if (config.mind.bipolarDisorder) {
        addListItem(advantagesList, 'Bipolar disorder prevention');
    }
    if (config.mind.depression) {
        addListItem(advantagesList, 'Depression prevention');
    }
    if (config.mind.insomnia) {
        addListItem(advantagesList, 'Insomnia prevention');
    }
    if (config.mind.iq) {
        addListItem(advantagesList, 'IQ improvement');
    }
    if (config.mind.migraine) {
        addListItem(advantagesList, 'Migraine prevention');
    }
    
    // If no advantages, add a message
    if (advantagesList.children.length === 0) {
        addListItem(advantagesList, 'No genetic modifications selected');
    }
    
    // Add natural characteristics, no disadvantages since we're now using prevention
    addListItem(disadvantagesList, 'Natural genetic profile with no modifications');
}

// Add list item to specified list
function addListItem(list, text) {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
}

// Back to configuration page
function backToConfig() {
    window.location.href = 'index.html';
}
