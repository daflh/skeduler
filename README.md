# Skeduler
Event scheduler build with Firebase. See the preview [here](https://dap-skeduler.web.app/).

<details>
  <summary>Screenshots</summary>
  
  ![Dashboard Screenshot](https://i.imgur.com/HIfOrpm.png)
  ![Events Screenshot](https://i.imgur.com/9JohmaO.png)
  ![Goals Screenshot](https://i.imgur.com/Oj6dHCr.png)
</details>

## Create your own

### Prerequisites
- Google account with a Firebase project
- Firebase project must have enabled Google sign-in method in Authentication ([how?](https://i.imgur.com/7PhXLbz.png))
- Firebase project must have created a Cloud Firestore database with rules allowing third party read and write ([how?](https://i.imgur.com/0hWAhMn.png))
- Node.js and npm with Firebase CLI installed, if you haven't then install it by running this command `npm i -g firebase-tools`

### Run on your machine
1. Make a copy of this repository then move to that folder
```sh
npx degit dafiulh/skeduler skeduler
cd skeduler
```
2. Login to Firebase CLI with your Google account
```sh
firebase login
```
3. Set an active Firebase project for this folder
```sh
firebase use --add
```
4. Go to `public/js/main.js` file then change the `config` variable with your Firebase app configuration ([?](https://support.google.com/firebase/answer/7015592#web))
```javascript
// change this variable
const config = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "example.firebaseapp.com",
    databaseURL: "https://example.firebaseio.com",
    projectId: "example",
    storageBucket: "example.appspot.com",
    messagingSenderId: "123456789012",
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
