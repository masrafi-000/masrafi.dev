import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    
    // Use token if available in env to increase rate limits
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const username = "masrafi-000";

    // Fetch user and repos concurrently with Axios
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers }),
    ]);

    const user = userRes.data;
    const reposData = reposRes.data;
    
    // Filter out essential data only to reduce the payload size
    interface RepoPayload {
      id: number;
      name: string;
      description: string;
      html_url: string;
      stargazers_count: number;
      language: string;
      updated_at: string;
    }
    
    const repos = reposData.map((repo: RepoPayload) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      updated_at: repo.updated_at,
    }));

    return NextResponse.json({ user, repos });
  } catch (error) {
    console.error("GitHub API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data. You may be rate limited." },
      { status: 500 }
    );
  }
}
