/**
 * @generated SignedSource<<d16dd9f62cf3c9143b33f02289b313ef>>
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
    "cacheID": "824261ee421c40f0c9c3b03e60b77a11",
    "id": null,
    "metadata": {},
    "name": "auctionsQuery",
    "operationKind": "query",
    "text": "query auctionsQuery {\n  auctions {\n    id\n    title\n    description\n    closeAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "3bce706cba646e9ead121e303e7c703a";

export default node;
