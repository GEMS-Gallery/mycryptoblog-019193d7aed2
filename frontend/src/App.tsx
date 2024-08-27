import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

type PostType = 'standard' | 'video';

type Post = {
  id: bigint;
  postType: PostType;
  title: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  timestamp: bigint;
};

type FormData = {
  postType: PostType;
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const { control, handleSubmit, reset, setValue, watch } = useForm<FormData>();

  const postType = watch('postType');

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
        const result = await backend.editPost(
          editingPost.id,
          { [data.postType]: null },
          data.title,
          data.content,
          data.imageUrl ? [data.imageUrl] : [],
          data.videoUrl ? [data.videoUrl] : []
        );
        if ('ok' in result) {
          console.log('Post edited successfully');
          setEditingPost(null);
        } else {
          console.error('Error editing post:', result.err);
        }
      } else {
        const result = await backend.createPost(
          { [data.postType]: null },
          data.title,
          data.content,
          data.imageUrl ? [data.imageUrl] : [],
          data.videoUrl ? [data.videoUrl] : []
        );
        if ('ok' in result) {
          console.log('Post created successfully');
          setIsNewPostDialogOpen(false);
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
    setValue('postType', post.postType);
    setValue('title', post.title);
    setValue('content', post.content);
    setValue('imageUrl', post.imageUrl || '');
    setValue('videoUrl', post.videoUrl || '');
  };

  const handleCloseEdit = () => {
    setEditingPost(null);
    reset();
  };

  const handleOpenNewPostDialog = () => {
    setIsNewPostDialogOpen(true);
    reset();
    setValue('postType', 'standard');
  };

  const handleCloseNewPostDialog = () => {
    setIsNewPostDialogOpen(false);
    reset();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Dominic Williams Unchained
      </Typography>

      <Button onClick={handleOpenNewPostDialog} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        New Post
      </Button>

      {posts.map((post) => (
        <StyledCard key={Number(post.id)}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
            </Typography>
            {post.postType === 'standard' && post.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt={post.title}
              />
            )}
            {post.postType === 'video' && post.videoUrl && (
              <CardMedia
                component="iframe"
                height="315"
                src={post.videoUrl}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
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

      <Dialog open={isNewPostDialogOpen || !!editingPost} onClose={editingPost ? handleCloseEdit : handleCloseNewPostDialog}>
        <DialogTitle>{editingPost ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="postType"
              control={control}
              defaultValue="standard"
              rules={{ required: 'Post type is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Post Type</InputLabel>
                  <Select {...field}>
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
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
            {postType === 'standard' && (
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
            )}
            {postType === 'video' && (
              <Controller
                name="videoUrl"
                control={control}
                defaultValue=""
                rules={{ required: 'Video URL is required for video posts' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Video URL"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={editingPost ? handleCloseEdit : handleCloseNewPostDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
            {editingPost ? 'Update' : 'Create Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
