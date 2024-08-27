export const idlFactory = ({ IDL }) => {
  const PostType = IDL.Variant({ 'video' : IDL.Null, 'standard' : IDL.Null });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'postType' : PostType,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'imageUrl' : IDL.Opt(IDL.Text),
    'timestamp' : IDL.Int,
    'videoUrl' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'createPost' : IDL.Func(
        [PostType, IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'editPost' : IDL.Func(
        [
          IDL.Nat,
          PostType,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [Result],
        [],
      ),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
