# loginext-tasks-by-jinesh
Loginext Tasks by Jinesh Khimsaria

Assignment 2: Automation of Google maps

Details of OS & softwares used for test automation -
  OS - Mac OS Mojave 10.14.6 (18G2022)
  Install Node version - 14.4.0
  Install NPM version - 6.14.4
  WebdriverIO version - 6.1.25
  Install Chrome - 87.0.4280.88
  Chromedriver - 87.0.4280.20

Steps -
  To install required libraries -
    1. npm install
    2. npm audit fix

  To run the test -
    1. npm run chrome --baseUrl "https://maps.google.com/"

Outcome -
  1. Route details will be stored in an excel file Assignment.xlsx
  2. Screenshot of the route will be created & stored inside reports/html-reports/screenshots/\*.png
  
Pending work -
1. Invalid scenario (when the route is not created between source & destination)
2. Chrome headless
3. Firefox support
4. Run test inside a docker container
