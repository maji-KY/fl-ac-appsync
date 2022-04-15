/**
 * @generated SignedSource<<7646e24bec93c1522d345787063f4c57>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type AuctionIdSubscription$variables = {
  id: string;
};
export type AuctionIdSubscription$data = {
  readonly onUpdateAuction: {
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
export type AuctionIdSubscription = {
  variables: AuctionIdSubscription$variables;
  response: AuctionIdSubscription$data;
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
    "name": "onUpdateAuction",
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
    "name": "AuctionIdSubscription",
    "selections": (v3/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AuctionIdSubscription",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "6915fc44441f37238df7231ac32089d7",
    "id": null,
    "metadata": {},
    "name": "AuctionIdSubscription",
    "operationKind": "subscription",
    "text": "subscription AuctionIdSubscription(\n  $id: ID!\n) {\n  onUpdateAuction(id: $id) {\n    id\n    title\n    description\n    closeAt\n    ownerId\n    ownerName\n    biddingHistory {\n      id\n      amount\n      bidderId\n      bidderName\n      createdAt\n    }\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "14f7e5032817dba7f4054312a66e4b11";

export default node;
