import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

type Post = {
  id: bigint;
  title: string;
  content: string;
  imageUrl: string | null;
  timestamp: bigint;
};

type FormData = {
  title: string;
  content: string;
  imageUrl: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { control, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await backend.createPost(data.title, data.content, data.imageUrl ? [data.imageUrl] : []);
      if ('ok' in result) {
        console.log('Post created successfully');
        reset();
        fetchPosts();
      } else {
        console.error('Error creating post:', result.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Hacker Blog
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="content"
          control={control}
          defaultValue=""
          rules={{ required: 'Content is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="imageUrl"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Image URL (optional)"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Post
        </Button>
      </form>

      {posts.map((post) => (
        <StyledCard key={Number(post.id)}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
            </Typography>
            {post.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt={post.title}
              />
            )}
            <Typography variant="body1" paragraph>
              {post.content}
            </Typography>
          </CardContent>
        </StyledCard>
      ))}
    </Container>
  );
}

export default App;
