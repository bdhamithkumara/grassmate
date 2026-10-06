import type { Environment, Mission, MissionRequest, Weather } from "./types";
import { maxMinutesFor } from "./types";

interface FallbackMission extends Mission {
  /** Weathers this mission suits; omitted means any. */
  weather?: Weather[];
  /** Environments this mission suits; omitted means any. */
  environments?: Environment[];
}

const DRY: Weather[] = ["sunny", "cloudy", "cold", "hot"];
const MILD: Weather[] = ["sunny", "cloudy"];
const GREEN: Environment[] = ["park", "forest", "village"];

export const FALLBACK_MISSIONS: FallbackMission[] = [
  {
    emoji: "🌿", title: "Leaf Hunter", difficulty: "easy", duration: 20,
    description: "Wander slowly and collect the shapes nature hides in plain sight.",
    steps: ["Find three different leaf shapes.", "Compare their edges: smooth, toothed or wavy.", "Pick a favourite and remember where it grows."],
    reward: "More curiosity.", environments: GREEN,
    encouragement: "Nice hunting! Tomorrow, try finding a leaf the size of your hand.",
    reflection: "Which leaf would you never have noticed before today?",
  },
  {
    emoji: "🐦", title: "Five Sounds", difficulty: "easy", duration: 15,
    description: "Find a quiet spot and collect five sounds you usually tune out.",
    steps: ["Walk to the quietest place nearby.", "Stand still for one minute and just listen.", "Name five different sounds.", "Find one more sound somewhere new."],
    reward: "Sharper ears.",
    encouragement: "Lovely listening. Tomorrow, try to hear the farthest sound you can.",
    reflection: "Which sound surprised you the most?",
  },
  {
    emoji: "📷", title: "Color Hunt", difficulty: "easy", duration: 20,
    description: "Pick a colour and spot it everywhere, without taking a single photo.",
    steps: ["Choose one colour before you leave.", "Find it in five different places.", "Notice its lightest and darkest versions.", "Remember the most unexpected one."],
    reward: "A brighter day.",
    encouragement: "Great eye! Tomorrow, hunt for the opposite colour.",
    reflection: "Where did your colour show up that you didn't expect?",
  },
  {
    emoji: "🍂", title: "Quiet Corner", difficulty: "easy", duration: 15,
    description: "Find a small, peaceful spot and let it be yours for a few minutes.",
    steps: ["Look for a corner where few people pass.", "Sit or stand there comfortably.", "Take ten slow breaths.", "Notice three details you missed at first."],
    reward: "A calmer mind.",
    encouragement: "Well rested. Tomorrow, find a new corner to claim.",
    reflection: "How did you feel before and after your quiet minutes?",
  },
  {
    emoji: "🌳", title: "Tiny Adventure", difficulty: "easy", duration: 15,
    description: "Explore a space smaller than a parking spot like it's a whole world.",
    steps: ["Choose a tiny patch of ground.", "Crouch down and look closely.", "Count the different living things you see.", "Give the tiny world a name."],
    reward: "A new perspective.", environments: GREEN,
    encouragement: "What a world! Tomorrow, look at a tiny patch somewhere else.",
    reflection: "What lives in a space that small?",
  },
  {
    emoji: "🌸", title: "Hidden Nature", difficulty: "easy", duration: 20,
    description: "Find nature growing where nobody planted it.",
    steps: ["Look in cracks, walls and gutters.", "Find three plants growing on their own.", "Notice how each one found light.", "Pick the bravest one."],
    reward: "Respect for small things.", environments: ["city", "village"],
    encouragement: "Nature is everywhere. Tomorrow, look up for plants on rooftops.",
    reflection: "Which plant seemed the most determined to grow?",
  },
  {
    emoji: "🚶", title: "Slow Walk", difficulty: "easy", duration: 15,
    description: "Walk at half your normal speed and see what appears.",
    steps: ["Pick a short route you know.", "Walk it at half your usual pace.", "Notice your feet touching the ground.", "Spot one thing you've never seen there."],
    reward: "Patience.",
    encouragement: "Slow is a superpower. Tomorrow, try the same route even slower.",
    reflection: "What did slowing down show you?",
  },
  {
    emoji: "☀️", title: "Morning Explorer", difficulty: "medium", duration: 30,
    description: "Treat a familiar route like a place you're visiting for the first time.",
    steps: ["Leave by a door or path you rarely use.", "Take one turn you've never taken.", "Find something that would make a good postcard.", "Find your way back without a map."],
    reward: "Fresh eyes.", weather: DRY,
    encouragement: "Explorer badge earned in spirit. Tomorrow, try a different first turn.",
    reflection: "What felt new about a place you thought you knew?",
  },
  {
    emoji: "☁️", title: "Cloud Stories", difficulty: "easy", duration: 15,
    description: "Find shapes in the clouds and invent a tiny story about them.",
    steps: ["Find an open patch of sky.", "Spot three cloud shapes.", "Give each one a character.", "Make up a one-line story linking them."],
    reward: "A playful mind.", weather: ["cloudy", "sunny"],
    encouragement: "Great story. Tomorrow, watch how fast the clouds move.",
    reflection: "What was your favourite cloud character?",
  },
  {
    emoji: "🌧️", title: "Rain Listener", difficulty: "easy", duration: 15,
    description: "Find shelter outside and listen to the rain play different surfaces.",
    steps: ["Find a covered spot outdoors.", "Listen to rain on three different surfaces.", "Watch where the water runs.", "Take three deep breaths of rainy air."],
    reward: "Calm.", weather: ["rainy"],
    encouragement: "Rain has its own music. Tomorrow, notice how the world smells after it.",
    reflection: "What did the rain sound like on different things?",
  },
  {
    emoji: "💧", title: "Puddle Mirror", difficulty: "easy", duration: 20,
    description: "Find the sky reflected on the ground.",
    steps: ["Look for puddles after or during the rain.", "Find one that reflects a tree or building.", "Watch the reflection ripple.", "Find the clearest mirror on your walk."],
    reward: "Wonder.", weather: ["rainy", "cloudy"],
    encouragement: "Beautiful find. Tomorrow, see if your puddle is still there.",
    reflection: "What did the world look like upside down?",
  },
  {
    emoji: "❄️", title: "Breath Clouds", difficulty: "easy", duration: 15,
    description: "Wrap up warm and notice how the cold changes everything.",
    steps: ["Dress warmly and step outside.", "Watch your breath in the air.", "Find three things the cold has changed.", "Walk briskly for five minutes to warm up."],
    reward: "Fresh energy.", weather: ["cold"],
    encouragement: "Brave and refreshed. Tomorrow, notice how the cold feels at a different time.",
    reflection: "What does cold air make you notice?",
  },
  {
    emoji: "🌞", title: "Shade Seeker", difficulty: "easy", duration: 15,
    description: "Move from shade to shade and find the coolest spot around.",
    steps: ["Bring water.", "Walk only in the shade.", "Find the coolest spot you can.", "Rest there for three minutes."],
    reward: "A cool head.", weather: ["hot"],
    encouragement: "Smart and cool. Tomorrow, go out a little earlier when it's milder.",
    reflection: "Where was the coolest spot, and why do you think it was?",
  },
  {
    emoji: "🌊", title: "Wave Counter", difficulty: "easy", duration: 20,
    description: "Watch the water and find the rhythm of the waves.",
    steps: ["Stand or sit at a safe distance from the water.", "Count ten waves.", "Spot the biggest one.", "Breathe in time with the waves for a minute."],
    reward: "Calm rhythm.", environments: ["beach"],
    encouragement: "The sea says hi. Tomorrow, try counting waves at a different hour.",
    reflection: "How did the rhythm of the waves make you feel?",
  },
  {
    emoji: "🐚", title: "Shoreline Treasure", difficulty: "easy", duration: 30,
    description: "Walk the shoreline and find natural treasures, leaving them where they are.",
    steps: ["Walk slowly along the shore.", "Find a shell, a smooth stone and something surprising.", "Look closely at each one.", "Leave them all where you found them."],
    reward: "Delight.", environments: ["beach"], weather: DRY,
    encouragement: "Treasure found. Tomorrow, look for the smallest one you can.",
    reflection: "Which treasure would you most like to remember?",
  },
  {
    emoji: "🌲", title: "Tree Friend", difficulty: "easy", duration: 20,
    description: "Choose a tree and get to know it properly.",
    steps: ["Pick a tree that catches your eye.", "Feel its bark with your hand.", "Look up through its branches.", "Guess how old it might be."],
    reward: "A new friend.", environments: ["park", "forest", "village"],
    encouragement: "Your tree will be there tomorrow. Visit and see what changed.",
    reflection: "What did you notice about your tree up close?",
  },
  {
    emoji: "🍄", title: "Forest Detective", difficulty: "medium", duration: 30,
    description: "Look for signs that animals have passed by.",
    steps: ["Walk a marked path.", "Look for tracks, nibbled leaves or feathers.", "Listen for movement in the trees.", "Guess which animals live nearby."],
    reward: "Detective instincts.", environments: ["forest", "park"], weather: DRY,
    encouragement: "Case closed. Tomorrow, try to spot an animal itself.",
    reflection: "Which clue made you most curious?",
  },
  {
    emoji: "🏘️", title: "Door Collector", difficulty: "easy", duration: 20,
    description: "Find the most interesting doors and gates on your street.",
    steps: ["Walk a street you don't know well.", "Find five interesting doors or gates.", "Notice their colours and handles.", "Pick the one with the best story."],
    reward: "Imagination.", environments: ["city", "village"],
    encouragement: "Great collection. Tomorrow, collect windows instead.",
    reflection: "What story did your favourite door seem to tell?",
  },
  {
    emoji: "🔺", title: "Shape Spotter", difficulty: "easy", duration: 15,
    description: "Find circles, triangles and squares hiding in the world.",
    steps: ["Find three circles.", "Find three triangles.", "Find three squares.", "Find one shape you can't name."],
    reward: "A sharp eye.",
    encouragement: "Shapes everywhere! Tomorrow, find a perfect spiral.",
    reflection: "Where did you find the most surprising shape?",
  },
  {
    emoji: "🧭", title: "Compass Walk", difficulty: "medium", duration: 30,
    description: "Let simple rules choose your route.",
    steps: ["At each corner, turn left, then right, then straight.", "Repeat the pattern for 15 minutes.", "Notice where you end up.", "Walk back a different way."],
    reward: "Freedom.", weather: DRY, environments: ["city", "village", "park"],
    encouragement: "You let the walk lead. Tomorrow, invent your own rule.",
    reflection: "Where did the rules take you that you wouldn't have chosen?",
  },
  {
    emoji: "👣", title: "Thousand Steps", difficulty: "active", duration: 15,
    description: "Count one thousand steps and see how far they take you.",
    steps: ["Start counting from your door.", "Walk at a comfortable pace.", "Stop at one thousand steps.", "Look around and notice where you are."],
    reward: "Energy.", weather: DRY,
    encouragement: "A thousand steps done. Tomorrow, try them in a new direction.",
    reflection: "How far did a thousand steps take you?",
  },
  {
    emoji: "🏃", title: "Lamp Post Intervals", difficulty: "active", duration: 20,
    description: "Mix easy walking and brisk walking using what you pass.",
    steps: ["Warm up with five minutes of easy walking.", "Walk briskly between two lamp posts or trees.", "Walk easily between the next two.", "Repeat ten times, then cool down."],
    reward: "A stronger heart.", weather: DRY, environments: ["city", "village", "park"],
    encouragement: "Nicely done. Tomorrow, add two more intervals.",
    reflection: "How did your body feel after the brisk parts?",
  },
  {
    emoji: "🌅", title: "Sky Watcher", difficulty: "easy", duration: 15,
    description: "Spend a few minutes doing nothing but watching the sky change.",
    steps: ["Find a spot with a wide view of the sky.", "Watch it for five full minutes.", "Notice the colours and movement.", "Name the colour you'd paint it."],
    reward: "Stillness.", weather: MILD,
    encouragement: "Sky watched. Tomorrow, watch it at a different time of day.",
    reflection: "What changed in the sky while you watched?",
  },
  {
    emoji: "🌬️", title: "Wind Reader", difficulty: "easy", duration: 15,
    description: "Discover which way the wind is blowing without any app.",
    steps: ["Watch leaves, flags or grass move.", "Feel the wind on your face.", "Work out which way it's coming from.", "Walk into it, then with it."],
    reward: "Awareness.", weather: ["cloudy", "cold", "sunny"],
    encouragement: "Wind read! Tomorrow, check if it changed direction.",
    reflection: "What felt different walking with and against the wind?",
  },
  {
    emoji: "🪨", title: "Texture Trail", difficulty: "easy", duration: 20,
    description: "Collect textures with your fingertips instead of your eyes.",
    steps: ["Find something smooth.", "Find something rough.", "Find something soft.", "Find something cool to the touch."],
    reward: "Connection.",
    encouragement: "Great touch. Tomorrow, find a texture you can't describe.",
    reflection: "Which texture did you enjoy touching most?",
  },
  {
    emoji: "😊", title: "Kindness Scout", difficulty: "easy", duration: 20,
    description: "Look for small acts of kindness, or do one yourself.",
    steps: ["Walk somewhere with people around.", "Smile or say hello to someone.", "Notice one kind thing someone else does.", "Leave a place a little tidier than you found it."],
    reward: "A warmer heart.", environments: ["city", "village", "park", "beach"],
    encouragement: "The world is a bit kinder now. Tomorrow, try two small kindnesses.",
    reflection: "What kind moment did you notice today?",
  },
  {
    emoji: "🌺", title: "Scent Seeker", difficulty: "easy", duration: 20,
    description: "Follow your nose and find five different outdoor smells.",
    steps: ["Breathe in slowly as you walk.", "Find five different scents.", "Find the strongest and the faintest.", "Pick the one you'd bottle."],
    reward: "Fresh senses.", weather: ["sunny", "cloudy", "rainy", "hot"],
    encouragement: "Great nose! Tomorrow, notice how smells change after rain.",
    reflection: "Which smell brought back a memory?",
  },
  {
    emoji: "🎨", title: "Nature Palette", difficulty: "easy", duration: 30,
    description: "Find as many shades of green, brown or blue as you can.",
    steps: ["Choose green, brown or blue.", "Find ten different shades of it.", "Arrange them in your mind from light to dark.", "Pick the shade that matches your mood."],
    reward: "Creativity.", environments: GREEN,
    encouragement: "Your palette is full. Tomorrow, try a different colour family.",
    reflection: "How many shades did you find, and which was your favourite?",
  },
  {
    emoji: "🪑", title: "Bench Philosopher", difficulty: "easy", duration: 15,
    description: "Find a bench and give yourself permission to just think.",
    steps: ["Find a bench or a place to sit.", "Put your hands in your lap.", "Watch the world go by for five minutes.", "Think of one thing you're grateful for."],
    reward: "Clarity.", environments: ["park", "city", "village", "beach"],
    encouragement: "Deep thoughts. Tomorrow, try a bench with a different view.",
    reflection: "What thought kept coming back while you sat?",
  },
  {
    emoji: "🗺️", title: "Mini Map Maker", difficulty: "medium", duration: 30,
    description: "Explore a small loop and draw it from memory when you're back.",
    steps: ["Walk a short loop you don't know well.", "Pick three landmarks on the way.", "Notice where you turn.", "Back home, sketch the map on paper."],
    reward: "A sense of place.", weather: DRY,
    encouragement: "Map made. Tomorrow, add a new street to it.",
    reflection: "Which landmark will you remember most?",
  },
];

function suits(m: FallbackMission, req: MissionRequest, maxMinutes: number): boolean {
  if (m.duration > maxMinutes) return false;
  if (req.mode !== "custom") return true;
  if (m.weather && !m.weather.includes(req.weather)) return false;
  if (m.environments && !m.environments.includes(req.environment)) return false;
  return true;
}

/** Picks a built-in mission for when the AI is unavailable. */
export function pickFallback(req: MissionRequest, random: () => number = Math.random): Mission {
  const maxMinutes = maxMinutesFor(req);
  const avoid = new Set(req.avoid.map((t) => t.toLowerCase()));

  const fitting = FALLBACK_MISSIONS.filter((m) => suits(m, req, maxMinutes));
  const fresh = fitting.filter((m) => !avoid.has(m.title.toLowerCase()));
  // Relax filters step by step so there is always something to return.
  const pool = fresh.length ? fresh : fitting.length ? fitting : FALLBACK_MISSIONS;

  const chosen = pool[Math.floor(random() * pool.length)];
  const { weather: _w, environments: _e, ...mission } = chosen;
  return { ...mission, steps: [...mission.steps], duration: Math.min(mission.duration, maxMinutes) };
}
