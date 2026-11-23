import Link from "next/link";
import FeaturedProperties from "@/components/FeaturedProperties";

const categories = [
  {
    title: "Land",
    description: "Residential plots and open land",
    image: "/image/land.jpg",
    href: "/properties?type=LAND",
  },
  {
    title: "House",
    description: "Beautiful homes for your family",
    image: "/image/house.jpg",
    href: "/properties?type=HOUSE",
  },
  {
    title: "Field",
    description: "Agricultural and farming properties",
    image: "/image/field.jpg",
    href: "/properties?type=FIELD",
  },
  {
    title: "Shop",
    description: "Shops and commercial spaces",
    image: "/image/shop.jpg",
    href: "/properties?type=SHOP",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#F5F3EE] text-[#1F2937]">



      <section className="relative min-h-[780px]">

        {/* Hero Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/image/land1.avif')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[780px] max-w-7xl items-center px-6 pb-32 pt-32 lg:px-8">

          <div className="max-w-4xl text-white">

            <div className="mb-6 flex items-center gap-3">

              <span className="h-px w-12 bg-[#C59D5F]" />

              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E4C27A]">
                SBM LAND HUB
              </span>

            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
              Find a place

              <span className="block text-[#DDB86A]">
                worth calling yours.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Discover land, houses, agricultural fields and
              commercial properties with SBM LAND HUB.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                href="/properties"
                className="rounded-full bg-[#C59D5F] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#1F2937]"
              >
                Explore Properties
              </Link>

              <Link
                href="/sell"
                className="rounded-full border border-white/50 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1F2937]"
              >
                Sell Your Property
              </Link>

            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH BOX
        ================================================== */}

        <div className="absolute bottom-[-105px] left-0 right-0 z-20 px-6">

          <div className="mx-auto max-w-6xl rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-7">

            <div className="mb-5">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B88A44]">
                Property Search
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#1F2937]">
                What are you looking for?
              </h2>

            </div>

            <form className="grid gap-3 md:grid-cols-4">

              {/* PROPERTY TYPE */}

              <div className="rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3">

                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Property Type
                </label>

                <select
                  name="type"
                  className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="">
                    All Properties
                  </option>

                  <option value="LAND">
                    Land
                  </option>

                  <option value="HOUSE">
                    House
                  </option>

                  <option value="FIELD">
                    Field
                  </option>

                  <option value="SHOP">
                    Shop
                  </option>

                  <option value="COMMERCIAL">
                    Commercial
                  </option>
                </select>

              </div>

              {/* LOCATION */}

              <div className="rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3">

                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="City, district or area"
                  className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal"
                />

              </div>

              {/* BUDGET */}

              <div className="rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3">

                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Budget
                </label>

                <input
                  type="text"
                  name="maxPrice"
                  placeholder="Maximum price"
                  className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal"
                />

              </div>

              {/* SEARCH BUTTON */}

              <button
                type="submit"
                className="rounded-xl bg-[#1F2937] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
              >
                Search Properties
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROPERTY CATEGORIES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-44 lg:px-8">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
              Explore Properties
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2937] sm:text-5xl">
              Find what fits your future.
            </h2>

          </div>

          <Link
            href="/properties"
            className="font-semibold text-[#1F2937] underline decoration-[#C59D5F] decoration-2 underline-offset-4 transition hover:text-[#B88A44]"
          >
            View all properties →
          </Link>

        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (

            <Link
              key={category.title}
              href={category.href}
              className="group relative h-[390px] overflow-hidden rounded-3xl bg-[#1F2937]"
            >

              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute bottom-0 p-7 text-white">

                <p className="text-3xl font-semibold">
                  {category.title}
                </p>

                <p className="mt-2 text-sm text-white/70">
                  {category.description}
                </p>

                <span className="mt-5 inline-block text-sm font-bold text-[#E2BD70]">
                  Explore →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* =====================================================
          FEATURED PROPERTIES
      ====================================================== */}

      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
              Featured Properties
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2937] sm:text-5xl">
              Properties worth seeing
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
              Explore selected properties available through
              SBM LAND HUB.
            </p>

          </div>

          <FeaturedProperties />

        </div>

      </section>


      {/* =====================================================
          ABOUT / TRUST
      ====================================================== */}

      <section className="bg-[#1F2937] text-white">

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-8">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#DDB86A]">
              Why SBM LAND HUB
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Property decisions should feel simple.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-white/65">
              Whether you are looking to buy your first home,
              invest in land, find agricultural property or
              sell your existing property, SBM LAND HUB
              connects you with opportunities that matter.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-block rounded-full bg-[#C59D5F] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#1F2937]"
            >
              Learn About Us
            </Link>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {[
              [
                "01",
                "Trusted Listings",
                "Property information presented clearly.",
              ],
              [
                "02",
                "Local Knowledge",
                "Better understanding of local property markets.",
              ],
              [
                "03",
                "Personal Support",
                "Help throughout your property journey.",
              ],
              [
                "04",
                "Easy Enquiries",
                "Quickly connect with our team.",
              ],
            ].map(([number, title, description]) => (

              <div
                key={number}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#C59D5F]/50"
              >

                <span className="text-sm font-bold text-[#DDB86A]">
                  {number}
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          SELL CTA
      ====================================================== */}

      <section className="bg-[#C59D5F]">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1F2937]">
            Have a Property?
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2937] sm:text-5xl">
            Turn your property into an opportunity.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[#1F2937]/70">
            Tell us about your land, house, field or shop and
            let SBM LAND HUB help you connect with potential
            buyers.
          </p>

          <Link
            href="/sell"
            className="mt-8 inline-block rounded-full bg-[#1F2937] px-8 py-4 text-sm font-bold text-white transition hover:bg-black"
          >
            List Your Property
          </Link>

        </div>

      </section>

    </main>
  );
}
