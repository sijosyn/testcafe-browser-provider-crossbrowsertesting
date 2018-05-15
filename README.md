# testcafe-browser-provider-crossbrowsertesting
[![Build Status](https://travis-ci.org/sijosyn/testcafe-browser-provider-crossbrowsertesting.svg)](https://travis-ci.org/sijosyn/testcafe-browser-provider-crossbrowsertesting)

This plugin integrates [TestCafe](http://devexpress.github.io/testcafe) with the [CrossBrowserTesting Cloud](https://crossbrowsertesting.com).

## Install

```
npm install testcafe-browser-provider-crossbrowsertesting
```

## Usage
Before using this plugin, save the CrossBrowserTesting username and auth key to environment variables `CBT_TUNNELS_USERNAME` and `CBT_TUNNELS_AUTHKEY`.

## Setting Environment Variables for Mac OS X/Linux
In Terminal mode, enter vi ~/.bash_profile, and then press Enter.
Press i to insert text into your profile file.
Enter these lines:
```
export CBT_TUNNELS_USERNAME="your crossbrowsertesting username/email address"
export CBT_TUNNELS_AUTHKEY="your crossbrowsertesting auth key"
```
Press Escape.
Hold Shift and press Z twice (z z) to save your file and quit vi.
In the terminal, enter source ~/.bash_profile.

## Check available browsers
You can determine the available browser aliases by running
```
testcafe -b crossbrowsertesting
```

## Run tests
When you run tests from the command line, use the alias when specifying browsers:

```
testcafe "crossbrowsertesting:Internet Explorer@11:Windows 10" "path/to/test/file.js"
```


When you use API, pass the alias to the `browsers()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('crossbrowsertesting:Internet Explorer@11:Windows 10')
    .run();
```

## Configuration

Use the following environment variables to set additional configuration options:

 - `CBT_MAX_DURATION` - By default, a test will have a maximum run time of 600 seconds (10 minutes). If you need more time you can change that by passing the max_duration capability along with a value.The highest value is 14400 seconds (4 hours). [More details](https://help.crossbrowsertesting.com/selenium-testing/faq/default-duration-selenium-test-timeout-information/)  

## Author
Sijo Cheeran (https://synacor.com)
