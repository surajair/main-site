"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Calendar, Edit, Plus, Search, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const mockBlogs = [
  {
    id: 1,
    title: "Getting Started with Our Platform",
    author: "John Doe",
    status: "published",
    date: "2024-01-15",
    category: "Tutorial",
    tags: ["beginner", "guide"],
  },
  {
    id: 2,
    title: "Advanced Features Guide",
    author: "Jane Smith",
    status: "draft",
    date: "2024-01-12",
    category: "Guide",
    tags: ["advanced", "features"],
  },
  {
    id: 3,
    title: "Best Practices for Content Creation",
    author: "Mike Johnson",
    status: "published",
    date: "2024-01-10",
    category: "Tips",
    tags: ["content", "writing"],
  },
];

export default function BlogsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = mockBlogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-muted-foreground mt-2">Manage your blog articles</p>
        </div>
        <Link href={`/project/${websiteId}/blogs/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Blog
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{blog.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {blog.date}
                    </div>
                    <Badge variant={blog.status === "published" ? "default" : "secondary"}>{blog.status}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/project/${websiteId}/blogs/${blog.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {blog.category}
                </Badge>
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No blogs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first blog."}
            </p>
            <Link href={`/project/${websiteId}/blogs/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
