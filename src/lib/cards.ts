export type CollectionCard = {
    name: string;
    energy: string[];
    meaning: string;
};

export const cards = new Map<string, any>([
    ["Major Arcana",
        [
            {
                "name": "The Fool",
                "energy": [
                    "Beginnings",
                    "Adventure",
                    "Exploration"
                ],
                "meaning": "Embrace the energy of <span class='energy'>beginnings</span>, as The Fool embarks on a journey filled with <span class='energy'>adventure</span> and <span class='energy'>exploration</span>, leaving behind the familiar for the unknown.",
                "reversedMeaning": "The Fool's reversed energy warns against naivety, recklessness, and impulsive decisions, reminding you to consider the consequences of your actions."
            },
            {
                "name": "The Magician",
                "energy": [
                    "Creativity",
                    "Communication",
                    "Inspiration"
                ],
                "meaning": "The Magician's energy inspires <span class='energy'>creativity</span>, <span class='energy'>communication</span>, and <span class='energy'>innovation</span>, using skill and knowledge to manifest desires and turn ideas into reality.",
                "reversedMeaning": "When reversed, The Magician's energy indicates manipulation, deceit, and wasted potential, urging you to recognize and harness your true abilities."
            },
            {
                "name": "The High Priestess",
                "energy": [
                    "Communication",
                    "Intuition",
                    "Wisdom",
                    "Mystery"
                ],
                "meaning": "Trust your <span class='energy'>intuition</span> with The High Priestess, who embodies <span class='energy'>wisdom</span>, <span class='energy'>mystery</span>, and deep communication, guiding you to discover hidden truths.",
                "reversedMeaning": "In the reversed position, The High Priestess urges you to reconnect with your intuition and uncover hidden truths, as secrets, confusion, or denial may cloud your judgement."
            },
            {
                "name": "The Empress",
                "energy": [
                    "Creativity",
                    "Nurturing",
                    "Abundance",
                    "Relationships"
                ],
                "meaning": "The Empress represents nurturing <span class='energy'>creativity</span>, flourishing <span class='energy'>relationships</span>, and an abundance of love, cultivating a warm and inviting environment for growth.",
                "reversedMeaning": "The Empress reversed signifies neglect, codependency, and stifled creativity, calling for self-care and reevaluating relationships to restore balance and growth."
            },
            {
                "name": "The Emperor",
                "energy": [
                    "Authority",
                    "Stability",
                    "Discipline"
                ],
                "meaning": "The Emperor's authority brings <span class='energy'>stability</span> and <span class='energy'>discipline</span>, providing a strong foundation and clear direction, fostering a sense of security and order.",
                "reversedMeaning": "The Emperor reversed cautions against excessive control, rigidity, or tyranny, reminding you that true stability requires flexibility and empathy."
            },
            {
                "name": "The Hierophant",
                "energy": [
                    "Authority",
                    "Tradition",
                    "Guidance",
                    "Education"
                ],
                "meaning": "Rely on The Hierophant for guidance through <span class='energy'>tradition</span>, <span class='energy'>authority</span>, and <span class='energy'>education</span>, finding wisdom in established customs and beliefs to navigate life's complexities.",
                "reversedMeaning": "In the reversed position, The Hierophant suggests questioning tradition, authority, and dogma, inviting you to explore unconventional wisdom and personal beliefs."
            },
            {
                "name": "The Lovers",
                "energy": [
                    "Relationships",
                    "Harmony",
                    "Choice",
                    "Fairness",
                    "Temptation"
                ],
                "meaning": "The Lovers symbolize <span class='energy'>harmony</span> in relationships, highlighting the importance of <span class='energy'>choice</span>, <span class='energy'>fairness</span>, and balance, while reminding us of the <span class='energy'>temptations</span> that may arise.",
                "reversedMeaning": "The Lovers reversed signify disharmony, imbalance, and indecision, emphasizing the need to restore trust, fairness, and mutual understanding in relationships."
            },
            {
                "name": "The Chariot",
                "energy": [
                    "Determination",
                    "Progress",
                    "Harmony"
                ],
                "meaning": "Harness The Chariot's energy of <span class='energy'>determination</span>, propelling you forward with <span class='energy'>harmony</span> and <span class='energy'>progress</span>, fueled by your unwavering will and drive.",
                "reversedMeaning": "Reversed, The Chariot's energy warns of obstacles, lack of direction, and discord, urging you to regain focus and determination to overcome setbacks."
            },
            {
                "name": "Strength",
                "energy": [
                    "Intuition",
                    "Nurturing",
                    "Discipline",
                    "Courage"
                ],
                "meaning": "Strength combines nurturing <span class='energy'>intuition</span> with the <span class='energy'>courage</span> and <span class='energy'>discipline</span> required to face challenges, allowing you to persevere and overcome adversity with grace.",
                "reversedMeaning": "Strength reversed suggests insecurity, self-doubt, and a lack of discipline, encouraging you to cultivate inner courage and resilience in the face of challenges."
            },
            {
                "name": "The Hermit",
                "energy": [
                    "Tradition",
                    "Guidance",
                    "Education",
                    "Solitude",
                    "Reflection"
                ],
                "meaning": "Seek The Hermit's guidance for <span class='energy'>solitude</span>, <span class='energy'>reflection</span>, and <span class='energy'>education</span> in tradition, providing the space to connect with your inner wisdom and truth.",
                "reversedMeaning": "The Hermit reversed implies isolation, withdrawal, or denial, highlighting the importance of finding balance between solitude and social connections."
            },
            {
                "name": "The Wheel of Fortune",
                "energy": [
                    "Progress",
                    "Cycles",
                    "Destiny",
                    "Transition",
                    "Upheaval"
                ],
                "meaning": "Embrace the inevitability of <span class='energy'>cycles</span>, <span class='energy'>destiny</span>, and <span class='energy'>progress</span> with The Wheel of Fortune, navigating life's transitions and upheavals with resilience and adaptability.",
                "reversedMeaning": "In its reversed position, The Wheel of Fortune cautions against stagnation, resistance to change, and a feeling of being stuck in life's cycles."
            },
            {
                "name": "Justice",
                "energy": [
                    "Balance",
                    "Fairness",
                    "Truth"
                ],
                "meaning": "Justice embodies the principles of <span class='energy'>balance</span>, <span class='energy'>fairness</span>, and <span class='energy'>truth</span>, guiding you to make impartial decisions and uphold integrity in all aspects of life.",
                "reversedMeaning": "Justice reversed warns of injustice, dishonesty, or imbalance, emphasizing the importance of truth and fairness in decision-making and actions."
            },
            {
                "name": "The Hanged Man",
                "energy": [
                    "Choice",
                    "Courage",
                    "Solitude",
                    "Surrender",
                    "Redemption",
                    "Constraint"
                ],
                "meaning": "The Hanged Man's energy invites <span class='energy'>choice</span>, <span class='energy'>courage</span>, and <span class='energy'>surrender</span>, encouraging you to embrace <span class='energy'>constraint</span> and <span class='energy'>solitude</span> for personal growth and redemption.",
                "reversedMeaning": "The Hanged Man reversed indicates indecision, fear of change, and avoidance of surrender, urging you to embrace vulnerability and let go of control."
            },
            {
                "name": "Death",
                "energy": [
                    "Beginnings",
                    "Transformation",
                    "Transition"
                ],
                "meaning": "Experience <span class='energy'>transformation</span> and <span class='energy'>transition</span> through the energy of Death, initiating new beginnings that clear away the old to make way for the new.",
                "reversedMeaning": "Death reversed represents fear of change, stagnation, or an inability to release the past, reminding you to embrace transformation for personal growth."
            },
            {
                "name": "Temperance",
                "energy": [
                    "Balance",
                    "Harmony",
                    "Moderation"
                ],
                "meaning": "Find equilibrium with Temperance, harmonizing opposing forces and promoting <span class='energy'>moderation</span> to create a balanced, peaceful existence.",
                "reversedMeaning": "When reversed, Temperance signifies imbalance, excess, and a lack of moderation, calling for self-reflection and the restoration of equilibrium."
            },
            {
                "name": "The Devil",
                "energy": [
                    "Temptation",
                    "Obsession",
                    "Constraint"
                ],
                "meaning": "Beware The Devil's allure of <span class='energy'>temptation</span> and <span class='energy'>obsession</span>, which can lead to <span class='energy'>constraint</span>, urging you to confront and overcome unhealthy attachments.",
                "reversedMeaning": "The Devil reversed offers liberation from temptation, obsession, or constraint, empowering you to break free from unhealthy attachments and regain control."
            },
            {
                "name": "The Tower",
                "energy": [
                    "Surrender",
                    "Transformation",
                    "Upheaval"
                ],
                "meaning": "The Tower signifies <span class='energy'>upheaval</span> and <span class='energy'>transformation</span>, challenging you to surrender to the process and rebuild a stronger, more resilient foundation.",
                "reversedMeaning": "In the reversed position, The Tower suggests delaying inevitable change, resisting transformation, or avoiding the consequences of upheaval."
            },
            {
                "name": "The Star",
                "energy": [
                    "Guidance",
                    "Hope",
                    "Inspiration"
                ],
                "meaning": "Let The Star's energy guide you with <span class='energy'>hope</span> and <span class='energy'>inspiration</span>, illuminating your path and sparking a renewed sense of purpose and direction.",
                "reversedMeaning": "The Star reversed warns of despair, loss of faith, or disillusionment, urging you to reignite hope and inspiration within yourself."
            },
            {
                "name": "The Moon",
                "energy": [
                    "Mystery",
                    "Intuition",
                    "Wisdom",
                    "Reflection",
                    "Truth",
                    "Obsession"
                ],
                "meaning": "Explore the realm of <span class='energy'>mystery</span>, <span class='energy'>intuition</span>, and <span class='energy'>reflection</span> with The Moon, unveiling hidden truths and confronting obsessions to find clarity and wisdom.",
                "reversedMeaning": "When reversed, The Moon represents confusion, deception, or repressed emotions, inviting you to confront hidden truths and trust your intuition."
            },
            {
                "name": "The Sun",
                "energy": [
                    "Creativity",
                    "Hope",
                    "Renewal"
                ],
                "meaning": "Bask in The Sun's radiant energy, fostering <span class='energy'>creativity</span>, <span class='energy'>hope</span>, and <span class='energy'>renewal</span>, illuminating the path to happiness and success with optimism and vitality.",
                "reversedMeaning": "The Sun reversed indicates blocked creativity, pessimism, or diminished confidence, encouraging you to rediscover your inner light and renew your sense of purpose."
            },
            {
                "name": "Judgment",
                "energy": [
                    "Destiny",
                    "Renewal",
                    "Redemption"
                ],
                "meaning": "The call of Judgment brings <span class='energy'>destiny</span>, <span class='energy'>renewal</span>, and <span class='energy'>redemption</span>, urging you to embrace transformative change and make peace with the past.",
                "reversedMeaning": "Judgment reversed cautions against self-doubt, indecision, or denial, reminding you to heed the call of renewal and embrace transformative change."
            },
            {
                "name": "The World",
                "energy": [
                    "Adventure",
                    "Abundance",
                    "Stability",
                    "Cycles",
                    "Exploration"
                ],
                "meaning": "The World's energy unites <span class='energy'>adventure</span>, <span class='energy'>abundance</span>, <span class='energy'>stability</span>, <span class='energy'>cycles</span>, and <span class='energy'>exploration</span>, marking the completion of one cycle and the beginning of another, filled with endless possibilities.",
                "reversedMeaning": "The World reversed signifies incomplete cycles, stagnation, or resistance to growth, urging you to explore new opportunities and embrace life's transitions."
            }
        ]]
]);