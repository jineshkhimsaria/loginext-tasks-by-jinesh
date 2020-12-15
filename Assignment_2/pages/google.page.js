const googleCommon = require("./google.common");
const excel = require('excel4node');
const excelFile = "Assignment_2.xlsx";
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet-1');


class GoogleMaps {

    // Objects & Variables
    // Test data of addresses will be fetched from data.json file
    sourceAddress;
    destinationAddress;

    // Cookie pop-up iframe & agree button
    get iframe() { return $(`iframe[class="widget-consent-frame"]`) }
    get popUpAgree() { return $(`#introAgreeButton`); }

    // Direction button & its container
    get directionBtn() { return $(`#searchbox-directions`); }
    get directionContainer() { return $(`div[class="searchbox-directions-container"]`); }
    
    // Source & Destination address text boxes, suggestions & suggestion grids
    get sourceInputBox() { return $(`input[aria-label*="Choose starting point"]`); }
    get destinationInputBox() { return $(`input[aria-label*="Choose destination"]`); }
    get sourceSuggestionGrid() {return $$(`#suggestions-grid`)[0]; }
    get destinationSuggestionGrid() {return $$(`#suggestions-grid`)[1]; }
    get addressSuggestionSelection() { return $$(`div[role="row"]`)[0]; }

    // Route details
    get firstRoute() { return $(`#section-directions-trip-0`); }
    get routeSectionLayout() { return $$(`div[class="section-layout"]`); }
    get waypoints() { return $$(`span[class="section-trip-header-waypoint-name"]`); }
    get tripSummaryTitle() { return $(`h1[class="section-trip-summary-title"]`); }
    get tripRouteHiglight() { return $(`#section-directions-trip-title-0`); }
    get maneuverArrows() { return $$(`button[class="directions-group-disclose"]`); }
    get allManeuvers() { return $$(`div[class="numbered-step"]`); }
    get allDistances() { return $$(`div[class="directions-mode-step"] div[class="directions-mode-separator"] div[class="directions-mode-distance-time"]`)}


    // Functions
    // Agree cookies function & related verification
    agreeCookies() {
        try {
            this.iframe.waitForDisplayed();
            browser.switchToFrame(this.iframe);
            this.popUpAgree.click();
        }
        catch {
        }
        finally {
            if (this.iframe.isExisting()) {
                browser.switchToFrame(this.iframe);
                this.popUpAgree.click();
            }
            expect(this.iframe).dom.to.eventually.not.be.visible();
        }
    }

    // Import of test data (source & destination address from a json file data.json)
    importData() {
        const fs = require('fs');
        let rawdata = fs.readFileSync("data.json");
        var data = JSON.parse(rawdata);
        this.sourceAddress = data["source"];
        this.destinationAddress = data["destination"];
    }

    // Go to URL. URL is passed as part of command line
    goToUrl() {
        try {
            browser.url("/");
            this.agreeCookies();
        }
        catch {
        }
        finally {
            this.importData();
        }
    }

    // Click Direction button
    clickDirectionBtn() {
        expect(this.directionContainer.getAttribute("style")).does.not.contain("display: none;");
        this.directionBtn.click();
        expect(this.directionContainer.getAttribute("style")).contains("display: none;");
    }

    // Enter source address & select the first suggestion
    enterSourceAddress() {
        var source = this.sourceInputBox;
        source.setValue(this.sourceAddress);
        browser.pause(500);
        this.sourceSuggestionGrid.$(this.addressSuggestionSelection).click();
    }

    // Enter destination address & select the first suggestion
    enterDestinationAddress() {
        this.destinationInputBox.setValue(this.destinationAddress);
        browser.pause(500);
        this.destinationSuggestionGrid.$(this.addressSuggestionSelection).click();
    }

    // Select first route from all the routes shown
    selectFirstRoute() {
        this.firstRoute.click();
        this.routeDetails();
    }

    // Writing route details in an excel file
    routeDetails() {
        this.tripSummaryTitle.waitForDisplayed();
        this.tripRouteHiglight.waitForDisplayed();
        var summaryTitle = this.tripSummaryTitle.getText();
        var summaryHighlight = this.tripRouteHiglight.getText();
        var index;
        this.expandManeuverDetails();
        this.allManeuvers[0].waitForDisplayed();
        this.allDistances[0].waitForDisplayed();
        var maneuvers = this.allManeuvers;
        var distances = this.allDistances;
        
        this.writeToExcel(1, 1, "From - " + this.waypoints[0].getText());
        this.writeToExcel(2, 1, "To - " + this.waypoints[1].getText());
        this.writeToExcel(3, 1, summaryTitle + " " + summaryHighlight);

        for (index=0; index<maneuvers.length; index++) {
            maneuvers[index].scrollIntoView();
            var maneuverTitle = maneuvers[index].getText();
            var maneuverDistance = distances[index].getText();
            this.writeToExcel(index+5, 1, maneuverTitle);
            this.writeToExcel(index+5, 2, maneuverDistance);
        }
    }

    // Expanding route maneuvers by clicking the arrows otherwise the maneuvers are hidden
    expandManeuverDetails() {
        var index;
        this.maneuverArrows[0].waitForDisplayed();
        var arrows = this.maneuverArrows;
        for (index=0; index<arrows.length; index++) {
            arrows[index].waitForDisplayed();
            arrows[index].scrollIntoView();
            arrows[index].click();
            while (arrows[index].getAttribute("aria-expanded") == "false") {
                    arrows[index].waitForDisplayed();
                    arrows[index].scrollIntoView();
                    arrows[index].click();
            }
            expect(arrows[index].getAttribute("aria-expanded")).equals("true");
        }
    }

    // Write to an excel file
    writeToExcel(row, column, strValue) {
        worksheet.cell(row, column).string(strValue);
    }

    // Save the excel file
    saveExcelFile() {
        workbook.write(excelFile);
    }

}

module.exports = new GoogleMaps()