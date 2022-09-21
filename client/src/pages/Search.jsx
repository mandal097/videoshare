import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/Card';
import Loading from '../components/Loading';
import axios from '../config/axios';

const Container = styled.div`
display:flex;
flex-wrap:wrap;
gap:10px;
`;
const Search = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const searchParams = location.search;
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/search${searchParams}`);
            console.log(res.data);
            setVideos(res.data);
        }
        fetchVideos()
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [searchParams])
    return (
        <>
            {
                loading ?
                    (
                        <Loading />
                    ) : (

                        <Container>
                            {
                                videos.map((video) => (
                                    <Card video={video} key={video._id} />
                                ))
                            }
                        </Container>
                    )
            }
        </>
    )
}

export default Search