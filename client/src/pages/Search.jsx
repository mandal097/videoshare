import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/Card';
import axios from '../config/axios';

const Container = styled.div`
display:flex;
flex-wrap:wrap;
gap:10px;
`;
const Search = () => {
    const location = useLocation();
    // const tags = location.pathname.split('/')[2]
    // console.log(tags);
    const searchParams = location.search;
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/search${searchParams}`);
            // const res = await axios.get(`/videos/tags${searchParams}`);
            console.log(res.data);
            setVideos(res.data);
        }
        fetchVideos()
    }, [searchParams])
    return (
        <Container>
            {
                videos.map((video) => (
                    <Card video={video} key={video._id} />
                ))
            }

        </Container>
    )
}

export default Search