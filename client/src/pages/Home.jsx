import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "../config/axios";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');
      const res = type === "subs"
        ? await axios.get(`/videos/${type}`, {
          headers: {
            token: `Bearer ${token}`
          }
        })
        : await axios.get(`/videos/vid-f/${type}`)
      setVideos(res.data)
    }
    fetchVideos()
  }, [type])

  return (
    <Container>
      {
        videos.map(video => (
          <Card key={video._id} video={video} />
        ))
      }
    </Container>
  );
};

export default Home;
