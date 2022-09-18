import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import axios from '../config/axios';
import Card from './Card';

const Container = styled.div`
  flex: 2;
  /* border:1px solid red; */
`;
const Recommendations = ({ tags }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const videoRes = await axios.get(`/videos/tags?tags=${tags}`);
                // console.log(videoRes.data);
                setVideos(videoRes.data)

            } catch (error) {
                console.log(error);
            }
        }
        fetchVideo()
    }, [tags]);


    return (
        <Container>
            {
                videos.map(video => (
                    <Card key={video._id} video={video} type="sm"/>
                ))
            }

        </Container>
    )
}

export default Recommendations