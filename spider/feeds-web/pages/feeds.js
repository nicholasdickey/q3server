// ./src/pages/admin.js
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import PostUrl from "../components/postUrl";

import RunUrl from "../components/runUrl";
import RunFeed from "../components/runFeed";
import withApollo from "../lib/apollo";
import FeedEditor from "../components/feedEditor";
import FeedsStatus from "../components/feedsStatus";

const Picture = styled.img`
    border-radius: 50%;
    border: 3px solid white;
    width: 100px;
`;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
const TitleWrap = styled.div`
    padding-top: 8px;
    padding-left: 20px;
    width: 160px;
`;
const TopControls = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 200px;
    .label {
        color: white;
        padding-left: 20px;
    }
    .control {
        color: white;
        padding-top: 10px;
        width: 120px;
    }
`;
export default withApollo({ ssr: true })(props => {
    const [tabValue, setTabValue] = React.useState(0);
    const [silo, setSilo] = React.useState(4);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleSiloChange = event => {
        setSilo(event.target.value);
    };
    console.log("feeds render");
    return (
        <div>
            <AppBar position="static">
                <TopControls>
                    <Typography variant="h6">
                        <TitleWrap>Qwiket Feeds</TitleWrap>
                    </Typography>
                    {tabValue ? (
                        <FormControl>
                            <FormControlLabel
                                className="control"
                                labelPlacement="start"
                                id="demo-simple-select-label"
                                label="Silo"
                                control={
                                    <Select
                                        className="label"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={silo}
                                        onChange={handleSiloChange}>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                    </Select>
                                }
                            />
                        </FormControl>
                    ) : null}
                </TopControls>
                <Tabs
                    value={tabValue}
                    variant="scrollable"
                    onChange={handleTabChange}
                    aria-label="Feeds Manager">
                    <Tab label="Setup" {...a11yProps(0)} />
                    <Tab label="Run URL for Feed" {...a11yProps(1)} />
                    <Tab label="Run Feed" {...a11yProps(2)} />
                    <Tab label="Post URL" {...a11yProps(3)} />
                    <Tab label="Search" {...a11yProps(4)} />
                    <Tab label="Real-time " {...a11yProps(5)} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <FeedEditor />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <RunUrl silo={silo} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <RunFeed silo={silo} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <PostUrl silo={silo} />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
                Search
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
                <FeedsStatus silo={silo} />
            </TabPanel>
        </div>
    );
});
