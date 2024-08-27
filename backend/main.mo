import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Time "mo:base/Time";

actor {
  public type PostType = {
    #standard;
    #video;
  };

  public type Post = {
    id: Nat;
    postType: PostType;
    title: Text;
    content: Text;
    imageUrl: ?Text;
    videoUrl: ?Text;
    timestamp: Int;
  };

  stable var posts: [Post] = [];
  stable var nextId: Nat = 0;

  public func createPost(postType: PostType, title: Text, content: Text, imageUrl: ?Text, videoUrl: ?Text): async Result.Result<Nat, Text> {
    let post: Post = {
      id = nextId;
      postType = postType;
      title = title;
      content = content;
      imageUrl = imageUrl;
      videoUrl = videoUrl;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    #ok(post.id)
  };

  public query func getPosts(): async [Post] {
    Array.reverse(posts)
  };

  public func editPost(id: Nat, postType: PostType, newTitle: Text, newContent: Text, newImageUrl: ?Text, newVideoUrl: ?Text): async Result.Result<(), Text> {
    let postIndex = Array.indexOf<Post>({ id = id; postType = #standard; title = ""; content = ""; imageUrl = null; videoUrl = null; timestamp = 0 }, posts, func(a, b) { a.id == b.id });
    switch (postIndex) {
      case (null) {
        #err("Post not found")
      };
      case (?index) {
        let updatedPost: Post = {
          id = id;
          postType = postType;
          title = newTitle;
          content = newContent;
          imageUrl = newImageUrl;
          videoUrl = newVideoUrl;
          timestamp = Time.now();
        };
        posts := Array.tabulate<Post>(posts.size(), func (i) {
          if (i == index) { updatedPost } else { posts[i] }
        });
        #ok()
      };
    }
  };
}
