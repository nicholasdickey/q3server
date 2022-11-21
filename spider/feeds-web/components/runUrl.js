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

import FeedSelector from "../components/feedSelector";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
// runUrl(url: String!, primaryTag: String!, tags: [String]): Qwiket
const TagWrap = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    border: thin green solid;
    padding: 20px;
`;

const TagRow = ({ slug, index, setValue, deleteRow }) => {
    const handleInputChange = e => {
        console.log("handleInputChange", e.currentTarget);
        setValue({
            index,
            name: [e.currentTarget.name],
            value: e.currentTarget.value,
        });
    };
    return (
        <TagWrap>
            <form noValidate autoComplete="off">
                Tag {index} <br />
                <StyledTextField
                    id={`slug-${index}-input`}
                    label="Subroot Slug"
                    value={slug}
                    defaultValue={slug}
                    name="slug"
                    onChange={handleInputChange}
                />{" "}
                <br />
                <br />
                <Button size="small" onClick={() => deleteRow(index)}>
                    Delete{" "}
                </Button>{" "}
            </form>{" "}
        </TagWrap>
    );
};
const TagsGrid = ({ tags, setValue, deleteRow }) => {
    return (
        <div>
            {" "}
            {tags.map((p, i) => {
                return (
                    <Tag
                        slug={p}
                        index={i}
                        setValue={setValue}
                        deleteRow={deleteRow}
                    />
                );
            })}{" "}
        </div>
    );
};
const RUN_URL = gql`
    mutation runUrl($url: String!, $primaryTag: String!, $silo: Int) {
        runUrl(url: $url, primaryTag: $primaryTag, silo: $silo) {
            qwiket {
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
            log {
                type
                body
                logid
                micros
                when
            }
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
const postUrl = ({ silo }) => {
    const [feed, setFeed] = React.useState({
        tag: "frontpagemag",
        name: "Front Page Magazine",
    });
    const [url, setUrl] = React.useState(
        "https://www.frontpagemag.com/fpm/2020/05/malignant-hypocrisy-david-horowitz/"
    );
    const [runUrl, { error, data }] = useMutation(RUN_URL);
    const [loading, setLoading] = React.useState(0);

    const handleUrlChange = event => {
        let url = event.target.value;
        console.log("handleUrlChange", url);
        setUrl(url);
    };
    const handleFeedChange = feed => {
        setFeed(feed);
    };

    let qwiket = null;
    let log = null;
    if (data) {
        if (loading) setLoading(0);
        console.log("data:", data);
        let runUrl = data.runUrl;
        if (runUrl) {
            qwiket = runUrl.qwiket;
            log = runUrl.log;
        }
        console.log({ qwiket });
    }
    if (error) {
        console.log("error:", error);
    }
    return (
        <Container>
            <VContainer>
                <form noValidate autoComplete="off">
                    <StyledTextField
                        id="url-input"
                        label="Paste URL:"
                        value={url}
                        onChange={handleUrlChange.bind(this)}
                    />
                    <FeedSelector
                        feed={feed}
                        handleFeedChange={handleFeedChange}
                    />
                    <ButtonWrap>
                        <Button
                            disabled={feed && url && !loading ? false : true}
                            onClick={() => {
                                /* console.log("calling runUrl", {
                                    url,
                                    feed,
                                    silo,
                                });*/
                                setLoading(1);
                                runUrl({
                                    variables: {
                                        url,
                                        primaryTag: feed.tag,
                                        silo,
                                    },
                                });
                            }}
                            variant="contained">
                            Submit
                        </Button>
                    </ButtonWrap>
                </form>
                {qwiket ? <QwiketDisplay qwiket={qwiket} /> : null}
                {loading && !qwiket ? (
                    <div>
                        <br />
                        Loading...
                    </div>
                ) : null}
                {log ? (
                    <div>
                        <LogDisplay log={log} />
                    </div>
                ) : null}
            </VContainer>
        </Container>
    );
};
export default postUrl;
