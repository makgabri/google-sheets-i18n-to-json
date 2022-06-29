# Google Sheets I18N To JSON

![logo](https://user-images.githubusercontent.com/36118824/176408861-667d1731-7f7c-41b0-9aa7-767ef5e53adb.png)

![MIT License](https://badgen.net/badge/license/MIT/blue)
![Terminal](https://badgen.net/badge/icon/terminal?icon=terminal&label)
![NPM Version](https://badgen.net/npm/v/google-sheets-i18n-to-json)

Google Sheets I18N To JSON is a command line tool to help pull google sheets as JSON objects for I18N use.

The idea is that you have a google spreadsheet where you have a google spreadsheet to maintain a reference of keys to text corresponding to the language. This way both developers and clients can be on the same track with official texts for a product.

After updating the spreadsheet, the developer would want to update the JSON objects as easy as running: 
```console
foo@bar:~$ google-sheets-i18n-to-json update
```

There are a short number of easy steps that the command line tool guides you to making the spreadsheet, authorizing and pulling the JSON objects. Check out the website to get a thorough and proper understanding of the command line tool.

Website: https://google-sheets-i18n-to-json.netlify.app

Getting-Started: https://google-sheets-i18n-to-json.netlify.app/getting-started

Website Deploy Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/4f6d4b4b-429e-4b2b-9fff-ccfc5e7b6512/deploy-status)](https://app.netlify.com/sites/google-sheets-i18n-to-json/deploys)

## Example of Use Case
The command line tool creates a spreadsheet like this after initializing:
<img width="794" alt="image" src="https://user-images.githubusercontent.com/36118824/176410896-7ea423cb-f411-4e33-b6a8-60582793c843.png">

After initializing, the JSON objects will be pulled at first. However, say you or your team or your clients add a new key "Bye" and fill in the text in the corresponding locales. Simply run:
```console
foo@bar:~$ google-sheets-i18n-to-json update
```
to get the following:
<img width="794" alt="image" src="https://user-images.githubusercontent.com/36118824/176411799-8cdf244d-78f2-45e8-ad38-23dd54e6d970.png">


## Short README of functions
Commands:

1. Installing
2. Initialization
3. Authorizing
4. Pulling JSON Objects
5. Adding languages
6. Deleting language
7. Cleaning and removing files


### Installation
Using npm:
```console
foo@bar:~$ npm install --save-dev google-sheets-i18n-to-json
```
Using yarn:
```console
foo@bar:~$ yarn add google-sheets-i18n-to-json -D
```

### Using
Since google-sheets-i18n-to-json is long, you can use the following as a short form:
```console
foo@bar:~$ gs-i18n-json
```
Alternatively, the long version would still work.


### Initialization
#### Normal Initialization
Follow the steps to generate a spreadsheet after entering the command:
```console
foo@bar:~$ gs-i18n-json init
```

#### Linking Initialization
Follow the steps to link a spreadsheet after entering the command:
```console
foo@bar:~$ gs-i18n-json link
```

#### Linking New Initialization
Follow the steps to link a spreadsheet and create a new sheet inside after entering the command:
```console
foo@bar:~$ gs-i18n-json link-new
```


### Authorizing
Generates a token to perform actions. Initialization already includes this.
```console
foo@bar:~$ gs-i18n-json authorize
```
Get the date of when the token was generated:
```console
foo@bar:~$ gs-i18n-json token-date
```

### Updating JSON Objects
```console
foo@bar:~$ gs-i18n-json update
```

### Adding languages to spreadsheet
```console
foo@bar:~$ gs-i18n-json add-lang --lang language_1
```
### Deleting languages from spreadsheet
```console
foo@bar:~$ gs-i18n-json delete-lang --lang language_1
```

### Cleaning files
```console
foo@bar:~$ gs-i18n-json clean
```
Also remove config:
```console
foo@bar:~$ gs-i18n-json clean --config
```
