<p align="center">
  <img alt="Shrekify Logo" src="./public/logo.png" width="100" style="border-radius: 12px;" />
</p>
<h1 align="center">
  Shrekify
</h1>

### [👉 Full Project Description 👈](https://jessekuntz.github.io/shrekify.html)

## Running Things

```bash
yarn install

yarn dev
```

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

## Lambda Things

Once changes are made, build the JS:

```bash
yarn lambda:compile
```

> If you want to test the lambda function locally you can use:
>
> ```bash
> node -e 'require("./index").handler()'
> ```
>
> You'll just have to set a test image, or pass one in.
>
> Since the output is in base64, you can copy it an convert it to an image using [this converter](https://codebeautify.org/base64-to-image-converter).

Zip the code (this also excludes the `node_modules` because `canvas` is handled by a Lambda Layer):

```bash
yarn lambda:zip
```

And deploy it:

```bash
yarn lambda:deploy
```

> If not authenticated:
>
> ```bash
> aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin <AWS-ACCOUNT-ID>.dkr.ecr.us-east-2.amazonaws.com
> ```
