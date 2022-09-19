import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "../config/axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
  cursor:pointer;
  `;
const GoToSignIn = styled.span`
margin-left: auto;
font-size:12px;
cursor:pointer;
&:hover{
color:blue;
}
`;



const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all required fields")
    }
    try {
      const res = await axios.post('/user/auth/signup', { name, email, password });
      // console.log(res.data.user.status);
      // console.log(res.data.user);
      // console.log(res.status);
      if (res.status === 201) {
        toast.success("Registered successfully")
        setTimeout(() => {
          navigate('/')
        }, 1000);
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all required fields")
    }
    dispatch(loginStart());
    try {
      const res = await axios.post('/user/auth/signin', { email, password })
      dispatch(loginSuccess(res.data.user));
      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        navigate('/')
      }, 1000);
    } catch (error) {
      dispatch(loginFailure());
      toast.error("Something went wrong")
    }
  }


  const signinWithGoogle = async (e) => {
    e.preventDefault();
    try {
      signInWithPopup(auth, provider).then((result) => {
        // console.log(result);
        axios.post('/user/auth/google', {
          name: result.user.displayName,
          email: result.user.email,
          img: result.user.photoURL
        }).then((res) => {
          dispatch(loginSuccess(res.data.user))
          localStorage.setItem('token', res.data.token)
        })
        setTimeout(() => {
          navigate('/')
        }, 1000);
      }).catch((err) => {
        dispatch(loginFailure())
      })
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  }


  return (
    <Container>
      <ToastContainer />
      <Wrapper>
        {
          show ?
            (
              <>
                <Title>Sign in</Title>
                <SubTitle>to continue to youVid</SubTitle>
                <Input
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <GoToSignIn onClick={() => setShow(false)}>Don't have an account</GoToSignIn>
                <Button onClick={handleLogin}>Sign in</Button>

                <Title>or</Title>

                <Button onClick={signinWithGoogle} >Signin with Google</Button>
              </>
            ) : (
              <>
                <Title>Sign up</Title>
                <Input
                  placeholder="username"
                  onChange={(e) => setName(e.target.value)}
                  required

                />
                <Input
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <GoToSignIn onClick={() => setShow(true)}>Already have an account</GoToSignIn>
                <Button onClick={handleSignup}>Sign up</Button>
              </>
            )
        }
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
