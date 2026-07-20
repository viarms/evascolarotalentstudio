// src/app/classes/layout.tsx
// Layout for all /classes/* routes.
// Provides the white content card that wraps class pages.
// Kept here so the homepage and other future pages are not affected.

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex-1 w-full"
      style={{ background: "linear-gradient(to bottom, #121212 0%, #121212 33vh, #ffffff 33vh, #ffffff 100%)" }}
    >
      <div className="w-full max-w-[960px] mx-auto my-6 md:my-10 px-4 sm:px-6">
        <div className="bg-white text-gray-900 rounded-sm shadow-lg px-6 py-10 sm:px-10 md:px-16 md:py-14 min-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
