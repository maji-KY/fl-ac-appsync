/**
 * @generated SignedSource<<cf60b336ce4ee4f82e255db4521ef330>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateAuctionInput = {
  title: string;
  description: string;
};
export type createAuctionMutation$variables = {
  input: CreateAuctionInput;
};
export type createAuctionMutation$data = {
  readonly createAuction: {
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
export type createAuctionMutation = {
  variables: createAuctionMutation$variables;
  response: createAuctionMutation$data;
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
    "name": "createAuction",
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
    "name": "createAuctionMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createAuctionMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "b41538d8d8e6cf4e0426dc86b66d7b3c",
    "id": null,
    "metadata": {},
    "name": "createAuctionMutation",
    "operationKind": "mutation",
    "text": "mutation createAuctionMutation(\n  $input: CreateAuctionInput!\n) {\n  createAuction(input: $input) {\n    id\n    title\n    description\n    closeAt\n    ownerId\n    ownerName\n    biddingHistory {\n      id\n      amount\n      bidderId\n      bidderName\n      createdAt\n    }\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "50680081655b98e983b0e1f6ee7c291f";

export default node;
