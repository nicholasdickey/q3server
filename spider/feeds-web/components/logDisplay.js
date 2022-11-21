import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
const LogWrap = styled.div`
    width: 800px;
    margin-top: 60px;
`;
const BodyCellWrap = styled.div`
    width: 500px;
`;
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    //  const classes = useRowStyles();
    const millis = Math.abs(row.when / 1000);
    console.log("render row:", row, millis);
    let d = new Date(millis);
    let ds = row.micros;
    console.log("render micros:", ds);
    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>

                <TableCell align="left">
                    <BodyCellWrap>{row.body.slice(0, 128)}</BodyCellWrap>
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>

                <TableCell align="right">{row.logid}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div">
                                Body
                            </Typography>
                            <Typography>{row.body}</Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
const LogDisplay = ({ log }) => {
    console.log("LogDisplay render", log);
    return (
        <LogWrap>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="left">Body</TableCell>
                            <TableCell align="right">Type</TableCell>

                            <TableCell align="right">logid</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {log.map(row => {
                            console.log("row:", row);
                            return <Row key={row.logid} row={row} />;
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </LogWrap>
    );
};
export default LogDisplay;
