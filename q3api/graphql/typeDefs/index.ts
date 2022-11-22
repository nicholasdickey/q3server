export default `
type FeedItem {
    tag: String
    name: String
    icon: String
}
type Rss {
    slug: String
    rss: String
    active: Int
}
type Subroot {
    slug: String
    subroot: String
}
type Feed {
    slug: String
    name: String
    description: String
    image: String
    image_src: String
    path: String
    link: String
    owner: String
    entity: String
    rssFeeds: [Rss]
    tags: [String]
    root: String
    rss: Int
    both: Int
    last: Int
    active: Int
    notor: Int
    category_xid: Int
}

type LastFeed {
        name: String
        last: Int
}
type FeedStatus {
    name: String
    status: Int
}
type FeedsStatus {
    success: Boolean
    runningFeeds: [FeedStatus]
    lastFeeds: [LastFeed]
}
type Query {
    feedsStatus(silo: Int): FeedsStatus
    fetchFeed(slug: String): Feed
    allFeeds(channel: String): [FeedItem]
    pingPayload(payload: String): String
    ping: String
}
type Qwiket {
    slug: ID
    url: String
    reshare: String
    description: String
    image: String
    image_src: String
    author: String
    site_name: String
    type: String
    body: String
    title: String
    published_time: String
    shared_time: String
    tags: String
    authorAvatar: String
    subscr_status: String
    threadTagImage: String
    threadPublished_time: String
    userRole: String
    threadDescription: String
    threadTag: String
    threadImage: String
    threadAuthor: String
    threadSlug: String
    threadTitle: String
    threadTagName: String
    threadUrl: String
    children_summary: String
    parent_summary: String
}
    type LogEntry {
    logid: Int
    type: String
    body: String
    threaid: Int
    micros: String
    when: String
    sessionid: String
    username: String
}
type RunUrlResult {
    qwiket: Qwiket
    log: [LogEntry]
}
type returnValue {
    success: Boolean
    msg: String
    exception: String
}
input RssInput {
    rss: String
    active: Int
}
input SubrootInput {
    slug: String
    subroot: String
}
input FeedInput {
    slug: String
    name: String
    description: String
    image: String
    image_src: String
    path: String
    link: String
    owner: String
    entity: String
    rssFeeds: [RssInput]
    tags: [String]
    root: String
    rss: Int
    both: Int
    notor: Int
    active: Int
}

type Mutation {
    pingPayloadMutation(payload: String): String
    runUrl(
        url: String!
        primaryTag: String!
        tags: [String]
        silo: Int
    ): RunUrlResult
    runFeed(slug: String!, silo: Int, tags: [String]): Boolean
    postUrl(url: String!, silo: Int, tags: [String]): RunUrlResult
    saveFeed(feed: FeedInput): returnValue
    runFeeds(silo: Int): Boolean
    stopFeeds(silo: Int): Boolean
}
 type Place {
  id: ID
  owner: User
  desciption: String
  mainPhoto: String
  photos: [String]
  priceByNight: Float
  reviews: [Review]
}

input inputPlaceType {
  type: String
  desciption: String
  mainPhoto: String
  photos: [String]
  priceByNight: Float
}

type Mutation {
  addPlace(body: inputPlaceType): Place
}

type Query {
  placeList: [Place]
  place(id: ID): Place
}
 type Review {
  id: ID
  author: User
  feedback: String
  rate: Float
  place: ID
}

type Query {
  reviewByUser(id: ID): [Review]
}

input inputReviewType {
  id: ID
  feedback: String
  rate: Float
  place: ID
}

type Mutation {
  addReview(body: inputReviewType): Review
}
 type User {
  id: ID!
  name: String
  email: String!
  photo: String!
}

input inputUserType {
  name: String!
  email: String!
}

type Query {
  userList: [User!]!
  user(id: ID!): User!
}

type Mutation {
  addUser(body: inputUserType): User!
}
`;