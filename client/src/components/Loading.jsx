import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

const Container = styled.div`
display:flex;
height:100%;
width:100%;
align-items:center;
justify-content:center;
position:fixed;
top:0;
bottom:0;
right:0;
left:0;
`;
const Loader = styled.div``;

const Loading = () => {
    return (
        <Container >
            <Loader >
                <CircularProgress />
            </Loader>
        </Container>
    );
}

export default Loading;
