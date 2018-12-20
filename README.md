# data-provider-example

An example of Data Provider for FranceConnect.

The way a data provider works is explained in [FranceConnect documentation](https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees).

## Standalone installation

Run the following commands:

```bash
git clone git@github.com:france-connect/data-provider-example.git
cd data-provider-example
npm install
```

You can then start the server with:

```bash
npm start
```

## Connected installation (optional)

Note that the previous installation use a local mock of FranceConnect integration server.

If you are to use this app alongside the [service provider example](https://github.com/france-connect/identity-provider-example),
run the server with `USE_FC_MOCK=false npm start`.

By doing this you will tell the app to remotely verify the tokens against the actual FranceConnect integration server.

## Run the tests

Run the tests with:
```bash
npm test
```

## Run the linter

Run the linter with:
```bash
npm run lint
```
