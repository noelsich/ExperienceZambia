import { useMemo, useState } from 'react'
import {
  Binoculars,
  CalendarDays,
  Compass,
  ExternalLink,
  Filter,
  Flame,
  Handshake,
  Mail,
  Map,
  MapPin,
  Mountain,
  Music2,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Utensils,
  Waves,
  X,
} from 'lucide-react'
import Footer from '../ui/Footer'
import Navbar from '../ui/Navbar'

type CategoryKey =
  | 'delicacies'
  | 'adventure'
  | 'wildlife'
  | 'sightseeing'
  | 'culture'
  | 'nature'
  | 'events'
  | 'markets'
  | 'nightlife'
  | 'community'

type ProvinceKey = 'national' | 'southern' | 'eastern' | 'western'
type LocalProvinceKey = Exclude<ProvinceKey, 'national'>
type SelfExploreLevel = 'None' | 'Guided optional' | 'Zero'

type Provider = {
  name: string
  type: 'Tour operator' | 'Lodge' | 'Community host' | 'Self guide'
  phone: string
  email: string
  bookingUrl: string
  note: string
}

type Experience = {
  title: string
  province: LocalProvinceKey
  category: CategoryKey
  image: string
  price: string
  duration: string
  difficulty: 'Easy' | 'Moderate' | 'High'
  season: 'Dry season' | 'Wet season' | 'Year-round' | 'Calendar event'
  group: string
  selfExplore: SelfExploreLevel
  tags: string[]
  summary: string
  providers: Provider[]
}

type ItineraryPath = {
  title: string
  province: string
  steps: string[]
  meta: string
  providers: Provider[]
}

const categories: Array<{
  key: CategoryKey
  label: string
  icon: typeof Utensils
  national: string
  local: Record<LocalProvinceKey, string>
}> = [
  {
    key: 'delicacies',
    label: 'Delicacies',
    icon: Utensils,
    national: 'Nshima tables, bream, chikanda, village brews, coffee stops, and city food markets.',
    local: {
      southern: 'Zambezi bream, Livingstone cafes, riverside grills, and Victoria Falls market snacks.',
      eastern: 'Groundnut-rich village dishes, seasonal produce, and food stops around Chipata.',
      western: 'Barotse floodplain fish, cassava, local rice, and community-hosted meals.',
    },
  },
  {
    key: 'adventure',
    label: 'Extreme / Adventure',
    icon: Flame,
    national: 'Bungee jumping, white-water rafting, gorge swings, ziplining, and wild-water days.',
    local: {
      southern: 'Victoria Falls bungee, Batoka Gorge swing, rafting, canoe runs, and helicopter flips.',
      eastern: 'Luangwa valley hikes, guided bush walks, escarpment drives, and cycling trails.',
      western: 'Floodplain expeditions, remote 4x4 routes, canoe days, and Liuwa migration camps.',
    },
  },
  {
    key: 'wildlife',
    label: 'Wildlife Tours',
    icon: Binoculars,
    national: 'Classic safaris, walking safaris, birding, boat safaris, and conservation-led visits.',
    local: {
      southern: 'Mosi-oa-Tunya rhino walks, Chobe day trips, Lake Kariba boat safaris, and birding.',
      eastern: 'South Luangwa walking safaris, night drives, leopard country, and river hides.',
      western: 'Liuwa Plain wildebeest migration, hyena sightings, birding, and community camps.',
    },
  },
  {
    key: 'sightseeing',
    label: 'Sightseeing',
    icon: MapPin,
    national: 'Waterfalls, viewpoints, museums, monuments, markets, and landmark photo stops.',
    local: {
      southern: 'Victoria Falls, Livingstone Museum, Knife Edge Bridge, and Zambezi viewpoints.',
      eastern: 'Luangwa valley escarpment, Chipata craft stops, cathedral landmarks, and viewpoints.',
      western: 'Barotse floodplain, Mongu harbor views, royal sites, and wide-open sunset drives.',
    },
  },
  {
    key: 'culture',
    label: 'Culture & Heritage',
    icon: Sparkles,
    national: 'Ceremonies, museums, village visits, heritage routes, storytelling, and royal history.',
    local: {
      southern: 'Livingstone heritage, Tonga cultural visits, railway history, and museum-led tours.',
      eastern: 'Chewa and Nsenga traditions, Gule Wamkulu heritage, village visits, and local museums.',
      western: 'Kuomboka, the Barotse Royal Establishment, Lozi craft, royal drums, and floodplain life.',
    },
  },
  {
    key: 'nature',
    label: 'Nature & Outdoor',
    icon: Mountain,
    national: 'Hiking, canoeing, hot springs, lakes, wetlands, and outdoor escapes beyond viewpoints.',
    local: {
      southern: 'Zambezi canoeing, gorge walks, Kalomo countryside, Lake Kariba, and sunset cruises.',
      eastern: 'Luangwa riverbanks, escarpment hikes, bush camps, and baobab-lined tracks.',
      western: 'Liuwa grasslands, floodplain canoeing, sand tracks, and remote camps.',
    },
  },
  {
    key: 'events',
    label: 'Festivals & Events',
    icon: CalendarDays,
    national: 'Calendar-driven trips built around ceremonies, wildlife seasons, music, and holidays.',
    local: {
      southern: 'Livingstone cultural festivals, marathon weekends, and peak Victoria Falls water months.',
      eastern: 'Ncwala, Kulamba-linked visits, harvest gatherings, and safari green-season specials.',
      western: 'Kuomboka season, Liuwa migration windows, royal gatherings, and community regattas.',
    },
  },
  {
    key: 'markets',
    label: 'Markets & Shopping',
    icon: ShoppingBag,
    national: 'Craft markets, textiles, baskets, copper goods, curios, food stalls, and maker visits.',
    local: {
      southern: 'Mukuni market, Livingstone curios, stone carvings, baskets, and art studios.',
      eastern: 'Chipata textiles, baskets, produce markets, and roadside craft sellers.',
      western: 'Lozi baskets, woodwork, floodplain fish markets, and Mongu trading stops.',
    },
  },
  {
    key: 'nightlife',
    label: 'Nightlife',
    icon: Music2,
    national: 'Rooftop lounges, live music, resort bars, club nights, theatre, and local entertainment.',
    local: {
      southern: 'Livingstone sundowner decks, lodge bars, live bands, and traveler-friendly nightlife.',
      eastern: 'Chipata lounges, local music nights, safari lodge dinners, and relaxed evening spots.',
      western: 'Mongu lounges, riverfront sunsets, lodge firesides, and community performances.',
    },
  },
  {
    key: 'community',
    label: 'Community Tourism',
    icon: Handshake,
    national: 'Homestays, village-led walks, craft co-ops, volunteering, and locally owned experiences.',
    local: {
      southern: 'Mukuni village visits, local guide walks, craft co-ops, and conservation volunteering.',
      eastern: 'Community bush camps, village meals, guide training projects, and conservation visits.',
      western: 'Lozi village stays, floodplain fishing days, craft groups, and community camps.',
    },
  },
]

const provinces: Array<{ key: ProvinceKey; label: string; short: string }> = [
  { key: 'national', label: 'National', short: 'All Zambia' },
  { key: 'southern', label: 'Southern Province', short: 'Falls, river, adrenaline' },
  { key: 'eastern', label: 'Eastern Province', short: 'Luangwa, walking safaris' },
  { key: 'western', label: 'Western Province', short: 'Floodplain, Kuomboka, Liuwa' },
]

const providerSet: Record<string, Provider[]> = {
  livingstoneAdventure: [
    {
      name: 'Falls Adventure Desk',
      type: 'Tour operator',
      phone: '+260 97 000 2101',
      email: 'bookings@fallsadventure.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/waterfalls/victoria-falls/',
      note: 'Bridge, gorge, and river activity coordination.',
    },
    {
      name: 'Batoka River Outfitters',
      type: 'Tour operator',
      phone: '+260 96 000 2102',
      email: 'raft@batoka.example',
      bookingUrl: 'https://www.zambiatourism.com/activities/adventure/',
      note: 'Rafting, transfers, safety briefing, and equipment.',
    },
    {
      name: 'Livingstone Lodge Concierge',
      type: 'Lodge',
      phone: '+260 95 000 2103',
      email: 'concierge@livingstonelodge.example',
      bookingUrl: 'https://www.zambiatourism.com/places/livingstone/',
      note: 'Package reservations with accommodation support.',
    },
  ],
  luangwaSafari: [
    {
      name: 'Luangwa Footprint Guides',
      type: 'Tour operator',
      phone: '+260 97 000 3101',
      email: 'walks@luangwafootprint.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/national-parks/south-luangwa/',
      note: 'Licensed walking safari guides and park entry coordination.',
    },
    {
      name: 'Mfuwe Safari Lodge Desk',
      type: 'Lodge',
      phone: '+260 96 000 3102',
      email: 'reservations@mfuwesafari.example',
      bookingUrl: 'https://www.zambiatourism.com/activities/safari/',
      note: 'Game drives, transfers, meals, and lodge stays.',
    },
    {
      name: 'Luangwa Community Camp',
      type: 'Community host',
      phone: '+260 95 000 3103',
      email: 'hosts@luangwacommunity.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Community-based stays and local guide handoffs.',
    },
  ],
  barotseCulture: [
    {
      name: 'Barotse Cultural Hosts',
      type: 'Community host',
      phone: '+260 97 000 4101',
      email: 'hello@barotsehosts.example',
      bookingUrl: 'https://www.zambiatourism.com/activities/culture/',
      note: 'Heritage walks, local meals, and respectful ceremony planning.',
    },
    {
      name: 'Mongu Heritage Desk',
      type: 'Tour operator',
      phone: '+260 96 000 4102',
      email: 'book@monguheritage.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Floodplain logistics, transfers, and host matching.',
    },
    {
      name: 'Lozi Craft Cooperative',
      type: 'Community host',
      phone: '+260 95 000 4103',
      email: 'visits@lozicraft.example',
      bookingUrl: 'https://www.zambiatourism.com/activities/culture/',
      note: 'Craft visits, storytelling, and community-led shopping.',
    },
  ],
  selfGuided: [
    {
      name: 'Experience Zambia Self Guide',
      type: 'Self guide',
      phone: '+260 97 000 5101',
      email: 'selfguide@experiencezambia.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Map, suggested stops, and offline checklist.',
    },
    {
      name: 'Local Host Hotline',
      type: 'Community host',
      phone: '+260 96 000 5102',
      email: 'hosts@experiencezambia.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Optional local context and translation help.',
    },
    {
      name: 'Agency Listing Desk',
      type: 'Tour operator',
      phone: '+260 95 000 5103',
      email: 'providers@experiencezambia.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'For agencies that want to list or fulfil this experience.',
    },
  ],
}

const experiences: Experience[] = [
  {
    title: 'Victoria Falls Adrenaline Pass',
    province: 'southern',
    category: 'adventure',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    price: 'From $185',
    duration: '1 day',
    difficulty: 'High',
    season: 'Year-round',
    group: '2-8',
    selfExplore: 'None',
    tags: ['Bungee', 'Gorge swing', 'Guide required'],
    summary: 'Bundle the bridge jump, gorge swing, zipline, and a recovery sundowner near the spray line.',
    providers: providerSet.livingstoneAdventure,
  },
  {
    title: 'South Luangwa Walking Safari',
    province: 'eastern',
    category: 'wildlife',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    price: 'From $320',
    duration: '2 days',
    difficulty: 'Moderate',
    season: 'Dry season',
    group: '2-6',
    selfExplore: 'None',
    tags: ['Walking safari', 'Birding', 'Park fees'],
    summary: 'Track wildlife on foot with a licensed guide, then move into a late-afternoon river drive.',
    providers: providerSet.luangwaSafari,
  },
  {
    title: 'Kuomboka Heritage Journey',
    province: 'western',
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80',
    price: 'From $140',
    duration: '3 days',
    difficulty: 'Easy',
    season: 'Calendar event',
    group: '4-12',
    selfExplore: 'Guided optional',
    tags: ['Ceremony', 'Homestay', 'Local host'],
    summary: 'Follow the floodplain story through royal sites, Lozi craft, community meals, and ceremony viewing.',
    providers: providerSet.barotseCulture,
  },
  {
    title: 'Livingstone Food & Market Walk',
    province: 'southern',
    category: 'delicacies',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    price: 'From $38',
    duration: '4 hours',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-10',
    selfExplore: 'Zero',
    tags: ['Food market', 'Bream', 'Walking'],
    summary: 'Taste Zambezi bream, local snacks, seasonal fruit, and small-plate stops with a local storyteller.',
    providers: providerSet.selfGuided,
  },
  {
    title: 'Liuwa Plain Migration Camp',
    province: 'western',
    category: 'wildlife',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    price: 'From $490',
    duration: '4 days',
    difficulty: 'Moderate',
    season: 'Wet season',
    group: '2-6',
    selfExplore: 'None',
    tags: ['4x4 needed', 'Migration', 'Remote camp'],
    summary: 'A migration-timed plains safari with community guides, mobile camp logistics, and big-sky evenings.',
    providers: providerSet.luangwaSafari,
  },
  {
    title: 'Luangwa Escarpment View Route',
    province: 'eastern',
    category: 'sightseeing',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    price: 'From $75',
    duration: '1 day',
    difficulty: 'Moderate',
    season: 'Dry season',
    group: '2-8',
    selfExplore: 'Guided optional',
    tags: ['Viewpoints', '4x4 useful', 'Picnic'],
    summary: 'A slow scenic route through valley viewpoints, village stops, and golden-hour escarpment overlooks.',
    providers: providerSet.selfGuided,
  },
]

const paths: ItineraryPath[] = [
  {
    title: '3-Day Adventure Path: Livingstone',
    province: 'Southern',
    steps: ['Victoria Falls viewpoint', 'White-water rafting', 'Bungee or gorge swing', 'Food market evening'],
    meta: 'High energy · 2 nights · Guide required for river activities',
    providers: providerSet.livingstoneAdventure,
  },
  {
    title: '4-Day Wildlife Path: South Luangwa',
    province: 'Eastern',
    steps: ['Chipata arrival', 'Walking safari', 'Night drive', 'Village-led craft stop'],
    meta: 'Moderate · Dry season best · Park fees apply',
    providers: providerSet.luangwaSafari,
  },
  {
    title: '5-Day Heritage Path: Barotseland',
    province: 'Western',
    steps: ['Mongu base', 'Floodplain crossing', 'Kuomboka sites', 'Lozi homestay'],
    meta: 'Easy pace · Calendar sensitive · Local host recommended',
    providers: providerSet.barotseCulture,
  },
]

const practicalFilters = ['Budget tier', 'Difficulty / fitness', 'Trip duration', 'Group size', '4x4 needed', 'Permit info', 'Offline friendly']

export default function ExperienceMarketplace() {
  const [province, setProvince] = useState<ProvinceKey>('national')
  const [category, setCategory] = useState<CategoryKey>('wildlife')
  const [query, setQuery] = useState('')
  const [selectedListing, setSelectedListing] = useState<Experience | ItineraryPath | null>(null)

  const selectedCategory = categories.find((item) => item.key === category) ?? categories[0]
  const selectedProvince = provinces.find((item) => item.key === province) ?? provinces[0]
  const categoryCopy = province === 'national' ? selectedCategory.national : selectedCategory.local[province]

  const filteredExperiences = useMemo(() => {
    return experiences.filter((experience) => {
      const matchesProvince = province === 'national' || experience.province === province
      const matchesCategory = experience.category === category
      const providerText = experience.providers.map((provider) => provider.name).join(' ')
      const haystack = `${experience.title} ${experience.summary} ${experience.tags.join(' ')} ${providerText}`.toLowerCase()
      return matchesProvince && matchesCategory && haystack.includes(query.toLowerCase())
    })
  }, [category, province, query])

  const marketplacePool = filteredExperiences.length
    ? filteredExperiences
    : experiences.filter((experience) => province === 'national' || experience.province === province)

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-50">
      <Navbar />

      <main>
        <section className="relative min-h-[82vh] overflow-hidden pt-24">
          <img
            src="https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&w=1800&q=85"
            alt="Zambian wilderness landscape"
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.92),rgba(5,5,5,.62),rgba(5,5,5,.22))]" />
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-[linear-gradient(90deg,#169b62_0_25%,#d21034_25%_50%,#050505_50%_75%,#ff8200_75%_100%)]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:pt-24">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 border border-white/15 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                <Compass className="h-4 w-4 text-[#ff8200]" />
                Book local paths across Zambia
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                Zambia experience marketplace
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-stone-100/85 sm:text-lg">
                Browse national highlights first, then filter by province to find local food, safaris, culture, events, providers, safety notes, and bookable itineraries nearby.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#marketplace" className="inline-flex items-center justify-center gap-2 bg-[#d21034] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#a80d29]">
                  <Search className="h-4 w-4" />
                  Browse experiences
                </a>
                <a href="#paths" className="inline-flex items-center justify-center gap-2 border border-white/25 bg-black/35 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:border-[#ff8200]">
                  <Map className="h-4 w-4" />
                  View paths
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace" className="bg-stone-100 px-4 py-12 text-zinc-950 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#169b62]">Marketplace layer</p>
                <h2 className="mt-2 text-3xl font-black sm:text-5xl">{selectedProvince.label}</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-zinc-600">{categoryCopy}</p>
              </div>

              <div className="grid w-full max-w-xl gap-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {provinces.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setProvince(item.key)}
                      className={`min-h-[68px] border px-3 py-2 text-left transition ${
                        province === item.key
                          ? 'border-[#169b62] bg-[#169b62] text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-[#ff8200]'
                      }`}
                    >
                      <span className="block text-xs font-black uppercase tracking-[0.08em]">{item.label}</span>
                      <span className="mt-1 block text-[11px] font-semibold opacity-70">{item.short}</span>
                    </button>
                  ))}
                </div>
                <div className="flex min-h-[52px] items-center gap-3 border border-zinc-300 bg-white px-4">
                  <Search className="h-5 w-5 text-zinc-500" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search operators, permits, places"
                    className="h-full w-full bg-transparent text-sm font-bold outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
              <aside className="space-y-4">
                <div className="border border-zinc-200 bg-white p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-black">
                    <Filter className="h-4 w-4 text-[#d21034]" />
                    Categories
                  </div>
                  <div className="grid gap-2">
                    {categories.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setCategory(item.key)}
                          className={`flex min-h-[48px] items-center gap-3 border px-3 text-left text-sm font-black transition ${
                            category === item.key
                              ? 'border-[#d21034] bg-[#d21034] text-white'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-[#169b62]'
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-none" />
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="border-2 border-[#ff8200] bg-white p-4 shadow-[8px_8px_0_#050505]">
                  <p className="text-sm font-black">Practical filters</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-zinc-500">Highlighted because they decide whether an experience is realistic to book today.</p>
                  <div className="mt-4 grid gap-2 text-xs font-bold text-zinc-700">
                    {practicalFilters.map((filter) => (
                      <span key={filter} className="border border-zinc-200 bg-[#fff7ed] px-3 py-2">{filter}</span>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {marketplacePool.map((experience) => (
                  <article key={experience.title} className="overflow-hidden border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] bg-zinc-900">
                      <img src={experience.image} alt={experience.title} className="h-full w-full object-cover" />
                      <div className="absolute left-3 top-3 bg-black/75 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                        {experience.season}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-black leading-6">{experience.title}</h3>
                        <span className="whitespace-nowrap bg-[#169b62] px-2 py-1 text-xs font-black text-white">{experience.price}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">{experience.summary}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-black text-zinc-700 sm:grid-cols-4">
                        <span className="bg-stone-100 px-2 py-2">{experience.duration}</span>
                        <span className="bg-stone-100 px-2 py-2">{experience.difficulty}</span>
                        <span className="bg-stone-100 px-2 py-2">{experience.group}</span>
                        <span className="bg-stone-100 px-2 py-2">Self: {experience.selfExplore}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {experience.tags.map((tag) => (
                          <span key={tag} className="border border-zinc-200 px-2 py-1 text-xs font-bold text-zinc-500">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                        <span className="text-xs font-black uppercase tracking-[0.12em] text-zinc-500">{experience.providers.length} providers</span>
                        <button
                          type="button"
                          onClick={() => setSelectedListing(experience)}
                          className="bg-zinc-950 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white hover:bg-[#ff8200] hover:text-black"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 text-zinc-950 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-4">
            {[
              ['Verified operators', 'Attach booking links, guide licenses, lodge contacts, and response time badges to every listing.'],
              ['Travel logistics', 'Show drive times, transfer choices, road conditions, fuel stops, and whether a 4x4 is needed.'],
              ['Safety & permits', 'Surface park fees, guide requirements, activity waivers, medical notes, and age limits before checkout.'],
              ['Offline friendly', 'Save province pages, operator contacts, maps, and itinerary notes for low-connectivity areas.'],
            ].map(([title, body], index) => (
              <article key={title} className="border border-zinc-200 bg-stone-50 p-5">
                <span className={`mb-5 block h-2 w-16 ${['bg-[#169b62]', 'bg-[#d21034]', 'bg-black', 'bg-[#ff8200]'][index]}`} />
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="paths" className="bg-zinc-950 px-4 py-14 text-white sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff8200]">Itinerary paths</p>
                <h2 className="mt-2 text-3xl font-black sm:text-5xl">Book a sequence, not just a stop</h2>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-white/60">
                <Waves className="h-5 w-5 text-[#169b62]" />
                Season tags, permits, road notes, and operator handoffs included.
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {paths.map((path) => (
                <article key={path.title} className="border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="bg-[#d21034] px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">{path.province}</span>
                    <Star className="h-5 w-5 text-[#ff8200]" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black">{path.title}</h3>
                  <ol className="mt-5 space-y-3">
                    {path.steps.map((step, index) => (
                      <li key={step} className="flex gap-3 text-sm font-semibold text-white/75">
                        <span className="flex h-7 w-7 flex-none items-center justify-center bg-[#169b62] text-xs font-black text-white">{index + 1}</span>
                        <span className="pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-[0.12em] text-white/45">{path.meta}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedListing(path)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#ff8200] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-black hover:bg-white"
                  >
                    <Mail className="h-4 w-4" />
                    Reserve path
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {selectedListing && <ContactModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  )
}

function ContactModal({ listing, onClose }: { listing: Experience | ItineraryPath; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl border border-white/10 bg-white text-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d21034]">Reservations and provider details</p>
            <h2 className="mt-2 text-2xl font-black">{listing.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center bg-zinc-950 text-white" aria-label="Close contact modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-3">
            {listing.providers.map((provider) => (
              <article key={provider.name} className="border border-zinc-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="bg-[#169b62] px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">{provider.type}</span>
                    <h3 className="mt-3 text-lg font-black">{provider.name}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">{provider.note}</p>
                  </div>
                  <a href={provider.bookingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#ff8200] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-black">
                    Booking site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-4 grid gap-2 text-sm font-bold text-zinc-700 sm:grid-cols-2">
                  <a href={`tel:${provider.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 border border-zinc-200 px-3 py-2">
                    <Phone className="h-4 w-4 text-[#d21034]" />
                    {provider.phone}
                  </a>
                  <a href={`mailto:${provider.email}?subject=${encodeURIComponent(`Reservation request: ${listing.title}`)}`} className="flex items-center gap-2 border border-zinc-200 px-3 py-2">
                    <Mail className="h-4 w-4 text-[#d21034]" />
                    {provider.email}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <form className="border-2 border-[#ff8200] bg-[#fff7ed] p-4">
            <p className="text-sm font-black">Quick reservation request</p>
            <label className="mt-4 block text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Name
              <input className="mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-bold outline-none" placeholder="Traveler name" />
            </label>
            <label className="mt-3 block text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Travel date
              <input type="date" className="mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-bold outline-none" />
            </label>
            <label className="mt-3 block text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Group size
              <input type="number" min="1" className="mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-bold outline-none" placeholder="2" />
            </label>
            <label className="mt-3 block text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Message
              <textarea className="mt-2 min-h-24 w-full border border-zinc-300 bg-white px-3 py-3 text-sm font-bold outline-none" placeholder="Tell the provider what you need." />
            </label>
            <button type="button" className="mt-4 w-full bg-zinc-950 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">
              Prepare request
            </button>
            <a href="mailto:providers@experiencezambia.example?subject=List%20my%20tourism%20agency" className="mt-3 flex items-center justify-center gap-2 border border-zinc-300 bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-zinc-950">
              List tourism agency
              <ExternalLink className="h-4 w-4" />
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}
