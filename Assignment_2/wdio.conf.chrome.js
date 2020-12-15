// Required libraries
const HtmlReporter = require('@rpii/wdio-html-reporter').HtmlReporter;
const ReportAggregator = require('@rpii/wdio-html-reporter').ReportAggregator;
const moment = require('moment');

exports.config = {
    
    // Runner Configuration
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',

    // Specify Test Files
    specs: [
        './tests/**/google.test.js'
    ],
    
    // Capabilities
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
    }],
    
    // Level for logs
    logLevels: {
        webdriver: 'trace',
        webdriverio: 'trace',
        '@wdio/mocha-framework': 'trace',
        '@wdio/local-runner': 'trace',
        '@wdio/cli' : 'trace'
    },
    
    // Enables colors for log output
    outputDir: './logs',
    
    // Default timeout for all waitFor* commands.
    waitforTimeout: 30000,

    // Default timeout in milliseconds for request if browser driver or grid doesn't send response
    connectionRetryTimeout: 60000,
    
    // Default request retries count
    connectionRetryCount: 3,
    
    // Selenium standalone service + chrome driver version
    services: [['selenium-standalone', {
        logPath: 'logs',
        installArgs: {
            drivers: {
                chrome: { version: '87.0.4280.20' },
            }
        },
        args: {
            drivers: {
                chrome: { version: '87.0.4280.20' },
            }
        },
    }]],

    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    mochaOpts: {
        timeout: 30000
    },
    
    // Reporter
    reporters: [[HtmlReporter, {
        showInBrowser: false,
        useOnAfterCommandForScreenshot: true,
        //LOG: log4j.getLogger("default")
    }],
    ],
    
    onPrepare: function (config, capabilities) {
        console.log('opening browser...');
        let reportAggregator = new ReportAggregator({
            outputDir: './reports/html-reports/',
            filename: 'master-report.html',
            reportTitle: 'Master Report',
        });
        reportAggregator.clean();
        global.reportAggregator = reportAggregator;
    },

    before: function (capabilities, specs) {
        browser.maximizeWindow()
    },
    
    beforeTest: function (test, context) {
        const chai = require('chai')
        const chaiWebdriver = require('chai-webdriverio').default

        chai.use(chaiWebdriver(browser))

        global.assert = chai.assert
        global.should = chai.should
        global.expect = chai.expect
        browser.deleteCookies();
    },

    afterTest: function (test) {
        const path = require('path');
        const timestamp = moment().format('YYYYMMDD-HHmmss.SSS');
        const filepath = path.join('./reports/html-reports/screenshots/', timestamp + '.png');
        browser.saveScreenshot(filepath);
        process.emit('test:screenshot', filepath);
    },

    onComplete: async function(exitCode, config, capabilities, results) {
        await console.log('Ending the test now');
        await global.reportAggregator.createReport({
            config: config,
            capabilities: capabilities,
            results: results
        });
    },
}
