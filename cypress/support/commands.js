// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('elementExists', (selector) => {
    cy.get('body').then(($body) => {
        if ($body.find(selector).length) {
            assert.isOk('OK', 'Element exist.')
            return true;
        } else {
            // Throws no error when element not found
            assert.isOk('OK', 'Element does not exist.')
            return false;
        }
    })
})

Cypress.Commands.add('getEmailCode', () => {
    return cy.request({
        method: 'GET',
        url: `${Cypress.env('QA_MAIL_SERVICE')}`,
        headers: {
            'POGR_QA_TOKEN': `${Cypress.env('POGR_QA_TOKEN')}`
        }
    })
})

Cypress.Commands.add('getPogrElement', (selector) => {
    return cy.get(`[data-pogr-id=${selector}]`)
})

Cypress.Commands.add('getElementByClass', ({ styleClass, styleClasses, selector = "" }) => {
    if (styleClass) {
        return cy.get(styleClass);
    } else if (styleClasses) {
        return cy.get(styleClasses.join(''));
    } else {
        return cy.get(selector);
    }
})