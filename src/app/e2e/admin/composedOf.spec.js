import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import {
    elementIsClicked,
    stalenessOf,
    elementValueIs,
    elementTextIs,
    elementsCountIs,
    elementTextContains,
} from 'selenium-smart-wait';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import fixtures from './composedOf.json';
import { inputElementIsFocusable } from '../../../common/tests/conditions';
import loginAsJulia from '../loginAsJulia';

describe('Admin', () => {
    describe('composedOf', function homeTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear();
            await loadFixtures(fixtures);

            await driver.get('http://localhost:3100/admin');
            await driver.executeScript('return localStorage.clear();');
            await driver.executeScript('return sessionStorage.clear();');
            await loginAsJulia('/admin', '/');
        });

        it('should display form for newField4 column when clicking on btn-add-column', async () => {
            const buttonAddColumn = '.btn-add-column';
            await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
            await driver.sleep(500); // animations

            const buttonAddFreeColumn = '.btn-add-free-column';
            await driver.wait(elementIsClicked(buttonAddFreeColumn), DEFAULT_WAIT_TIMEOUT);

            await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);

            const label = '#field_form input[name=label]';
            await driver.wait(elementValueIs(label, 'newField 4'), DEFAULT_WAIT_TIMEOUT);
        });

        it('should change column name', async () => {
            const label = await driver.findElement(By.css('#field_form input[name=label]'));
            await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

            await label.clear();
            await label.sendKeys('Fullname');

            const th = '.publication-excerpt-for-edition th';
            await driver.wait(elementTextIs(th, 'Fullname', DEFAULT_WAIT_TIMEOUT));
        });

        it('should add composedOf', async () => {
            const addComposedOf = await driver.findElement(By.css('.add-composed-of'));
            await driver.wait(elementIsClicked(addComposedOf, DEFAULT_WAIT_TIMEOUT));
            await driver.wait(stalenessOf(addComposedOf, DEFAULT_WAIT_TIMEOUT));
            await driver.wait(until.elementsLocated(By.css('.remove-composed-of')), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.separator')), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(elementValueIs('.separator input', ' ', DEFAULT_WAIT_TIMEOUT));

            const compositeFields = await driver.findElements(By.css('.composite-field'));
            expect(compositeFields.length).toBe(2);

            await Promise.all(
                compositeFields
                    .map(field => field.getText()
                        .then(text => expect(text).toBe('select a field')),
                    ),
            );
        });

        it('should select first field', async () => {
            const compositeFields = await driver.findElements(By.css('.composite-field'));
            await driver.wait(elementIsClicked(compositeFields[0], DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.field_uri', 'URI', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.field_firstname', 'firstname', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.field_name', 'name', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementIsClicked('.field_firstname'));
            await driver.wait(elementTextContains('.composite-field:first-child', 'firstname', DEFAULT_WAIT_TIMEOUT));
        });

        it('should select second field', async () => {
            const compositeFields = await driver.findElements(By.css('.composite-field'));
            await driver.wait(elementIsClicked(compositeFields[1], DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.field_uri', 'URI', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.field_firstname', 'firstname', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.field_name', 'name', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementIsClicked('.field_name'));
            await driver.wait(elementTextContains('.composite-field:nth-child(2)', 'name', DEFAULT_WAIT_TIMEOUT));
        });

        it('should add third field', async () => {
            await driver.wait(elementIsClicked('.add-composite-field', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementsCountIs('.composite-field', 3, DEFAULT_WAIT_TIMEOUT));
            await driver.wait(
                elementTextContains('.composite-field:nth-child(3)', 'select a field', DEFAULT_WAIT_TIMEOUT),
            );
        });

        it('should remove third field', async () => {
            await driver.wait(elementIsClicked('.remove-composite-field', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementsCountIs('.composite-field', 2, DEFAULT_WAIT_TIMEOUT));
            await driver.wait(
                elementTextContains('.composite-field:nth-child(1)', 'firstname', DEFAULT_WAIT_TIMEOUT),
            );
            await driver.wait(
                elementTextContains('.composite-field:nth-child(2)', 'name', DEFAULT_WAIT_TIMEOUT),
            );
        });

        it('should try to remove second field', async () => {
            await driver.wait(elementIsClicked('.remove-composite-field', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementsCountIs('.composite-field', 2, DEFAULT_WAIT_TIMEOUT));
        });

        it('should change the separator', async () => {
            const separator = await driver.findElement(By.css('.separator input'));
            await separator.clear();
            await separator.sendKeys('-');
            // await driver.wait(elementHasBeenSentKeys('.separator input', '-', DEFAULT_WAIT_TIMEOUT));
        });

        it('should display the preview', async () => {
            await driver.wait(until.elementLocated(
                By.css('.publication-excerpt-for-edition'),
            ), DEFAULT_WAIT_TIMEOUT);
            const tds = await driver.findElements(By.css('.publication-excerpt-for-edition tr td:last-child'));
            expect(tds.length).toBe(5);
            const expectedTexts = [
                'PEREGRIN - TOOK',
                'SAMSAGET - GAMGIE',
                'BILBON - BAGGINS',
                'FRODO - BAGGINS',
                'MERIADOC - BRANDYBUCK',
            ];
            await Promise.all(tds.map((td, index) =>
                driver.wait(elementTextIs(td, expectedTexts[index], DEFAULT_WAIT_TIMEOUT))),
            );
        });

        it('should save the field', async () => {
            const saveButton = '.btn-save-column-edition';
            await driver.wait(elementIsClicked(saveButton), DEFAULT_WAIT_TIMEOUT);
            await driver.sleep(500);
        });

        it('should have added custom column with composedOf', async () => {
            await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);
            const tds = await driver.findElements(By.css('.publication-preview tr td:last-child'));
            expect(tds.length).toBe(6);

            const expectedTexts = [
                'PEREGRIN - TOOK',
                'SAMSAGET - GAMGIE',
                'BILBON - BAGGINS',
                'FRODO - BAGGINS',
                'MERIADOC - BRANDYBUCK',
            ];
            await Promise.all(tds.slice(0, 3).map((td, index) => // last td is the remove button
                driver.wait(elementTextIs(td, expectedTexts[index], DEFAULT_WAIT_TIMEOUT))),
            );
        });

        after(async () => {
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
            await clear();
        });
    });
});