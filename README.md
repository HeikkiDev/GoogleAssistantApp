# Handle Google Actions for Google Assistant Application with Firebase Cloud Functions

Basic structure of Firebase Cloud Functions project to handle Google Actions for a custom Google Assistant Application with Implicit Account Linking.

On the following Google codelab you can see the process of creating Firebase Project, API.AI agent and Firebase Cloud Functions project, and connect to Google Assistant on more detail:

https://codelabs.developers.google.com/codelabs/assistant-codelab/index.html#0



## Dependencies
actions-on-google: "^1.5.0"

firebase: "^4.4.0"

firebase-admin: "~5.4.0"

firebase-functions: "^0.7.0"

request": "^2.83.0"


## Install dependecies, Code and Deploy

First, install Firebase CLI:

```
npm install -g firebase-tools
```

Create a project on the Firebase Console:

https://console.firebase.google.com

Create a project (Agent) in API.AI. Create the necessary Intents, with the Actions names you are going to use for Google Assistant actions.

In this example we have 4 Intents:

- Welcome Default

- Bye

- Turn On Lights (Action name: lightson)

- Turn Off Lights (Action name: lightsoff)


Now create the Entity 'Room' with some values such as kitchen or bathroom.

Provide example user phrases in 'User says' in both 'Turn On Lights' and 'Turn Off Lights' Intents like:

- Lighst on

- Turn on kitchen lights


We also have to mark in the fullfilment section 'Use webhook' in all Intents, and mark as Required the Room parameter in 'Turn On/Off Lights' Intents.

In 'Bye' Intent we can mark 'End conversation' when Google Assistant Integration is enable.


Now log in in Firebase trhougt command line:

```
firebase login
```

If we are in Windows in Git Bash it will fail and tell us that the environment is not interactive.

We execute the command with the following parameter:
```
firebase login --interactive
```

Now we created the Firebase Cloud Functions project. In the root directory of your project, execute the following command:
```
firebase init
```

Use the arrows to move down to 'Functions: Configure and Deploy Cloud Functions' (in Windows Git Bash does not graphically see how the selected option changes, but it does).

Mark that option with the space bar. Enter to confirm that you want this option.

In the same way select the project previously created in Firebase web (you will see in the .firebasesrc file the Project ID of your selected Firebase project).


Now code time :)

[See the code in this Github repository.]


Install dependencies in /functions: 
```
npm install
```

Deploy to Firebase:
```
firebase deploy
```

Replace in loginpage.html form <YOUR_FIREBASE_FUNCTIONS_URL> with the Functions URL shown in console.

Deploy again to Firebase:
```
firebase deploy
```

Now in https://console.actions.google.com/ on Overview we have to enable 'Account Linking'. For this first we have to fill in other data from the application.

Select 'Implicit' in combo. To complete 'Account Linking' we need:

- Client ID: It is taken (or created) from the 'Credentials' -> 'OAuth 2.0 client IDs' section of the Google Cloud Platform
(https://console.cloud.google.com/apis/credentials?project=<YOUR_PROJECT>).

In this stackoverflow tutorial you can see how to create it: 

https://stackoverflow.com/questions/44218120/authenticate-google-calendar-on-api-ai-with-google-actions

- Authorization URL: <YOUR_FIREBASE_FUNCTIONS_URL>/authserver

- Scope: email


Now we create the test user in Firebase Authentication:

- user: testuser@gmail.com

- password: testpassword


Now go to API.AI.

Write in your API.AI Agent -> Fullfilment -> Webhook -> URL:

<YOUR_FIREBASE_FUNCTIONS_URL>/googleactionshandler


Let's go to Integrations -> Google Assistant -> Settings.

We mark all the Intents with 'Sign in required' and click 'Test'.

When finish click 'View' to go to the Google Assistant Emulator.

We should be able to use our Assistant App with 'Talk to MyCustomAppName'.

It will tell us we have to do the account linking.

In the DEBUG tab, copy the URL within "debugInfo" and paste it into a new browser tab.

Login with the Firebase test user email and password.


If we get to the Google website and the URL is like the following it means that the Account Linking has been done:

https://www.google.com/?result_code=SUCCESS&result_message=Accounts+now+linked.


Now we can talk to our App in the Google Assistant Emulator