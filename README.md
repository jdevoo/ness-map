# ness-map

> A Vue.js project

## Docker - run app using existing image

``` bash
# loading docker image
docker load --input ness-map-image.tar

# run Vue.js app in a Docker container
docker run -it -p 8080:8080 --rm --name ness-map ness/ness-map
```

## Docker - use existing image for development

Not working without Windows 10 - April 2018 update
(because of missing Localhost/loopback support for accessing containers)

``` bash
# loading docker image - only if it is necessary
docker load --input ness-map-image.tar

# run Docker container
docker run -v ${pwd}/src/:/app/src/ -p 8080:8080 -it --rm ness/ness-map /bin/sh

# run Vue.js app in development mode
npm run dev
```

## Docker - build and save new version of image

``` bash
# build Docker image
docker build -t ness/ness-map .

# save Docker image
docker save --output ness-map-image.tar ness/ness-map
```

## Default Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
