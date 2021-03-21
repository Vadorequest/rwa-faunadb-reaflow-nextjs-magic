export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Time: any;
  /** The `Long` scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};







/** 'Canvas' input values */
export type CanvasInput = {
  id: Scalars['ID'];
  lastUpdatedBySessionEphemeralId?: Maybe<Scalars['String']>;
  lastUpdatedByUserName?: Maybe<Scalars['String']>;
  project?: Maybe<CanvasProjectRelation>;
};

/** Allow manipulating the relationship between the types 'Canvas' and 'Project' using the field 'Canvas.project'. */
export type CanvasProjectRelation = {
  /** Create a document of type 'Project' and associate it with the current document. */
  create?: Maybe<ProjectInput>;
  /** Connect a document of type 'Project' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
  /** If true, disconnects this document from 'Project' */
  disconnect?: Maybe<Scalars['Boolean']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  /** Update an existing document in the collection of 'User' */
  updateUser?: Maybe<User>;
  /** Create a new document in the collection of 'User' */
  createUser: User;
  /** Update an existing document in the collection of 'Project' */
  updateProject?: Maybe<Project>;
  /** Delete an existing document in the collection of 'Canvas' */
  deleteCanvas?: Maybe<Canvas>;
  /** Delete an existing document in the collection of 'Project' */
  deleteProject?: Maybe<Project>;
  /** Create a new document in the collection of 'Project' */
  createProject: Project;
  /** Delete an existing document in the collection of 'User' */
  deleteUser?: Maybe<User>;
  /** Create a new document in the collection of 'Canvas' */
  createCanvas: Canvas;
  /** Update an existing document in the collection of 'Canvas' */
  updateCanvas?: Maybe<Canvas>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  data: UserInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID'];
  data: ProjectInput;
};


export type MutationDeleteCanvasArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationCreateProjectArgs = {
  data: ProjectInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCanvasArgs = {
  data: CanvasInput;
};


export type MutationUpdateCanvasArgs = {
  id: Scalars['ID'];
  data: CanvasInput;
};

/** Allow manipulating the relationship between the types 'Project' and 'Canvas' using the field 'Project.canvas'. */
export type ProjectCanvasRelation = {
  /** Create a document of type 'Canvas' and associate it with the current document. */
  create?: Maybe<CanvasInput>;
  /** Connect a document of type 'Canvas' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};

/** 'Project' input values */
export type ProjectInput = {
  id: Scalars['ID'];
  /** Name of the project */
  label: Scalars['String'];
  owner?: Maybe<ProjectOwnerRelation>;
  canvas?: Maybe<ProjectCanvasRelation>;
};

/** Allow manipulating the relationship between the types 'Project' and 'User' using the field 'Project.owner'. */
export type ProjectOwnerRelation = {
  /** Create a document of type 'User' and associate it with the current document. */
  create?: Maybe<UserInput>;
  /** Connect a document of type 'User' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};


/** 'User' input values */
export type UserInput = {
  id: Scalars['ID'];
  email: Scalars['String'];
  projects?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/**
 * The canvas contains all nodes and edges.
 * Nodes and edges are not represented because they're complex shapes,
 * and because we won't query them using GQL anyway. (we use GQL for that)
 */
export type Canvas = {
  __typename?: 'Canvas';
  project: Project;
  /** The document's ID. */
  _id: Scalars['ID'];
  lastUpdatedByUserName?: Maybe<Scalars['String']>;
  lastUpdatedBySessionEphemeralId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};

/**
 * A project **belongs** to a user and is related to a canvas.
 * A project can be considered as Canvas metadata.
 */
export type Project = {
  __typename?: 'Project';
  /** The document's ID. */
  _id: Scalars['ID'];
  /** Name of the project */
  label: Scalars['String'];
  id: Scalars['ID'];
  owner: User;
  canvas?: Maybe<Canvas>;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};

export type Query = {
  __typename?: 'Query';
  /** Find a document from the collection of 'Project' by its id. */
  findProjectByID?: Maybe<Project>;
  /** Find a document from the collection of 'User' by its id. */
  findUserByID?: Maybe<User>;
  /** Find a document from the collection of 'Canvas' by its id. */
  findCanvasByID?: Maybe<Canvas>;
};


export type QueryFindProjectByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindCanvasByIdArgs = {
  id: Scalars['ID'];
};

/**
 * ###################### FaunaDB internals
 * directive @embedded on OBJECT
 *
 * directive @collection(
 *     name: String!
 * ) on OBJECT
 *
 * directive @index(
 *     name: String!
 * ) on FIELD_DEFINITION
 *
 * directive @resolver(
 *     name: String
 *     paginated: Boolean! = false
 * ) on FIELD_DEFINITION
 *
 * directive @relation(
 *     name: String
 * ) on FIELD_DEFINITION
 *
 * directive @unique(
 *     index: String
 * ) on FIELD_DEFINITION
 *
 * scalar Date
 *
 * scalar Long
 *
 * scalar Time
 *
 * ###################### Custom
 */
export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  /** The document's ID. */
  _id: Scalars['ID'];
  id: Scalars['ID'];
  projects?: Maybe<Array<Maybe<Project>>>;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};

