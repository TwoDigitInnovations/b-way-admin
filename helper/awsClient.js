import {
  LocationClient,
  SearchPlaceIndexForSuggestionsCommand,
} from '@aws-sdk/client-location';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

const REGION = 'us-east-1';
const PLACE_INDEX_NAME = 'BWayPlaceIndex';
const IDENTITY_POOL_ID = 'your-identity-pool-id';

const locationClient = new LocationClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    identityPoolId: IDENTITY_POOL_ID,
    clientConfig: { region: REGION },
  }),
});

export { locationClient, PLACE_INDEX_NAME, SearchPlaceIndexForSuggestionsCommand };
