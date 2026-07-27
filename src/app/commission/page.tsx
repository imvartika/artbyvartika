import Reveal from "@/components/Reveal";
import RequestForm from "@/components/shop/RequestForm";
import HandTag from "@/components/HandTag";

export default function CommissionPage() {
  return (
    <div className="watercolor mx-auto max-w-2xl px-6 py-20">
      <Reveal>
        <HandTag color="terracotta" rotate={-2}>commission</HandTag>
        <h1 className="mt-1 font-display text-4xl italic text-clay-900 sm:text-5xl">
          Made just for you.
        </h1>
        <p className="mt-4 text-clay-800/70">
          A clay figure of your pet, a sketch from your favourite photo, a
          crocheted something for someone you love — tell her what you have
          in mind and she&rsquo;ll get back to you.
        </p>
      </Reveal>

      <div className="relative mt-10 border border-clay-200 bg-white p-8 shadow-[0_10px_30px_rgba(74,55,40,0.08)]">
        <p
          className="font-hand absolute -top-5 left-8 rounded bg-paper-50 px-2 text-2xl text-clay-600"
          style={{ transform: "rotate(-2deg)" }}
        >
          promise, no scary forms →
        </p>
        <RequestForm type="commission" />
      </div>
    </div>
  );
}
