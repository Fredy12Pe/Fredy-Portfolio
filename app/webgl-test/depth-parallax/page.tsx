import Link from "next/link";
import { DepthParallax } from "@/components/ui/depth-parallax";

// Preview page for the depth parallax component until it has a home on the site
export default function DepthParallaxPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <header className="space-y-3">
          <Link
            href="/webgl-test"
            className="inline-block text-sm text-neutral-400 transition hover:text-white"
          >
            ← Back to the lab
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Depth parallax</h1>
          <p className="max-w-xl text-neutral-400">
            A photo shifted per pixel by its depth map as the cursor moves over it.
          </p>
        </header>

        <DepthParallax
          src="/images/depth-parallax/teal.webp"
          depthSrc="/images/depth-parallax/teal-depth.png"
          alt="Motion-blurred crowd in teal tones"
        />

        <DepthParallax
          src="/images/depth-parallax/aquarium.webp"
          depthSrc="/images/depth-parallax/aquarium-depth.png"
          alt="Silhouetted visitors in front of a large green aquarium window"
        />
      </div>
    </main>
  );
}
