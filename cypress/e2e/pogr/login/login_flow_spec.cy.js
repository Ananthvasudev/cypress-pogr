import LoginPage from "../util/pages/LoginPage.cy";
import HeaderPage from "../util/pages/HeaderPage.cy";
import loginTestData from "../../../fixtures/i18n/login_test_data.json";
let lang = Cypress.env("lang");

describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("BASE_URL")}`);
    cy.clearCookies();
    cy.wait(500);
  });

  it('Login - Successful Flow', () => {
      HeaderPage.signIn();
      LoginPage.fillEmail({ email: loginTestData[lang].fields.email });
      LoginPage.fillPassword({ password: loginTestData[lang].fields.password });
      LoginPage.submit();

      cy.url().should('eq', `${Cypress.env('BASE_URL')}login`);

      cy.getElementByClass({ styleClass: '.VerificationCodeForm_titleRow__5IVKP' })
          .should("contain", loginTestData[lang].text.verify_login);
      cy.getPogrElement('handle-verification-code-reset-anchor-tag')
          .click();

      cy.wait(5000);
      cy.getEmailCode().then(
          (response) => {
              let code = response.body && response.body.code && response.body.code.split('');
              if (code) {
                  cy.getElementByClass({ styleClass: '.VerificationCodeInput_input__1ceYF' })
                      .within(() => {
                          // enter the code
                          for (let i = 0; i < code.length; i++) {
                              cy.get('input').eq(i).type(code[i])
                          }
                      })
                  cy.getPogrElement('verification-code-submit-button').click();
                  cy.wait(5000);
                  cy.getElementByClass({ styleClass: '.NavbarItem_itemTitle__m75rt' })
                      .then(($navItems) => {
                          expect($navItems, '4 items').to.have.length(4)
                      });
              }
          }
      )
  })

  it("The user must be redirected to the signup screen when the user click on the 'Create one now link ",()=>{
      HeaderPage.signIn();
      cy.getPogrElement("login-form-register-redirect-link").click()

      cy.url().should("include", "register").and("not.include", "login")
      cy.get(".RegisterForm_titleRow__HbnJC").contains(
        loginTestData[lang].text.create_one_now);

      })

  it("Login: Logo must be present on the login page",()=>{
      HeaderPage.signIn();
       cy.get('[src="/_next/static/media/Logo-full-vertical.0b737a23.svg"]').should("be.visible")

  });

  it("Login page should have correct placeholder text for all fields", () => {
    HeaderPage.signIn();
    cy.getPogrElement("login-input-textinput")
      .should("have.attr", "placeholder")
      .and("equal", loginTestData[lang].placeholders.Emai_field);
    cy.getPogrElement("password-textinput")
      .should("have.attr", "placeholder")
      .and("equal", loginTestData[lang].placeholders.Password_field);
  });

  it("Login page should have correct labels for all fields", () => {
    HeaderPage.signIn();
    cy.getPogrElement("login-form-input-row")
      .should("have.length", 3)
      .and(($li) => {
        expect($li.get(0).textContent, "Email label").to.equal(
          loginTestData[lang].labels.Sign
        );
        expect($li.get(1).textContent, "Password label").to.equal(
          loginTestData[lang].labels.Password
        );
      });
    //   .and(($li) => {
    //     expect($li.get(1).textContent, "Password label").to.equal(
    //       loginTestData[lang].labels.Password
    //     );
    //   })
  });
});

context("Login:An error message for invalid login ", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(`${Cypress.env("BASE_URL")}`);
    cy.wait(500);
    HeaderPage.signIn();
  });

  it("Login: An error message for login with empty field",()=>{
      cy.wait(5000)
      LoginPage.submit();
      cy.wait(5000)

      cy.getPogrElement("login-form-error-text")
        .should("be.visible")
        .and("contain.text", loginTestData[lang].error.All_empty_fields);

  })

  it("Login: An error message for invalid password",()=>{
      LoginPage.fillEmail({email:loginTestData[lang].fields.email})
      LoginPage.fillPassword({
        password: loginTestData[lang].fields.invalid_passord,});
        cy.wait(1000)
        LoginPage.submit();
        cy.wait(5000)

        cy.getPogrElement("login-form-error-text")
          .should("be.visible")
          .and("contain.text", loginTestData[lang].error.Incorrect_password);
  })

  it("Login: An error message for invalid email id",()=>{
      LoginPage.fillEmail({
        email: loginTestData[lang].fields.incorrect_email});
      LoginPage.fillPassword({password:loginTestData[lang].fields.password})
      LoginPage.submit()
      cy.wait(5000)

      cy.getPogrElement("login-form-error-text")
          .should("be.visible")
          .and("contain.text", loginTestData[lang].error.Incorrect_Email);
  })

  it("Login: An error message for invalid credentials",()=>{
      LoginPage.fillEmail({
        email: loginTestData[lang].fields.incorrect_email});
      LoginPage.fillPassword({password:loginTestData[lang].fields.password})
      LoginPage.submit()
      cy.wait(5000)

      cy.getPogrElement("login-form-error-text")
          .should("be.visible")
          .and("contain.text", loginTestData[lang].error.Incorrect_Email);
  })

  it("Login: An error message for incorrect email id",()=>{
      LoginPage.fillEmail({
        email: loginTestData[lang].fields.invalid_email});
      LoginPage.fillPassword({password:loginTestData[lang].fields.password})
      LoginPage.submit()
      cy.wait(5000)

      cy.getPogrElement("login-form-error-text")
          .should("be.visible")
          .and("contain.text", loginTestData[lang].error.Invalid_Email);
  })

  it("should remember the user credentials after logout",()=>{
      LoginPage.fillEmail({email:loginTestData[lang].fields.email})
      LoginPage.fillPassword({password:loginTestData[lang].fields.password})
      // cy.get("#remember-me-checkbox-input").check();
      // cy.get("#remember-me-checkbox-input").should('be.checked')
     LoginPage.checkbox().check()
      LoginPage.checkbox().should("be.checked")
      cy.wait(1000)
      LoginPage.submit();
      cy.wait(5000)
  });
});
