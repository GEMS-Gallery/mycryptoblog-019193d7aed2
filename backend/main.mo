import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Time "mo:base/Time";

actor {
  // Define the Post type
  public type Post = {
    id: Nat;
    title: Text;
    content: Text;
    imageUrl: ?Text;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts: [Post] = [];
  stable var nextId: Nat = 0;

  // Create a new post
  public func createPost(title: Text, content: Text, imageUrl: ?Text): async Result.Result<Nat, Text> {
    let post: Post = {
      id = nextId;
      title = title;
      content = content;
      imageUrl = imageUrl;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    #ok(post.id)
  };

  // Get all posts in reverse chronological order
  public query func getPosts(): async [Post] {
    Array.reverse(posts)
  };

  // Edit an existing post
  public func editPost(id: Nat, newTitle: Text, newContent: Text, newImageUrl: ?Text): async Result.Result<(), Text> {
    let postIndex = Array.indexOf<Post>({ id = id; title = ""; content = ""; imageUrl = null; timestamp = 0 }, posts, func(a, b) { a.id == b.id });
    switch (postIndex) {
      case (null) {
        #err("Post not found")
      };
      case (?index) {
        let updatedPost: Post = {
          id = id;
          title = newTitle;
          content = newContent;
          imageUrl = newImageUrl;
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
