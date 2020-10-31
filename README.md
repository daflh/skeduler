# Skeduler
Easy to use event scheduler build with Firebase. See the preview [here](https://dap-skeduler.web.app/).

<details>
  <summary>Screenshots</summary>
  
  ![Dashboard Screenshot](https://i.imgur.com/HIfOrpm.png)
  ![Events Screenshot](https://i.imgur.com/9JohmaO.png)
  ![Goals Screenshot](https://i.imgur.com/Oj6dHCr.png)
</details>

## Create your own

### Prerequisites
- Has a Google account with firebase project
- Your project must have enabled Google sign-in method in Authentication ([?](https://i.imgur.com/7PhXLbz.png))
- Your project must have created a Cloud Firestore database with rules allowing third party read and write ([?](https://i.imgur.com/0hWAhMn.png))
- Node.js and npm with Firebase CLI installed on it, if you haven't then install it by running this command `npm i -g firebase-tools`

### Run on your machine
1. Login to Firebase CLI with your Google account (if you haven't)
```sh
firebase login
```
2. To make a copy of this repository, create a new folder, then run this command below
```sh
npx degit dafiulh/skeduler
```
3. Set an active Firebase project for your working directory/folder
```sh
firebase use --add
```
4. Go to `public/js/main.js` file then change the `config` variable with your Firebase configuration ([?](https://i.imgur.com/NTgG0Ap.jpg))
```javascript
// change this variable
const config = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "example.firebaseapp.com",
    databaseURL: "https://example.firebaseio.com",
    projectId: "example",
    storageBucket: "example.appspot.com",
    messagingSenderId: "0000000000",
    appId: "YOUR_FIREBASE_APP_ID"
};
```
5. You're done! Now you can start a local server
```sh
firebase serve
```

### Deploy to Firebase Hosting
```sh
firebase deploy
```

## To-do

Custom repeat for event, the `repeat` field will contains an array with 2 elements, for example `[3, "week"]` means repeat event every 3 weeks
