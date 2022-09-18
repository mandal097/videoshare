import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Comments from "../components/Comments";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../config/axios";
import { fetchSuccess, updateDisLikes, updateLikes } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendations from "../components/Recommendations";



const Container = styled.div`
  display: flex;
  gap: 24px;
  /* border:1px solid red; */
  `;

const Content = styled.div`
  flex: 6;
  /* border:1px solid blue; */
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;



const VideoFrame = styled.video`
  max-height:720px;
  width:100%;
  object-fit:cover;  
`

const Video = () => {
  const { currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentVideo);
  const path = useLocation();
  const dispatch = useDispatch()


  // const [video, setVideo] = useState({});
  const [channel, setChannel] = useState({});
  const id = path.pathname.split('/')[2];

  useEffect(() => {    
    const fetchVideo = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${id}`);
        dispatch(fetchSuccess(videoRes.data))
        console.log(videoRes);
        if (videoRes) {
          const channelRes = await axios.get(`/user/find/${videoRes.data.userId}`);
          setChannel(channelRes.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchVideo();
  }, [id, dispatch]);

  const handleLikes = async () => {
    const token = localStorage.getItem('token')
    await axios.put(`/videos/vid-l/likes/${currentVideo._id}`, {}, {
      headers: {
        token: `Bearer ${token}`
      }
    })
    dispatch(updateLikes(currentUser._id))

  };
  const handleDisLikes = async () => {
    const token = localStorage.getItem('token')
    await axios.put(`/videos/vid-l/dislikes/${currentVideo._id}`, {}, {
      headers: {
        token: `Bearer ${token}`
      }
    })
    dispatch(updateDisLikes(currentUser._id))
  };

  const handleSubscribed = async () => {
    const token = localStorage.getItem('token')
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/user/subscribe/unsub/${channel._id}`, {}, {
        headers: {
          token: `Bearer ${token}`
        }
      }) :
      await axios.put(`/user/subscribe/sub/${channel._id}`, {}, {
        headers: {
          token: `Bearer ${token}`
        }
      });
    dispatch(subscription(channel._id))
  }


  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame controls>
            <source src={currentVideo.videoUrl} />
          </VideoFrame>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>{currentVideo.views} views • {format(currentVideo.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLikes}>
              {currentUser.likes?.includes(currentUser._id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              {currentVideo.likes.length}
            </Button>
            <Button onClick={handleDisLikes}>
              {currentUser.dislikes?.includes(currentUser._id) ? <ThumbDownIcon /> : <ThumbDownOffAltOutlinedIcon />}{currentVideo.dislikes.length}
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>
                {currentVideo.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSubscribed}>
            {currentUser.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendations tags={currentVideo.tags} />
    </Container>
  );
};

export default Video;
