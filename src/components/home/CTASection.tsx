import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <div className="grid gap-6 rounded-[2.5rem] border border-clay-200 bg-paper-100 p-10 text-center sm:grid-cols-2 sm:gap-10 sm:p-14 sm:text-left">
          <div>
            <h3 className="font-display text-2xl italic text-clay-900">
              See something you love?
            </h3>
            <p className="mt-2 text-sm text-clay-800/70">
              Some pieces are one of a kind and ready to go home with you.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-block rounded-full bg-clay-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-700"
            >
              Shop the collection
            </Link>
          </div>
          <div className="sm:border-l sm:border-clay-200 sm:pl-10">
            <h3 className="font-display text-2xl italic text-clay-900">
              Want your own?
            </h3>
            <p className="mt-2 text-sm text-clay-800/70">
              Send a photo, a colour, an idea — she&rsquo;ll make something
              made just for you.
            </p>
            <Link
              href="/commission"
              className="mt-5 inline-block rounded-full border border-clay-400 px-6 py-2.5 text-sm font-medium text-clay-800 hover:border-clay-600"
            >
              Request a commission
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
