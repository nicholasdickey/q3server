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
    console.log("tr=", slug, index);
    return (
        <TagWrap>
            <form noValidate autoComplete="off">
                <StyledTextField
                    id={`slug-${index}-input`}
                    label="Tag"
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
    console.log("TagsGrid Render", tags);
    return (
        <div>
            {" "}
            {tags.map((p, i) => {
                console.log("TagsGrid row:", p);
                return (
                    <TagRow
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
const POST_URL = gql`
    mutation postUrl($url: String!, $silo: Int, $tags: [String]) {
        postUrl(url: $url, silo: $silo, tags: $tags) {
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
    const [url, setUrl] = React.useState(
        "https://www.frontpagemag.com/fpm/2020/05/malignant-hypocrisy-david-horowitz/"
    );
    const [postUrl, { loading, error, data }] = useMutation(POST_URL);
    const [tags, setTags] = React.useState([]);

    const handleUrlChange = event => {
        let url = event.target.value;
        console.log("handleUrlChange", url);
        setUrl(url);
    };

    let qwiket = null;
    let log = null;
    if (data) {
        console.log("data:", data);
        let postUrl = data.postUrl;
        if (postUrl) {
            qwiket = postUrl.qwiket;
            log = postUrl.log;
        }
        console.log({ qwiket });
    }
    if (error) {
        console.log("error:", error);
    }
    console.log("tags", tags);
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
                    <div>
                        <TagsGrid
                            tags={tags}
                            setValue={({ index, name, value }) => {
                                let t = [...tags];
                                t[index] = value;
                                setTags(t);
                            }}
                            deleteRow={index => {
                                let t = [...tags];
                                t.splice(index, 1);
                                setTags(t);
                            }}
                        />
                        <Button
                            disabled={!loading ? false : true}
                            onClick={() => {
                                let t = [...tags];
                                if (!t) t = [];
                                t.push("");
                                console.log("new tag", t);

                                setTags(t);
                            }}
                            variant="outlined">
                            Add Tag
                        </Button>
                        <br />
                        <br />
                    </div>
                    <ButtonWrap>
                        <Button
                            disabled={url && !loading ? false : true}
                            onClick={() => {
                                console.log("calling postUrl", {
                                    url,
                                    tags,
                                    silo,
                                });

                                postUrl({
                                    variables: {
                                        url,
                                        tags,
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
