/// <reference types="cypress" />

import test1 from './locators';  //Note: if u are storing locators file to other folder the here give path from that respective folder

const testObj = new test1();
describe('Functional Testing_Mytime Widget', () => {
    before(() => {
        cy.visit('https://www.mytime.com/mkp/40426');

    });
    it('Verify Functional Testing_Mytime Widget', () => { 
        cy.get(testObj.tablerows).last().find(testObj.tableColm).invoke('text').then((text)=>{
            Cypress.env('countryText', text);
            cy.log(Cypress.env('countryText'));
            cy.get(testObj.tablerows).last().find(testObj.tableColm).click();
            
        });
        cy.get(testObj.locationEl).then((location) => {
            expect(location.text().trim()).to.equal( Cypress.env('countryText'))
        });
        cy.intercept('GET', 'https://www.mytime.com/api/mkp/v1/companies/40426/deals?location_ids=**').as('deals');
        cy.wait('@deals');
        cy.wait(5000);
        cy.get(testObj.service, {timeout: 10000}).eq(3).click();
        cy.get(testObj.service).each((person,i) => {
            if(person.text() == 'Rajat') {
                cy.get(testObj.service).eq(i).click();
                Cypress.env('personName', person.text());
            }
        }).then(()=>{
            cy.get(testObj.personText).should('have.text', Cypress.env('personName'));
        });
        
        cy.get(testObj.blocks).each((blokEl, j) => {
            if(blokEl.text() == 'Consultation') {
                cy.get(testObj.duration).eq(j).should('have.text', '15 Min');
                cy.get(testObj.pricerange).eq(j).then(el=>{
                    Cypress.env('rangePrice', el.text());
                    expect(el.text()).to.equal('$12.10-$13.20');
                })
                cy.get(testObj.bookBtn).eq(j).click();
            };
        });
        cy.get(testObj.cartPopup).eq(0).should('be.visible');
        cy.get(testObj.cartPrice).eq(0).then((cartprice) => {
            expect(cartprice.text()).to.eq(Cypress.env('rangePrice'));
        });
    });
});