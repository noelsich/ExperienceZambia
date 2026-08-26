import { useMemo, useState } from 'react'
import {
  Binoculars,
  Bus,
  CalendarDays,
  Compass,
  ExternalLink,
  Filter,
  Flame,
  Handshake,
  Landmark,
  Mail,
  Map,
  MapPin,
  Mountain,
  Music2,
  PartyPopper,
  Phone,
  Route,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TreePine,
  Utensils,
  Wallet,
  Waves,
  X,
  Zap,
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

type ProvinceKey =
  | 'national'
  | 'central'
  | 'copperbelt'
  | 'eastern'
  | 'luapula'
  | 'lusaka'
  | 'muchinga'
  | 'northern'
  | 'northwestern'
  | 'southern'
  | 'western'

type LocalProvinceKey = Exclude<ProvinceKey, 'national'>
type SelfExploreLevel = 'None' | 'Guided optional' | 'Zero'

type PathCategoryKey =
  | 'adrenaline'
  | 'wildlife'
  | 'culture'
  | 'food'
  | 'nature'
  | 'festival'
  | 'roadtrip'
  | 'budget'

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
  provinceKey: LocalProvinceKey | 'multi'
  pathCategory: PathCategoryKey
  intensity: 'Easy' | 'Moderate' | 'High' | 'Extreme'
  days: number
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
      central: 'Mkushi farm produce, fresh dairy, roadside maize, and Kabwe grill stops.',
      copperbelt: 'Kitwe and Ndola restaurant rows, braai yards, bakeries, and mine-town canteens.',
      eastern: 'Groundnut-rich village dishes, seasonal produce, and food stops around Chipata.',
      luapula: 'Lake Mweru fish, cassava nshima, chikanda, and smoked-fish market tables.',
      lusaka: 'Capital street food, nshima kitchens, Ethiopian and Indian rows, and cafe culture.',
      muchinga: 'Shiwa estate produce, hot-spring picnics, wild honey, and Bemba village meals.',
      northern: 'Lake Tanganyika kapenta and buka buka, cassava, and Kasama millet dishes.',
      northwestern: 'Cassava and pineapple country, Solwezi eateries, and Luvale village kitchens.',
      southern: 'Zambezi bream, Livingstone cafes, riverside grills, and Victoria Falls market snacks.',
      western: 'Barotse floodplain fish, cassava, local rice, and community-hosted meals.',
    },
  },
  {
    key: 'adventure',
    label: 'Extreme / Adventure',
    icon: Flame,
    national: 'Bungee jumping, white-water rafting, gorge swings, ziplining, and wild-water days.',
    local: {
      central: 'Kundalila Falls scrambles, cave routes, escarpment 4x4 tracks, and swamp expeditions.',
      copperbelt: 'Sunken-lake dives, quad trails, mountain biking, and Kafubu river runs.',
      eastern: 'Luangwa valley hikes, guided bush walks, escarpment drives, and cycling trails.',
      luapula: 'Waterfall gorge scrambles, wet-rock trails, and Lake Mweru boat crossings.',
      lusaka: 'Kafue river rapids day trips, quad biking, climbing walls, and skydive weekends.',
      muchinga: 'North Luangwa wilderness walks, Mutinondo rock domes, and remote river camps.',
      northern: 'Kalambo Gorge hikes, Tanganyika kayaking, dive sites, and escarpment descents.',
      northwestern: 'West Lunga expeditions, Nyambwezu Falls, and long remote 4x4 crossings.',
      southern: 'Victoria Falls bungee, Batoka Gorge swing, rafting, canoe runs, and helicopter flips.',
      western: 'Floodplain expeditions, remote 4x4 routes, canoe days, and Liuwa migration camps.',
    },
  },
  {
    key: 'wildlife',
    label: 'Wildlife Tours',
    icon: Binoculars,
    national: 'Classic safaris, walking safaris, birding, boat safaris, and conservation-led visits.',
    local: {
      central: 'Kasanka bat migration, Blue Lagoon lechwe, sitatunga hides, and Lukanga birding.',
      copperbelt: 'Chimfunshi chimpanzee sanctuary, Chembe bird lagoon, and Mikomfwa game park.',
      eastern: 'South Luangwa walking safaris, night drives, leopard country, and river hides.',
      luapula: 'Bangweulu edge birding, black lechwe plains, and wetland boat wildlife runs.',
      lusaka: 'Lusaka National Park, Munda Wanga sanctuary, Chaminuka, and Kafue Flats day trips.',
      muchinga: 'North Luangwa black rhino country, Bangweulu shoebills, and low-traffic wilderness.',
      northern: 'Nsumbu National Park, shoebill searches, Tanganyika shorelines, and rare birding.',
      northwestern: 'West Lunga forests, Source of the Zambezi miombo birds, and wild dog country.',
      southern: 'Mosi-oa-Tunya rhino walks, Chobe day trips, Lake Kariba boat safaris, and birding.',
      western: 'Liuwa Plain wildebeest migration, hyena sightings, birding, and community camps.',
    },
  },
  {
    key: 'sightseeing',
    label: 'Sightseeing',
    icon: MapPin,
    national: 'Waterfalls, viewpoints, museums, monuments, markets, and landmark photo stops.',
    local: {
      central: 'Kundalila Falls, Nsalu Cave rock art, Kabwe mine landmarks, and Great North Road stops.',
      copperbelt: 'Copperbelt Museum, the Ndola Slave Tree, open-pit viewpoints, and Lake Chilengwa.',
      eastern: 'Luangwa valley escarpment, Chipata craft stops, cathedral landmarks, and viewpoints.',
      luapula: 'Lumangwe, Kabwelume, Ntumbachushi and Mumbuluma falls on one waterfall road.',
      lusaka: 'Freedom Statue, Cathedral of the Holy Cross, National Museum, and Levy skyline views.',
      muchinga: 'Shiwa Ng’andu manor, Kapishya springs, Mutinondo domes, and Chinsali heritage sites.',
      northern: 'Kalambo Falls, Lake Tanganyika, Moto Moto Museum, and Chishimba Falls.',
      northwestern: 'Source of the Zambezi monument, Chavuma Falls, and Solwezi mine viewpoints.',
      southern: 'Victoria Falls, Livingstone Museum, Knife Edge Bridge, and Zambezi viewpoints.',
      western: 'Barotse floodplain, Mongu harbor views, royal sites, and wide-open sunset drives.',
    },
  },
  {
    key: 'culture',
    label: 'Culture & Heritage',
    icon: Sparkles,
    national: 'Ceremonies, museums, village visits, heritage routes, storytelling, and royal history.',
    local: {
      central: 'Lala and Swaka villages, Nsalu rock art, Broken Hill history, and chiefdom visits.',
      copperbelt: 'Mining heritage, Slave Tree history, township music, and Copperbelt Museum tours.',
      eastern: 'Chewa and Nsenga traditions, Gule Wamkulu heritage, village visits, and local museums.',
      luapula: 'Ushi and Bwile heritage, Mutomboko ceremony history, and fishing village traditions.',
      lusaka: 'Kabwata Cultural Village, National Museum, independence history, and craft studios.',
      muchinga: 'Shiwa Ng’andu estate story, Bemba royal sites, and Chinsali liberation heritage.',
      northern: 'Bemba capital Kasama, rock paintings, Moto Moto Museum, and Mpulungu port life.',
      northwestern: 'Likumbi Lya Mize, Luvale and Lunda ceremonies, masks, and chiefdom protocol.',
      southern: 'Livingstone heritage, Tonga cultural visits, railway history, and museum-led tours.',
      western: 'Kuomboka, the Barotse Royal Establishment, Lozi craft, royal drums, and floodplain life.',
    },
  },
  {
    key: 'nature',
    label: 'Nature & Outdoor',
    icon: Mountain,
    national: 'Hiking, canoeing, hot springs, lakes, wetlands, and outdoor escapes beyond viewpoints.',
    local: {
      central: 'Kundalila Falls pools, Lukanga swamp, miombo woodland walks, and Kasanka forests.',
      copperbelt: 'Mindolo Dam, Lake Chilengwa, Chembe Bird Sanctuary, and Dag Hammarskjöld woodland.',
      eastern: 'Luangwa riverbanks, escarpment hikes, bush camps, and baobab-lined tracks.',
      luapula: 'Waterfall pools, Bangweulu wetlands, Lake Mweru beaches, and rainforest strips.',
      lusaka: 'Kafue river escapes, Lower Zambezi gateway, dam picnics, and city green belts.',
      muchinga: 'Mutinondo Wilderness, Kapishya hot springs, waterfalls, and rock-dome sunrises.',
      northern: 'Lake Tanganyika beaches, Kalambo Gorge, Chishimba Falls, and Bangweulu swamps.',
      northwestern: 'Source of the Zambezi forest, Nyambwezu Falls, and dambo grassland walks.',
      southern: 'Zambezi canoeing, gorge walks, Kalomo countryside, Lake Kariba, and sunset cruises.',
      western: 'Liuwa grasslands, floodplain canoeing, sand tracks, and remote camps.',
    },
  },
  {
    key: 'events',
    label: 'Festivals & Events',
    icon: CalendarDays,
    national: 'Calendar-driven trips built around ceremonies, wildlife seasons, music, and holidays.',
    local: {
      central: 'Kasanka bat season, harvest gatherings, and Chibwela Kumushi traditional ceremony.',
      copperbelt: 'City music festivals, Independence weekends, and Copperbelt sports fixtures.',
      eastern: 'Ncwala, Kulamba-linked visits, harvest gatherings, and safari green-season specials.',
      luapula: 'Mutomboko ceremony, fishing season openings, and lakeside regatta weekends.',
      lusaka: 'Agricultural and Commercial Show, arts festivals, concerts, and food weekends.',
      muchinga: 'Bemba ceremonies, Chinsali commemorations, and dry-season wilderness windows.',
      northern: 'Ukusefya Pa Ng’wena, Kasama gatherings, and Lake Tanganyika sailing weekends.',
      northwestern: 'Likumbi Lya Mize, Lunda Lubanza, and Chisemwa Cha Lunda ceremonies.',
      southern: 'Livingstone cultural festivals, marathon weekends, and peak Victoria Falls water months.',
      western: 'Kuomboka season, Liuwa migration windows, royal gatherings, and community regattas.',
    },
  },
  {
    key: 'markets',
    label: 'Markets & Shopping',
    icon: ShoppingBag,
    national: 'Craft markets, textiles, baskets, copper goods, curios, food stalls, and maker visits.',
    local: {
      central: 'Kabwe traders, roadside farm stalls, honey and dairy stops, and Serenje craft sellers.',
      copperbelt: 'Copper craft, malls and markets in Kitwe and Ndola, gemstone and curio dealers.',
      eastern: 'Chipata textiles, baskets, produce markets, and roadside craft sellers.',
      luapula: 'Mansa markets, cassava and fish trade, reed mats, and lakeside craft groups.',
      lusaka: 'Soweto Market, Kabwata curios, Sunday craft markets, and designer chitenge studios.',
      muchinga: 'Mpika roadside stalls, wild honey, Shiwa estate goods, and village craft sellers.',
      northern: 'Kasama basketry, Mpulungu fish markets, pottery, and Bemba carving stalls.',
      northwestern: 'Luvale and Lunda masks, Mwinilunga pineapple stalls, and Solwezi trade markets.',
      southern: 'Mukuni market, Livingstone curios, stone carvings, baskets, and art studios.',
      western: 'Lozi baskets, woodwork, floodplain fish markets, and Mongu trading stops.',
    },
  },
  {
    key: 'nightlife',
    label: 'Nightlife',
    icon: Music2,
    national: 'Rooftop lounges, live music, resort bars, club nights, theatre, and local entertainment.',
    local: {
      central: 'Kabwe lounges, roadside grills, live rhumba nights, and farm-block social clubs.',
      copperbelt: 'Kitwe and Ndola club circuit, live bands, sports bars, and late braai spots.',
      eastern: 'Chipata lounges, local music nights, safari lodge dinners, and relaxed evening spots.',
      luapula: 'Mansa bars, lakeside music nights, and fishing-town weekend dances.',
      lusaka: 'Rooftops, Great East Road lounges, live jazz, comedy nights, and club districts.',
      muchinga: 'Mpika town bars, lodge firesides, and star-heavy wilderness evenings.',
      northern: 'Kasama nightspots, Mpulungu harbour bars, and lakeside beach evenings.',
      northwestern: 'Solwezi mine-town bars, live bands, and community dance nights.',
      southern: 'Livingstone sundowner decks, lodge bars, live bands, and traveler-friendly nightlife.',
      western: 'Mongu lounges, riverfront sunsets, lodge firesides, and community performances.',
    },
  },
  {
    key: 'community',
    label: 'Community Tourism',
    icon: Handshake,
    national: 'Homestays, village-led walks, craft co-ops, volunteering, and locally owned experiences.',
    local: {
      central: 'Kasanka community scouts, farm stays, beekeeping groups, and village-led walks.',
      copperbelt: 'Township tours, chimpanzee sanctuary volunteering, and urban youth co-ops.',
      eastern: 'Community bush camps, village meals, guide training projects, and conservation visits.',
      luapula: 'Fishing-village homestays, waterfall guide groups, and cassava processing visits.',
      lusaka: 'Township food walks, craft cooperatives, social enterprises, and urban farm visits.',
      muchinga: 'Estate and village stays, honey cooperatives, and community scout programmes.',
      northern: 'Lakeside homestays, boat co-ops, fish-smoking visits, and school partnerships.',
      northwestern: 'Luvale and Lunda village stays, mask-carving workshops, and honey groups.',
      southern: 'Mukuni village visits, local guide walks, craft co-ops, and conservation volunteering.',
      western: 'Lozi village stays, floodplain fishing days, craft groups, and community camps.',
    },
  },
]

const provinces: Array<{ key: ProvinceKey; label: string; short: string }> = [
  { key: 'national', label: 'National', short: 'All Zambia' },
  { key: 'central', label: 'Central', short: 'Kasanka, falls, farm country' },
  { key: 'copperbelt', label: 'Copperbelt', short: 'Cities, mines, chimps' },
  { key: 'eastern', label: 'Eastern', short: 'Luangwa, walking safaris' },
  { key: 'luapula', label: 'Luapula', short: 'Waterfalls, Lake Mweru' },
  { key: 'lusaka', label: 'Lusaka', short: 'Capital, food, nightlife' },
  { key: 'muchinga', label: 'Muchinga', short: 'Shiwa, hot springs, wilderness' },
  { key: 'northern', label: 'Northern', short: 'Tanganyika, Kalambo, shoebills' },
  { key: 'northwestern', label: 'North-Western', short: 'Zambezi source, ceremonies' },
  { key: 'southern', label: 'Southern', short: 'Falls, river, adrenaline' },
  { key: 'western', label: 'Western', short: 'Floodplain, Kuomboka, Liuwa' },
]

const pathCategories: Array<{ key: PathCategoryKey; label: string; icon: typeof Zap; blurb: string }> = [
  { key: 'adrenaline', label: 'Adrenaline only', icon: Zap, blurb: 'Pure high-intensity days. Waivers, guides, and fitness requirements apply.' },
  { key: 'wildlife', label: 'Wildlife & safari', icon: Binoculars, blurb: 'Park-based sequences built around game viewing, walking safaris, and birding.' },
  { key: 'culture', label: 'Culture & heritage', icon: Landmark, blurb: 'Royal sites, museums, village hosts, and heritage routes with local protocol.' },
  { key: 'food', label: 'Food & city', icon: Utensils, blurb: 'Market kitchens, restaurant rows, live music, and urban weekend pacing.' },
  { key: 'nature', label: 'Nature & water', icon: TreePine, blurb: 'Waterfalls, lakes, wetlands, hot springs, and slow outdoor days.' },
  { key: 'festival', label: 'Festival-timed', icon: PartyPopper, blurb: 'Locked to ceremony dates. Book early and confirm the year’s calendar.' },
  { key: 'roadtrip', label: 'Road trip / overland', icon: Bus, blurb: 'Multi-province drives with fuel, road condition, and vehicle notes.' },
  { key: 'budget', label: 'Budget & slow', icon: Wallet, blurb: 'Public transport friendly, low-cost stays, and self-explore-heavy routes.' },
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
  centralWild: [
    {
      name: 'Kasanka Trust Booking Office',
      type: 'Tour operator',
      phone: '+260 97 000 6101',
      email: 'bookings@kasankatrust.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/national-parks/kasanka/',
      note: 'Bat season permits, hides, and camp reservations.',
    },
    {
      name: 'Serenje Falls Guides',
      type: 'Community host',
      phone: '+260 96 000 6102',
      email: 'guides@serenjefalls.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Kundalila Falls, Nsalu Cave access, and village walks.',
    },
    {
      name: 'Mkushi Farm Stay Desk',
      type: 'Lodge',
      phone: '+260 95 000 6103',
      email: 'stay@mkushifarms.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Farm-block accommodation, meals, and transfers.',
    },
  ],
  copperbeltCity: [
    {
      name: 'Copperbelt City Tours',
      type: 'Tour operator',
      phone: '+260 97 000 7101',
      email: 'tours@copperbeltcity.example',
      bookingUrl: 'https://www.zambiatourism.com/places/ndola/',
      note: 'Museum, Slave Tree, mine viewpoints, and city transfers.',
    },
    {
      name: 'Chimfunshi Visitor Desk',
      type: 'Community host',
      phone: '+260 96 000 7102',
      email: 'visits@chimfunshi.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Sanctuary day visits, overnight huts, and volunteering.',
    },
    {
      name: 'Kitwe Nightlife Concierge',
      type: 'Lodge',
      phone: '+260 95 000 7103',
      email: 'concierge@kitwestay.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Table reservations, safe transport, and late-night pickups.',
    },
  ],
  luapulaFalls: [
    {
      name: 'Luapula Waterfall Circuit',
      type: 'Tour operator',
      phone: '+260 97 000 8101',
      email: 'route@luapulafalls.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/waterfalls/',
      note: 'Lumangwe, Kabwelume, and Ntumbachushi access with local guides.',
    },
    {
      name: 'Mweru Lakeside Hosts',
      type: 'Community host',
      phone: '+260 96 000 8102',
      email: 'hosts@mwerulakeside.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Fishing village stays, boat days, and market visits.',
    },
    {
      name: 'Mansa Travel Desk',
      type: 'Tour operator',
      phone: '+260 95 000 8103',
      email: 'desk@mansatravel.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Vehicle hire, road updates, and accommodation booking.',
    },
  ],
  lusakaCity: [
    {
      name: 'Lusaka Food Walks',
      type: 'Tour operator',
      phone: '+260 97 000 9101',
      email: 'walks@lusakafood.example',
      bookingUrl: 'https://www.zambiatourism.com/places/lusaka/',
      note: 'Market kitchens, tastings, and safe city walking routes.',
    },
    {
      name: 'Capital Nights Concierge',
      type: 'Lodge',
      phone: '+260 96 000 9102',
      email: 'nights@capitalstay.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Rooftop and live-music bookings with vetted transport.',
    },
    {
      name: 'Kabwata Craft Collective',
      type: 'Community host',
      phone: '+260 95 000 9103',
      email: 'craft@kabwata.example',
      bookingUrl: 'https://www.zambiatourism.com/activities/culture/',
      note: 'Carver studios, chitenge makers, and fair-price shopping.',
    },
  ],
  muchingaWilderness: [
    {
      name: 'Shiwa Ng’andu Estate Office',
      type: 'Lodge',
      phone: '+260 97 001 1101',
      email: 'estate@shiwahouse.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Manor tours, Kapishya hot springs, and estate stays.',
    },
    {
      name: 'North Luangwa Wilderness Guides',
      type: 'Tour operator',
      phone: '+260 96 001 1102',
      email: 'walk@northluangwa.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/national-parks/north-luangwa/',
      note: 'Restricted-access walking safaris and park permits.',
    },
    {
      name: 'Mutinondo Wilderness Camp',
      type: 'Lodge',
      phone: '+260 95 001 1103',
      email: 'camp@mutinondo.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Hiking trails, rock domes, camping, and full-board chalets.',
    },
  ],
  northernLakes: [
    {
      name: 'Tanganyika Blue Charters',
      type: 'Tour operator',
      phone: '+260 97 001 2101',
      email: 'charter@tanganyikablue.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/lakes/lake-tanganyika/',
      note: 'Boat transfers, Nsumbu access, snorkelling, and beach camps.',
    },
    {
      name: 'Kalambo Gorge Guides',
      type: 'Community host',
      phone: '+260 96 001 2102',
      email: 'hike@kalambogorge.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/waterfalls/',
      note: 'Falls viewpoints, gorge descents, and village-based guiding.',
    },
    {
      name: 'Kasama Heritage Desk',
      type: 'Tour operator',
      phone: '+260 95 001 2103',
      email: 'heritage@kasamadesk.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Moto Moto Museum, rock art sites, and Bemba heritage routes.',
    },
  ],
  northwesternSource: [
    {
      name: 'Zambezi Source Guides',
      type: 'Community host',
      phone: '+260 97 001 3101',
      email: 'source@zambeziguides.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Mwinilunga source monument, forest walks, and village hosts.',
    },
    {
      name: 'Mize Ceremony Desk',
      type: 'Tour operator',
      phone: '+260 96 001 3102',
      email: 'mize@ceremonydesk.example',
      bookingUrl: 'https://www.zambiatourism.com/activities/culture/',
      note: 'Likumbi Lya Mize seating, protocol briefing, and transfers.',
    },
    {
      name: 'Solwezi Expedition Hire',
      type: 'Tour operator',
      phone: '+260 95 001 3103',
      email: 'hire@solweziexpeditions.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: '4x4 hire, fuel planning, and remote-route recovery cover.',
    },
  ],
  karibaWater: [
    {
      name: 'Siavonga Houseboat Company',
      type: 'Tour operator',
      phone: '+260 97 001 4101',
      email: 'boats@siavongahouse.example',
      bookingUrl: 'https://www.zambiatourism.com/destinations/lakes/lake-kariba/',
      note: 'Houseboat charters, crew, catering, and fishing gear.',
    },
    {
      name: 'Kariba Lakeside Lodge',
      type: 'Lodge',
      phone: '+260 96 001 4102',
      email: 'stay@karibalakeside.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Rooms, day cruises, and transfers from Lusaka.',
    },
    {
      name: 'Zambezi Water Safety Desk',
      type: 'Self guide',
      phone: '+260 95 001 4103',
      email: 'safety@zambeziwater.example',
      bookingUrl: 'https://www.zambiatourism.com/',
      note: 'Life jackets, weather notes, and crocodile-safe swim guidance.',
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

const IMG = {
  falls: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  safari: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  plains: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
  scenic: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
  lake: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
  city: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1200&q=80',
  nightlife: 'https://images.unsplash.com/photo-1470229722913-7ea0d3e2ba9d?auto=format&fit=crop&w=1200&q=80',
  market: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
  forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  river: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?auto=format&fit=crop&w=1200&q=80',
  birds: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  hills: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  village: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1200&q=80',
  festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
}

const experiences: Experience[] = [
  // ---------- Central ----------
  {
    title: 'Kasanka Bat Migration Camp',
    province: 'central',
    category: 'wildlife',
    image: IMG.forest,
    price: 'From $210',
    duration: '3 days',
    difficulty: 'Easy',
    season: 'Calendar event',
    group: '2-8',
    selfExplore: 'None',
    tags: ['Nov-Dec only', 'Hides', 'Park fees'],
    summary: 'Sit in dawn and dusk hides as ten million straw-coloured fruit bats pour over the Kasanka swamp forest.',
    providers: providerSet.centralWild,
  },
  {
    title: 'Kundalila Falls & Nsalu Cave Route',
    province: 'central',
    category: 'nature',
    image: IMG.waterfall,
    price: 'From $65',
    duration: '2 days',
    difficulty: 'Moderate',
    season: 'Year-round',
    group: '1-8',
    selfExplore: 'Guided optional',
    tags: ['Rock art', 'Swim pools', '4x4 useful'],
    summary: 'Drop into the Kundalila plunge pool, then read the ochre rock art at Nsalu Cave on the same escarpment run.',
    providers: providerSet.centralWild,
  },
  {
    title: 'Mkushi Farm Block Harvest Table',
    province: 'central',
    category: 'delicacies',
    image: IMG.food,
    price: 'From $45',
    duration: '1 day',
    difficulty: 'Easy',
    season: 'Dry season',
    group: '2-12',
    selfExplore: 'Zero',
    tags: ['Farm stay', 'Dairy', 'Honey'],
    summary: 'Eat straight off the farm block — fresh dairy, wild honey, maize fields, and a long lunch under the msasa trees.',
    providers: providerSet.centralWild,
  },

  // ---------- Copperbelt ----------
  {
    title: 'Chimfunshi Chimpanzee Sanctuary Day',
    province: 'copperbelt',
    category: 'wildlife',
    image: IMG.forest,
    price: 'From $55',
    duration: '1 day',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-15',
    selfExplore: 'None',
    tags: ['Sanctuary', 'Family friendly', 'Conservation'],
    summary: 'Meet one of the world’s largest chimpanzee sanctuaries, with feeding-platform viewing and keeper-led talks.',
    providers: providerSet.copperbeltCity,
  },
  {
    title: 'Ndola & Kitwe Night Circuit',
    province: 'copperbelt',
    category: 'nightlife',
    image: IMG.nightlife,
    price: 'From $40',
    duration: 'Evening',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-10',
    selfExplore: 'Guided optional',
    tags: ['Live bands', 'Safe transport', 'Late night'],
    summary: 'Work the copper-city circuit — braai yards, live rhumba, sports bars, and a vetted driver for the whole night.',
    providers: providerSet.copperbeltCity,
  },
  {
    title: 'Copperbelt Mining Heritage Tour',
    province: 'copperbelt',
    category: 'culture',
    image: IMG.city,
    price: 'From $50',
    duration: '1 day',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-12',
    selfExplore: 'Guided optional',
    tags: ['Museum', 'Slave Tree', 'Industrial history'],
    summary: 'Trace a century of copper — the Copperbelt Museum, the Ndola Slave Tree, and an open-pit viewpoint stop.',
    providers: providerSet.copperbeltCity,
  },

  // ---------- Eastern ----------
  {
    title: 'South Luangwa Walking Safari',
    province: 'eastern',
    category: 'wildlife',
    image: IMG.safari,
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
    title: 'Luangwa Escarpment View Route',
    province: 'eastern',
    category: 'sightseeing',
    image: IMG.scenic,
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
  {
    title: 'Ncwala Ceremony Weekend',
    province: 'eastern',
    category: 'events',
    image: IMG.festival,
    price: 'From $120',
    duration: '2 days',
    difficulty: 'Easy',
    season: 'Calendar event',
    group: '2-20',
    selfExplore: 'None',
    tags: ['February', 'Ngoni', 'Protocol briefing'],
    summary: 'Join the Ngoni first-fruits ceremony at Mtenguleni with seating, protocol briefing, and a village meal after.',
    providers: providerSet.luangwaSafari,
  },
  {
    title: 'Chipata Market & Groundnut Kitchen',
    province: 'eastern',
    category: 'delicacies',
    image: IMG.market,
    price: 'From $30',
    duration: '4 hours',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-10',
    selfExplore: 'Zero',
    tags: ['Cooking', 'Groundnuts', 'Walking'],
    summary: 'Shop the Chipata stalls, then cook chikanda, ifisashi, and pounded groundnut relish with a home cook.',
    providers: providerSet.selfGuided,
  },

  // ---------- Luapula ----------
  {
    title: 'Luapula Waterfall Trail',
    province: 'luapula',
    category: 'nature',
    image: IMG.waterfall,
    price: 'From $95',
    duration: '3 days',
    difficulty: 'Moderate',
    season: 'Year-round',
    group: '2-8',
    selfExplore: 'Guided optional',
    tags: ['Lumangwe', 'Kabwelume', 'Wet rock'],
    summary: 'One road, four major falls — Ntumbachushi, Lumangwe, Kabwelume, and Mumbuluma, with rainbow spray at midday.',
    providers: providerSet.luapulaFalls,
  },
  {
    title: 'Lake Mweru Fishing Village Days',
    province: 'luapula',
    category: 'community',
    image: IMG.lake,
    price: 'From $70',
    duration: '2 days',
    difficulty: 'Easy',
    season: 'Dry season',
    group: '1-6',
    selfExplore: 'None',
    tags: ['Homestay', 'Boat day', 'Local host'],
    summary: 'Go out with the dawn boats, watch the fish-smoking racks, and sleep in a lakeside family compound.',
    providers: providerSet.luapulaFalls,
  },
  {
    title: 'Mansa Craft & Cassava Market',
    province: 'luapula',
    category: 'markets',
    image: IMG.market,
    price: 'From $25',
    duration: 'Half day',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-10',
    selfExplore: 'Zero',
    tags: ['Reed mats', 'Cassava', 'Fair price'],
    summary: 'Reed mats, clay pots, dried fish, and cassava flour — a working market walk with fair-price coaching.',
    providers: providerSet.luapulaFalls,
  },

  // ---------- Lusaka ----------
  {
    title: 'Lusaka Street Food & Nshima Tour',
    province: 'lusaka',
    category: 'delicacies',
    image: IMG.food,
    price: 'From $35',
    duration: '4 hours',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-12',
    selfExplore: 'Zero',
    tags: ['Nshima', 'Street food', 'Walking'],
    summary: 'Six stops across the capital — village chicken, kapenta, chikanda, and the best nshima kitchen on the route.',
    providers: providerSet.lusakaCity,
  },
  {
    title: 'Lusaka Rooftop & Live Band Night',
    province: 'lusaka',
    category: 'nightlife',
    image: IMG.nightlife,
    price: 'From $45',
    duration: 'Evening',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-10',
    selfExplore: 'Guided optional',
    tags: ['Live jazz', 'Rooftop', 'Driver included'],
    summary: 'Sundowners on a rooftop, a live band set, then the late Great East Road lounges with a driver on standby.',
    providers: providerSet.lusakaCity,
  },
  {
    title: 'Kabwata Village & Soweto Market Run',
    province: 'lusaka',
    category: 'markets',
    image: IMG.market,
    price: 'From $28',
    duration: 'Half day',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-10',
    selfExplore: 'Guided optional',
    tags: ['Carvers', 'Chitenge', 'Bargaining help'],
    summary: 'Meet the carvers at Kabwata Cultural Village, then dive into Soweto Market with someone who knows the prices.',
    providers: providerSet.lusakaCity,
  },

  // ---------- Muchinga ----------
  {
    title: 'Shiwa Ng’andu & Kapishya Hot Springs',
    province: 'muchinga',
    category: 'culture',
    image: IMG.culture,
    price: 'From $180',
    duration: '2 days',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-10',
    selfExplore: 'None',
    tags: ['Manor tour', 'Hot springs', 'Estate stay'],
    summary: 'Tour the improbable English manor on the Bemba plateau, then soak in the Kapishya springs until dark.',
    providers: providerSet.muchingaWilderness,
  },
  {
    title: 'North Luangwa Wilderness Walk',
    province: 'muchinga',
    category: 'adventure',
    image: IMG.safari,
    price: 'From $560',
    duration: '4 days',
    difficulty: 'High',
    season: 'Dry season',
    group: '2-6',
    selfExplore: 'None',
    tags: ['Restricted access', 'Fly camp', 'Fitness needed'],
    summary: 'Walk-in only, black rhino country, no roads to fall back on — Zambia’s most serious wilderness safari.',
    providers: providerSet.muchingaWilderness,
  },
  {
    title: 'Mutinondo Wilderness Dome Hikes',
    province: 'muchinga',
    category: 'nature',
    image: IMG.hills,
    price: 'From $85',
    duration: '3 days',
    difficulty: 'Moderate',
    season: 'Year-round',
    group: '1-10',
    selfExplore: 'Guided optional',
    tags: ['Granite domes', 'Camping', 'Waterfalls'],
    summary: 'Bare granite whalebacks, miombo trails, river swims, and a sunrise scramble with 40 km of empty view.',
    providers: providerSet.muchingaWilderness,
  },

  // ---------- Northern ----------
  {
    title: 'Kalambo Falls Gorge Hike',
    province: 'northern',
    category: 'adventure',
    image: IMG.waterfall,
    price: 'From $90',
    duration: '2 days',
    difficulty: 'High',
    season: 'Dry season',
    group: '2-8',
    selfExplore: 'None',
    tags: ['221m drop', 'Steep descent', 'Guide required'],
    summary: 'Stand at the lip of Africa’s second-highest single-drop falls, then take the guided descent toward the gorge floor.',
    providers: providerSet.northernLakes,
  },
  {
    title: 'Lake Tanganyika & Nsumbu Beach Days',
    province: 'northern',
    category: 'sightseeing',
    image: IMG.lake,
    price: 'From $240',
    duration: '4 days',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-8',
    selfExplore: 'Guided optional',
    tags: ['Snorkelling', 'Boat transfer', 'Remote'],
    summary: 'Clear-water bays, cichlid snorkelling, empty beaches, and the Mpulungu harbour run into Nsumbu park.',
    providers: providerSet.northernLakes,
  },
  {
    title: 'Bangweulu Shoebill Search',
    province: 'northern',
    category: 'wildlife',
    image: IMG.birds,
    price: 'From $295',
    duration: '3 days',
    difficulty: 'Moderate',
    season: 'Wet season',
    group: '2-6',
    selfExplore: 'None',
    tags: ['Shoebill', 'Black lechwe', 'Wet feet'],
    summary: 'Pole out into the swamp at first light for shoebill, then watch black lechwe move across the flooded plain.',
    providers: providerSet.northernLakes,
  },

  // ---------- North-Western ----------
  {
    title: 'Source of the Zambezi Pilgrimage',
    province: 'northwestern',
    category: 'sightseeing',
    image: IMG.forest,
    price: 'From $110',
    duration: '2 days',
    difficulty: 'Easy',
    season: 'Dry season',
    group: '1-10',
    selfExplore: 'Guided optional',
    tags: ['National monument', 'Forest walk', 'Long drive'],
    summary: 'Stand at the spring where Africa’s fourth-longest river begins, in the Mwinilunga forest near three borders.',
    providers: providerSet.northwesternSource,
  },
  {
    title: 'Likumbi Lya Mize Ceremony',
    province: 'northwestern',
    category: 'events',
    image: IMG.festival,
    price: 'From $130',
    duration: '3 days',
    difficulty: 'Easy',
    season: 'Calendar event',
    group: '2-20',
    selfExplore: 'None',
    tags: ['August', 'Makishi masks', 'Protocol briefing'],
    summary: 'The Luvale ceremony at Mize — Makishi masked dancers, royal procession, and a briefing on what not to photograph.',
    providers: providerSet.northwesternSource,
  },
  {
    title: 'West Lunga & Nyambwezu Expedition',
    province: 'northwestern',
    category: 'adventure',
    image: IMG.river,
    price: 'From $420',
    duration: '5 days',
    difficulty: 'High',
    season: 'Dry season',
    group: '2-6',
    selfExplore: 'None',
    tags: ['4x4 convoy', 'Self-sufficient', 'Remote'],
    summary: 'A genuine expedition — riverine forest, Nyambwezu Falls, sand tracks, and no fuel for long stretches.',
    providers: providerSet.northwesternSource,
  },

  // ---------- Southern ----------
  {
    title: 'Victoria Falls Adrenaline Pass',
    province: 'southern',
    category: 'adventure',
    image: IMG.falls,
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
    title: 'Livingstone Food & Market Walk',
    province: 'southern',
    category: 'delicacies',
    image: IMG.food,
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
    title: 'Mosi-oa-Tunya Rhino Walk',
    province: 'southern',
    category: 'wildlife',
    image: IMG.safari,
    price: 'From $95',
    duration: 'Half day',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-8',
    selfExplore: 'None',
    tags: ['White rhino', 'Armed scout', 'Park fees'],
    summary: 'Walk up to Zambia’s protected white rhino with scouts, then finish on the river loop for zebra and giraffe.',
    providers: providerSet.livingstoneAdventure,
  },
  {
    title: 'Lake Kariba Houseboat Nights',
    province: 'southern',
    category: 'nature',
    image: IMG.lake,
    price: 'From $260',
    duration: '3 days',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '4-16',
    selfExplore: 'Guided optional',
    tags: ['Houseboat', 'Tiger fishing', 'Crew included'],
    summary: 'Drift the Siavonga shoreline with a crew, fish for tigerfish at dawn, and watch elephants come down to drink.',
    providers: providerSet.karibaWater,
  },
  {
    title: 'Mukuni Village Craft Market Run',
    province: 'southern',
    category: 'markets',
    image: IMG.market,
    price: 'From $22',
    duration: 'Half day',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-12',
    selfExplore: 'Guided optional',
    tags: ['Carvings', 'Baskets', 'Village-led'],
    summary: 'Buy direct from Mukuni carvers and basket weavers, with a village guide handling introductions and prices.',
    providers: providerSet.livingstoneAdventure,
  },
  {
    title: 'Livingstone Sundowner Deck Crawl',
    province: 'southern',
    category: 'nightlife',
    image: IMG.nightlife,
    price: 'From $48',
    duration: 'Evening',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '2-12',
    selfExplore: 'Guided optional',
    tags: ['River cruise', 'Live music', 'Transfers'],
    summary: 'A river sunset cruise into lodge decks and live bands, ending on the traveler strip with transfers arranged.',
    providers: providerSet.livingstoneAdventure,
  },

  // ---------- Western ----------
  {
    title: 'Kuomboka Heritage Journey',
    province: 'western',
    category: 'culture',
    image: IMG.culture,
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
    title: 'Liuwa Plain Migration Camp',
    province: 'western',
    category: 'wildlife',
    image: IMG.plains,
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
    title: 'Ngonye Falls & Floodplain Canoe',
    province: 'western',
    category: 'nature',
    image: IMG.river,
    price: 'From $105',
    duration: '2 days',
    difficulty: 'Moderate',
    season: 'Dry season',
    group: '2-8',
    selfExplore: 'None',
    tags: ['Canoe', 'Falls', 'Sand roads'],
    summary: 'The wide horseshoe of Ngonye Falls, then a paddle through floodplain channels with a Lozi boatman.',
    providers: providerSet.barotseCulture,
  },
  {
    title: 'Barotse Village Homestay',
    province: 'western',
    category: 'community',
    image: IMG.village,
    price: 'From $60',
    duration: '2 days',
    difficulty: 'Easy',
    season: 'Year-round',
    group: '1-6',
    selfExplore: 'None',
    tags: ['Homestay', 'Fishing day', 'Local meals'],
    summary: 'Live the floodplain day — fishing at dawn, cassava fields, basket weaving, and evening drums with the family.',
    providers: providerSet.barotseCulture,
  },
]

const paths: ItineraryPath[] = [
  // ---- Adrenaline ----
  {
    title: '3-Day Adrenaline Path: Livingstone',
    province: 'Southern',
    provinceKey: 'southern',
    pathCategory: 'adrenaline',
    intensity: 'High',
    days: 3,
    steps: ['Victoria Falls viewpoint', 'White-water rafting', 'Bungee or gorge swing', 'Food market evening'],
    meta: 'High energy · 2 nights · Guide required for river activities',
    providers: providerSet.livingstoneAdventure,
  },
  {
    title: '5-Day Adrenaline Only: Batoka Overload',
    province: 'Southern',
    provinceKey: 'southern',
    pathCategory: 'adrenaline',
    intensity: 'Extreme',
    days: 5,
    steps: ['Bridge bungee & swing', 'Full-day grade V rafting', 'Abseil & flying fox', 'Microlight over the Falls', 'Devil’s Pool finish'],
    meta: 'Extreme · Waivers required · Not for first-timers or under-16s',
    providers: providerSet.livingstoneAdventure,
  },
  {
    title: '4-Day Adrenaline Path: Kalambo Gorge',
    province: 'Northern',
    provinceKey: 'northern',
    pathCategory: 'adrenaline',
    intensity: 'High',
    days: 4,
    steps: ['Mbala staging', 'Kalambo Falls rim', 'Guided gorge descent', 'Tanganyika kayak crossing'],
    meta: 'High · Fitness required · Remote evacuation times — carry cover',
    providers: providerSet.northernLakes,
  },
  {
    title: '5-Day Adrenaline Path: West Lunga Expedition',
    province: 'North-Western',
    provinceKey: 'northwestern',
    pathCategory: 'adrenaline',
    intensity: 'Extreme',
    days: 5,
    steps: ['Solwezi outfitting', 'Sand-track convoy', 'Nyambwezu Falls camp', 'River crossing day', 'Chavuma exit'],
    meta: 'Extreme · 4x4 convoy only · Self-sufficient fuel, water, and recovery gear',
    providers: providerSet.northwesternSource,
  },

  // ---- Wildlife ----
  {
    title: '4-Day Wildlife Path: South Luangwa',
    province: 'Eastern',
    provinceKey: 'eastern',
    pathCategory: 'wildlife',
    intensity: 'Moderate',
    days: 4,
    steps: ['Chipata arrival', 'Walking safari', 'Night drive', 'Village-led craft stop'],
    meta: 'Moderate · Dry season best · Park fees apply',
    providers: providerSet.luangwaSafari,
  },
  {
    title: '6-Day Wildlife Path: North Luangwa Wilderness',
    province: 'Muchinga',
    provinceKey: 'muchinga',
    pathCategory: 'wildlife',
    intensity: 'High',
    days: 6,
    steps: ['Mpika arrival', 'Fly-camp walk in', 'Black rhino sector', 'River crossing camp', 'Mutinondo decompression'],
    meta: 'High · Restricted access · Limited beds, book 6+ months out',
    providers: providerSet.muchingaWilderness,
  },
  {
    title: '5-Day Wildlife Path: Kasanka Bat Season',
    province: 'Central',
    provinceKey: 'central',
    pathCategory: 'wildlife',
    intensity: 'Easy',
    days: 5,
    steps: ['Kabwe overnight', 'Kasanka dusk hide', 'Dawn bat forest', 'Sitatunga hide', 'Kundalila Falls exit'],
    meta: 'Easy · November to mid-December only · Book the hide slots early',
    providers: providerSet.centralWild,
  },
  {
    title: '4-Day Wildlife Path: Liuwa Migration',
    province: 'Western',
    provinceKey: 'western',
    pathCategory: 'wildlife',
    intensity: 'Moderate',
    days: 4,
    steps: ['Mongu staging', 'Floodplain crossing', 'Liuwa mobile camp', 'Wildebeest plains day'],
    meta: 'Moderate · Wet season migration · 4x4 and recovery kit essential',
    providers: providerSet.barotseCulture,
  },

  // ---- Culture ----
  {
    title: '5-Day Heritage Path: Barotseland',
    province: 'Western',
    provinceKey: 'western',
    pathCategory: 'culture',
    intensity: 'Easy',
    days: 5,
    steps: ['Mongu base', 'Floodplain crossing', 'Kuomboka sites', 'Lozi homestay'],
    meta: 'Easy pace · Calendar sensitive · Local host recommended',
    providers: providerSet.barotseCulture,
  },
  {
    title: '4-Day Heritage Path: Bemba Plateau',
    province: 'Muchinga & Northern',
    provinceKey: 'muchinga',
    pathCategory: 'culture',
    intensity: 'Easy',
    days: 4,
    steps: ['Shiwa Ng’andu manor', 'Kapishya hot springs', 'Chinsali liberation sites', 'Moto Moto Museum, Mbala'],
    meta: 'Easy · Year-round · Long driving legs on the Great North Road',
    providers: providerSet.muchingaWilderness,
  },
  {
    title: '3-Day Heritage Path: Copperbelt Industrial Story',
    province: 'Copperbelt',
    provinceKey: 'copperbelt',
    pathCategory: 'culture',
    intensity: 'Easy',
    days: 3,
    steps: ['Copperbelt Museum, Ndola', 'Slave Tree & city walk', 'Open-pit viewpoint', 'Township music night'],
    meta: 'Easy · Year-round · Good tarmac, easy public transport',
    providers: providerSet.copperbeltCity,
  },

  // ---- Food & city ----
  {
    title: '2-Day Food & Night Path: Lusaka',
    province: 'Lusaka',
    provinceKey: 'lusaka',
    pathCategory: 'food',
    intensity: 'Easy',
    days: 2,
    steps: ['Soweto Market breakfast', 'Nshima kitchen crawl', 'Kabwata craft stop', 'Rooftop & live band night'],
    meta: 'Easy · Year-round · Vetted drivers for the late legs',
    providers: providerSet.lusakaCity,
  },
  {
    title: '3-Day Food Path: Zambezi Table, Livingstone',
    province: 'Southern',
    provinceKey: 'southern',
    pathCategory: 'food',
    intensity: 'Easy',
    days: 3,
    steps: ['Livingstone market walk', 'Bream on the riverbank', 'Mukuni village meal', 'Sunset cruise dinner'],
    meta: 'Easy · Year-round · Pairs well with any Falls activity day',
    providers: providerSet.selfGuided,
  },

  // ---- Nature & water ----
  {
    title: '4-Day Waterfall Path: Luapula Circuit',
    province: 'Luapula',
    provinceKey: 'luapula',
    pathCategory: 'nature',
    intensity: 'Moderate',
    days: 4,
    steps: ['Ntumbachushi Falls', 'Lumangwe Falls camp', 'Kabwelume viewpoint', 'Lake Mweru sunset'],
    meta: 'Moderate · Year-round · Slippery rock, sturdy shoes required',
    providers: providerSet.luapulaFalls,
  },
  {
    title: '3-Day Water Path: Lake Kariba',
    province: 'Southern',
    provinceKey: 'southern',
    pathCategory: 'nature',
    intensity: 'Easy',
    days: 3,
    steps: ['Siavonga arrival', 'Houseboat night one', 'Dawn tiger fishing', 'Shoreline game viewing'],
    meta: 'Easy · Year-round · Crew and catering included, no swimming off-boat',
    providers: providerSet.karibaWater,
  },
  {
    title: '4-Day Nature Path: Source of the Zambezi',
    province: 'North-Western',
    provinceKey: 'northwestern',
    pathCategory: 'nature',
    intensity: 'Moderate',
    days: 4,
    steps: ['Solwezi overnight', 'Mwinilunga forest', 'Zambezi source monument', 'Dambo birding morning'],
    meta: 'Moderate · Dry season · Very long drive legs, fuel planning matters',
    providers: providerSet.northwesternSource,
  },

  // ---- Festival-timed ----
  {
    title: 'Kuomboka Festival Path',
    province: 'Western',
    provinceKey: 'western',
    pathCategory: 'festival',
    intensity: 'Easy',
    days: 4,
    steps: ['Mongu arrival', 'Lealui palace visit', 'Kuomboka procession day', 'Limulunga celebration night'],
    meta: 'Easy · Date announced yearly (usually March–April) · Accommodation sells out',
    providers: providerSet.barotseCulture,
  },
  {
    title: 'Ncwala Festival Path',
    province: 'Eastern',
    provinceKey: 'eastern',
    pathCategory: 'festival',
    intensity: 'Easy',
    days: 3,
    steps: ['Chipata base', 'Mtenguleni ceremony grounds', 'Ngoni dance day', 'South Luangwa add-on'],
    meta: 'Easy · Late February · Protocol briefing included, photo rules apply',
    providers: providerSet.luangwaSafari,
  },
  {
    title: 'Likumbi Lya Mize Festival Path',
    province: 'North-Western',
    provinceKey: 'northwestern',
    pathCategory: 'festival',
    intensity: 'Moderate',
    days: 4,
    steps: ['Zambezi town arrival', 'Mize palace grounds', 'Makishi masked dance', 'Craft and mask workshop'],
    meta: 'Moderate · August · Remote, limited beds, book transport early',
    providers: providerSet.northwesternSource,
  },

  // ---- Road trip ----
  {
    title: '10-Day Overland Path: Great North Road',
    province: 'Multi-province',
    provinceKey: 'multi',
    pathCategory: 'roadtrip',
    intensity: 'Moderate',
    days: 10,
    steps: ['Lusaka', 'Kabwe & Mkushi', 'Kasanka', 'Mutinondo', 'Shiwa Ng’andu', 'Kasama', 'Mpulungu'],
    meta: 'Moderate · Dry season · Tarmac with rough patches, fuel every major town',
    providers: providerSet.muchingaWilderness,
  },
  {
    title: '8-Day Overland Path: Falls to Floodplain',
    province: 'Multi-province',
    provinceKey: 'multi',
    pathCategory: 'roadtrip',
    intensity: 'High',
    days: 8,
    steps: ['Livingstone', 'Sesheke', 'Ngonye Falls', 'Senanga', 'Mongu', 'Liuwa gateway'],
    meta: 'High · Dry season only · Sand sections, 4x4 strongly advised',
    providers: providerSet.barotseCulture,
  },

  // ---- Budget & slow ----
  {
    title: '7-Day Budget Path: Backpacker Loop',
    province: 'Multi-province',
    provinceKey: 'multi',
    pathCategory: 'budget',
    intensity: 'Easy',
    days: 7,
    steps: ['Lusaka hostel base', 'Bus to Livingstone', 'Free Falls viewpoints', 'Mukuni market', 'Bus to Choma museum'],
    meta: 'Easy · Year-round · Intercity buses, dorm beds, self-explore heavy',
    providers: providerSet.selfGuided,
  },
  {
    title: '5-Day Slow Path: Luapula on Public Transport',
    province: 'Luapula',
    provinceKey: 'luapula',
    pathCategory: 'budget',
    intensity: 'Easy',
    days: 5,
    steps: ['Mansa arrival', 'Ntumbachushi day trip', 'Local guesthouse nights', 'Lake Mweru village stay'],
    meta: 'Easy · Year-round · Minibus schedules are loose, keep days flexible',
    providers: providerSet.luapulaFalls,
  },
]

export default function ExperienceMarketplace() {
  const [province, setProvince] = useState<ProvinceKey>('national')
  const [category, setCategory] = useState<CategoryKey>('wildlife')
  const [query, setQuery] = useState('')
  const [pathCategory, setPathCategory] = useState<PathCategoryKey | 'all'>('all')
  const [pathProvince, setPathProvince] = useState<LocalProvinceKey | 'multi' | 'all'>('all')
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

  const exactMatch = filteredExperiences.length > 0

  const marketplacePool = exactMatch
    ? filteredExperiences
    : experiences.filter((experience) => province === 'national' || experience.province === province)

  const filteredPaths = useMemo(() => {
    return paths.filter((path) => {
      const matchesCategory = pathCategory === 'all' || path.pathCategory === pathCategory
      const matchesProvince = pathProvince === 'all' || path.provinceKey === pathProvince
      return matchesCategory && matchesProvince
    })
  }, [pathCategory, pathProvince])

  const activePathCategory = pathCategories.find((item) => item.key === pathCategory)

  const pathProvinceOptions = useMemo(() => {
    const used = new Set(paths.map((path) => path.provinceKey))
    const options: Array<{ key: LocalProvinceKey | 'multi' | 'all'; label: string }> = [{ key: 'all', label: 'All provinces' }]
    provinces.forEach((item) => {
      if (item.key !== 'national' && used.has(item.key as LocalProvinceKey)) {
        options.push({ key: item.key as LocalProvinceKey, label: item.label })
      }
    })
    if (used.has('multi')) options.push({ key: 'multi', label: 'Multi-province' })
    return options
  }, [])

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
                All 10 provinces · book local paths across Zambia
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                Zambia experience marketplace
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-stone-100/85 sm:text-lg">
                Browse national highlights first, then filter by any of Zambia’s ten provinces to find local food, safaris, culture, events, providers, safety notes, and bookable itineraries nearby.
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
                <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{selectedProvince.short}</p>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-zinc-600">{categoryCopy}</p>
              </div>

              <div className="flex min-h-[52px] w-full max-w-xl items-center gap-3 border border-zinc-300 bg-white px-4">
                <Search className="h-5 w-5 text-zinc-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search operators, permits, places"
                  className="h-full w-full bg-transparent text-sm font-bold outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="mt-6 border border-zinc-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black">
                <MapPin className="h-4 w-4 text-[#169b62]" />
                Provinces
                <span className="ml-auto text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">
                  {marketplacePool.length} listing{marketplacePool.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {provinces.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setProvince(item.key)}
                    title={item.short}
                    className={`border px-3 py-2 text-left transition ${
                      province === item.key
                        ? 'border-[#169b62] bg-[#169b62] text-white'
                        : 'border-zinc-300 bg-white text-zinc-700 hover:border-[#ff8200]'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-[0.08em]">{item.label}</span>
                    <span className="mt-0.5 block text-[10px] font-semibold opacity-70">{item.short}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
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

              </aside>

              <div>
                {!exactMatch && (
                  <div className="mb-4 border-l-4 border-[#ff8200] bg-white px-4 py-3 text-sm font-bold text-zinc-600">
                    No {selectedCategory.label.toLowerCase()} listing matches that yet — showing everything else in {selectedProvince.label}.
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {marketplacePool.map((experience) => (
                    <article key={experience.title} className="overflow-hidden border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-[4/3] bg-zinc-900">
                        <img src={experience.image} alt={experience.title} className="h-full w-full object-cover" />
                        <div className="absolute left-3 top-3 bg-black/75 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                          {experience.season}
                        </div>
                        <div className="absolute right-3 top-3 bg-[#169b62] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                          {provinces.find((item) => item.key === experience.province)?.label}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xl font-black leading-6">{experience.title}</h3>
                          <span className="whitespace-nowrap bg-[#169b62] px-2 py-1 text-xs font-black text-white">{experience.price}</span>
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">{experience.summary}</p>
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

            <div className="mt-8 border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/60">
                <Filter className="h-4 w-4 text-[#ff8200]" />
                Path type
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPathCategory('all')}
                  className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-[0.1em] transition ${
                    pathCategory === 'all' ? 'border-[#ff8200] bg-[#ff8200] text-black' : 'border-white/15 bg-black/30 text-white/75 hover:border-[#ff8200]'
                  }`}
                >
                  <Route className="h-4 w-4" />
                  All paths
                </button>
                {pathCategories.map((item) => {
                  const Icon = item.icon
                  const active = pathCategory === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setPathCategory(item.key)}
                      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-[0.1em] transition ${
                        active ? 'border-[#ff8200] bg-[#ff8200] text-black' : 'border-white/15 bg-black/30 text-white/75 hover:border-[#ff8200]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-white/60">Province</span>
                  {pathProvinceOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setPathProvince(option.key)}
                      className={`border px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition ${
                        pathProvince === option.key
                          ? 'border-[#169b62] bg-[#169b62] text-white'
                          : 'border-white/15 bg-black/30 text-white/70 hover:border-[#169b62]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-black uppercase tracking-[0.12em] text-white/45">
                  {filteredPaths.length} path{filteredPaths.length === 1 ? '' : 's'}
                </span>
              </div>

              {activePathCategory && (
                <p className="mt-4 border-l-4 border-[#169b62] bg-black/30 px-4 py-3 text-sm font-semibold text-white/70">
                  {activePathCategory.blurb}
                </p>
              )}
            </div>

            {filteredPaths.length === 0 ? (
              <div className="mt-6 border border-white/10 bg-white/[0.04] p-8 text-center">
                <p className="text-lg font-black">Nothing on that combination yet.</p>
                <p className="mt-2 text-sm font-semibold text-white/60">Try another province, or clear the province filter to see every path of this type.</p>
                <button
                  type="button"
                  onClick={() => setPathProvince('all')}
                  className="mt-5 inline-flex items-center gap-2 bg-[#ff8200] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-black"
                >
                  Clear province filter
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {filteredPaths.map((path) => {
                  const meta = pathCategories.find((item) => item.key === path.pathCategory)
                  const MetaIcon = meta?.icon ?? Route
                  return (
                    <article key={path.title} className="flex flex-col border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="bg-[#d21034] px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">{path.province}</span>
                        <Star className="h-5 w-5 text-[#ff8200]" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 border border-[#ff8200]/60 bg-[#ff8200]/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[#ff8200]">
                          <MetaIcon className="h-3.5 w-3.5" />
                          {meta?.label}
                        </span>
                        <span className="border border-white/15 px-2 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/60">{path.intensity}</span>
                        <span className="border border-white/15 px-2 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/60">{path.days} days</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-black">{path.title}</h3>
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
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      {selectedListing && <ContactModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  )
}

function isExperience(listing: Experience | ItineraryPath): listing is Experience {
  return 'category' in listing
}

type FactRow = { label: string; value: string; strong?: boolean }

function buildFacts(listing: Experience | ItineraryPath): FactRow[] {
  if (isExperience(listing)) {
    const text = `${listing.tags.join(' ')} ${listing.summary}`.toLowerCase()
    const permitTags = listing.tags.filter((tag) => /park fee|permit|waiver|guide required|protocol|restricted|licen|only|access/i.test(tag))

    return [
      { label: 'Budget tier', value: listing.price, strong: true },
      { label: 'Trip duration', value: listing.duration, strong: true },
      { label: 'Difficulty / fitness', value: listing.difficulty, strong: true },
      { label: 'Group size', value: `${listing.group} people`, strong: true },
      { label: 'Best season', value: listing.season },
      { label: '4x4 needed', value: /4x4/.test(text) ? 'Yes — 4x4 vehicle required' : 'No — normal vehicle is fine' },
      { label: 'Permit info', value: permitTags.length ? permitTags.join(' · ') : 'No special permit or fee listed' },
      {
        label: 'Can you self-explore?',
        value:
          listing.selfExplore === 'Zero'
            ? 'Yes — go on your own, no guide needed'
            : listing.selfExplore === 'Guided optional'
              ? 'Partly — a guide is optional but helpful'
              : 'No — a licensed guide or operator is required',
      },
      {
        label: 'Offline friendly',
        value: /remote|camp|4x4|expedition/.test(text)
          ? 'Low signal — download maps and save contacts first'
          : 'Usually good signal — but save contacts anyway',
      },
    ]
  }

  const meta = pathCategories.find((item) => item.key === listing.pathCategory)
  const text = listing.meta.toLowerCase()

  return [
    { label: 'Path type', value: meta?.label ?? 'Itinerary path', strong: true },
    { label: 'Trip duration', value: `${listing.days} days`, strong: true },
    { label: 'Difficulty / fitness', value: listing.intensity, strong: true },
    { label: 'Province', value: listing.province, strong: true },
    { label: 'Stops on this path', value: `${listing.steps.length} stops` },
    { label: '4x4 needed', value: /4x4|sand|convoy/.test(text) ? 'Yes — 4x4 vehicle required' : 'No — normal vehicle is fine' },
    { label: 'Permit info', value: /park fee|permit|waiver|restricted|protocol/.test(text) ? 'Park fees or permits apply — confirm at booking' : 'No special permit listed' },
    { label: 'Booking note', value: listing.meta },
  ]
}

function ContactModal({ listing, onClose }: { listing: Experience | ItineraryPath; onClose: () => void }) {
  const facts = buildFacts(listing)
  const tags = isExperience(listing) ? listing.tags : []
  const [showMinistry, setShowMinistry] = useState(false)

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

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_340px]">
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

          <aside className="space-y-4">
            <div className="border-2 border-[#ff8200] bg-white p-4 shadow-[8px_8px_0_#050505]">
              <p className="text-sm font-black">Practical filters</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-zinc-500">
                These decide whether this experience is realistic to book today.
              </p>

              <dl className="mt-4 grid gap-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="border border-zinc-200 bg-[#fff7ed] px-3 py-2">
                    <dt className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-500">{fact.label}</dt>
                    <dd className={`mt-1 leading-5 text-zinc-900 ${fact.strong ? 'text-base font-black' : 'text-sm font-bold'}`}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {tags.length > 0 && (
                <div className="mt-4 border-t border-zinc-200 pt-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-500">Good to know</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="border border-zinc-300 bg-white px-2 py-1 text-xs font-bold text-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowMinistry(true)}
              className="flex w-full items-center justify-center gap-2 bg-[#169b62] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#0f7a4c]"
            >
              <Phone className="h-4 w-4" />
              Call the agency
            </button>
          </aside>
        </div>
      </div>

      {showMinistry && <MinistryModal onClose={() => setShowMinistry(false)} />}
    </div>
  )
}

type OfficialContact = {
  name: string
  role: string
  address?: string
  phone?: string
  website: string
  websiteLabel: string
  note: string
  primary?: boolean
}

const officialContacts: OfficialContact[] = [
  {
    name: 'Zambia Tourism Agency (ZTA)',
    role: 'Licensing & grading — start here',
    address: 'Abacus House, Kabelenga Road, Lusaka',
    phone: '+260 211 229087',
    website: 'https://www.zambia.travel/zta.html',
    websiteLabel: 'zambia.travel',
    note: 'The statutory body that licenses and grades tourism enterprises and accommodation. Operators register here first.',
    primary: true,
  },
  {
    name: 'Ministry of Tourism',
    role: 'Policy & oversight',
    website: 'https://www.mot.gov.zm/',
    websiteLabel: 'mot.gov.zm',
    note: 'Sets tourism policy and oversees the statutory bodies. Use the ministry site’s Contact page for the current switchboard and departmental lines.',
  },
  {
    name: 'National Heritage Conservation Commission',
    role: 'Heritage sites & monuments',
    website: 'https://www.mot.gov.zm/',
    websiteLabel: 'Via Ministry of Tourism',
    note: 'Permissions for filming, events, or guided access at national monuments and heritage sites.',
  },
  {
    name: 'Zambia Institute for Tourism & Hospitality Studies',
    role: 'Guide training & accreditation',
    website: 'https://www.mot.gov.zm/',
    websiteLabel: 'Via Ministry of Tourism',
    note: 'Training and qualifications for guides, lodge staff, and hospitality operators.',
  },
]

function MinistryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl border border-white/10 bg-white text-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#169b62]">Official tourism bodies</p>
            <h2 className="mt-2 text-2xl font-black">Ministry of Tourism contacts</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">
              To list a tour operation, verify a provider, or report a problem with one, go through the official channels below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 flex-none items-center justify-center bg-zinc-950 text-white"
            aria-label="Close ministry contacts"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 p-5">
          {officialContacts.map((contact) => (
            <article
              key={contact.name}
              className={`p-4 ${contact.primary ? 'border-2 border-[#ff8200] bg-[#fff7ed] shadow-[6px_6px_0_#050505]' : 'border border-zinc-200 bg-white'}`}
            >
              <span
                className={`px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white ${
                  contact.primary ? 'bg-[#d21034]' : 'bg-[#169b62]'
                }`}
              >
                {contact.role}
              </span>
              <h3 className="mt-3 text-lg font-black leading-6">{contact.name}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">{contact.note}</p>

              <div className="mt-4 grid gap-2 text-sm font-bold text-zinc-800">
                {contact.address && (
                  <div className="flex items-start gap-2 border border-zinc-200 bg-white px-3 py-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-none text-[#d21034]" />
                    {contact.address}
                  </div>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2 hover:border-[#ff8200]"
                  >
                    <Phone className="h-4 w-4 flex-none text-[#d21034]" />
                    {contact.phone}
                  </a>
                )}
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2 hover:border-[#ff8200]"
                >
                  <ExternalLink className="h-4 w-4 flex-none text-[#d21034]" />
                  {contact.websiteLabel}
                </a>
              </div>
            </article>
          ))}

          <p className="border-l-4 border-zinc-300 bg-stone-50 px-4 py-3 text-xs font-semibold leading-5 text-zinc-500">
            Contact details change. Confirm the current phone numbers and office hours on the official websites before travelling to an office.
          </p>
        </div>
      </div>
    </div>
  )
}
