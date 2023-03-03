import SignUpPage from "../util/pages/SignUpPage.cy";
import HeaderPage from "../util/pages/HeaderPage.cy";
import signupTestData from "../../../fixtures/i18n/signup_test_data.json";
let lang = Cypress.env('lang');

describe('Sign Up Complete Suite', () => {
    context('Sign Up - New User Registration Flow', () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.visit(`${Cypress.env('BASE_URL')}`);
            cy.wait(2000);
            HeaderPage.signUp();
        });

        it('Sing Up New User', () => {

            SignUpPage.fillEmail({ email: signupTestData[lang].fields.email });
            SignUpPage.fillPassword({ password: signupTestData[lang].fields.password });
            SignUpPage.fillConfirmPassword({ confirmPassword: signupTestData[lang].fields.confirm_password });
            SignUpPage.submit();
            cy.wait(5000);

            cy.elementExists('.VerificationCodeForm_titleRow__AdJBO').then(($element) => {
                if ($element) {
                    cy.getEmailCode().then(
                        (response) => {
                            let code = response.body && response.body.code && response.body.code.split('');
                            if (code) {
                                let code = response.body.code.split('')
                                cy.getElementByClass({ styleClass: '.VerificationCodeInput_input__1ceYF' })
                                    .within(() => {
                                        // enter the code
                                        for (let i = 0; i < code.length; i++) {
                                            cy.get('input').eq(i).type(code[i])
                                        }
                                    })
                                cy.getPogrElement('register-verification-submit-button').click();
                                cy.getPogrElement('register-qrcode-skip-button').click();
                                cy.get('.RegisterForm_titleRow__HbnJC')
                                    .contains(signupTestData[lang].text.get_started);
                            }
                        }
                    )
                }
            })

            cy.elementExists('.RegisterForm_errorRow__Mci8P').then((cb) => {
                if (cb) {
                    cy.getPogrElement('register-error-text')
                        .should("be.visible")
                        .and(
                            "contain.text",
                            signupTestData[lang].error.user_already_registered
                        );
                }
            })
        })
        it("Should not allow a User to sign up with an existing email", () => {

            SignUpPage.fillEmail({ email: signupTestData[lang].fields.email });
            SignUpPage.fillPassword({ password: signupTestData[lang].fields.password });
            SignUpPage.fillConfirmPassword({ confirmPassword: signupTestData[lang].fields.confirm_password });
            SignUpPage.submit();
            cy.wait(5000);

            cy.getPogrElement('register-error-text')
                .should("be.visible")
                .and(
                    "contain.text",
                    signupTestData[lang].error.user_already_registered
                );
        });

    })
    context('Sign Up - Registration Error Conditions', () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.visit(`${Cypress.env('BASE_URL')}`);
            cy.wait(1000);
            HeaderPage.signUp();
        });
        it("Should show 'Password mismatch' when User enters different passwords", () => {

            SignUpPage.fillEmail({ email: signupTestData[lang].fields.email });
            SignUpPage.fillPassword({ password: signupTestData[lang].fields.password });
            SignUpPage.fillConfirmPassword({ confirmPassword: signupTestData[lang].fields.wrong_password });
            SignUpPage.submit();
            cy.wait(500);

            cy.getPogrElement('register-error-text')
                .should("be.visible")
                .and(
                    "contain.text",
                    signupTestData[lang].error.password_mismatch
                );
        });

        it("Should show 'Invalid register info' when User submits without entering any data", () => {

            cy.wait(500);
            SignUpPage.submit();
            cy.wait(500);

            cy.getPogrElement('register-error-text')
                .should("be.visible")
                .and(
                    "contain.text",
                    signupTestData[lang].error.invalid_reg_info
                );
        });
        it("Should show 'Invalid value' when User submits without entering passwords", () => {

            SignUpPage.fillEmail({ email: signupTestData[lang].fields.email });
            SignUpPage.submit();
            cy.wait(500);

            cy.getPogrElement('register-error-text')
                .should("be.visible")
                .and(
                    "contain.text",
                    signupTestData[lang].error.invalid_value
                );
        });
    })
})