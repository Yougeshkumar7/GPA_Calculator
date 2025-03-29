document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Simple Calculator
    const simpleForm = document.getElementById('simpleForm');
    const simpleInputList = document.getElementById('simpleInputList');
    const addSimpleRowBtn = document.getElementById('addSimpleRow');
    const calculateSimpleGPABtn = document.getElementById('calculateSimpleGPA');
    const resetSimpleFormBtn = document.getElementById('resetSimpleForm');
    const simpleResultDiv = document.getElementById('simpleResult');
    const simpleGpaResultSpan = document.getElementById('simpleGpaResult');

    // DOM elements - Criteria Based Calculator
    const criteriaSetupContainer = document.getElementById('criteriaSetupContainer');
    const criteriaCalculatorContainer = document.getElementById('criteriaCalculatorContainer');
    const criteriaTableBody = document.getElementById('criteriaTableBody');
    const saveCriteriaBtn = document.getElementById('saveCriteria');
    const resetCriteriaBtn = document.getElementById('resetCriteria');
    const criteriaInputList = document.getElementById('criteriaInputList');
    const addCriteriaRowBtn = document.getElementById('addCriteriaRow');
    const calculateCriteriaGPABtn = document.getElementById('calculateCriteriaGPA');
    const resetCriteriaFormBtn = document.getElementById('resetCriteriaForm');
    const criteriaResultDiv = document.getElementById('criteriaResult');
    const criteriaGpaResultSpan = document.getElementById('criteriaGpaResult');

    // DOM elements - Semester Average Calculator
    const semesterInputList = document.getElementById('semesterInputList');
    const addSemesterRowBtn = document.getElementById('addSemesterRow');
    const calculateSemesterGPABtn = document.getElementById('calculateSemesterGPA');
    const resetSemesterFormBtn = document.getElementById('resetSemesterForm');
    const semesterResultDiv = document.getElementById('semesterResult');
    const semesterGpaResultSpan = document.getElementById('semesterGpaResult');

    // DOM elements - Common
    const darkModeToggle = document.getElementById('darkModeToggle');
    const historyContainer = document.getElementById('history');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Tab elements
    const simpleTabBtn = document.getElementById('simpleTabBtn');
    const criteriaTabBtn = document.getElementById('criteriaTabBtn');
    const semesterTabBtn = document.getElementById('semesterTabBtn');
    const simpleCalculator = document.getElementById('simpleCalculator');
    const criteriaCalculator = document.getElementById('criteriaCalculator');
    const semesterCalculator = document.getElementById('semesterCalculator');

    // Initialize state
    let calculations = loadFromLocalStorage('gpaCalculations') || [];
    let gradingCriteria = loadFromLocalStorage('gradingCriteria') || null;
    
    // Check dark mode preference
    if (loadFromLocalStorage('darkMode') === true) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // If no saved criteria, use default university grading policy
    if (!gradingCriteria) {
        // Initialize with university grading policy
        gradingCriteria = [
            { letter: 'A', gpa: 4.0, min: 93 },
            { letter: 'A-', gpa: 3.67, min: 87 },
            { letter: 'B+', gpa: 3.33, min: 82 },
            { letter: 'B', gpa: 3.0, min: 77 },
            { letter: 'B-', gpa: 2.67, min: 72 },
            { letter: 'C+', gpa: 2.3, min: 68 },
            { letter: 'C', gpa: 2.0, min: 64 },
            { letter: 'C-', gpa: 1.67, min: 60 },
            { letter: 'F', gpa: 0.0, min: 0 }
        ];
        saveToLocalStorage('gradingCriteria', gradingCriteria);
    }

    // Display history
    displayHistory();
    
    // Initialize UI components
    setTimeout(updateMaxMarksRanges, 100); // Update max marks ranges after page load

    // Tab Event listeners
    simpleTabBtn.addEventListener('click', function() {
        hideAllCalculators();
        simpleTabBtn.classList.add('active');
        simpleCalculator.classList.remove('hidden');
    });

    criteriaTabBtn.addEventListener('click', function() {
        hideAllCalculators();
        criteriaTabBtn.classList.add('active');
        criteriaCalculator.classList.remove('hidden');
    });

    semesterTabBtn.addEventListener('click', function() {
        hideAllCalculators();
        semesterTabBtn.classList.add('active');
        semesterCalculator.classList.remove('hidden');
    });

    function hideAllCalculators() {
        // Hide all calculator sections
        simpleCalculator.classList.add('hidden');
        criteriaCalculator.classList.add('hidden');
        semesterCalculator.classList.add('hidden');
        
        // Remove active class from all tabs
        simpleTabBtn.classList.remove('active');
        criteriaTabBtn.classList.remove('active');
        semesterTabBtn.classList.remove('active');
    }

    // Simple Calculator Event listeners
    addSimpleRowBtn.addEventListener('click', addSimpleRow);
    calculateSimpleGPABtn.addEventListener('click', calculateSimpleGPA);
    resetSimpleFormBtn.addEventListener('click', resetSimpleForm);
    
    // Add event delegation for remove buttons
    simpleInputList.addEventListener('click', function(e) {
        if (e.target.closest('.remove-simple-row')) {
            removeSimpleRow(e.target.closest('.simple-row'));
        }
    });

    // Criteria Calculator Event listeners
    saveCriteriaBtn.addEventListener('click', saveCriteriaFromTable);
    resetCriteriaBtn.addEventListener('click', resetCriteriaToDefault);
    addCriteriaRowBtn.addEventListener('click', addCriteriaRow);
    calculateCriteriaGPABtn.addEventListener('click', calculateCriteriaGPA);
    resetCriteriaFormBtn.addEventListener('click', resetCriteriaForm);
    
    // Add event delegation for remove buttons
    criteriaInputList.addEventListener('click', function(e) {
        if (e.target.closest('.remove-criteria-row')) {
            removeCriteriaRow(e.target.closest('.criteria-row'));
        }
    });
    
    // Add event listeners for marks inputs to update grade displays
    criteriaInputList.addEventListener('input', function(e) {
        if (e.target.classList.contains('criteria-marks')) {
            const row = e.target.closest('.criteria-row');
            const marksInput = e.target;
            const gradeDisplay = row.querySelector('.criteria-grade-display');
            
            if (marksInput.value) {
                const marks = parseFloat(marksInput.value);
                const gradeInfo = getGradeForMarks(marks);
                gradeDisplay.textContent = gradeInfo.letter;
            } else {
                gradeDisplay.textContent = '-';
            }
        }
    });

    // Semester Calculator Event listeners
    addSemesterRowBtn.addEventListener('click', addSemesterRow);
    calculateSemesterGPABtn.addEventListener('click', calculateSemesterGPA);
    resetSemesterFormBtn.addEventListener('click', resetSemesterForm);
    
    // Add event delegation for remove buttons
    semesterInputList.addEventListener('click', function(e) {
        if (e.target.closest('.remove-semester-row')) {
            removeSemesterRow(e.target.closest('.semester-row'));
        }
    });

    // Other Event listeners
    darkModeToggle.addEventListener('click', toggleDarkMode);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Simple Calculator Functions
    function addSimpleRow() {
        const simpleRow = document.createElement('div');
        simpleRow.className = 'simple-row';
        simpleRow.innerHTML = `
            <input type="number" class="existing-gpa" placeholder="GPA (0.0-4.0)" min="0" max="4.0" step="0.01" required>
            <input type="number" class="simple-credit-hours" placeholder="Credits" min="0" step="0.5" required>
            <button type="button" class="btn-icon remove-simple-row" title="Remove Row">
                <i class="fas fa-trash"></i>
            </button>
        `;
        simpleInputList.appendChild(simpleRow);
    }

    function removeSimpleRow(row) {
        if (simpleInputList.childElementCount > 1) {
            simpleInputList.removeChild(row);
        } else {
            alert('You must have at least one row.');
        }
    }

    function calculateSimpleGPA() {
        // Validate inputs
        const rows = document.querySelectorAll('.simple-row');
        let isValid = true;
        let totalCredits = 0;
        let totalPoints = 0;
        
        rows.forEach(row => {
            const gpaInput = row.querySelector('.existing-gpa');
            const creditInput = row.querySelector('.simple-credit-hours');
            
            if (!gpaInput.value || !creditInput.value) {
                isValid = false;
                highlightInvalid(row);
                return;
            }
            
            const gpa = parseFloat(gpaInput.value);
            const credits = parseFloat(creditInput.value);
            
            if (isNaN(gpa) || gpa < 0 || gpa > 4.0 || isNaN(credits) || credits < 0) {
                isValid = false;
                highlightInvalid(row);
                return;
            }
            
            totalCredits += credits;
            totalPoints += credits * gpa;
        });
        
        if (!isValid) {
            alert('Please fill in all fields correctly. GPA must be between 0.0 and 4.0.');
            return;
        }
        
        if (totalCredits === 0) {
            alert('Total credits cannot be zero.');
            return;
        }
        
        // Calculate Cumulative GPA
        const cumulativeGPA = totalPoints / totalCredits;
        
        // Display result
        simpleGpaResultSpan.textContent = cumulativeGPA.toFixed(2);
        simpleResultDiv.classList.remove('hidden');
        
        // Save to history
        const calculation = {
            date: new Date().toLocaleString(),
            type: 'simple',
            gpa: cumulativeGPA.toFixed(2),
            credits: totalCredits
        };
        
        calculations.unshift(calculation);
        if (calculations.length > 10) calculations.pop(); // Keep only the 10 most recent
        saveToLocalStorage('gpaCalculations', calculations);
        
        // Update displayed history
        displayHistory();
    }
    
    function resetSimpleForm() {
        // Keep only one empty row
        while (simpleInputList.childElementCount > 0) {
            simpleInputList.removeChild(simpleInputList.lastChild);
        }
        
        addSimpleRow();
        simpleResultDiv.classList.add('hidden');
    }

    // Criteria Based Calculator Functions
    function saveCriteriaFromTable() {
        const rows = criteriaTableBody.querySelectorAll('tr');
        const criteria = [];
        
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            const letter = inputs[0].value || inputs[0].placeholder;
            const gpa = parseFloat(inputs[1].value || inputs[1].placeholder);
            const minMarks = parseFloat(inputs[2].value || inputs[2].placeholder);
            
            if (letter && !isNaN(gpa) && !isNaN(minMarks)) {
                criteria.push({
                    letter: letter,
                    gpa: gpa,
                    min: minMarks
                });
            }
        });

        // Sort criteria by min marks in descending order
        criteria.sort((a, b) => b.min - a.min);
        
        if (criteria.length > 0) {
            gradingCriteria = criteria;
            saveToLocalStorage('gradingCriteria', criteria);
            updateMaxMarksRanges();
            alert('Grading criteria saved successfully.');
        } else {
            alert('Failed to save criteria. Please check all values.');
        }
    }
    
    function resetCriteriaToDefault() {
        // Default criteria based on the university grading policy provided
        const defaultCriteria = [
            { letter: 'A', gpa: 4.0, min: 93 },
            { letter: 'A-', gpa: 3.67, min: 87 },
            { letter: 'B+', gpa: 3.33, min: 82 },
            { letter: 'B', gpa: 3.0, min: 77 },
            { letter: 'B-', gpa: 2.67, min: 72 },
            { letter: 'C+', gpa: 2.3, min: 68 },
            { letter: 'C', gpa: 2.0, min: 64 },
            { letter: 'C-', gpa: 1.67, min: 60 },
            { letter: 'F', gpa: 0.0, min: 0 }
        ];
        
        // Save default criteria first
        gradingCriteria = defaultCriteria;
        saveToLocalStorage('gradingCriteria', defaultCriteria);
        
        // Then update the table with the values
        try {
            const rows = criteriaTableBody.querySelectorAll('tr');
            
            if (rows.length === defaultCriteria.length) {
                // Sort the criteria by min marks in descending order for display
                const sortedCriteria = [...defaultCriteria].sort((a, b) => b.min - a.min);
                
                rows.forEach((row, index) => {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length >= 3) {
                        // Set values directly 
                        const letterInput = inputs[0];
                        const gpaInput = inputs[1];
                        const minMarksInput = inputs[2];
                        
                        letterInput.value = sortedCriteria[index].letter;
                        gpaInput.value = sortedCriteria[index].gpa;
                        minMarksInput.value = sortedCriteria[index].min;
                    }
                });
            }
        } catch (e) {
            console.error("Error updating criteria table:", e);
        }
        
        // Update the max marks ranges in the display
        setTimeout(updateMaxMarksRanges, 100);
        
        alert('Grading criteria reset to university standard values.');
    }
    
    // Function to update the max marks ranges based on min marks
    function updateMaxMarksRanges() {
        const rows = criteriaTableBody.querySelectorAll('tr');
        const minMarksInputs = Array.from(rows).map(row => {
            const minMarksInput = row.querySelector('.min-marks');
            if (!minMarksInput) return null;
            
            return {
                min: parseFloat(minMarksInput.value || minMarksInput.placeholder),
                row: row
            };
        }).filter(item => item !== null);
        
        // Sort by min marks in descending order
        minMarksInputs.sort((a, b) => b.min - a.min);
        
        // Update the max marks spans
        minMarksInputs.forEach((item, i) => {
            const maxMarksSpan = item.row.querySelector('.max-marks');
            if (maxMarksSpan) {
                if (i === 0) {
                    // First row (highest grade) has a max of 100
                    maxMarksSpan.textContent = '100';
                } else {
                    // Other rows have max of the previous row's min - 0.01
                    const prevMin = minMarksInputs[i-1].min;
                    maxMarksSpan.textContent = (prevMin - 0.01).toFixed(2);
                }
            }
        });
    }
    
    // Add event listener to update max marks ranges when min marks change
    criteriaTableBody.addEventListener('input', function(e) {
        if (e.target.classList.contains('min-marks')) {
            // Add a small delay to ensure all inputs have been processed
            setTimeout(updateMaxMarksRanges, 100);
        }
    });
    
    function getGradeForMarks(marks) {
        // Sort the grading criteria by minimum marks in descending order
        // This ensures we check the highest grade requirements first
        const sortedCriteria = [...gradingCriteria].sort((a, b) => b.min - a.min);
        
        // Now find the first grade where the marks meet or exceed the minimum
        for (let i = 0; i < sortedCriteria.length; i++) {
            const criterion = sortedCriteria[i];
            if (marks >= criterion.min) {
                return { letter: criterion.letter, gpa: criterion.gpa };
            }
        }
        
        // Default to F grade if no match is found
        return { letter: 'F', gpa: 0.0 };
    }
    
    function addCriteriaRow() {
        const row = document.createElement('div');
        row.className = 'criteria-row';
        row.innerHTML = `
            <input type="number" class="criteria-credit-hours" placeholder="Credits" min="0" step="0.5" required>
            <input type="number" class="criteria-marks" placeholder="Marks (%)" min="0" max="100" step="0.1" required>
            <span class="criteria-grade-display">-</span>
            <button type="button" class="btn-icon remove-criteria-row" title="Remove Course">
                <i class="fas fa-trash"></i>
            </button>
        `;
        criteriaInputList.appendChild(row);
    }
    
    function removeCriteriaRow(row) {
        if (criteriaInputList.childElementCount > 1) {
            criteriaInputList.removeChild(row);
        } else {
            alert('You must have at least one course.');
        }
    }
    
    function calculateCriteriaGPA() {
        // Validate inputs
        const rows = criteriaInputList.querySelectorAll('.criteria-row');
        let isValid = true;
        let totalCredits = 0;
        let totalPoints = 0;
        const courses = [];
        
        rows.forEach(row => {
            const creditInput = row.querySelector('.criteria-credit-hours');
            const marksInput = row.querySelector('.criteria-marks');
            
            if (!creditInput.value || !marksInput.value) {
                isValid = false;
                highlightInvalid(row);
                return;
            }
            
            const marks = parseFloat(marksInput.value);
            const credits = parseFloat(creditInput.value);
            
            if (isNaN(credits) || credits < 0 || isNaN(marks) || marks < 0 || marks > 100) {
                isValid = false;
                highlightInvalid(row);
                return;
            }
            
            const gradeInfo = getGradeForMarks(marks);
            
            totalCredits += credits;
            totalPoints += credits * gradeInfo.gpa;
            
            courses.push({
                marks: marks,
                credits: credits,
                grade: gradeInfo.letter,
                gpa: gradeInfo.gpa
            });
        });
        
        if (!isValid) {
            alert('Please fill in all fields correctly. Marks must be between 0 and 100.');
            return;
        }
        
        if (totalCredits === 0) {
            alert('Total credits cannot be zero.');
            return;
        }
        
        // Calculate GPA
        const gpa = totalPoints / totalCredits;
        
        // Display result
        criteriaGpaResultSpan.textContent = gpa.toFixed(2);
        criteriaResultDiv.classList.remove('hidden');
        
        // Save to history
        const calculation = {
            date: new Date().toLocaleString(),
            type: 'criteria',
            gpa: gpa.toFixed(2),
            totalCredits: totalCredits,
            courses: courses
        };
        
        calculations.unshift(calculation);
        if (calculations.length > 10) calculations.pop(); // Keep only the 10 most recent
        saveToLocalStorage('gpaCalculations', calculations);
        
        // Update displayed history
        displayHistory();
    }
    
    function resetCriteriaForm() {
        // Keep only one empty row
        while (criteriaInputList.childElementCount > 0) {
            criteriaInputList.removeChild(criteriaInputList.lastChild);
        }
        
        addCriteriaRow();
        criteriaResultDiv.classList.add('hidden');
    }

    // Semester Average Calculator Functions
    function addSemesterRow() {
        const semesterRow = document.createElement('div');
        semesterRow.className = 'semester-row';
        semesterRow.innerHTML = `
            <input type="number" class="semester-gpa" placeholder="GPA (0.0-4.0)" min="0" max="4.0" step="0.01" required>
            <button type="button" class="btn-icon remove-semester-row" title="Remove Semester">
                <i class="fas fa-trash"></i>
            </button>
        `;
        semesterInputList.appendChild(semesterRow);
    }

    function removeSemesterRow(row) {
        if (semesterInputList.childElementCount > 1) {
            semesterInputList.removeChild(row);
        } else {
            alert('You must have at least one semester.');
        }
    }

    function calculateSemesterGPA() {
        // Validate inputs
        const rows = document.querySelectorAll('.semester-row');
        let isValid = true;
        const semesterGPAs = [];
        
        rows.forEach((row, index) => {
            const gpaInput = row.querySelector('.semester-gpa');
            
            // Validate fields
            if (!gpaInput.value) {
                isValid = false;
                highlightInvalid(row);
                return;
            }
            
            const gpa = parseFloat(gpaInput.value);
            
            if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
                isValid = false;
                highlightInvalid(row);
                return;
            }
            
            semesterGPAs.push(gpa);
        });
        
        if (!isValid) {
            alert('Please fill in all GPA fields correctly. GPA must be between 0.0 and 4.0.');
            return;
        }
        
        if (semesterGPAs.length === 0) {
            alert('Please add at least one semester.');
            return;
        }
        
        // Calculate simple average of GPAs
        const totalGPA = semesterGPAs.reduce((sum, gpa) => sum + gpa, 0);
        const averageGPA = totalGPA / semesterGPAs.length;
        
        // Display result
        semesterGpaResultSpan.textContent = averageGPA.toFixed(2);
        semesterResultDiv.classList.remove('hidden');
        
        // Save to history
        const calculation = {
            date: new Date().toLocaleString(),
            gpa: averageGPA.toFixed(2),
            type: 'semester',
            semesterCount: semesterGPAs.length,
            method: 'simple average'
        };
        
        calculations.unshift(calculation);
        if (calculations.length > 10) calculations.pop(); // Keep only the 10 most recent
        saveToLocalStorage('gpaCalculations', calculations);
        
        // Update displayed history
        displayHistory();
    }
    
    function resetSemesterForm() {
        // Keep only one empty row
        while (semesterInputList.childElementCount > 0) {
            semesterInputList.removeChild(semesterInputList.lastChild);
        }
        
        addSemesterRow();
        semesterResultDiv.classList.add('hidden');
    }

    // Utility Functions
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            saveToLocalStorage('darkMode', true);
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            saveToLocalStorage('darkMode', false);
        }
    }
    
    function clearHistory() {
        calculations = [];
        saveToLocalStorage('gpaCalculations', []);
        displayHistory();
    }
    
    function displayHistory() {
        historyContainer.innerHTML = '';
        
        if (calculations.length === 0) {
            historyContainer.innerHTML = '<p>No previous calculations</p>';
            return;
        }
        
        calculations.forEach(calc => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            let typeLabel = 'Unknown';
            let resultDisplay = '';
            
            switch(calc.type) {
                case 'simple':
                    typeLabel = 'Simple';
                    resultDisplay = `GPA: <strong>${calc.gpa}</strong>`;
                    break;
                case 'criteria':
                    typeLabel = 'Criteria-Based';
                    resultDisplay = `GPA: <strong>${calc.gpa}</strong>`;
                    break;
                case 'semester':
                    typeLabel = 'Semester Average';
                    resultDisplay = `GPA: <strong>${calc.gpa}</strong>`;
                    break;
            }
            
            historyItem.innerHTML = `
                <div class="history-date">${calc.date} (${typeLabel})</div>
                <div class="history-gpa">${resultDisplay}</div>
            `;
            
            // Add click event to show detail
            historyItem.addEventListener('click', () => {
                let details = `Date: ${calc.date}\nType: ${typeLabel}\n`;
                
                switch(calc.type) {
                    case 'simple':
                        details += `GPA: ${calc.gpa}\nTotal Credits: ${calc.credits}`;
                        break;
                    case 'criteria':
                        details += `GPA: ${calc.gpa}\nTotal Credits: ${calc.totalCredits}\nCourses: ${calc.courses.length}`;
                        break;
                    case 'semester':
                        if (calc.method === 'simple average') {
                            details += `GPA: ${calc.gpa}\nNumber of Semesters: ${calc.semesterCount}\nCalculation: Simple Average`;
                        } else {
                            details += `GPA: ${calc.gpa}\nNumber of Semesters: ${calc.semesterCount}`;
                        }
                        break;
                }
                
                alert(details);
            });
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    function highlightInvalid(element) {
        element.classList.add('invalid');
        
        setTimeout(() => {
            element.classList.remove('invalid');
        }, 2000);
    }
    
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}); 