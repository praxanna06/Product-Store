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
            chatflowid="139197a5-0c60-4014-892e-58b422bd4e08"
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
