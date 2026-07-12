import { ImageLightbox } from "@/components/image-lightbox";
import { ComponentPage, Demo, Specs } from "../_component-page";

export default function ImageLightboxDocs() {
  return (
    <ComponentPage
      title="Image Lightbox"
      description="A clickable image that opens full-screen in an overlay. Used for all case-study media."
    >
      <Demo title="Default" caption="Click the image to open the lightbox.">
        <div className="w-full max-w-sm">
          <ImageLightbox
            src="/projects/DSC_3852.jpg"
            alt="Example photo"
            width={1200}
            height={800}
          />
        </div>
      </Demo>

      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">Anatomy</h2>
        </div>
        <Specs
          rows={[
            { part: "Thumbnail", spec: "rounded-lg · w-full · h-auto · cursor-zoom-in" },
            { part: "Overlay scrim", spec: "fixed inset-0 · bg-black/80 · z-50" },
            { part: "Full image", spec: "max-h-[90vh] · max-w-[90vw] · object-contain" },
            { part: "Props", spec: "src · alt · width · height · (fill, sizes, className)" },
          ]}
        />
      </section>
    </ComponentPage>
  );
}
