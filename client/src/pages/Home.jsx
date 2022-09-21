import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "../config/axios";
import Loading from "../components/Loading";

const Main = styled.div`
  /* display: flex;
  justify-content: space-between;
  flex-wrap: wrap; */
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Channel = styled.div`
  display: flex;
  margin-bottom:40px;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 30px;
`;

const Image = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  cursor:pointer;
  &:hover{
    transform:scale(1.06);
  }
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 400;
  font-size:20px;
  cursor:pointer;
  text-transform:capitalize;
  &:hover{
    color:skyblue;
  }
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;



const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);

  const path = useLocation();
  const id = path.pathname.split('/')[2];
  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');
      if (type === "subs") {
        const res = await axios.get(`/videos/${type}`, {
          headers: {
            token: `Bearer ${token}`
          }
        })
        setVideos(res.data)
      } else if (type === "channel") {
        const res = await axios.get(`/videos/channel/all-vid/${id}`)
        setVideos(res.data);
        console.log(res.data);
      } else {
        const res = await axios.get(`/videos/vid-f/${type}`)
        setVideos(res.data)

      }
    }
    setLoading(true)
    fetchVideos()
    setTimeout(() => {
      setLoading(false)      
    }, 1000);
  }, [type, id]);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelRes = await axios.get(`/user/find/${id}`);
        setChannel(channelRes.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchChannel();
  }, [id]);

  return (

    <Main>
      {
        loading ? <Loading /> : (
          <>
            {type === "channel" &&
              <Channel>
                <ChannelInfo>
                  <Image src={channel.img} />
                  <ChannelDetail>
                    <ChannelName>{channel.name}</ChannelName>
                    <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
                    <ChannelCounter>{videos.length} videos</ChannelCounter>
                  </ChannelDetail>
                </ChannelInfo>
              </Channel>
            }
            <Container>
              {
                videos.map(video => (
                  <Card key={video._id} video={video} type={type} channel={channel}/>
                ))
              }
            </Container>
          </>
        )
      }
    </Main>
  );
};

export default Home;
