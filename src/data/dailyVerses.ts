export interface Verse {
  text: string;
  reference: string;
}

export const dailyVerses: Verse[] = [
  { text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", reference: "Jeremiah 29:11" },
  { text: "I can do all things through him who strengthens me.", reference: "Philippians 4:13" },
  { text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.", reference: "Romans 8:28" },
  { text: "Trust in the Lord with all your heart, and do not lean on your own understanding.", reference: "Proverbs 3:5" },
  { text: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.", reference: "Joshua 1:9" },
  { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { text: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law.", reference: "Galatians 5:22-23" },
  { text: "Come to me, all who labor and are heavy laden, and I will give you rest.", reference: "Matthew 11:28" },
  { text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.", reference: "Isaiah 40:31" },
  { text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.", reference: "2 Corinthians 5:17" },
  { text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.", reference: "John 3:16" },
  { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
  { text: "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.", reference: "1 Thessalonians 5:16-18" },
  { text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.", reference: "Lamentations 3:22-23" },
  { text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.", reference: "Philippians 4:6" },
  { text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.", reference: "Ephesians 2:8" },
  { text: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.", reference: "Matthew 6:33" },
  { text: "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.", reference: "Galatians 2:20" },
  { text: "Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble.", reference: "Matthew 6:34" },
  { text: "Your word is a lamp to my feet and a light to my path.", reference: "Psalm 119:105" },
  { text: "Let all that you do be done in love.", reference: "1 Corinthians 16:14" },
  { text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.", reference: "Galatians 6:9" },
  { text: "He has told you, O man, what is good; and what does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God?", reference: "Micah 6:8" },
  { text: "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.", reference: "1 John 1:9" },
  { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", reference: "Psalm 37:4" },
  { text: "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life; of whom shall I be afraid?", reference: "Psalm 27:1" },
  { text: "Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.", reference: "Matthew 11:29" },
  { text: "And my God will supply every need of yours according to his riches in glory in Christ Jesus.", reference: "Philippians 4:19" },
  { text: "Set your minds on things that are above, not on things that are on earth.", reference: "Colossians 3:2" },
  { text: "But God shows his love for us in that while we were still sinners, Christ died for us.", reference: "Romans 5:8" },
  { text: "Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth!", reference: "Psalm 46:10" }
];

export const getDailyVerse = (): Verse => {
  // Use the current date (YYYY-MM-DD) as a seed for a pseudo-random number
  // This ensures the verse changes every day, but doesn't predictably repeat 
  // on the same day every month like a simple modulus would.
  const today = new Date();
  const seedString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = parseInt(seedString, 10);
  
  // Simple seeded random function
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const index = Math.floor(random(seed) * dailyVerses.length);
  return dailyVerses[index];
};
