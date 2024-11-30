echo "cleaning demos..."
rm -rf docs/demos/
mkdir docs/demos
mkdir docs/demos/storybooks


echo "building chota-react-redux..."
cd templates/chota-angular-ngrx/
npm run build
cp -R dist ../../docs/demos/chota-angular-ngrx
npm run build-storybook
cp -R storybook-static ../../docs/demos/storybooks/chota-angular-ngrx


echo "building chota-react-redux..."
cd ../chota-react-redux/
npm run build
cp -R build ../../docs/demos/chota-react-redux
npm run build-storybook
cp -R storybook-static ../../docs/demos/storybooks/chota-react-redux


echo "building chota-react-rtk..."
cd ../chota-react-rtk/
npm run build
cp -R build ../../docs/demos/chota-react-rtk
npm run build-storybook
cp -R storybook-static ../../docs/demos/storybooks/chota-react-rtk


echo "building chota-react-saga..."
cd ../chota-react-saga/
npm run build
cp -R build ../../docs/demos/chota-react-saga
npm run build-storybook
cp -R storybook-static ../../docs/demos/storybooks/chota-react-saga


echo "building chota-vue-pinia..."
cd ../chota-vue-pinia/
npm run build
cp -R dist ../../docs/demos/chota-vue-pinia
npm run build-storybook
cp -R storybook-static ../../docs/demos/storybooks/chota-vue-pinia


echo "building chota-wc-saga..."
cd ../chota-wc-saga/
npm run build
cp -R dist ../../docs/demos/chota-wc-saga
npm run build-storybook
cp -R storybook-static ../../docs/demos/storybooks/chota-wc-saga

echo "Demos build complete."