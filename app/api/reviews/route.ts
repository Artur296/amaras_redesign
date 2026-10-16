import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent } from "@/lib/content";
import { commitFiles, githubConfig } from "@/lib/github";
import type { Review } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Persistent memory buffer across warm invocations in serverless / node runtime
const globalReviewsCache = ((globalThis as any).__amarasReviewsCache ||
  ((globalThis as any).__amarasReviewsCache = new Map<string, Review>())) as Map<
  string,
  Review
>;

export async function GET() {
  try {
    let allReviews: Review[] = [];
    try {
      const p = path.join(process.cwd(), "content", "reviews.json");
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf8");
        allReviews = JSON.parse(raw);
      }
    } catch {}

    if (!allReviews.length) {
      const { reviews } = await getContent();
      allReviews = reviews || [];
    }

    // Merge in any reviews stored in the runtime cache
    const map = new Map<string, Review>();
    for (const [id, r] of globalReviewsCache.entries()) {
      map.set(id, r);
    }
    for (const r of allReviews) {
      if (!map.has(r.id)) {
        map.set(r.id, r);
      }
    }

    const merged = Array.from(map.values()).filter((r) => r.approved !== false);

    // Sort newest first
    merged.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date || 0).getTime();
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date || 0).getTime();
      return tB - tA;
    });

    return NextResponse.json(
      { reviews: merged },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
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
    const guideName = typeof body.guideName === "string" ? body.guideName.trim() : "";

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
      guideName: guideName.slice(0, 80),
      text: text.slice(0, 1200),
      date: new Date().toISOString().split("T")[0],
      approved: true, // Immediately approved and published!
      createdAt: new Date().toISOString(),
    };

    // Store in global in-memory buffer immediately for zero-delay visibility
    globalReviewsCache.set(newReview.id, newReview);

    // Load existing reviews
    let existingReviews: Review[] = [];
    try {
      const p = path.join(process.cwd(), "content", "reviews.json");
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf8");
        existingReviews = JSON.parse(raw);
      }
    } catch {}

    if (!existingReviews.length) {
      const content = await getContent();
      existingReviews = content.reviews || [];
    }

    const allReviews: Review[] = [
      newReview,
      ...existingReviews.filter((r) => r.id !== newReview.id),
    ];

    // 1. Try local write
    try {
      const p = path.join(process.cwd(), "content", "reviews.json");
      await fs.promises.writeFile(p, `${JSON.stringify(allReviews, null, 2)}\n`, "utf8");
    } catch (fsErr) {
      console.warn("Local reviews.json write skipped (read-only):", fsErr);
    }

    // 2. Revalidate cached pages immediately
    try {
      revalidatePath("/", "layout");
      revalidatePath("/ru");
      revalidatePath("/hy");
      revalidatePath("/en");
    } catch (e) {
      console.warn("Reviews revalidatePath error:", e);
    }

    // 3. Try GitHub commit if configured
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
          `reviews: new review from ${newReview.author}`
        );
      } catch (ghErr) {
        console.warn("GitHub commit for new review failed:", ghErr);
      }
    }

    return NextResponse.json({
      ok: true,
      review: newReview,
      message: "Спасибо за ваш отзыв! Он успешно опубликован на сайте.",
    });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже." },
      { status: 500 }
    );
  }
}
