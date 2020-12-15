googleCommon = require(`../pages/google.common`)

describe(`Google maps - `, function() {
    it(`View & save route details`, () => {
        pageGoogle.goToUrl();
        pageGoogle.clickDirectionBtn();
        pageGoogle.enterSourceAddress();
        pageGoogle.enterDestinationAddress();
        pageGoogle.selectFirstRoute();       
        pageGoogle.saveExcelFile();       
    })
})