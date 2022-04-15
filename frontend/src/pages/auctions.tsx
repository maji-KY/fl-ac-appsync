import React from "react";
import styled from "styled-components";
import type { NextPage } from "next";
import Link from "next/link";
import { graphql, usePreloadedQuery, useQueryLoader } from "react-relay";
import { auctionsQuery as AQ } from "./__generated__/auctionsQuery.graphql";
import { PreloadedQuery } from "react-relay/relay-hooks/EntryPointTypes";

const auctionsQuery = graphql`
  query auctionsQuery {
    auctions {
      id
      title
      description
      closeAt
    }
  }
`;

const AuctionListStyle = styled.div`
  text-align: center;
  .auction-element {
    margin: 15px;
  }
  .auction-title {
    width: 200px;
    text-align: right;
  }
`;

function AuctionList({ preload }: { preload: PreloadedQuery<any, any> }) {
  const result = usePreloadedQuery<AQ>(auctionsQuery, preload);
  return (
    <AuctionListStyle>
      {result.auctions.map(x => (
        <div key={x.id} className="auction-element">
          <Link href={`/auction/${x.id}`}>
            <a>
              <span className="auction-title">{x.title}</span>: <span>{x.description}</span>
            </a>
          </Link>
        </div>
      ))}
    </AuctionListStyle>
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
  .loading {
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Auctions: NextPage = () => {
  const [preload, load] = useQueryLoader<AQ>(auctionsQuery);
  React.useEffect(() => {
    load({});
  }, [load]);

  return (
    <StyledDiv>
      <div className="logo">フリオク!</div>
      <h1>オークション一覧</h1>
      <React.Suspense fallback={<div className="loading">ろ〜でぃんぐ☆</div>}>
        {preload && <AuctionList preload={preload} />}
      </React.Suspense>
    </StyledDiv>
  );
};

export default Auctions;
