# data-provider-example

Exemple de fournisseur de données pour FranceConnect.

Ce projet a les objectifs suivants :

- fournir un exemple de code JavaScript simple compréhensible par des développeurs sans connaissance spécifique de JavaScript
- fournir un exemple de code qui peut être installé localement et simplement pour permettre une bonne compréhension des appels émis et reçu par l'application
- fournir un environnement de test pour le développement d'un service en interaction avec une API FranceConnecté
- permettre une consultation et une édition des données à des non développeurs

Ce fournisseur de données est inspiré de l'API Impôt particulier opérée par la DGFiP mais n'est pas ISO fonctionnel avec l'API de production. En particulier, l'API de la DGFiP requiert un premier niveau d'authentification qui n'est pas représenté dans ce projet. Dans le cadre du développement d'un service qui intéragirait avec cette API, nous vous recommandons de ne pas utiliser ce projet mais plutôt de vous référer à https://api.gouv.fr/les-api/impot-particulier.

C'est grâce à vos retours que ce projet peut s'améliorer, aussi n'hésitez pas à [ouvrir des issues github](https://github.com/france-connect/data-provider-example/issues/new) pour nous suggérer vos idées.

Le fonctionnement d'un fournisseur de données est expliqué dans la [documentation FranceConnect](https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees).

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

If you are to use this app alongside the [service provider example](https://github.com/france-connect/service-provider-example),
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
