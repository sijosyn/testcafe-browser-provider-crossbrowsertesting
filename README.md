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
export CBT_TUNNELS_USERNAME="your Sauce username/email address"
export CBT_TUNNELS_AUTHKEY="your sauce access key"
```
Press Escape.
Hold Shift and press Z twice (z z) to save your file and quit vi.
In the terminal, enter source ~/.bash_profile.


You can determine the available browser aliases by running
```
testcafe -b crossbrowsertesting
```

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

## Author
Sijo Cheeran (https://synacor.com)
