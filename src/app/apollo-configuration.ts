export class ApolloConfiguration {}

import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { MsalService } from '@azure/msal-angular';
import { HttpLink } from 'apollo-angular/http';
import { lastValueFrom } from 'rxjs';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";





export const createApollo = (httpLink: HttpLink, msalService: MsalService) => {

  const auth = setContext(async () => {
    var instance = msalService.instance;

    if (instance.getActiveAccount() === null) {
      msalService.loginRedirect();
      var account = instance.getAllAccounts();
      instance.setActiveAccount(account[0]);
    }

    if (instance.getActiveAccount() != null) {
      var data = await lastValueFrom(
        msalService.acquireTokenSilent({
          scopes: ['api://9eba4a57-7daa-473b-8efb-5a0e6e96ca6c/access_all'],
        })
      );

      localStorage.setItem('bearerToken', JSON.stringify(data.accessToken));

      return {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      };
    }
    return {};
  });

  const http = ApolloLink.from([
    auth,
    httpLink.create({ uri: 'https://localhost:7242/graphql' }),
  ]);
  const ws = new GraphQLWsLink(
    createClient({
      url: "wss://localhost:7242/graphql",
    }),
  );

  const link = split(
    // split based on operation type
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === 'OperationDefinition' && def.operation === 'subscription';
    },
    ws,
    http,
  );

  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
};
