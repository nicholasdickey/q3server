import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import FeedSelector from "../components/feedSelector";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
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
            <div noValidate autoComplete="off">
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
            </div>{" "}
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

/////////////////
const RssRow = ({ rss, active, index, setValue, deleteRow }) => {
    const handleInputChange = e => {
        console.log("handleInputChange", e.currentTarget);
        setValue({ index, rss: e.currentTarget.value, active });
    };
    const handleSelectChange = e => {
        // let newValue = e.target.value;
        console.log("handleSelectChange", {
            name: e.target.name,
            value: e.target.value,
        });
        setValue({ index, rss, active: e.target.value });
    };
    return (
        <div noValidate autoComplete="off">
            <StyledTextField
                id={`name-${index}-input`}
                label="Rss Url"
                value={rss}
                defaultValue={rss}
                name="rss"
                onChange={handleInputChange}
            />{" "}
            <FormControl>
                <InputLabel id={`rss-row-${index}-select-label`}>
                    Active{" "}
                </InputLabel>{" "}
                <Select
                    labelId={`rss-row-${index}-select-label`}
                    id={`rss-row-${index}-select`}
                    value={active}
                    name="active"
                    onChange={handleSelectChange}>
                    <MenuItem value={0}> 0 </MenuItem>{" "}
                    <MenuItem value={1}> 1 </MenuItem>{" "}
                </Select>{" "}
                <br />
                <Button size="small" onClick={() => deleteRow(index)}>
                    Delete{" "}
                </Button>{" "}
                <br />
            </FormControl>{" "}
        </div>
    );
};
const RssGrid = ({ rssFeeds, setValue, deleteRow }) => {
    return (
        <div>
            {" "}
            {rssFeeds
                ? rssFeeds.map((p, i) => {
                      return (
                          <RssRow
                              rss={p.rss}
                              active={p.active}
                              index={i}
                              setValue={setValue}
                              deleteRow={deleteRow}
                          />
                      );
                  })
                : null}{" "}
        </div>
    );
};
const VALIDATE_FEED_SLUG_QL = gql`
    query validateFeedSlug($slug: String!) {
        validateFeedSlug(slug: $slug) {
            success
        }
    }
`;
const SAVE_FEED_QL = gql`
    mutation saveFeed($feed: FeedInput!) {
        saveFeed(feed: $feed) {
            success
        }
    }
`;
const FETCH_FEED_QL = gql`
    query fetchFeed($slug: String!) {
        fetchFeed(slug: $slug) {
            slug
            name
            description
            image
            image_src
            path
            link
            owner
            entity
            rssFeeds {
                rss
                active
            }
            root
            tags
            rss
            both
            last
            active
            notor
            category_xid
        }
    }
`;

const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
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
    display: flex;
    justifycontent: space-in-between;
`;
const ButtonSpace = styled.div`
    margin-left: 20px;
`;
const Alert = styled.div`
    display: flex;
    flex-direction: column;
    width: 800px;
    margin-bottom: 40px;
`;

const StyledTextField = styled(({ ...other }) => <TextField {...other} />)`
    width: 800 px;
`;
const FeedEditor = ({}) => {
    const [newFeed, setNewFeed] = React.useState(false);
    const [slug, setSlug] = React.useState("");
    const [alert, setAlert] = React.useState("");
    const [feed, setFeed] = React.useState(null);
    const [feedEdit, setFeedEdit] = React.useState({
        slug: "",
        name: "",
        description: "",
        image: "",
        image_src: "",
        path: "",
        link: "",
        owner: "",
        entity: "",
        root: "",
        rss: 0,
        rssFeeds: [],
        both: 0,
        last: 0,
        active: 0,
    });

    const [
        saveFeed,
        { error: saveFeedError, data: saveFeedData },
    ] = useMutation(SAVE_FEED_QL, {
        onCompleted: data => {
            console.log("save completed", feedEdit.slug);
            fetchFeed({
                variables: {
                    slug: feedEdit.slug,
                },
            });
        },
    });
    const [
        fetchFeed,
        { loading, error: fetchFeedError, data: feedData },
    ] = useLazyQuery(FETCH_FEED_QL, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            let feed = data.fetchFeed;
            console.log("FETCH_FEED_QL completed:", feed);
            setFeedEdit(feed);
        },
        onError: error => {
            setAlert(error);
            console.log("error2:", error);
        },
    });
    const [
        validateFeedSlug,
        {
            loading: newFeedLoading,
            error: validateFeedSlugError,
            data: validateFeedSlugData,
        },
    ] = useLazyQuery(VALIDATE_FEED_SLUG_QL, {
        onCompleted: data => {
            let result = data.validateFeedSlug;
            console.log("validateFeedSlug completed", result);
            if (result.success) {
                setNewFeed(false);
                setFeedEdit({ ...feedEdit, ["slug"]: slug });
            } else {
                setAlert(`
    Can 't validate the slug`);
            }
        },
        onError: error => {
            setAlert(error);
            console.log("error3:", error);
        },
    });

    const [description, setDescription] = React.useState(
        feedData ? feedData.description : ""
    );

    // console.log("RENDER ", feedEdit);

    const handleFeedChange = feed => {
        if (feed) {
            console.log("handleFeedChange", feed.tag);
            fetchFeed({
                variables: {
                    slug: feed.tag,
                },
            });
        }
    };

    if (fetchFeedError) {
        console.log("error:", fetchFeedError);
    }

    const handleInputChange = e => {
        console.log("handleInputChange", e.currentTarget);
        setFeedEdit({
            ...feedEdit,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };
    const handleSelectChange = e => {
        let newValue = e.target.value;
        console.log("handleSelectChange", { name: e.target.name, newValue });
        setFeedEdit({
            ...feedEdit,
            [e.target.name]: newValue,
        });
    };
    return (
        <Container>
            {" "}
            {alert ? (
                <Alert>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                {" "}
                                {alert}{" "}
                            </Typography>{" "}
                        </CardContent>{" "}
                        <CardActions>
                            <Button
                                size="small"
                                onClick={() => setAlert(false)}>
                                Dismiss{" "}
                            </Button>{" "}
                        </CardActions>{" "}
                    </Card>{" "}
                </Alert>
            ) : null}{" "}
            {newFeed ? (
                <VContainer>
                    <form>
                        <StyledTextField
                            id="name-input"
                            label="New Feed Slug"
                            value={slug}
                            defaultValue={slug}
                            name="slug"
                            onChange={e => setSlug(e.currentTarget.value)}
                        />{" "}
                        <br />
                        <br />
                        <ButtonWrap>
                            <Button
                                disabled={!newFeedLoading ? false : true}
                                onClick={() => {
                                    console.log("calling validateFeedSlug", {
                                        slug,
                                    });

                                    validateFeedSlug({
                                        variables: {
                                            slug,
                                        },
                                    });
                                }}
                                variant="contained">
                                Submit{" "}
                            </Button>{" "}
                            <ButtonSpace>
                                <Button
                                    disabled={!newFeedLoading ? false : true}
                                    onClick={() => setNewFeed(false)}
                                    variant="contained">
                                    Cancel{" "}
                                </Button>{" "}
                            </ButtonSpace>{" "}
                        </ButtonWrap>{" "}
                    </form>{" "}
                </VContainer>
            ) : (
                <VContainer>
                    <form noValidate autoComplete="off">
                        <FeedSelector
                            feed={feed}
                            handleFeedChange={handleFeedChange}
                        />{" "}
                        <br />
                        <br />{" "}
                        {feedEdit && feedEdit.slug ? (
                            <div>
                                <StyledTextField
                                    id="slug-input"
                                    label="Slug"
                                    value={feedEdit.slug}
                                    disabled={true}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="name-input"
                                    label="Name"
                                    value={feedEdit.name}
                                    defaultValue={feedEdit.name}
                                    name="name"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="description-input"
                                    label="Description"
                                    value={feedEdit.description}
                                    name="description"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="imagesrc-input"
                                    label="Image Src"
                                    value={feedEdit.image_src}
                                    name="image_src"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="image-input"
                                    label="Image"
                                    value={feedEdit.image}
                                    disabled={true}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="path-input"
                                    label="Path"
                                    value={feedEdit.path}
                                    name="path"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="link-input"
                                    label="Link"
                                    value={feedEdit.link}
                                    name="link"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="owner-input"
                                    label="Owner"
                                    value={feedEdit.owner}
                                    name="owner"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="entity-input"
                                    label="Entity"
                                    value={feedEdit.entity}
                                    name="entity"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="root-input"
                                    label="Root"
                                    value={feedEdit.root}
                                    name="root"
                                    onChange={handleInputChange}
                                />{" "}
                                <br />
                                <br />
                                <FormControl>
                                    <InputLabel id="rss-select-label">
                                        Rss{" "}
                                    </InputLabel>{" "}
                                    <Select
                                        labelId="rss-select-label"
                                        id="drss-select"
                                        value={feedEdit.rss}
                                        name="rss"
                                        onChange={handleSelectChange}>
                                        <MenuItem value={0}> 0 </MenuItem>{" "}
                                        <MenuItem value={1}> 1 </MenuItem>{" "}
                                    </Select>{" "}
                                </FormControl>{" "}
                                <br />
                                <br />{" "}
                                {feedEdit.rss == 1 ? (
                                    <div>
                                        <RssGrid
                                            rssFeeds={feedEdit.rssFeeds}
                                            setValue={({
                                                index,
                                                rss,
                                                active,
                                            }) => {
                                                let rssFeeds = [
                                                    ...feedEdit.rssFeeds,
                                                ];
                                                rssFeeds[index] = {
                                                    rss,
                                                    active,
                                                };
                                                setFeedEdit({
                                                    ...feedEdit,
                                                    ["rssFeeds"]: rssFeeds,
                                                });
                                            }}
                                            deleteRow={index => {
                                                let rssFeeds =
                                                    feedEdit.rssFeeds;
                                                rssFeeds.splice(index, 1);
                                                setFeedEdit({
                                                    ...feedEdit,
                                                    ["rssFeeds"]: rssFeeds,
                                                });
                                            }}
                                        />{" "}
                                        <Button
                                            disabled={!loading ? false : true}
                                            onClick={() => {
                                                let rssFeeds =
                                                    feedEdit.rssFeeds;
                                                if (!rssFeeds) rssFeeds = [];
                                                rssFeeds.push({
                                                    rss: "",
                                                    active: 0,
                                                });
                                                console.log(
                                                    "new rssFeeds",
                                                    rssFeeds
                                                );

                                                setFeedEdit({
                                                    ...feedEdit,
                                                    ["rssFeeds"]: rssFeeds,
                                                });
                                            }}
                                            variant="outlined">
                                            Add Rss{" "}
                                        </Button>{" "}
                                        <br />
                                        <br />
                                    </div>
                                ) : null}{" "}
                                <FormControl>
                                    <InputLabel id="both-select-label">
                                        Both{" "}
                                    </InputLabel>{" "}
                                    <Select
                                        labelId="both-select-label"
                                        id="both-select"
                                        value={feedEdit.both}
                                        name="both"
                                        onChange={handleSelectChange}>
                                        <MenuItem value={0}> 0 </MenuItem>{" "}
                                        <MenuItem value={1}> 1 </MenuItem>{" "}
                                    </Select>{" "}
                                </FormControl>{" "}
                                <br />
                                <br />
                                <StyledTextField
                                    id="last-input"
                                    label="Last"
                                    value={feedEdit.last}
                                    disabled={true}
                                />{" "}
                                <br />
                                <br />
                                <FormControl>
                                    <InputLabel id="active-select-label">
                                        Active{" "}
                                    </InputLabel>{" "}
                                    <Select
                                        labelId="active-select-label"
                                        id="active-select"
                                        value={feedEdit.active}
                                        name="active"
                                        onChange={handleSelectChange}>
                                        <MenuItem value={0}> 0 </MenuItem>{" "}
                                        <MenuItem value={1}> 1 </MenuItem>{" "}
                                    </Select>{" "}
                                </FormControl>{" "}
                                <br />
                                <br />
                                <FormControl>
                                    <InputLabel id="notor-select-label">
                                        Notor{" "}
                                    </InputLabel>{" "}
                                    <Select
                                        labelId="notor-select-label"
                                        id="notor-select"
                                        value={feedEdit.notor}
                                        name="notor"
                                        onChange={handleSelectChange}>
                                        <MenuItem value={0}> 0 </MenuItem>{" "}
                                        <MenuItem value={1}> 1 </MenuItem>{" "}
                                    </Select>{" "}
                                </FormControl>{" "}
                            </div>
                        ) : null}{" "}
                        <ButtonWrap>
                            <Button
                                disabled={
                                    !loading && feedEdit && feedEdit.slug
                                        ? false
                                        : true
                                }
                                onClick={() => {
                                    let fs = JSON.stringify(feedEdit);
                                    let feed = JSON.parse(fs);
                                    delete feed.__typename;
                                    delete feed.last;
                                    delete feed.category_xid;
                                    if (feed.rssFeeds) {
                                        for (
                                            var i = 0;
                                            i < feed.rssFeeds.length;
                                            i++
                                        ) {
                                            delete feed.rssFeeds[i].__typename;
                                        }
                                    }
                                    /*if (feed.tags) {
                        for (
                            var i = 0;
                            i < feed.tags.length;
                            i++
                        ) {
                            delete feed.tag[i].__typename;
                        }
                    }*/
                                    console.log("calling saveFeed", {
                                        feed,
                                    });

                                    saveFeed({
                                        variables: {
                                            feed,
                                        },
                                    });
                                }}
                                variant="contained">
                                Save{" "}
                            </Button>{" "}
                            <ButtonSpace>
                                <Button
                                    disabled={!loading ? false : true}
                                    onClick={() => setNewFeed(true)}
                                    variant="contained">
                                    New Feed{" "}
                                </Button>{" "}
                            </ButtonSpace>{" "}
                        </ButtonWrap>{" "}
                    </form>{" "}
                </VContainer>
            )}{" "}
        </Container>
    );
};
export default FeedEditor;
/*
 <div>
                                    <TagsGrid
                                        tags={
                                            feedEdit.tags ? feedEdit.tags : []
                                        }
                                        setValue={({ index, name, value }) => {
                                            let tags = feedEdit.tags
                                                ? feedEdit.tags
                                                : [];
                                            tags[index] = value;
                                            setFeedEdit({
                                                ...feedEdit,
                                                ["tags"]: tags,
                                            });
                                        }}
                                        deleteRow={index => {
                                            let tags = feedEdit.tags
                                                ? feedEdit.tags
                                                : [];
                                            tags.splice(index, 1);
                                            setFeedEdit({
                                                ...feedEdit,
                                                ["tags"]: tags,
                                            });
                                        }}
                                    />
                                    <Button
                                        disabled={!loading ? false : true}
                                        onClick={() => {
                                            let tags = feedEdit.tags;
                                            if (!tags) tags = [];
                                            tags = tags.push("");
                                            console.log("new tag", tags);

                                            setFeedEdit({
                                                ...feedEdit,
                                                ["tags"]: tags,
                                            });
                                        }}
                                        variant="outlined">
                                        Add Tag
                                    </Button>
                                    <br />
                                    <br />
                                </div>
                                */
