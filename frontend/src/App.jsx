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
            chatflowid="52915b66-239d-4335-93a1-719b774bed66"
            apiHost="https://cloud.flowiseai.com"
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
