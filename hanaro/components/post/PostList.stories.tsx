import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostList from "./PostList";

const meta: Meta<typeof PostList> = {
  title: "Post/PostList",
  component: PostList,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof PostList>;

const mockPosts = [
  {
    id: 1,
    title: "첫 번째 게시글",
    content:
      "이것은 첫 번째 게시글 내용입니다. Storybook에서 미리보기용으로 작성된 더미 텍스트입니다.",
    createdAt: new Date("2026-03-01"),
    PostCategory: [
      { Category: { id: 1, title: "JS" } },
      { Category: { id: 2, title: "React" } },
    ],
    _count: {
      Comment: 3,
      Likes: 5,
    },
  },
  {
    id: 2,
    title: "두 번째 게시글",
    content:
      "두 번째 게시글입니다. line-clamp가 어떻게 동작하는지 확인하기 위한 조금 더 긴 내용입니다.",
    createdAt: new Date("2026-06-15"),
    PostCategory: [{ Category: { id: 3, title: "Next" } }],
    _count: {
      Comment: 0,
      Likes: 1,
    },
  },
];

export const Default: Story = {
  args: {
    posts: mockPosts,
  },
};

export const Empty: Story = {
  args: {
    posts: [],
  },
};
