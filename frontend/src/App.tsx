import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { control, handleSubmit, reset, setValue } = useForm<FormData>();

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
      if (editingPost) {
        const result = await backend.editPost(editingPost.id, data.title, data.content, data.imageUrl ? [data.imageUrl] : []);
        if ('ok' in result) {
          console.log('Post edited successfully');
          setEditingPost(null);
        } else {
          console.error('Error editing post:', result.err);
        }
      } else {
        const result = await backend.createPost(data.title, data.content, data.imageUrl ? [data.imageUrl] : []);
        if ('ok' in result) {
          console.log('Post created successfully');
        } else {
          console.error('Error creating post:', result.err);
        }
      }
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating/editing post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setValue('title', post.title);
    setValue('content', post.content);
    setValue('imageUrl', post.imageUrl || '');
  };

  const handleCloseEdit = () => {
    setEditingPost(null);
    reset();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Dominic Williams Unchained
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
          {editingPost ? 'Update Post' : 'Create Post'}
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
            <Button onClick={() => handleEdit(post)} variant="outlined" color="primary">
              Edit
            </Button>
          </CardContent>
        </StyledCard>
      ))}

      <Dialog open={!!editingPost} onClose={handleCloseEdit}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
