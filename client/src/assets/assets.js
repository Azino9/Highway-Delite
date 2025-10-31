import logo from "./logo.svg";
import arrow_icon from "./arrow_icon.svg"
import tick_icon from "./tick_icon.svg"
import menu_icon from "./menu_icon.svg"
import close_icon from "./close_icon.svg"
import BoatCruise from "./BoatCruise.jpg"
import BunjeeJump from "./Bunjee-jumping.jpg"
import CoffeeTrail from "./Coffee-Trail.jpg"
import CoffeeMount from "./CoffeeMount.jpg"
import KayakingFull from "./Kayaking-Full.jpg" 
import Kayaking from "./Kayaking.jpg"
import NandiHills from "./Nandi-Hills.jpg"
import NandiHillsSunrise from "./NandiHills-Sunrise.jpg"


export const cityList = ['New York', 'Los Angeles', 'Houston', 'Chicago']

export const assets = {
    logo,
    arrow_icon,
    tick_icon,
    menu_icon,
    close_icon,
}

export const menuLinks = [
    { name: "Home", path: "/" },

]



export const experiences = [
    {
        _id: 'exp_001',
        owner: 'owner_001',
        name: 'Kayaking',
        images: Kayaking,
        description: 'Glide over glassy waters at dawn — all gear and guidance included. Perfect for first-timers and thrill-seekers.',
        about: 'Start your day with an unforgettable early-morning paddle. Our expert guides lead small groups along scenic waterways where you’ll spot birdlife, weave through tranquil coves, and pause for a relaxed picnic. We provide top-quality kayaks, safety gear, and a short skills briefing so everyone leaves confident and smiling. This is a curated, social adventure designed to deliver beautiful photos and shared memories.',
        availability: [
            // sold out on the earlier morning slot, second slot has a few seats
            { date: '2025-11-01', times: [ { id: 't1', time: '05:00 AM', capacity: 0 }, { id: 't2', time: '06:30 AM', capacity: 8 } ] },
            // both slots available
            { date: '2025-11-05', times: [ { id: 't1', time: '05:00 AM', capacity: 12 }, { id: 't2', time: '06:30 AM', capacity: 6 } ] },
            // fully unavailable date (closed)
            { date: '2025-11-08', times: [ { id: 't1', time: '05:00 AM', capacity: 0 }, { id: 't2', time: '06:30 AM', capacity: 0 } ], available: false },
            // large capacity later in the week
            { date: '2025-11-10', times: [ { id: 't1', time: '05:00 AM', capacity: 16 } ] }
        ],
        pricePerPerson: 999,
        location: 'Kerala',
        category: 'Udupi',
        duration: '3 hours',
        highlights: ['Sunrise view', 'Professional pilot', 'Breakfast included'],
        times: [
            { id: 't1', time: '05:00 AM', capacity: 16 },
            { id: 't2', time: '06:30 AM', capacity: 16 }
        ],
        rating: 4.9,
        reviewsCount: 124,
        isAvailable: true,
        createdAt: '2025-01-10T08:00:00.000Z'
    },
    {
        _id: 'exp_002',
        owner: 'owner_002',
        name: ' Nandi Hills Sunrise',
        images: NandiHills,
        description: 'Watch the world wake up from the hilltop — a crisp, camera-ready sunrise hike.',
        about: 'Join a small-group hike to the most breathtaking vantage points at Nandi Hills. Our local guides bring the route to life with stories about the area, point out hidden photo spots, and serve warm drinks as the sun spreads color across the valley. It’s intimate, relaxed, and designed for unforgettable sunrise photos — a perfect short escape from the city.',
        availability: [
        // closed for maintenance on this date (moved from 11-02 to 11-12 to avoid repeating same unavailable date)
        { date: '2025-11-12', times: [ { id: 't1', time: '05:30 AM', capacity: 0 } ], available: false },
        // a small-group date with limited seats and one sold-out late slot
        { date: '2025-11-03', times: [ { id: 't1', time: '05:30 AM', capacity: 6 }, { id: 't2', time: '07:00 AM', capacity: 0 } ] },
        // more seats later in the week
        { date: '2025-11-06', times: [ { id: 't1', time: '05:30 AM', capacity: 10 } ] }
    ],
        pricePerPerson: 899,
        location: 'Karnataka',
        category: 'Bangalore',
        duration: '3 hours',
        highlights: ['Local tastings', 'Small groups', 'Historical anecdotes'],
        times: [
            { id: 't1', time: '11:00 AM', capacity: 10 },
            { id: 't2', time: '02:00 PM', capacity: 10 }
        ],
        rating: 4.7,
        reviewsCount: 58,
        isAvailable: true,
        createdAt: '2025-02-05T10:30:00.000Z'
    },
    {
        _id: 'exp_003',
        owner: 'owner_003',
        name: 'Coffee Trail',
        images: CoffeeMount,
        description: 'Sip single-origin coffee at its source — tasting flights, plantation stroll, and insider stories.',
        about: 'Wander fragrant coffee rows with passionate growers, sample rare and seasonal brews in guided tasting flights, and discover the journey from cherry to cup. This experience blends gentle estate walks, expert-led tastings, and behind-the-scenes insights into sustainable farming. Expect mouth-watering aromas, friendly conversation, and a new appreciation for every sip.',
        availability: [
        // one sold-out early slot and a wide-open evening
        { date: '2025-11-03', times: [ { id: 't1', time: '04:00 PM', capacity: 0 }, { id: 't2', time: '05:30 PM', capacity: 20 } ] },
        // plentiful capacity
        { date: '2025-11-07', times: [ { id: 't1', time: '05:30 PM', capacity: 30 } ] }
    ],
        pricePerPerson: 1299,
        location: 'Kerala',
        category: 'Coorg',
        duration: '2 hours',
        highlights: ['Sunset', 'Drinks included', 'Optional swim'],
        times: [
            { id: 't1', time: '05:30 PM', capacity: 30 }
        ],
        rating: 4.8,
        reviewsCount: 210,
        isAvailable: true,
        createdAt: '2025-03-12T17:00:00.000Z'
    },
    {
        _id: 'exp_004',
        owner: 'owner_004',
        name: 'Jungle Boating',
        images: KayakingFull,
        description: 'Slip into silent waterways and meet the wild — guided jungle boating with comfort and care.',
        about: 'Cruise through narrow channels framed by towering foliage and listen for the calls of jungle life. Our experienced skippers know where to find the best wildlife viewing and create calm, safe moments to enjoy nature up-close. Boats include life jackets and refreshments, and the experience is paced to maximize sightings and photo opportunities.',
        availability: [
        // morning good, afternoon sold out
        { date: '2025-11-04', times: [ { id: 't1', time: '09:00 AM', capacity: 12 }, { id: 't2', time: '01:00 PM', capacity: 0 } ] },
        // date fully unavailable (river closed)
        { date: '2025-11-08', times: [ { id: 't1', time: '09:00 AM', capacity: 0 } ], available: false }
    ],
        pricePerPerson: 999,
        location: 'Karnataka',
        category: 'Udupi, Karnataka',
        duration: '4 hours',
        highlights: ['Bikes provided', 'Experienced guide', 'Trail snacks'],
        times: [
            { id: 't1', time: '09:00 AM', capacity: 12 },
            { id: 't2', time: '01:00 PM', capacity: 12 }
        ],
        rating: 4.6,
        reviewsCount: 76,
        isAvailable: true,
        createdAt: '2025-04-01T09:00:00.000Z'
    },
    {
        _id: 'exp_005',
        owner: 'owner_005',
        name: 'Nandi Hills Sunrise',
        images: NandiHillsSunrise,
        description: 'Rise early, climb easy trails, and watch the sunrise spill color across the plains.',
        about: 'Walk with a small group to a spectacular vantage point where dawn fractures into color. This experience includes guided trail navigation, a light breakfast at the top, and plenty of time for photos and quiet reflection. The route is chosen for great views and gentle climbs — ideal for photographers and anyone craving a peaceful morning reset.',
        availability: [
        // available early morning
        { date: '2025-11-05', times: [ { id: 't1', time: '06:00 AM', capacity: 8 } ] },
        // sold out date
        { date: '2025-11-09', times: [ { id: 't1', time: '06:00 AM', capacity: 0 } ], available: false }
    ],
        pricePerPerson: 899,
        location: 'Karnataka',
        category: 'Bangalore',
        duration: '2.5 hours',
        highlights: ['Small group', 'Instructor feedback', 'Location scouting'],
        times: [
            { id: 't1', time: '06:00 PM', capacity: 8 }
        ],
        rating: 4.95,
        reviewsCount: 34,
        isAvailable: true,
        createdAt: '2025-05-20T18:00:00.000Z'
    },
    {
        _id: 'exp_006',
        owner: 'owner_006',
        name: 'Boat Cruise',
        images: BoatCruise,
        description: 'Shop, cook and feast — a market-to-table boat experience led by a local chef.',
        about: 'Dive into local flavors: we’ll walk a vibrant market with a chef to choose the season’s best ingredients, then head to a comfortable boat where you’ll learn to prepare traditional dishes together. This hands-on culinary adventure ends with a shared lunch and plenty of stories — it’s food, culture, and company in one delicious package.',
        availability: [
        // midday sold out on second slot
        { date: '2025-11-06', times: [ { id: 't1', time: '09:00 AM', capacity: 10 }, { id: 't2', time: '03:00 PM', capacity: 0 } ] },
        { date: '2025-11-10', times: [ { id: 't1', time: '09:00 AM', capacity: 5 } ] }
    ],
        pricePerPerson: 999,
        location: 'Kerala',
        category: 'Sunderban',
        duration: '4 hours',
        highlights: ['Market visit', 'Hands-on cooking', 'Meal included'],
        times: [
            { id: 't1', time: '09:00 AM', capacity: 10 },
            { id: 't2', time: '03:00 PM', capacity: 10 }
        ],
        rating: 4.85,
        reviewsCount: 89,
        isAvailable: true,
        createdAt: '2025-06-02T09:00:00.000Z'
    }
    ,
    {
        _id: 'exp_007',
        owner: 'owner_007',
        name: 'Bunjee Jumping',
        images: BunjeeJump,
        description: 'Leap, scream, laugh — a high-adrenaline bunjee jump with panoramic views and pro supervision.',
        about: 'Experience an unforgettable adrenaline spike from a certified platform with top-tier safety gear and professional staff. After a full safety briefing and equipment check, you’ll step up to a dramatic drop over stunning scenery. Most guests describe it as equal parts terrifying and euphoric — and totally worth it. Bring a friend to share the moment (and the epic footage).',
        availability: [
        // two dates with mixed availability
        { date: '2025-11-07', times: [ { id: 't1', time: '08:30 PM', capacity: 14 } ] },
        { date: '2025-11-09', times: [ { id: 't1', time: '08:30 PM', capacity: 0 } ] }
    ],
        pricePerPerson: 999,
        location: 'Jammu and Kashmir',
        category: 'Manali',
        duration: '2 hours',
        highlights: ['Bioluminescent waters', 'Expert guide', 'Small groups'],
        times: [
            { id: 't1', time: '08:30 PM', capacity: 14 }
        ],
        rating: 4.92,
        reviewsCount: 47,
        isAvailable: true,
        createdAt: '2025-07-15T20:30:00.000Z'
    },
    {
        _id: 'exp_008',
        owner: 'owner_008',
        name: 'Coffee Trail - RomeShadow',
        images: CoffeeTrail,
        description: 'Roam hidden streets and skip the lines — intimate history walk with priority museum access.',
        about: 'Follow a knowledgeable local guide through charming streets, uncovering fascinating stories and secret corners often missed by visitors. The tour ends with priority entry to the museum so you avoid queues and spend more time with the exhibits. It’s an engaging, family-friendly way to connect with the city’s past and present.',
        availability: [
            // morning available, afternoon sold out
            { date: '2025-11-08', times: [ { id: 't1', time: '10:00 AM', capacity: 20 }, { id: 't2', time: '02:00 PM', capacity: 0 } ] },
            { date: '2025-11-11', times: [ { id: 't1', time: '10:00 AM', capacity: 12 } ] }
        ],
        pricePerPerson: 1299,
        location: 'Kerala',
        category: 'Coorg',
        duration: '4 hours',
        highlights: ['Guided tour', 'Museum entry', 'Family friendly'],
        times: [
            { id: 't1', time: '10:00 AM', capacity: 20 },
            { id: 't2', time: '02:00 PM', capacity: 20 }
        ],
        rating: 4.75,
        reviewsCount: 150,
        isAvailable: true,
        createdAt: '2025-08-05T10:00:00.000Z'
    }
];
