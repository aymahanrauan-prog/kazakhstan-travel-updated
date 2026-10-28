/**
 * multistep.js - multi-step registration form.
 *
 * The form is split into 3 steps. "Next" and "Back" buttons call changeStep(),
 * which receives a CALLBACK (showStep) that draws the correct step.
 * Input values are kept because all steps live inside the same <form>.
 */
(function () {
    'use strict';

    const form = document.getElementById('register-form');
    if (!form) { return; }

    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextButton = document.getElementById('step-next');
    const backButton = document.getElementById('step-back');
    const submitButton = document.getElementById('step-submit');
    const progressBar = document.getElementById('step-progress');
    const progressWrapper = document.getElementById('step-progress-wrapper');
    const progressLabel = document.getElementById('step-label');

    const stepTitles = ['Account', 'Password', 'Confirm'];
    const totalSteps = steps.length;
    let currentStep = 1;
    let ready = false;   // false while the page is loading (no autofocus on first draw)

    // CALLBACK: shows the step with the given number and updates the interface
    function showStep(stepNumber) {
        steps.forEach(function (step, index) {
            const isActive = index + 1 === stepNumber;
            step.hidden = !isActive;
            if (isActive) {
                step.classList.remove('slide-in');
                void step.offsetWidth;         // restart the animation
                step.classList.add('slide-in');
            }
        });

        backButton.hidden = stepNumber === 1;
        nextButton.hidden = stepNumber === totalSteps;
        submitButton.hidden = stepNumber !== totalSteps;

        progressBar.style.width = (stepNumber / totalSteps * 100) + '%';
        progressWrapper.setAttribute('aria-valuenow', String(stepNumber));
        progressLabel.textContent = 'Step ' + stepNumber + ' of ' + totalSteps + ': ' + stepTitles[stepNumber - 1];

        if (stepNumber === totalSteps) { fillSummary(); }

        // Put the cursor in the first field of the new step
        const firstField = steps[stepNumber - 1].querySelector('input');
        if (ready && firstField) { firstField.focus(); }
    }

    // Shows the entered data on the last step (the state is kept between steps)
    function fillSummary() {
        document.getElementById('summary-name').textContent = document.getElementById('reg-name').value.trim();
        document.getElementById('summary-email').textContent = document.getElementById('reg-email').value.trim();
    }

    // Checks every field of a step with the validator from validation.js
    function isStepValid(stepNumber) {
        const fields = Array.from(steps[stepNumber - 1].querySelectorAll('input'));
        let allValid = true;
        fields.forEach(function (field) {
            if (!window.KZValidation.validateField(field)) { allValid = false; }
        });
        return allValid;
    }

    // Moves forward (+1) or back (-1) and then calls the callback
    function changeStep(direction, callback) {
        const target = currentStep + direction;
        if (target < 1 || target > totalSteps) { return; }
        if (direction > 0 && !isStepValid(currentStep)) {
            window.KZSound.play('click');
            return;                      // stay on this step until the data is correct
        }
        currentStep = target;
        callback(currentStep);
    }

    nextButton.addEventListener('click', function () { changeStep(1, showStep); });
    backButton.addEventListener('click', function () { changeStep(-1, showStep); });

    // Enter key = "Next" on steps 1-2 (instead of submitting an incomplete form)
    form.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'Enter':
                if (currentStep < totalSteps && event.target.tagName === 'INPUT') {
                    event.preventDefault();
                    changeStep(1, showStep);
                }
                break;
            default:
                break;
        }
    });

    // If submit finds an error, go to the step that contains it
    form.addEventListener('submit', function () {
        const invalid = form.querySelector('.is-invalid');
        if (invalid) {
            currentStep = steps.indexOf(invalid.closest('.form-step')) + 1;
            showStep(currentStep);
        } else {
            window.KZSound.play('success');
        }
    });

    // After "Clear" or a successful sign-up, return to step 1
    form.addEventListener('reset', function () {
        currentStep = 1;
        showStep(1);
    });

    showStep(1);
    ready = true;
})();
