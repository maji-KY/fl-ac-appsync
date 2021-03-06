import React from "react";
import styled from "styled-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { graphql, usePreloadedQuery, useQueryLoader, useSubscription, useMutation } from "react-relay";
import { PreloadedQuery } from "react-relay/relay-hooks/EntryPointTypes";
import { AuctionIdQuery } from "./__generated__/AuctionIdQuery.graphql";
import { AuctionIdSubscription } from "./__generated__/AuctionIdSubscription.graphql";
import { AuctionIdBidMutation } from "./__generated__/AuctionIdBidMutation.graphql";
import Link from "next/link";

const auctionQuery = graphql`
  query AuctionIdQuery($id: ID!) {
    auction(id: $id) {
      id
      title
      description
      closeAt
      ownerId
      ownerName
      biddingHistory {
        id
        amount
        bidderId
        bidderName
        createdAt
      }
      createdAt
    }
  }
`;

const auctionSubscription = graphql`
  subscription AuctionIdSubscription($id: ID!) {
    onUpdateAuction(id: $id) {
      id
      title
      description
      closeAt
      ownerId
      ownerName
      biddingHistory {
        id
        amount
        bidderId
        bidderName
        createdAt
      }
      createdAt
    }
  }
`;

const bidMutation = graphql`
  mutation AuctionIdBidMutation($input: BidInput!) {
    bid(input: $input) {
      id
      title
      description
      closeAt
      ownerId
      ownerName
      biddingHistory {
        id
        amount
        bidderId
        bidderName
        createdAt
      }
      createdAt
    }
  }
`;

const AuctionDetailStyle = styled.div`
  text-align: left;
  width: 500px;
  margin: auto;
  .description {
    font-size: 24px;
    margin: 30px 0;
  }
  .error {
    color: red;
  }
  .bid-button {
    margin: 10px;
  }
`;

type FormType = {
  amount: string;
};

function AuctionDetail({ preload }: { preload: PreloadedQuery<any, any> }) {
  const { auction } = usePreloadedQuery<AuctionIdQuery>(auctionQuery, preload);
  const [commit, isInFlight] = useMutation<AuctionIdBidMutation>(bidMutation);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>();
  const onSubmit = React.useCallback<(f: FormType) => void>(
    formData => {
      console.log(formData);
      commit({
        variables: {
          input: {
            auctionId: auction.id,
            amount: parseInt(formData.amount, 10),
          },
        },
      });
    },
    [auction, commit],
  );
  return (
    <AuctionDetailStyle>
      <h1>{auction.title}</h1>
      <p className="description">{auction.description}</p>
      <div>???????????????{auction.closeAt}</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="number" defaultValue="" {...register("amount", { required: true })} />
        {errors.amount && <span className="error">????????????</span>}
        <input className="bid-button" type="submit" disabled={isInFlight} value="???????????????" />
      </form>
      <div>
        <h3>????????????</h3>
        {auction.biddingHistory.map(x => (
          <div key={x.id}>
            {x.bidderName} ????????? {x.amount} ????????????????????????
          </div>
        ))}
      </div>
    </AuctionDetailStyle>
  );
}

const StyledDiv = styled.div`
  text-align: center;
  .logo {
    font-family: "Stick", sans-serif;
    font-size: 150px;
    font-weight: bold;
    margin: -30px auto;
  }
  .back {
    display: inline-block;
    margin-top: 30px;
  }
  .loading {
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
`;

const Auction: NextPage = () => {
  const [preload, load] = useQueryLoader<AuctionIdQuery>(auctionQuery);
  const auctionId = useRouter().query.auctionId as string;
  React.useEffect(() => {
    load({ "id": auctionId });
  }, [load, auctionId]);

  const config = React.useMemo(
    () => ({
      variables: { "id": auctionId },
      subscription: auctionSubscription,
    }),
    [auctionId],
  );
  useSubscription<AuctionIdSubscription>(config);

  return (
    <StyledDiv>
      <div className="logo">????????????!</div>
      <Link href="/auctions">
        <a className="back">???????????????</a>
      </Link>
      <h1>????????????????????????</h1>
      <React.Suspense fallback={<div className="loading">?????????????????????</div>}>
        {preload && <AuctionDetail preload={preload} />}
      </React.Suspense>
    </StyledDiv>
  );
};

export default Auction;
