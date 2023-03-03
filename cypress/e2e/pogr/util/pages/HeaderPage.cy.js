class HeaderPage {
    signIn() {
        const button = cy.getPogrElement('navbar-header-sign-in-button');
        button.click();
    }

    signUp() {
        const button = cy.getPogrElement('navbar-header-sign-up-button');
        button.click();
    }
}

module.exports = new HeaderPage();