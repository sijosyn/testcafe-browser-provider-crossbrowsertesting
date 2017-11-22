import { flatten } from 'lodash';
import CBTConnector from 'cbt_tunnels';
import request from 'request-promise';
import wd from 'wd';

var openedBrowsers = {};
var webDriver;

const AUTH_FAILED_ERROR = 'Authentication failed. Please assign the correct username and access key ' +
    'to the CBT_TUNNELS_USERNAME and CBT_TUNNELS_AUTHKEY environment variables.';

const CBT_API_PATHS = {
    browserList: {
        url: 'https://crossbrowsertesting.com/api/v3/selenium/browsers?format=json'
    },
    tunnelInfo: {
        url: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true'
    },
    deleteTunnel: id => ({
        url:    `https://crossbrowsertesting.com/api/v3/tunnels/${id}`,
        method: 'DELETE'
    }),
    seleniumTestHistory: {
        url: 'https://crossbrowsertesting.com/api/v3/selenium?active=true'
    },
    deleteBrowser: id => ({
        url:    `https://crossbrowsertesting.com/api/v3/selenium/${id}`,
        method: 'DELETE'
    })
};

function doRequest (apiPath) {
    var url = apiPath.url;

    var opts = {
        auth: {
            user: process.env['CBT_TUNNELS_USERNAME'],
            pass: process.env['CBT_TUNNELS_AUTHKEY'],
        },

        method: apiPath.method || 'GET'
    };

    return request(url, opts)
        .catch(error => {
            throw error;
        });
}

async function startBrowser (id, url, capabilities) {
    webDriver = wd.promiseChainRemote('hub.crossbrowsertesting.com', 80, process.env['CBT_TUNNELS_USERNAME'], process.env['CBT_TUNNELS_AUTHKEY']);
    openedBrowsers[id] = webDriver;

    await webDriver
        .init(capabilities)
        .get(url);

}

export default {
    // Multiple browsers support
    isMultiBrowser: true,
    platformsInfo:  [],
    browserNames:   [],

    async _getDeviceList () {
        this.myArr = JSON.parse(await doRequest(CBT_API_PATHS.browserList));

        this.browserNames = this.myArr
            .map(info => {
                if (info['device'] === 'mobile') {
                    this.name = info['browsers'][0]['type'];
                    this.version = info['caps'].platformVersion;
                    this.OS = info['caps'].deviceName;
                    return `${this.name}@${this.version}:${this.OS}`;
                }

                this.arrList = [];
                this.OS = info['name'];

                for (var i = 0; i < info['browsers'].length; i++) {
                    this.name = info['browsers'][i]['type'];
                    this.version = info['browsers'][i]['version'];
                    this.arrList.push(`${this.name}@${this.version}:${this.OS}`);
                }
                return this.arrList;
            });

        this.browserNames = flatten( this.browserNames);
    },


    // Required - must be implemented
    // Browser control
    async openBrowser (id, pageUrl, browserName) {
        if (!process.env['CBT_TUNNELS_USERNAME'] || !process.env['CBT_TUNNELS_AUTHKEY'])
            throw new Error(AUTH_FAILED_ERROR);

        CBTConnector.start({ 'username': process.env['CBT_TUNNELS_USERNAME'], 'authkey': process.env['CBT_TUNNELS_AUTHKEY'] }, function (err) {
            if (!err) {

                var colon = browserName.indexOf(':');

                if (colon > -1) {
                    var platform = browserName.substr(colon + 1);

                    browserName = browserName.substr(0, colon);
                }
                var at = browserName.indexOf('@');

                if (at > -1) {
                    var version = browserName.substr(at + 1);

                    browserName = browserName.substr(0, at);
                }

                var capabilities;

                if (browserName !== 'Chrome Mobile' && browserName !== 'Mobile Safari') {
                    capabilities = {
                        browserName: browserName,
                        version:     version,
                        platform:    platform
                    };
                } 
                else {
                    capabilities = {
                        browserName:     browserName,
                        platformVersion: version,
                        deviceName:      platform
                    };
                }

                capabilities.name = `TestCafe test run ${id}`;

                startBrowser(id, pageUrl, capabilities);
            }

        });
    },

    async closeBrowser (id) {
        await openedBrowsers[id].quit();
    },


    // Optional - implement methods you need, remove other methods
    // Initialization
    async init () {
        await this._getDeviceList();
    },

    async dispose () {
        this.seleniumHistoryList = JSON.parse(await doRequest(CBT_API_PATHS.seleniumTestHistory));
        if (this.seleniumHistoryList.meta.record_count >= 1) {
            for (let i = 0; i < this.seleniumHistoryList.meta.record_count; i++) {
                this.seleniumTestID = this.seleniumHistoryList.selenium[i].selenium_test_id;
                await doRequest(CBT_API_PATHS.deleteBrowser(this.seleniumTestID));
            }
        }

        this.tunnelList = JSON.parse(await doRequest(CBT_API_PATHS.tunnelInfo));
        if (this.tunnelList.meta.record_count >= 1) {
            for (let i = 0; i < this.tunnelList.meta.record_count; i++) {
                this.tunnelID = this.tunnelList.tunnels[i].tunnel_id;
                await doRequest(CBT_API_PATHS.deleteTunnel(this.tunnelID));
            }
        }
    },

    // Browser names handling
    async getBrowserList () {
        return this.browserNames;
    },

    async isValidBrowserName (/* browserName */) {
        return true;
    },


    // Extra methods
    async resizeWindow (/* id, width, height, currentWidth, currentHeight */) {
        this.reportWarning('The window resize functionality is not supported by the "crossbrowsertesting" browser provider.');
    },

    async takeScreenshot (/* id, screenshotPath, pageWidth, pageHeight */) {
        this.reportWarning('The screenshot functionality is not supported by the "crossbrowsertesting" browser provider.');
    }
};
