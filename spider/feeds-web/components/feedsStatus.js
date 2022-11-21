import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import QwiketDisplay from "./qwiketDisplay";
import LogDisplay from "./logDisplay";

import FeedSelector from "./feedSelector";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
// runUrl(url: String!, primaryTag: String!, tags: [String]): Qwiket
const Label = styled.div`
    width: 120px;
    margin-top: 20px;
`;
const TagWrap = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    border: thin green solid;
    padding: 20px;
`;

const FEEDS_STATUS = gql`
    query feedsStatus($silo: Int) {
        feedsStatus(silo: $silo) {
            success
            runningFeeds {
                name
                status
            }
            lastFeeds {
                name
                last
            }
        }
    }
`;
const RUN_FEEDS = gql`
    mutation runFeeds($silo: Int) {
        runFeeds(silo: $silo)
    }
`;
const STOP_FEEDS = gql`
    mutation stopFeeds($silo: Int) {
        stopFeeds(silo: $silo)
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

const FeedsStatus = ({ silo }) => {
    const { error, data } = useQuery(FEEDS_STATUS, {
        variables: {
            silo,
        },
        fetchPolicy: "network-only",
        pollInterval: 12000,
        onCompleted: data => {
            //let feed = data.fetchFeed;
            // console.log("completed feedsStatus query run");
            // setNow((Date.now() / 1000) | 0);
            //setFeedEdit(feed);
        },
        onError: error => {
            //  setAlert(error);
            console.log("error2:", error);
        },
    });
    const [runFeeds, { error: errorRunFeeds }] = useMutation(RUN_FEEDS);
    const [stopFeeds, { error: errorStopFeeds }] = useMutation(STOP_FEEDS);

    let runningFeeds = null;
    let lastFeeds = null;
    if (data) {
        //  console.log("data:", data);
        let feedsStatus = data.feedsStatus;
        if (feedsStatus) {
            runningFeeds = feedsStatus.runningFeeds;
            lastFeeds = feedsStatus.lastFeeds;
        }
        // console.log({ runningFeeds, lastFeeds });
    }
    if (error) {
        console.log("error:", error);
    }

    return (
        <Container>
            <VContainer>
                <ButtonWrap>
                    <Button
                        onClick={() => {
                            console.log("calling runFeeds", {
                                silo,
                            });

                            runFeeds({
                                variables: {
                                    silo,
                                },
                            });
                        }}
                        variant="contained">
                        Run Feeds{" "}
                    </Button>{" "}
                    <Button
                        onClick={() => {
                            console.log("calling stopFeeds", {
                                silo,
                            });

                            stopFeeds({
                                variables: {
                                    silo,
                                },
                            });
                        }}
                        variant="contained">
                        Stop Feeds{" "}
                    </Button>{" "}
                </ButtonWrap>{" "}
                {runningFeeds ? (
                    <div>
                        <Label> Running Feeds </Label>{" "}
                        {runningFeeds.map((p, i) => {
                            return (
                                <div>
                                    {" "}
                                    {i + 1}: {p.name}{" "}
                                </div>
                            );
                        })}{" "}
                    </div>
                ) : null}{" "}
                {lastFeeds ? (
                    <div>
                        <Label> Last Feeds </Label>{" "}
                        {lastFeeds.map((p, i) => {
                            const ago = p.last;
                            return (
                                <div>
                                    <div>
                                        {" "}
                                        {i + 1}: {p.name}: {ago}
                                        sec ago{" "}
                                    </div>{" "}
                                </div>
                            );
                        })}{" "}
                    </div>
                ) : null}{" "}
            </VContainer>{" "}
        </Container>
    );
};
export default FeedsStatus;
