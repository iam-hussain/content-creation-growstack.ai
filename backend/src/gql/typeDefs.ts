import gql from 'graphql-tag';

export default gql`
  type Query {
    userInputs: [UserInput]
    contentByUserInput(userInputId: Int!): [Content]
  }

  type Mutation {
    createUserInput(email: String!, keywords: String!, audience: String!, language: String!, tone: String!): UserInput
    updateContent(
      id: Int!
      blog: String
      twitter: String
      facebook: String
      linkedin: String
      instagram: String
      threads: String
    ): Content
    createSchedule(
      contentId: Int!
      blog: String
      twitter: String
      facebook: String
      linkedin: String
      instagram: String
      threads: String
    ): Schedule
  }

  type Subscription {
    contentGeneratedByAI: Content
    scheduleTriggered: Schedule
    statusUpdater: Status
  }

  type Status {
    id: Int!
    success: Boolean!
    message: String!
    stage: String!
  }

  type UserInput {
    id: Int!
    email: String!
    keywords: String!
    audience: String!
    language: String!
    tone: String!
    createdAt: String!
    outputs: [Content]!
  }

  type Content {
    id: Int!
    blog: String
    twitter: String
    facebook: String
    linkedin: String
    instagram: String
    threads: String
    userInputId: Int!
    userInput: UserInput
    createdAt: String!
    schedule: [Schedule]!
  }

  type Schedule {
    id: Int!
    blog: String
    twitter: String
    facebook: String
    linkedin: String
    instagram: String
    threads: String
    contentId: Int!
    content: Content
    createdAt: String!
  }
`;
