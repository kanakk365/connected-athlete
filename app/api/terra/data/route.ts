import { NextRequest, NextResponse } from "next/server";
import { TERRA_BASE, terraHeaders } from "@/lib/terra/config";

/**
 * Terra processes requests spanning >28 days asynchronously (via webhooks).
 * To keep our frontend synchronous, we split large date ranges into ≤28-day
 * chunks, fetch each chunk with `to_webhook=false`, and merge the results.
 */

const MAX_CHUNK_DAYS = 28;

/** Split a date range into chunks of at most `maxDays` days. */
function chunkDateRange(
  start: string,
  end: string,
  maxDays: number,
): Array<{ start: string; end: string }> {
  const chunks: Array<{ start: string; end: string }> = [];
  let cursor = new Date(start + "T00:00:00Z");
  const endDate = new Date(end + "T00:00:00Z");

  while (cursor <= endDate) {
    const chunkEnd = new Date(
      Math.min(
        cursor.getTime() + maxDays * 24 * 60 * 60 * 1000,
        endDate.getTime(),
      ),
    );
    chunks.push({
      start: cursor.toISOString().split("T")[0],
      end: chunkEnd.toISOString().split("T")[0],
    });
    // Move cursor to the day after chunkEnd to avoid overlap
    cursor = new Date(chunkEnd.getTime() + 24 * 60 * 60 * 1000);
  }

  return chunks;
}

/**
 * GET /api/terra/data?user_id=xxx&type=daily|sleep|body|nutrition|activity&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 *
 * Proxies a request to Terra's REST API to fetch health data for a given user.
 * Automatically chunks large date ranges (>28 days) to avoid Terra's async
 * large-request processing, ensuring data is always returned synchronously.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const type = searchParams.get("type") || "daily";
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    // Default to last 7 days if no dates provided
    const now = new Date();
    const defaultEnd = now.toISOString().split("T")[0];
    const defaultStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const resolvedStart = startDate || defaultStart;
    const resolvedEnd = endDate || defaultEnd;

    // Split into ≤28-day chunks to stay under Terra's sync threshold
    const chunks = chunkDateRange(resolvedStart, resolvedEnd, MAX_CHUNK_DAYS);

    // Fetch all chunks in parallel
    const chunkResults = await Promise.all(
      chunks.map(async (chunk) => {
        const params = new URLSearchParams({
          user_id: userId,
          start_date: chunk.start,
          end_date: chunk.end,
          to_webhook: "false",
        });

        const terraUrl = `${TERRA_BASE}/${type}?${params.toString()}`;
        const res = await fetch(terraUrl, {
          method: "GET",
          headers: terraHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          console.warn(
            `Terra chunk fetch failed for ${type} [${chunk.start} - ${chunk.end}]:`,
            data,
          );
          return { data: [] };
        }

        return data;
      }),
    );

    // Merge data arrays from all chunks
    const mergedData = chunkResults.flatMap(
      (result) => result.data || [],
    );

    return NextResponse.json({ data: mergedData });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
