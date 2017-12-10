
# Sample Flickr API app

A sample app for consuming the public [Flickr API](https://api.flickr.com/services/feeds/photos_public.gne?format=json)

[Demo](https://robertbasden.github.io/flickr-api-app)

## Technologies used

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/docs/introduction/)
- [Create React App](https://github.com/facebookincubator/create-react-app)
- [Sass](http://sass-lang.com/)

# Development


Run development server, this will watch and compile JS and start a static server to display the app.
```
npm start
```

You also need to watch and compile the SASS files, details [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc).
```
npm run watch-css
```

Once you are ready to compile for production:
```
npm run build
```
