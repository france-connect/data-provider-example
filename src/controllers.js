import { isEmpty } from 'lodash';
import axios from 'axios';
import axiosLogger from 'axios-logger';
import {
  isAuthorized, filter, format, reconcile,
} from './services';
import { getAccessTokenFromAuthorizationHeader } from './utils';
import { FC_URL } from '../config';

const httpClient = axios.create();
if (process.env.NODE_ENV !== 'test') {
  httpClient.interceptors.request.use(axiosLogger.requestLogger, axiosLogger.errorLogger);
  httpClient.interceptors.response.use(axiosLogger.responseLogger, axiosLogger.errorLogger);
}

export const healthCheck = (req, res) => res.sendStatus(200);

export const getDgfipData = async (req, res, next) => {
  try {
    // First step: check that the Fournisseur de Service actually send an access token
    const accessToken = getAccessTokenFromAuthorizationHeader(req.header('Authorization'));
    if (!accessToken) {
      return res.sendStatus(400);
    }

    // Second step: check the access token validity against Franceconnect
    const { data: { scope, identity } } = await httpClient({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: { token: accessToken },
      url: `${FC_URL}/api/v1/checktoken`,
    });

    // Third step: we make sure the user is authorized to read data from DGFiP
    // ie. he asks for DGFiP scopes
    if (!isAuthorized(scope)) {
      // In this case, the Fournisseur de Service as call the Fournisseur de Données with an
      // accessToken that does not have enough scopes to access any data
      return res.sendStatus(403);
    }

    // Fourth step: we get the data that match the France Connect user
    const matchedDatabaseEntry = await reconcile(identity);

    if (isEmpty(matchedDatabaseEntry)) {
      // In this case, our database did not find any matching data
      return res.sendStatus(404);
    }

    // Fifth step: we filter the data so it returns only the data allowed for the given scope
    const allowedDatabaseEntry = filter(
      scope,
      matchedDatabaseEntry,
    );

    // Optional step: we format the final json to be iso with the DGFiP production API
    const formatedDatabaseEntry = format(allowedDatabaseEntry);

    return res.json(formatedDatabaseEntry);
  } catch (error) {
    // the Franceconnect server may be down or did not respond
    if (error.request && !error.response) {
      return res.sendStatus(502);
    }

    if (error.response && error.response.status >= 400) {
      return res.status(error.response.status).send(error.response.data);
    }

    return next(error); // use express default error handler
  }
};
