import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { commitFiles, githubConfig } from "@/lib/github";
import type { Review } from "@/lib/reviews";

export async function GET() {
  try {
    const { reviews } = await getContent();
    const approved = (reviews || []).filter((r) => r.approved !== false);
    return NextResponse.json({ reviews: approved });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const author = typeof body.author === "string" ? body.author.trim() : "";
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating) || 5)));
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const tourTitle = typeof body.tourTitle === "string" ? body.tourTitle.trim() : "";

    if (!author) {
      return NextResponse.json(
        { error: "Пожалуйста, укажите ваше имя." },
        { status: 400 }
      );
    }

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Текст отзыва слишком короткий." },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: author.slice(0, 80),
      location: location.slice(0, 60),
      rating,
      tourTitle: tourTitle.slice(0, 100),
      text: text.slice(0, 1200),
      date: new Date().toISOString().split("T")[0],
      approved: false, // Awaiting admin approval
      createdAt: new Date().toISOString(),
    };

    // Load existing reviews
    const content = await getContent();
    const allReviews: Review[] = [newReview, ...(content.reviews || [])];

    // 1. Try local write
    try {
      const p = path.join(process.cwd(), "content", "reviews.json");
      await fs.promises.writeFile(p, `${JSON.stringify(allReviews, null, 2)}\n`, "utf8");
    } catch (fsErr) {
      console.warn("Local reviews.json write skipped (read-only):", fsErr);
    }

    // 2. Try GitHub commit if configured
    const cfg = githubConfig();
    if (cfg) {
      try {
        await commitFiles(
          cfg,
          [
            {
              path: "content/reviews.json",
              content: `${JSON.stringify(allReviews, null, 2)}\n`,
            },
          ],
          `reviews: new pending review from ${newReview.author}`
        );
      } catch (ghErr) {
        console.warn("GitHub commit for new review failed:", ghErr);
      }
    }

    return NextResponse.json({
      ok: true,
      message:
        "Спасибо за ваш отзыв! Он появится на сайте сразу после проверки администратором.",
    });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже." },
      { status: 500 }
    );
  }
}
