export interface Comment {
  content: string | null;
  authorName: string;
  date: string;
  blogId: string;
}

export interface Blog {
  key: string;
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  date: string;
  authorName: string;
  authorId: string;
  comments: Comment[];
}
