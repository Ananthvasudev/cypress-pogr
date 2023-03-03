class LoginPage {
    visit() {
        cy.visit(`${Cypress.env('BASE_URL')}login`);
    }

    fillEmail({ email }) {
        const field = cy.getPogrElement('login-input-textinput');
        field.type(email);
    }

    fillPassword({ password }) {
        const field = cy.getPogrElement('password-textinput');
        field.type(password);
    }

    submit() {
        const button = cy.getPogrElement('sign-in-submit-button');
        button.click();
    }

    checkbox(){
        const field = cy.get("#remember-me-checkbox-input");
       // field.check();
       return field

    }
    
}

module.exports = new LoginPage();
