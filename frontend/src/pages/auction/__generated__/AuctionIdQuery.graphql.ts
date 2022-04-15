/**
 * @generated SignedSource<<7497150db6ac30ca5f21ec847173943a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AuctionIdQuery$variables = {
  id: string;
};
export type AuctionIdQuery$data = {
  readonly auction: {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly closeAt: string;
    readonly ownerId: string;
    readonly ownerName: string;
    readonly biddingHistory: ReadonlyArray<{
      readonly id: string;
      readonly amount: number;
      readonly bidderId: string;
      readonly bidderName: string;
      readonly createdAt: string;
    }>;
    readonly createdAt: string;
  };
};
export type AuctionIdQuery = {
  variables: AuctionIdQuery$variables;
  response: AuctionIdQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Auction",
    "kind": "LinkedField",
    "name": "auction",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
        "concreteType": "Bidding",
        "kind": "LinkedField",
        "name": "biddingHistory",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "amount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bidderId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bidderName",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      (v2/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AuctionIdQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AuctionIdQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "0c3078b1d4dd1b25f31121284ca05a43",
    "id": null,
    "metadata": {},
    "name": "AuctionIdQuery",
    "operationKind": "query",
    "text": "query AuctionIdQuery(\n  $id: ID!\n) {\n  auction(id: $id) {\n    id\n    title\n    description\n    closeAt\n    ownerId\n    ownerName\n    biddingHistory {\n      id\n      amount\n      bidderId\n      bidderName\n      createdAt\n    }\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "ed65867da38a1d30076f787aaf7a9ad6";

export default node;
