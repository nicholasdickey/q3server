export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
};

export type Feed = {
  __typename?: 'Feed';
  active?: Maybe<Scalars['Int']>;
  both?: Maybe<Scalars['Int']>;
  category_xid?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  entity?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  image_src?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notor?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  root?: Maybe<Scalars['String']>;
  rss?: Maybe<Scalars['Int']>;
  rssFeeds?: Maybe<Array<Maybe<Rss>>>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type FeedInput = {
  active?: InputMaybe<Scalars['Int']>;
  both?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  entity?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  image_src?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notor?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  root?: InputMaybe<Scalars['String']>;
  rss?: InputMaybe<Scalars['Int']>;
  rssFeeds?: InputMaybe<Array<InputMaybe<RssInput>>>;
  slug?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type FeedItem = {
  __typename?: 'FeedItem';
  icon?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

export type FeedStatus = {
  __typename?: 'FeedStatus';
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
};

export type FeedsStatus = {
  __typename?: 'FeedsStatus';
  lastFeeds?: Maybe<Array<Maybe<LastFeed>>>;
  runningFeeds?: Maybe<Array<Maybe<FeedStatus>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type LastFeed = {
  __typename?: 'LastFeed';
  last?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type LogEntry = {
  __typename?: 'LogEntry';
  body?: Maybe<Scalars['String']>;
  logid?: Maybe<Scalars['Int']>;
  micros?: Maybe<Scalars['String']>;
  sessionid?: Maybe<Scalars['String']>;
  threaid?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPlace?: Maybe<Place>;
  addReview?: Maybe<Review>;
  addUser: User;
  pingPayloadMutation?: Maybe<Scalars['String']>;
  postUrl?: Maybe<RunUrlResult>;
  runFeed?: Maybe<Scalars['Boolean']>;
  runFeeds?: Maybe<Scalars['Boolean']>;
  runUrl?: Maybe<RunUrlResult>;
  saveFeed?: Maybe<ReturnValue>;
  stopFeeds?: Maybe<Scalars['Boolean']>;
};


export type MutationAddPlaceArgs = {
  body?: InputMaybe<InputPlaceType>;
};


export type MutationAddReviewArgs = {
  body?: InputMaybe<InputReviewType>;
};


export type MutationAddUserArgs = {
  body?: InputMaybe<InputUserType>;
};


export type MutationPingPayloadMutationArgs = {
  payload?: InputMaybe<Scalars['String']>;
};


export type MutationPostUrlArgs = {
  silo?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url: Scalars['String'];
};


export type MutationRunFeedArgs = {
  silo?: InputMaybe<Scalars['Int']>;
  slug: Scalars['String'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationRunFeedsArgs = {
  silo?: InputMaybe<Scalars['Int']>;
};


export type MutationRunUrlArgs = {
  primaryTag: Scalars['String'];
  silo?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url: Scalars['String'];
};


export type MutationSaveFeedArgs = {
  feed?: InputMaybe<FeedInput>;
};


export type MutationStopFeedsArgs = {
  silo?: InputMaybe<Scalars['Int']>;
};

export type Place = {
  __typename?: 'Place';
  desciption?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  mainPhoto?: Maybe<Scalars['String']>;
  owner?: Maybe<User>;
  photos?: Maybe<Array<Maybe<Scalars['String']>>>;
  priceByNight?: Maybe<Scalars['Float']>;
  reviews?: Maybe<Array<Maybe<Review>>>;
};

export type Query = {
  __typename?: 'Query';
  allFeeds?: Maybe<Array<Maybe<FeedItem>>>;
  feedsStatus?: Maybe<FeedsStatus>;
  fetchFeed?: Maybe<Feed>;
  ping?: Maybe<Scalars['String']>;
  pingPayload?: Maybe<Scalars['String']>;
  place?: Maybe<Place>;
  placeList?: Maybe<Array<Maybe<Place>>>;
  reviewByUser?: Maybe<Array<Maybe<Review>>>;
  user: User;
  userList: Array<User>;
};


export type QueryAllFeedsArgs = {
  channel?: InputMaybe<Scalars['String']>;
};


export type QueryFeedsStatusArgs = {
  silo?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchFeedArgs = {
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryPingPayloadArgs = {
  payload?: InputMaybe<Scalars['String']>;
};


export type QueryPlaceArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryReviewByUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Qwiket = {
  __typename?: 'Qwiket';
  author?: Maybe<Scalars['String']>;
  authorAvatar?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  children_summary?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  image_src?: Maybe<Scalars['String']>;
  parent_summary?: Maybe<Scalars['String']>;
  published_time?: Maybe<Scalars['String']>;
  reshare?: Maybe<Scalars['String']>;
  shared_time?: Maybe<Scalars['String']>;
  site_name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['ID']>;
  subscr_status?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  threadAuthor?: Maybe<Scalars['String']>;
  threadDescription?: Maybe<Scalars['String']>;
  threadImage?: Maybe<Scalars['String']>;
  threadPublished_time?: Maybe<Scalars['String']>;
  threadSlug?: Maybe<Scalars['String']>;
  threadTag?: Maybe<Scalars['String']>;
  threadTagImage?: Maybe<Scalars['String']>;
  threadTagName?: Maybe<Scalars['String']>;
  threadTitle?: Maybe<Scalars['String']>;
  threadUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  userRole?: Maybe<Scalars['String']>;
};

export type Review = {
  __typename?: 'Review';
  author?: Maybe<User>;
  feedback?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  place?: Maybe<Scalars['ID']>;
  rate?: Maybe<Scalars['Float']>;
};

export type Rss = {
  __typename?: 'Rss';
  active?: Maybe<Scalars['Int']>;
  rss?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type RssInput = {
  active?: InputMaybe<Scalars['Int']>;
  rss?: InputMaybe<Scalars['String']>;
};

export type RunUrlResult = {
  __typename?: 'RunUrlResult';
  log?: Maybe<Array<Maybe<LogEntry>>>;
  qwiket?: Maybe<Qwiket>;
};

export type Subroot = {
  __typename?: 'Subroot';
  slug?: Maybe<Scalars['String']>;
  subroot?: Maybe<Scalars['String']>;
};

export type SubrootInput = {
  slug?: InputMaybe<Scalars['String']>;
  subroot?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  photo: Scalars['String'];
};

export type InputPlaceType = {
  desciption?: InputMaybe<Scalars['String']>;
  mainPhoto?: InputMaybe<Scalars['String']>;
  photos?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  priceByNight?: InputMaybe<Scalars['Float']>;
  type?: InputMaybe<Scalars['String']>;
};

export type InputReviewType = {
  feedback?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  place?: InputMaybe<Scalars['ID']>;
  rate?: InputMaybe<Scalars['Float']>;
};

export type InputUserType = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type ReturnValue = {
  __typename?: 'returnValue';
  exception?: Maybe<Scalars['String']>;
  msg?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};
