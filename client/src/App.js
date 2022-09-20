import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
  /* border:1px solid yellow; */
  `;
const Wrapper = styled.div`
  padding: 22px 90px;
  /* border:1px solid yellow; */
`;
const Message = styled.div`
  padding: 22px 90px;
  color:${({ theme }) => theme.text};
  font-size:20px;

`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { currentuser } = useSelector((state) => state.user);

  const mediaMatch = window.matchMedia('(max-width: 600px)');
  const [matches, setMatches] = useState(mediaMatch.matches);

  useEffect(() => {
    const handler = e => setMatches(e.matches);
    mediaMatch.addListener(handler);
    return () => mediaMatch.removeListener(handler);
  }, [mediaMatch])
  console.log(matches);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>

      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            {
              matches &&
              <Message>This may not give you better experience on mobile <br />Better play on desktop</Message>
            }
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="subs" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="signin" element={currentuser ? <Navigate to='/' /> : <SignIn />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
