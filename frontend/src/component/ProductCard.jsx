import {
  Box,
  Image,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Spinner,
  Textarea,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { PiSparkleBold } from "react-icons/pi";
import { DeleteIcon, EditIcon, InfoIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { useProductStore } from '../store/product';

const ProductCard = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [analyzingSentiment, setAnalyzingSentiment] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [editValues, setEditValues] = useState({
    name: product.name,
    price: product.price,
    image: product.image,
  });

  const textColor = useColorModeValue('gray.600', 'gray.200');
  const bg = useColorModeValue('white', 'gray.800');

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const infoDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? 'Deleted' : 'Error',
      description: message,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews/${product._id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load reviews.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingReviews(false);
    }
  };

  const submitReview = async () => {
    if (!newReview.trim()) {
      toast({
        title: 'Error',
        description: 'Review cannot be empty.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const res = await fetch(`/api/reviews/${product._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newReview }),
      });
      const data = await res.json();
      setNewReview('');
      setReviews([data.review, ...reviews]);
      toast({
        title: 'Review Added',
        description: 'Your review has been submitted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not submit review.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const analyzeSentiment = async () => {
    setAnalyzingSentiment(true);
    try {
      const res = await fetch(`/api/reviews/sentiment/${product._id}`);
      const data = await res.json();
      setSentimentResult(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Sentiment analysis failed.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setAnalyzingSentiment(false);
    }
  };

  const handleOpenInfo = () => {
    infoDisclosure.onOpen();
    fetchReviews();
  };

  const handleEditProduct = async () => {
    const { name, price, image } = editValues;
    if (!name || !price || !image) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await updateProduct(product._id, editValues);
    toast({
      title: success ? 'Updated' : 'Failed',
      description: message,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
    if (success) editDisclosure.onClose();
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        height="200px"
        width="100%"
        objectFit="cover"
      />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>
        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>
        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} onClick={editDisclosure.onOpen} colorScheme="blue" aria-label="Edit" />
          <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme="red" aria-label="Delete" />
          <IconButton icon={<InfoIcon />} onClick={handleOpenInfo} colorScheme="teal" aria-label="Info" />
        </HStack>
      </Box>

      {/* Info Modal */}
      <Modal isOpen={infoDisclosure.isOpen} onClose={infoDisclosure.onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reviews & Sentiment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Textarea
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <Button onClick={submitReview} colorScheme="blue">
                Submit Review
              </Button>
              <Heading size="md">Customer Reviews:</Heading>
              {loadingReviews ? (
                <Spinner />
              ) : reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <Box key={idx} p={3} bg="gray.500" rounded="md" w="100%">
                    <Text>{rev.text}</Text>
                  </Box>
                ))
              ) : (
                <Text>No reviews yet.</Text>
              )}
              <Button onClick={analyzeSentiment} colorScheme="teal" isLoading={analyzingSentiment}>
                <PiSparkleBold />
              </Button>
              {sentimentResult && (
                <Box bg="gray.500" p={4} rounded="md">
                  <Text><strong>Overall Sentiment Score:</strong> {sentimentResult.score}/10</Text>
                  <Text><strong>Summary:</strong> {sentimentResult.summary}</Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={infoDisclosure.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editDisclosure.isOpen} onClose={editDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={editValues.price}
                  onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={editValues.image}
                  onChange={(e) => setEditValues({ ...editValues, image: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditProduct}>
              Save
            </Button>
            <Button variant="ghost" onClick={editDisclosure.onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
