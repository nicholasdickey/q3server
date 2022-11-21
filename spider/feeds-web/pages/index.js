import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Button from "@material-ui/core/Button";
const Home = () => (
    <Container>
        <Heading>QWIKET-API HOME</Heading>
        <Link href="/feeds">
            <Button>Feeds</Button>
        </Link>
    </Container>
);
const Container = styled.div`
    width: 960px;
    height: 100vh;
    margin: 2rem auto;
    padding: 2rem;
    background: #f2f2f2;
`;
const Heading = styled.h1``;
export default Home;
