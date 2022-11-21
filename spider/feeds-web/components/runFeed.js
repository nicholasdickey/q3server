import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Qwikets from "./qwiketsList";

import FeedSelector from "../components/feedSelector";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import QwiketDisplay from "./qwiketDisplay";
// runUrl(url: String!, primaryTag: String!, tags: [String]): Qwiket
const RUN_FEED = gql`
    mutation runFeed($slug: String!, $tags: [String], $silo: Int) {
        runFeed(slug: $slug, tags: $tags, silo: $silo)
    }
`;
const RESET_TEST = gql`
    mutation resetTest($test: String) {
        resetTest(test: $test)
    }
`;
const STOP_TEST = gql`
    mutation stopTest($name: String) {
        stopTest(name: $name)
    }
`;
const QWIKET_TAGS_QUERY = gql`
    query qwiketTagsQuery($tags: [String]!, $page: Int, $silo: Int) {
        qwiketTagsQuery(tags: $tags, page: $page, silo: $silo) {
            slug
            url
            title
            description
            image
            image_src
            author
            site_name
            type
            reshare
            body
            published_time
            shared_time
            tags
        }
    }
`;
const Container = styled.div`
    display: flex;
    justify-content: center;
`;
const VContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const OuterWrap = styled.div`
    margin: 20px;
`;

const ButtonWrap = styled.div`
    width: 800px;
    margin-top: 60px;
`;

const StyledTextField = styled(({ ...other }) => <TextField {...other} />)`
    width: 800 px;
`;
const RunFeedComponent = ({ silo }) => {
    const [feed, setFeed] = React.useState({
        tag: "frontpagemag",
        name: "Front Page Magazine",
    });

    const [runFeed, { loading, error, data }] = useMutation(RUN_FEED);
    const [resetTest, {}] = useMutation(RESET_TEST);
    const [stopTest, {}] = useMutation(STOP_TEST);
    const { error: qwiketTagsQueryError, data: qwiketsData } = useQuery(
        QWIKET_TAGS_QUERY,
        {
            variables: {
                tags: [feed ? feed.tag : ""],
                silo,
            },
            fetchPolicy: "network-only",
            pollInterval: 12000,
            onCompleted: data => {
                //let feed = data.fetchFeed;
                console.log("completed tags query run");
                //setFeedEdit(feed);
            },
            onError: error => {
                //  setAlert(error);
                console.log("error2:", error);
            },
        }
    );
    const handleFeedChange = feed => {
        setFeed(feed);
    };

    if (error) {
        console.log("error:", error);
    }
    console.log("qwikets:", qwikets);
    let qwikets = qwiketsData ? qwiketsData.qwiketTagsQuery : null;
    return (
        <Container>
            <VContainer>
                <form noValidate autoComplete="off">
                    <ButtonWrap>
                        <Button
                            disabled={!loading ? false : true}
                            onClick={() => {
                                /*console.log("calling runFeed", {
                                    feed,
                                    silo,
                                });*/

                                resetTest({
                                    variables: {
                                        test: "test",
                                    },
                                });
                            }}
                            variant="contained">
                            Reset Silo 4 / Tests
                        </Button>
                        <Button
                            disabled={!loading ? false : true}
                            onClick={() => {
                                /* console.log("calling runFeed", {
                                    feed,
                                    silo,
                                }); */

                                stopTest({
                                    variables: {
                                        name: feed.tag,
                                    },
                                });
                            }}
                            variant="contained">
                            Stop Feed
                        </Button>
                        <br />
                        <br />
                    </ButtonWrap>

                    <FeedSelector
                        feed={feed}
                        handleFeedChange={handleFeedChange}
                    />
                    <ButtonWrap>
                        <Button
                            disabled={!loading ? false : true}
                            onClick={() => {
                                /* console.log("calling runFeed", {
                                    feed,
                                    silo,
                                });*/

                                runFeed({
                                    variables: {
                                        slug: feed.tag,
                                        silo,
                                    },
                                });
                            }}
                            variant="contained">
                            Run
                        </Button>
                    </ButtonWrap>
                </form>
                {qwikets ? <Qwikets qwikets={qwikets} /> : null}
            </VContainer>
        </Container>
    );
};
export default RunFeedComponent;
