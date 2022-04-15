/**
 * @generated SignedSource<<5d5bcf7f5e5503bcd4b84febd923cb10>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BidInput = {
  auctionId: string;
  amount: number;
};
export type AuctionIdBidMutation$variables = {
  input: BidInput;
};
export type AuctionIdBidMutation$data = {
  readonly bid: {
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
export type AuctionIdBidMutation = {
  variables: AuctionIdBidMutation$variables;
  response: AuctionIdBidMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Auction",
    "kind": "LinkedField",
    "name": "bid",
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
    "name": "AuctionIdBidMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AuctionIdBidMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "d2041f0d8e35446bdd75bcb8b32efadb",
    "id": null,
    "metadata": {},
    "name": "AuctionIdBidMutation",
    "operationKind": "mutation",
    "text": "mutation AuctionIdBidMutation(\n  $input: BidInput!\n) {\n  bid(input: $input) {\n    id\n    title\n    description\n    closeAt\n    ownerId\n    ownerName\n    biddingHistory {\n      id\n      amount\n      bidderId\n      bidderName\n      createdAt\n    }\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "25817b32264e9b0edd62d4d897e8b3dd";

export default node;
