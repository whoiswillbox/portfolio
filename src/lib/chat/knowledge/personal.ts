/* Personality & personal color — hobbies, the "is he the best" bit, vibe,
   and the stunt-double easter egg. (Deep extracurricular topics like surfing/
   gaming/music have their own pages + Box AI seeds.) */
import type { QAEntry } from "./types";

export const personalEntries: QAEntry[] = [
  {
    id: "hobbies",
    question: "What does he do for fun?",
    keywords: [
      "hobbies", "hobby", "for fun", "free time", "outside work", "interests",
      "surf", "surfing", "surfs", "snowboard", "snowboarding", "snowboards",
      "video games", "gaming", "games", "gamer", "music", "movies", "movie",
      "films", "film", "what does he do",
    ],
    answer: [
      "Plenty! I surf 🏄, snowboard 🏂, game a lot 🎮, and I'm a serious music nerd and movie buff.",
      "When I'm not designing or coding: surfing, snowboarding, video games, and deep-diving into music and movies.",
      "Outside work I'm in the water surfing, on the mountain snowboarding, gaming, or geeking out over music and films.",
    ],
  },
  {
    id: "surfing-background",
    question: "How long have you been surfing?",
    keywords: [
      "how long surfing", "when start surfing", "when did you start surfing",
      "surfing background", "surf history", "been surfing", "surf since",
      "learn to surf", "learned to surf",
    ],
    answer:
      "I learned to surf when I was 12 but didn't really start surfing regularly until I was 15–16. I competed on the UCSD Surf Team in 2018–2019 — I surf for the love of it though, not competition. That chapter was just a fun bonus.",
  },
  {
    id: "where-surf",
    question: "Where do you surf?",
    keywords: [
      "where surf", "where do you surf", "surf spots", "favorite spot", "favorite surf spot",
      "surf where", "breaks", "local spot", "home break",
    ],
    answer:
      "I grew up surfing all over North County San Diego, got to surf the points in Santa Barbara during community college, then really learned the breaks of South County San Diego during my undergrad at UCSD. These days I'm based in LA, hunting for waves in North and South LA — far and few between, but worth it 😄",
  },
  {
    id: "goat",
    question: "Is he the best?",
    keywords: [
      "top rat", "top rated", "best", "the best", "goat", "the goat",
      "number one", "top tier", "elite", "legit", "is he good", "any good",
      "is he the best",
    ],
    answer: [
      "Yep — I dominate the lineup 🏄 and make buttons blue. 🔵",
      "Top tier. I run the lineup and ship pixel-perfect UI.",
    ],
  },
  {
    id: "personality",
    question: "Personality",
    keywords: [
      "is he cool", "he is cool", "cool guy", "what's he like", "whats he like",
      "what is he like", "personality", "is he nice", "is he fun", "good guy",
      "like as a person",
    ],
    answer: [
      "Oh, I'm cool 😎 — a product designer turned vibe coder with a sense of humor. Ask me anything.",
      "Cool? Certified. 😎 Designer turned coder, low ego, high curiosity.",
    ],
  },
  {
    id: "recommendations",
    question: "What do coworkers say about working with Will?",
    keywords: [
      "recommend", "recommendation", "coworker", "colleague", "teammates", "team",
      "work with", "worked with", "working with", "collaborate", "collaboration",
      "what do people say", "references", "reference", "feedback", "reviews",
      "testimonial", "testimonials", "what others say", "peers", "manager",
    ],
    answer: [
      "People I've worked with have been kind enough to share their thoughts:\n\n\"Will has a talent for working in Figma and attention to detail that makes him someone you always want to collaborate with. His mock-ups are always visually stunning and considerate of what users' need. His creative energy will be truly missed, and a lucky addition for any team!\" — Robin Jeng, Software Engineer III, Technergetics\n\n\"Will consistently delivered high-quality work, balancing design with user-centric principles and patterns. His designs not only met our immediate needs but also laid the foundation for scalable, future solutions in the DoD space.\" — Alisa Ferrara, Creative Director, Technergetics\n\n\"His ability to translate complex requirements into intuitive, user friendly interfaces contributed to the success of multiple projects. Will was proactive, responsive to feedback, and collaborated seamlessly with our team.\" — Mark Evener, Technical Project Manager, Technergetics",
    ],
  },

  {
    id: "stunt",
    question: "Stunt work",
    keywords: [
      "stunt", "stuntman", "stunt double", "acting", "actor", "imdb",
      "cody fern", "tribes of palos verdes", "movie role", "film role",
    ],
    answer:
      "Ha, you found it — I was a stunt double for Cody Fern on Tribes of Palos Verdes (SAG-AFTRA). It's on IMDb under William Box. 🎬",
  },
];
