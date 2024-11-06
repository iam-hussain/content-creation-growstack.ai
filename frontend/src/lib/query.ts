import { gql } from "@apollo/client";

export const CreateUserInput = gql`
  mutation CreateUserInput(
    $email: String!
    $keywords: String!
    $audience: String!
    $language: String!
    $tone: String!
  ) {
    createUserInput(
      email: $email
      keywords: $keywords
      audience: $audience
      language: $language
      tone: $tone
    ) {
      id
      email
      keywords
      audience
      language
      tone
      createdAt
    }
  }
`;

export const StatusUpdater = gql`
  subscription StatusUpdater {
    statusUpdater {
      id
      message
      stage
      success
    }
  }
`;

export const ContentByUserInput = gql`
  query ContentByUserInput($userInputId: Int!) {
    contentByUserInput(userInputId: $userInputId) {
      id
      blog
      twitter
      facebook
      linkedin
      instagram
      threads
      userInputId
      userInput {
        id
        email
        keywords
        audience
        language
        tone
        createdAt
      }
      createdAt
      schedule {
        id
        blog
        twitter
        facebook
        linkedin
        instagram
        threads
        contentId
        createdAt
      }
    }
  }
`;
