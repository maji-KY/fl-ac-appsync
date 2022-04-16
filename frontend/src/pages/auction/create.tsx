import React from "react";
import styled from "styled-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { createAuctionMutation as MutationType } from "./__generated__/createAuctionMutation.graphql";

const createAuctionMutation = graphql`
  mutation createAuctionMutation($input: CreateAuctionInput!) {
    createAuction(input: $input) {
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

const StyledDiv = styled.div`
  text-align: center;
  .logo {
    font-family: "Stick", sans-serif;
    font-size: 150px;
    font-weight: bold;
    margin: -30px auto;
  }
  .form-container {
    width: 450px;
    margin: 0 auto;
  }
  .form {
  }
  .label {
    display: flex;
  }
  input {
    width: 400px;
  }
  .error {
    color: red;
  }
  .create-button {
    margin: 20px;
    padding: 20px 60px;
  }
`;

type FormType = {
  title: string;
  description: string;
};

const CreateAuction: NextPage = () => {
  const router = useRouter();
  const [commit, isInFlight] = useMutation<MutationType>(createAuctionMutation);
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
            title: formData.title,
            description: formData.description,
          },
        },
        onCompleted: response => {
          router.push(`/auction/${response.createAuction.id}`);
        },
      });
    },
    [router, commit],
  );
  return (
    <StyledDiv>
      <div className="logo">フリオク!</div>
      <h1>新規オークション作成</h1>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <span className="label">タイトル：</span>
          <input type="text" defaultValue="" {...register("title", { required: true })} />
          {errors.title && <span className="error">必須です</span>}
          <br />
          <span className="label">説明文：</span>
          <input type="text" defaultValue="" {...register("description", { required: true })} />
          {errors.description && <span className="error">必須です</span>}
          <br />
          <input className="create-button" type="submit" disabled={isInFlight} value="作成する！" />
        </form>
      </div>
    </StyledDiv>
  );
};

export default CreateAuction;
