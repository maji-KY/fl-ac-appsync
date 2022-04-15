/**
 * @generated SignedSource<<7eb68b4d32cc07447d760fee285ed418>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type auctionsQuery$variables = {};
export type auctionsQuery$data = {
  readonly auctions: ReadonlyArray<{
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly closeAt: string;
    readonly ownerId: string;
    readonly ownerName: string;
    readonly createdAt: string;
  }>;
};
export type auctionsQuery = {
  variables: auctionsQuery$variables;
  response: auctionsQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Auction",
    "kind": "LinkedField",
    "name": "auctions",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "closeAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ownerId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ownerName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "auctionsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "auctionsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "00c4b72e28854003f84c79b4b1a2c8e1",
    "id": null,
    "metadata": {},
    "name": "auctionsQuery",
    "operationKind": "query",
    "text": "query auctionsQuery {\n  auctions {\n    id\n    title\n    description\n    closeAt\n    ownerId\n    ownerName\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "138324c8495806dff4426b9b9319a520";

export default node;
