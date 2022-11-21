import { withApollo } from "next-apollo";
//import { HttpLink } from "apollo-boost";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const _base = process.env.BASE_URL;
let uri = _base ? _base : "" + "/graphql";
console.log("uri=", uri);
const apolloClient = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
});

/*const config = {
    link: new HttpLink({
        uri: process.env.GRAPHQL_URL, // Server URL (must be absolute)
        includeExtensions: false,
        addTypename: false,
        opts: {
            credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
        },
    }),
};*/

export default withApollo(apolloClient);
