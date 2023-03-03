class SignUpPage {
    visit() {
        cy.visit(`${Cypress.env('BASE_URL')}register`);
    }
    fillEmail({ email }) {
        const field = cy.getPogrElement('register-email-text-input');
        field.type(email);
    }

    fillPassword({ password = 'Testing123' }) {
        const field = cy.getPogrElement('register-password-text-input');
        field.type(password);
    }

    fillConfirmPassword({ confirmPassword = 'Testing123' }) {
        const field = cy.getPogrElement('register-confirm-password-text-input');
        field.type(confirmPassword);
    }

    submit() {
        const button = cy.getPogrElement('register-next-step-button');
        button.click();
    }

}

module.exports = new SignUpPage();