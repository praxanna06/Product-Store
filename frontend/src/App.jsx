import { Box, useColorModeValue } from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom';
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./component/Navbar";
import { BubbleChat } from 'flowise-embed-react'

function App() {

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <BubbleChat
            chatflowid="60c4f029-c394-4a23-84e9-400579950580"
            apiHost="https://flowiseai-p5t6.onrender.com"
        />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Box>
  );
}

export default App;
