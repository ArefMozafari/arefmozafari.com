export type PackageScore = { points: number; likes: number; downloads30Days: number };

const PUB_DEV_API = 'https://pub.dev/api/packages/';

/// Fetches the pub.dev score of a package. Returns null on any failure so an
/// unreachable pub.dev renders the row without a count.
export async function fetchPackageScore(
  name: string,
  fetchImplementation: typeof fetch = fetch,
): Promise<PackageScore | null> {
  try {
    const response = await fetchImplementation(`${PUB_DEV_API}${name}/score`);
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as {
      grantedPoints?: number;
      likeCount?: number;
      downloadCount30Days?: number;
    };
    return {
      points: payload.grantedPoints ?? 0,
      likes: payload.likeCount ?? 0,
      downloads30Days: payload.downloadCount30Days ?? 0,
    };
  } catch {
    return null;
  }
}
