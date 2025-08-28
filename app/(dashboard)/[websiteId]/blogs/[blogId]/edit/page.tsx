"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditorContent, useEditor } from "@tiptap/react";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered, Quote, Redo, Undo } from "lucide-react";

// Mock data - in real app this would come from API
const mockBlog = {
  id: 1,
  title: "Getting Started with Our Platform",
  slug: "getting-started-with-our-platform",
  content:
    "This is a comprehensive guide to help you get started with our platform. We'll cover all the basics you need to know...",
  author: "John Doe",
  status: "published",
  category: "Tutorial",
  tags: ["beginner", "guide"],
};

const mockCategories = ["Tutorial", "Guide", "Tips", "News", "Updates"];
const mockTags = ["beginner", "guide", "advanced", "features", "content", "writing", "tips"];

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params.websiteId as string;
  const blogId = params.blogId as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("draft");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const editor = useEditor({
    // extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Load blog data on mount
  useEffect(() => {
    // In real app, fetch blog data by ID
    setTitle(mockBlog.title);
    setSlug(mockBlog.slug);
    setContent(mockBlog.content);
    setAuthor(mockBlog.author);
    setStatus(mockBlog.status);
    setCategory(mockBlog.category);
    setSelectedTags(mockBlog.tags);

    // Update editor content
    if (editor) {
      editor.commands.setContent(mockBlog.content);
    }
  }, [blogId, editor]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    // In real app, this would update the blog via API
    console.log("Updating blog:", { title, slug, content, author, status, category, selectedTags });
    router.push(`/project/${websiteId}/blogs`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/project/${websiteId}/blogs`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog</h1>
          <p className="text-muted-foreground mt-2">Update your blog article</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="blog-url-slug" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="border rounded-md">
                  {/* Editor Toolbar */}
                  <div className="border-b p-2 flex gap-1 flex-wrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={editor?.isActive("bold") ? "bg-muted" : ""}>
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={editor?.isActive("italic") ? "bg-muted" : ""}>
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={editor?.isActive("bulletList") ? "bg-muted" : ""}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={editor?.isActive("orderedList") ? "bg-muted" : ""}>
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      className={editor?.isActive("blockquote") ? "bg-muted" : ""}>
                      <Quote className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().undo().run()}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      // onClick={() => editor?.chain().focus().redo().run()}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Editor Content */}
                  <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none p-4 min-h-[400px] focus-within:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="space-y-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category"
                      className="flex-1"
                    />
                    <Button onClick={handleAddCategory} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Suggested:</span>
                    <div className="flex flex-wrap gap-2">
                      {mockTags
                        .filter((tag) => !selectedTags.includes(tag))
                        .slice(0, 5)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer text-xs"
                            onClick={() => setSelectedTags([...selectedTags, tag])}>
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Blog
            </Button>
            <Link href={`/project/${websiteId}/blogs`} className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
