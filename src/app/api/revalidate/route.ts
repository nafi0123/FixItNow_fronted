import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tag, tags, path } = body;

    if (tag) {
      try {
        (revalidateTag as any)(tag);
      } catch (err) {
        console.error("Failed to revalidate tag:", tag, err);
      }
    }

    if (Array.isArray(tags)) {
      for (const t of tags) {
        try {
          (revalidateTag as any)(t);
        } catch (err) {
          console.error("Failed to revalidate tag:", t, err);
        }
      }
    }

    if (path) {
      try {
        revalidatePath(path);
      } catch (err) {
        console.error("Failed to revalidate path:", path, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cache revalidated successfully",
      tag,
      tags,
      path,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error in revalidate route:", error);
    return NextResponse.json(
      { success: false, message: "Error revalidating cache" },
      { status: 500 }
    );
  }
}
