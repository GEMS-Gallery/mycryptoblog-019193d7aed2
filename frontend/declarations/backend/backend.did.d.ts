import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Post {
  'id' : bigint,
  'postType' : PostType,
  'title' : string,
  'content' : string,
  'imageUrl' : [] | [string],
  'timestamp' : bigint,
  'videoUrl' : [] | [string],
}
export type PostType = { 'video' : null } |
  { 'standard' : null };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'createPost' : ActorMethod<
    [PostType, string, string, [] | [string], [] | [string]],
    Result_1
  >,
  'editPost' : ActorMethod<
    [bigint, PostType, string, string, [] | [string], [] | [string]],
    Result
  >,
  'getPosts' : ActorMethod<[], Array<Post>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
