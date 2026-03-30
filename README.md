# Elegant

Elegant is a command line tool to build an Elegant Front end Architecture

## Cloning Boilerplates

Install Boilerplates with following commands:

React with Legacy Redux
```sh
npx elegant chota-react-redux
```

React with Redux SAGA
```sh
npx elegant chota-react-saga
```

React with Redux Toolkit
```sh
npx elegant chota-react-rtk
```

Angular with NgRx
```sh
npx elegant chota-angular-ngrx
```

Vue with Pinia
```sh
npx elegant chota-vue-pinia
```

Web Components with Redux Saga
```sh
npx elegant chota-wc-saga
```

## Developing on Boilerplates
All Boilerplates are equiped with Storybook. So to begin after cloning, you have to
```sh
cd {your-app-name}
npm install --legacy-peer-deps
npm start
```
To build a production build
```sh
npm run build
```
Once the build is complete, copy this build `dist` to your web hosting.

To start working to build component with atomic design approach
```sh
npm run storybook
```

### Happy Coding!!!