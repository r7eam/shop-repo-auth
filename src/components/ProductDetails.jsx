import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  IconButton,
  Card,
  CardMedia,
} from '@mui/material';
import {
  ArrowBack,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import { productsAPI } from '../api/productsAPI';
import { productImagesAPI } from '../api/productImagesAPI';
import ImageWithFallback from './ImageWithFallback';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchProductImages();
    }
  }, [id, fetchProduct, fetchProductImages]);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      const data = response.data;

      // Handle different response structures
      let productData;
      if (data.data) {
        productData = data.data;
      } else {
        productData = data;
      }

      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchProductImages = useCallback(async () => {
    try {
      const response = await productImagesAPI.getByProductId(id);
      const data = response.data;

      // Handle different response structures
      let imagesData;
      if (data.data && data.data.data) {
        imagesData = data.data.data;
      } else if (data.data) {
        imagesData = data.data;
      } else {
        imagesData = data;
      }

      const imagesList = Array.isArray(imagesData) ? imagesData : [];
      // Sort images to put primary first
      const sortedImages = imagesList.sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return 0;
      });

      setImages(sortedImages);
    } catch (error) {
      console.error('Error fetching product images:', error);
      setImages([]);
    }
  }, [id]);

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant='h4'>Loading product...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant='h4' gutterBottom>
            {error || 'Product not found'}
          </Typography>
          <Button
            variant='contained'
            onClick={() => navigate('/products')}
            startIcon={<ArrowBack />}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              {/* Main Image */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                {selectedImage ? (
                  <img
                    src={selectedImage.imageUrl || selectedImage.url}
                    alt={selectedImage.altText || product.name}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <ImageWithFallback
                    src=''
                    alt={product.name}
                    width='100%'
                    height='400px'
                    fallbackText='No Image Available'
                    style={{ borderRadius: '8px' }}
                  />
                )}

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                      }}
                    >
                      <NavigateBefore />
                    </IconButton>
                    <IconButton
                      onClick={nextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                      }}
                    >
                      <NavigateNext />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <Grid container spacing={1}>
                  {images.map((image, index) => (
                    <Grid size={{ xs: 3 }} key={image.id || index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedImageIndex === index ? 2 : 0,
                          borderColor: 'primary.main',
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <CardMedia
                          component='img'
                          height='80'
                          image={image.imageUrl || image.url}
                          alt={image.altText}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Product Info Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              {/* Product Name */}
              <Typography variant='h4' gutterBottom>
                {product.name || 'Unnamed Product'}
              </Typography>

              {/* Category */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={
                    product.categoryName ||
                    (product.category && typeof product.category === 'object'
                      ? product.category.name
                      : product.category) ||
                    'No Category'
                  }
                  color='primary'
                  variant='outlined'
                />
              </Box>

              {/* Price */}
              <Typography variant='h5' color='primary' sx={{ mb: 2 }}>
                ${product.price || '0.00'}
                {product.discount > 0 && (
                  <Typography
                    component='span'
                    variant='body2'
                    sx={{
                      ml: 2,
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    $
                    {(
                      parseFloat(product.price) + parseFloat(product.discount)
                    ).toFixed(2)}
                  </Typography>
                )}
              </Typography>

              {/* Stock Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </Typography>
              </Box>

              {/* Description */}
              <Typography variant='body1' sx={{ mb: 4 }}>
                {product.description || 'No description available.'}
              </Typography>

              {/* Back to Products Button */}
              <Button
                variant='contained'
                size='large'
                startIcon={<ArrowBack />}
                onClick={() => navigate('/products')}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Back to Products
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;
