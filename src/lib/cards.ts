export type CollectionCard = {
    name: string;
    reversed: boolean;
    energy: { "upright": string[], "reversed": string[] };
    meaning: string;
    reversedMeaning: string;
};

export type CollectionDeck = {
    name: string;
    cards: CollectionCard[];
    available: boolean;
};

export const cards = new Map<string, CollectionCard[]>([
    ["Major Arcana",
        [
            {
                "name": "The Fool",
                "reversed": false,
                "energy": {
                    "upright": ["Beginnings", "Innocence"],
                    "reversed": ["Recklessness", "Naivety"]
                },
                "meaning": "The Fool represents <b>Beginnings</b> and <b>Innocence</b>, symbolizing a fresh start or new journey.",
                "reversedMeaning": "In reverse, The Fool signifies <b>Recklessness</b> and <b>Naivety</b>, indicating poor decisions or lack of foresight."
            },
            {
                "name": "The Magician",
                "reversed": false,
                "energy": {
                    "upright": ["Manifestation", "Willpower"],
                    "reversed": ["Manipulation", "Trickery"]
                },
                "meaning": "The Magician embodies <b>Manifestation</b> and <b>Willpower</b>, symbolizing the power to create and achieve goals.",
                "reversedMeaning": "Reversed, The Magician warns of <b>Manipulation</b> and <b>Trickery</b>, suggesting deceit or dishonest intentions."
            },
            {
                "name": "The High Priestess",
                "reversed": false,
                "energy": {
                    "upright": ["Intuition", "Mystery"],
                    "reversed": ["Secrets", "Disconnection"]
                },
                "meaning": "The High Priestess signifies <b>Intuition</b> and <b>Mystery</b>, representing inner wisdom and spiritual insight.",
                "reversedMeaning": "In reverse, The High Priestess indicates <b>Secrets</b> and <b>Disconnection</b>, suggesting hidden truths or emotional detachment."
            },
            {
                "name": "The Empress",
                "reversed": false,
                "energy": {
                    "upright": ["Nurturing", "Abundance"],
                    "reversed": ["Dependence", "Neglect"]
                },
                "meaning": "The Empress symbolizes <b>Nurturing</b> and <b>Abundance</b>, embodying love, fertility, and prosperity.",
                "reversedMeaning": "Reversed, The Empress warns of <b>Dependence</b> and <b>Neglect</b>, indicating a lack of self-care or unhealthy relationships."
            },
            {
                "name": "The Emperor",
                "reversed": false,
                "energy": {
                    "upright": ["Authority", "Stability"],
                    "reversed": ["Tyranny", "Rigidity"]
                },
                "meaning": "The Emperor represents <b>Authority</b> and <b>Stability</b>, symbolizing leadership, structure, and control.",
                "reversedMeaning": "In reverse, The Emperor signifies <b>Tyranny</b> and <b>Rigidity</b>, suggesting oppressive power or inflexibility."
            },
            {
                "name": "The Hierophant",
                "reversed": false,
                "energy": {
                    "upright": ["Tradition", "Spiritual guidance"],
                    "reversed": ["Dogmatism", "Rebellion"]
                },
                "meaning": "The Hierophant embodies <b>Tradition</b> and <b>Spiritual guidance</b>, representing wisdom, religious beliefs, and mentorship.",
                "reversedMeaning": "Reversed, The Hierophant warns of <b>Dogmatism</b> and <b>Rebellion</b>, indicating rigid beliefs or defiance against norms."
            },
            {
                "name": "The Lovers",
                "reversed": false,
                "energy": {
                    "upright": ["Relationships", "Choices"],
                    "reversed": ["Disharmony", "Imbalance"]
                },
                "meaning": "The Lovers symbolize <b>Relationships</b> and <b>Choices</b>, representing love, partnership, and important decisions.",
                "reversedMeaning": "In reverse, The Lovers indicate <b>Disharmony</b> and <b>Imbalance</b>, suggesting conflict or misaligned values."
            },
            {
                "name": "The Chariot",
                "reversed": false,
                "energy": {
                    "upright": ["Willpower", "Triumph"],
                    "reversed": ["Loss of control", "Aggression"]
                },
                "meaning": "The Chariot signifies <b>Willpower</b> and <b>Triumph</b>, symbolizing determination, victory, and overcoming obstacles.",
                "reversedMeaning": "Reversed, The Chariot warns of <b>Loss of control</b> and <b>Aggression</b>, suggesting impulsiveness or hostility."
            },
            {
                "name": "Strength",
                "reversed": false,
                "energy": {
                    "upright": ["Courage", "Patience"],
                    "reversed": ["Fear", "Impatience"]
                },
                "meaning": "Strength represents <b>Courage</b> and <b>Patience</b>, embodying inner power, resilience, and self-control.",
                "reversedMeaning": "In reverse, Strength indicates <b>Fear</b> and <b>Impatience</b>, suggesting insecurity or restlessness."
            },
            {
                "name": "The Hermit",
                "reversed": false,
                "energy": {
                    "upright": ["Introspection", "Guidance"],
                    "reversed": ["Isolation", "Withdrawal"]
                },
                "meaning": "The Hermit symbolizes <b>Introspection</b> and <b>Guidance</b>, representing self-reflection, wisdom, and spiritual growth.",
                "reversedMeaning": "Reversed, The Hermit warns of <b>Isolation</b> and <b>Withdrawal</b>, suggesting unhealthy solitude or disconnection."
            },
            {
                "name": "Wheel of Fortune",
                "reversed": false,
                "energy": {
                    "upright": ["Luck", "Cycles"],
                    "reversed": ["Misfortune", "Resistance"]
                },
                "meaning": "The Wheel of Fortune signifies <b>Luck</b> and <b>Cycles</b>, symbolizing destiny, change, and the ups and downs of life.",
                "reversedMeaning": "In reverse, The Wheel of Fortune indicates <b>Misfortune</b> and <b>Resistance</b>, suggesting setbacks or an unwillingness to adapt."
            },
            {
                "name": "Justice",
                "reversed": false,
                "energy": {
                    "upright": ["Fairness", "Balance"],
                    "reversed": ["Injustice", "Dishonesty"]
                },
                "meaning": "Justice represents <b>Fairness</b> and <b>Balance</b>, symbolizing the need for truth and impartiality in decision-making.",
                "reversedMeaning": "In reverse, Justice signifies <b>Injustice</b> and <b>Dishonesty</b>, indicating a lack of fairness or ethical behavior."
            },
            {
                "name": "The Hanged Man",
                "reversed": false,
                "energy": {
                    "upright": ["Sacrifice", "Perspective"],
                    "reversed": ["Stagnation", "Indecision"]
                },
                "meaning": "The Hanged Man represents <b>Sacrifice</b> and <b>Perspective</b>, symbolizing the need for surrender and a change in viewpoint.",
                "reversedMeaning": "In reverse, The Hanged Man signifies <b>Stagnation</b> and <b>Indecision</b>, indicating a lack of progress or inability to make a choice."
            },
            {
                "name": "Death",
                "reversed": false,
                "energy": {
                    "upright": ["Transformation", "Endings"],
                    "reversed": ["Resistance", "Stagnation"]
                },
                "meaning": "Death represents <b>Transformation</b> and <b>Endings</b>, symbolizing the need for change and the conclusion of a phase.",
                "reversedMeaning": "In reverse, Death signifies <b>Resistance</b> and <b>Stagnation</b>, indicating an unwillingness to accept change or a lack of progress."
            },
            {
                "name": "Temperance",
                "reversed": false,
                "energy": {
                    "upright": ["Balance", "Harmony"],
                    "reversed": ["Imbalance", "Excess"]
                },
                "meaning": "Temperance represents <b>Balance</b> and <b>Harmony</b>, symbolizing the need for moderation and cooperation.",
                "reversedMeaning": "In reverse, Temperance signifies <b>Imbalance</b> and <b>Excess</b>, indicating a lack of self-control or discord."
            },
            {
                "name": "The Devil",
                "reversed": false,
                "energy": {
                    "upright": ["Temptation", "Bondage"],
                    "reversed": ["Release", "Enlightenment"]
                },
                "meaning": "The Devil represents <b>Temptation</b> and <b>Bondage</b>, symbolizing the need to confront one's own fears and unhealthy attachments.",
                "reversedMeaning": "In reverse, The Devil signifies <b>Release</b> and <b>Enlightenment</b>, indicating a breaking free from negative influences or gaining new insight."
            },
            {
                "name": "The Tower",
                "reversed": false,
                "energy": {
                    "upright": ["Sudden change", "Chaos"],
                    "reversed": ["Avoidance", "Fear"]
                },
                "meaning": "The Tower represents <b>Sudden change</b> and <b>Chaos</b>, symbolizing unexpected upheaval and the need for adaptation.",
                "reversedMeaning": "In reverse, The Tower signifies <b>Avoidance</b> and <b>Fear</b>, indicating a reluctance to face challenges or confront one's own anxieties."
            },
            {
                "name": "The Star",
                "reversed": false,
                "energy": {
                    "upright": ["Hope", "Inspiration"],
                    "reversed": ["Despair", "Disconnection"]
                },
                "meaning": "The Star represents <b>Hope</b> and <b>Inspiration</b>, symbolizing a sense of optimism and spiritual guidance.",
                "reversedMeaning": "In reverse, The Star signifies <b>Despair</b> and <b>Disconnection</b>, indicating a loss of faith or feeling disconnected from one's purpose."
            },
            {
                "name": "The Moon",
                "reversed": false,
                "energy": {
                    "upright": ["Intuition", "Illusion"],
                    "reversed": ["Confusion", "Fear"]
                },
                "meaning": "The Moon represents <b>Intuition</b> and <b>Illusion</b>, symbolizing the need to trust one's instincts and navigate through uncertainty.",
                "reversedMeaning": "In reverse, The Moon signifies <b>Confusion</b> and <b>Fear</b>, indicating a lack of clarity or being overwhelmed by emotions."
            },
            {
                "name": "The Sun",
                "reversed": false,
                "energy": {
                    "upright": ["Joy", "Success"],
                    "reversed": ["Negativity", "Depression"]
                },
                "meaning": "The Sun represents <b>Joy</b> and <b>Success</b>, symbolizing happiness, achievement, and a sense of fulfillment.",
                "reversedMeaning": "In reverse, The Sun signifies <b>Negativity</b> and <b>Depression</b>, indicating a lack of enthusiasm or feelings of sadness."
            },
            {
                "name": "Judgement",
                "reversed": false,
                "energy": {
                    "upright": ["Renewal", "Redemption"],
                    "reversed": ["Regret", "Denial"]
                },
                "meaning": "Judgement represents <b>Renewal</b> and <b>Redemption</b>, symbolizing the need for self-evaluation and spiritual awakening.",
                "reversedMeaning": "In reverse, Judgement signifies <b>Regret</b> and <b>Denial</b>, indicating a refusal to accept responsibility or face the consequences of one's actions."
            },
            {
                "name": "The World",
                "reversed": false,
                "energy": {
                    "upright": ["Completion", "Wholeness"],
                    "reversed": ["Incompletion", "Stagnation"]
                },
                "meaning": "The World represents <b>Completion</b> and <b>Wholeness</b>, symbolizing the achievement of goals and a sense of unity.",
                "reversedMeaning": "In reverse, The World signifies <b>Incompletion</b> and <b>Stagnation</b>, indicating a lack of progress or feeling unfulfilled."
            },
        ]
    ],
    [
        "Suit of Wands",
        [
            {
                "name": "Ace of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Inspiration", "New beginnings"],
                    "reversed": ["Delay", "Lack of motivation"]
                },
                "meaning": "The Ace of Wands represents <b>Inspiration</b> and <b>New beginnings</b>, symbolizing a creative spark or a fresh start.",
                "reversedMeaning": "In reverse, the Ace of Wands signifies <b>Delay</b> and <b>Lack of motivation</b>, indicating procrastination or a loss of enthusiasm."
            },
            {
                "name": "Two of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Planning", "Choices"],
                    "reversed": ["Indecision", "Fear"]
                },
                "meaning": "The Two of Wands represents <b>Planning</b> and <b>Choices</b>, symbolizing the need to make decisions and set goals.",
                "reversedMeaning": "In reverse, the Two of Wands signifies <b>Indecision</b> and <b>Fear</b>, indicating uncertainty or anxiety about the future."
            },
            {
                "name": "Three of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Expansion", "Progress"],
                    "reversed": ["Delays", "Frustration"]
                },
                "meaning": "The Three of Wands represents <b>Expansion</b> and <b>Progress</b>, symbolizing growth and forward movement.",
                "reversedMeaning": "In reverse, the Three of Wands signifies <b>Delays</b> and <b>Frustration</b>, indicating obstacles or setbacks."
            },
            {
                "name": "Four of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Celebration", "Stability"],
                    "reversed": ["Disharmony", "Incompletion"]
                },
                "meaning": "The Four of Wands represents <b>Celebration</b> and <b>Stability</b>, symbolizing joy and a solid foundation.",
                "reversedMeaning": "In reverse, the Four of Wands signifies <b>Disharmony</b> and <b>Incompletion</b>, indicating conflict or unfinished business."
            },
            {
                "name": "Five of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Conflict", "Competition"],
                    "reversed": ["Resolution", "Cooperation"]
                },
                "meaning": "The Five of Wands represents <b>Conflict</b> and <b>Competition</b>, symbolizing struggles and rivalry.",
                "reversedMeaning": "In reverse, the Five of Wands signifies <b>Resolution</b> and <b>Cooperation</b>, indicating compromise or teamwork."
            },
            {
                "name": "Six of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Success", "Recognition"],
                    "reversed": ["Failure", "Ego"]
                },
                "meaning": "The Six of Wands represents <b>Success</b> and <b>Recognition</b>, symbolizing achievements and public acknowledgment.",
                "reversedMeaning": "In reverse, the Six of Wands signifies <b>Failure</b> and <b>Ego</b>, indicating setbacks or overconfidence."
            },
            {
                "name": "Seven of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Courage", "Perseverance"],
                    "reversed": ["Overwhelm", "Retreat"]
                },
                "meaning": "The Seven of Wands represents <b>Courage</b> and <b>Perseverance</b>, symbolizing determination and standing up for oneself.",
                "reversedMeaning": "In reverse, the Seven of Wands signifies <b>Overwhelm</b> and <b>Retreat</b>, indicating a need to step back or feeling overwhelmed."
            },
            {
                "name": "Eight of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Speed", "Action"],
                    "reversed": ["Delays", "Confusion"]
                },
                "meaning": "The Eight of Wands represents <b>Speed</b> and <b>Action</b>, symbolizing swift movement and decisive action.",
                "reversedMeaning": "In reverse, the Eight of Wands signifies <b>Delays</b> and <b>Confusion</b>, indicating slow progress or uncertainty."
            },
            {
                "name": "Nine of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Resilience", "Persistence"],
                    "reversed": ["Exhaustion", "Defensiveness"]
                },
                "meaning": "The Nine of Wands represents <b>Resilience</b> and <b>Persistence</b>, symbolizing strength and determination in the face of adversity.",
                "reversedMeaning": "In reverse, the Nine of Wands signifies <b>Exhaustion</b> and <b>Defensiveness</b>, indicating fatigue or a need to protect oneself."
            },
            {
                "name": "Ten of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Burden", "Responsibility"],
                    "reversed": ["Release", "Overwhelm"]
                },
                "meaning": "The Ten of Wands represents <b>Burden</b> and <b>Responsibility</b>, symbolizing heavy loads and obligations.",
                "reversedMeaning": "In reverse, the Ten of Wands signifies <b>Release</b> and <b>Overwhelm</b>, indicating a need to let go or feeling weighed down."
            },
            {
                "name": "Page of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Enthusiasm", "Exploration"],
                    "reversed": ["Haste", "Lack of direction"]
                },
                "meaning": "The Page of Wands represents <b>Enthusiasm</b> and <b>Exploration</b>, symbolizing curiosity and a desire for adventure.",
                "reversedMeaning": "In reverse, the Page of Wands signifies <b>Haste</b> and <b>Lack of direction</b>, indicating impatience or a lack of focus."
            },
            {
                "name": "Knight of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Energy", "Passion"],
                    "reversed": ["Impulsiveness", "Frustration"]
                },
                "meaning": "The Knight of Wands represents <b>Energy</b> and <b>Passion</b>, symbolizing drive and enthusiasm for life.",
                "reversedMeaning": "In reverse, the Knight of Wands signifies <b>Impulsiveness</b> and <b>Frustration</b>, indicating hasty decisions or irritability."
            },
            {
                "name": "Queen of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Confidence", "Warmth"],
                    "reversed": ["Insecurity", "Jealousy"]
                },
                "meaning": "The Queen of Wands represents <b>Confidence</b> and <b>Warmth</b>, symbolizing self-assurance and a nurturing nature.",
                "reversedMeaning": "In reverse, the Queen of Wands signifies <b>Insecurity</b> and <b>Jealousy</b>, indicating self-doubt or envy."
            },
            {
                "name": "King of Wands",
                "reversed": false,
                "energy": {
                    "upright": ["Leadership", "Vision"],
                    "reversed": ["Impatience", "Arrogance"]
                },
                "meaning": "The King of Wands represents <b>Leadership</b> and <b>Vision</b>, symbolizing authority and the ability to inspire others.",
                "reversedMeaning": "In reverse, the King of Wands signifies <b>Impatience</b> and <b>Arrogance</b>, indicating a lack of tolerance or an inflated ego."
            }
        ]],
    ["Suit of Cups", [
        {
            "name": "Ace of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Love", "Emotional fulfillment"],
                "reversed": ["Blocked emotions", "Instability"]
            },
            "meaning": "The Ace of Cups represents <b>Love</b> and <b>Emotional fulfillment</b>, symbolizing the beginning of a new emotional journey or relationship.",
            "reversedMeaning": "In reverse, the Ace of Cups signifies <b>Blocked emotions</b> and <b>Instability</b>, indicating emotional challenges or a lack of emotional balance."
        },
        {
            "name": "Two of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Partnership", "Connection"],
                "reversed": ["Imbalance", "Disconnection"]
            },
            "meaning": "The Two of Cups represents <b>Partnership</b> and <b>Connection</b>, symbolizing a strong bond or relationship between two people.",
            "reversedMeaning": "In reverse, the Two of Cups signifies <b>Imbalance</b> and <b>Disconnection</b>, indicating a lack of harmony or communication in a relationship."
        },
        {
            "name": "Three of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Celebration", "Friendship"],
                "reversed": ["Isolation", "Overindulgence"]
            },
            "meaning": "The Three of Cups represents <b>Celebration</b> and <b>Friendship</b>, symbolizing joy, social gatherings, and strong bonds with others.",
            "reversedMeaning": "In reverse, the Three of Cups signifies <b>Isolation</b> and <b>Overindulgence</b>, indicating loneliness or excessive celebration that may lead to negative consequences."
        },
        {
            "name": "Four of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Contemplation", "Apathy"],
                "reversed": ["Action", "Renewed interest"]
            },
            "meaning": "The Four of Cups represents <b>Contemplation</b> and <b>Apathy</b>, symbolizing a period of introspection or disinterest in one's surroundings.",
            "reversedMeaning": "In reverse, the Four of Cups signifies <b>Action</b> and <b>Renewed interest</b>, indicating a shift in focus and a renewed sense of motivation."
        },
        {
            "name": "Five of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Loss", "Grief"],
                "reversed": ["Acceptance", "Healing"]
            },
            "meaning": "The Five of Cups represents <b>Loss</b> and <b>Grief</b>, symbolizing a period of mourning or disappointment.",
            "reversedMeaning": "In reverse, the Five of Cups signifies <b>Acceptance</b> and <b>Healing</b>, indicating a process of recovery and moving forward from past pain."
        },
        {
            "name": "Six of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Nostalgia", "Reunion"],
                "reversed": ["Stuck in the past", "Unrealistic expectations"]
            },
            "meaning": "The Six of Cups represents <b>Nostalgia</b> and <b>Reunion</b>, symbolizing a connection to the past or a rekindling of old relationships.",
            "reversedMeaning": "In reverse, the Six of Cups signifies <b>Stuck in the past</b> and <b>Unrealistic expectations</b>, indicating an inability to let go or a tendency to idealize past experiences."
        },
        {
            "name": "Seven of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Choices", "Illusion"],
                "reversed": ["Clarity", "Decision"]
            },
            "meaning": "The Seven of Cups represents <b>Choices</b> and <b>Illusion</b>, symbolizing a multitude of options and the potential for confusion or deception.",
            "reversedMeaning": "In reverse, the Seven of Cups signifies <b>Clarity</b> and <b>Decision</b>, indicating a clear understanding of one's options and the ability to make a choice."
        },
        {
            "name": "Eight of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Withdrawal", "Search for meaning"],
                "reversed": ["Stagnation", "Fear of change"]
            },
            "meaning": "The Eight of Cups represents <b>Withdrawal</b> and <b>Search for meaning</b>, symbolizing a desire to leave behind the familiar in pursuit of deeper understanding.",
            "reversedMeaning": "In reverse, the Eight of Cups signifies <b>Stagnation</b> and <b>Fear of change</b>, indicating a reluctance to move forward or embrace new experiences."
        },
        {
            "name": "Nine of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Satisfaction", "Wish fulfillment"],
                "reversed": ["Discontent", "Greed"]
            },
            "meaning": "The Nine of Cups represents <b>Satisfaction</b> and <b>Wish fulfillment</b>, symbolizing happiness, contentment, and the realization of one's desires.",
            "reversedMeaning": "In reverse, the Nine of Cups signifies <b>Discontent</b> and <b>Greed</b>, indicating a lack of satisfaction or an excessive focus on material possessions."
        },
        {
            "name": "Ten of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Happiness", "Harmony"],
                "reversed": ["Broken relationships", "Disillusionment"]
            },
            "meaning": "The Ten of Cups represents <b>Happiness</b> and <b>Harmony</b>, symbolizing emotional fulfillment, strong relationships, and a sense of belonging.",
            "reversedMeaning": "In reverse, the Ten of Cups signifies <b>Broken relationships</b> and <b>Disillusionment</b>, indicating emotional turmoil or a loss of connection with loved ones."
        },
        {
            "name": "Page of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Creativity", "Intuition"],
                "reversed": ["Emotional immaturity", "Insecurity"]
            },
            "meaning": "The Page of Cups represents <b>Creativity</b> and <b>Intuition</b>, symbolizing a youthful, imaginative energy and a strong connection to one's emotions.",
            "reversedMeaning": "In reverse, the Page of Cups signifies <b>Emotional immaturity</b> and <b>Insecurity</b>, indicating a lack of emotional growth or self-confidence."
        },
        {
            "name": "Knight of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Romance", "Idealism"],
                "reversed": ["Disillusionment", "Moodiness"]
            },
            "meaning": "The Knight of Cups represents <b>Romance</b> and <b>Idealism</b>, symbolizing a passionate, dreamy energy and a strong desire for love and connection.",
            "reversedMeaning": "In reverse, the Knight of Cups signifies <b>Disillusionment</b> and <b>Moodiness</b>, indicating emotional instability or a loss of faith in one's ideals."
        },
        {
            "name": "Queen of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Empathy", "Compassion"],
                "reversed": ["Emotional manipulation", "Instability"]
            },
            "meaning": "The Queen of Cups represents <b>Empathy</b> and <b>Compassion</b>, symbolizing a nurturing, emotionally intelligent energy and a deep understanding of others' feelings.",
            "reversedMeaning": "In reverse, the Queen of Cups signifies <b>Emotional manipulation</b> and <b>Instability</b>, indicating a misuse of emotional intelligence or a lack of emotional balance."
        },
        {
            "name": "King of Cups",
            "reversed": false,
            "energy": {
                "upright": ["Emotional balance", "Diplomacy"],
                "reversed": ["Emotional detachment", "Manipulation"]
            },
            "meaning": "The King of Cups represents <b>Emotional balance</b> and <b>Diplomacy</b>, symbolizing a wise, emotionally mature energy and the ability to navigate complex emotional situations.",
            "reversedMeaning": "In reverse, the King of Cups signifies <b>Emotional detachment</b> and <b>Manipulation</b>, indicating a lack of emotional connection or a tendency to use emotions for personal gain."
        },
    ]],
    ["Suit of Swords", [
        {
            "name": "Ace of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Clarity", "Breakthrough"],
                "reversed": ["Confusion", "Delay"]
            },
            "meaning": "The Ace of Swords represents <b>Clarity</b> and <b>Breakthrough</b>, symbolizing a new beginning or a moment of mental clarity.",
            "reversedMeaning": "In reverse, the Ace of Swords signifies <b>Confusion</b> and <b>Delay</b>, indicating a lack of understanding or obstacles in your path."
        },
        {
            "name": "Two of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Indecision", "Balance"],
                "reversed": ["Confusion", "Overwhelm"]
            },
            "meaning": "The Two of Swords represents <b>Indecision</b> and <b>Balance</b>, symbolizing a need to weigh options and make a choice.",
            "reversedMeaning": "In reverse, the Two of Swords signifies <b>Confusion</b> and <b>Overwhelm</b>, indicating a lack of clarity or feeling overwhelmed by choices."
        },
        {
            "name": "Three of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Heartbreak", "Sorrow"],
                "reversed": ["Healing", "Forgiveness"]
            },
            "meaning": "The Three of Swords represents <b>Heartbreak</b> and <b>Sorrow</b>, symbolizing emotional pain or loss.",
            "reversedMeaning": "In reverse, the Three of Swords signifies <b>Healing</b> and <b>Forgiveness</b>, indicating a time of recovery and letting go of past hurts."
        },
        {
            "name": "Four of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Rest", "Meditation"],
                "reversed": ["Restlessness", "Burnout"]
            },
            "meaning": "The Four of Swords represents <b>Rest</b> and <b>Meditation</b>, symbolizing a need for relaxation and reflection.",
            "reversedMeaning": "In reverse, the Four of Swords signifies <b>Restlessness</b> and <b>Burnout</b>, indicating a lack of rest or feeling overwhelmed by stress."
        },
        {
            "name": "Five of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Conflict", "Defeat"],
                "reversed": ["Reconciliation", "Regret"]
            },
            "meaning": "The Five of Swords represents <b>Conflict</b> and <b>Defeat</b>, symbolizing a struggle or loss in a situation.",
            "reversedMeaning": "In reverse, the Five of Swords signifies <b>Reconciliation</b> and <b>Regret</b>, indicating a resolution of conflict or feelings of remorse."
        },
        {
            "name": "Six of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Transition", "Healing"],
                "reversed": ["Stagnation", "Resistance"]
            },
            "meaning": "The Six of Swords represents <b>Transition</b> and <b>Healing</b>, symbolizing a journey towards a better place or emotional recovery.",
            "reversedMeaning": "In reverse, the Six of Swords signifies <b>Stagnation</b> and <b>Resistance</b>, indicating a reluctance to move forward or change."
        },
        {
            "name": "Seven of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Deception", "Strategy"],
                "reversed": ["Honesty", "Exposure"]
            },
            "meaning": "The Seven of Swords represents <b>Deception</b> and <b>Strategy</b>, symbolizing cunning actions or hidden motives.",
            "reversedMeaning": "In reverse, the Seven of Swords signifies <b>Honesty</b> and <b>Exposure</b>, indicating a revelation of truth or a change in tactics."
        },
        {
            "name": "Eight of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Restriction", "Fear"],
                "reversed": ["Release", "Clarity"]
            },
            "meaning": "The Eight of Swords represents <b>Restriction</b> and <b>Fear</b>, symbolizing a feeling of being trapped or limited by circumstances.",
            "reversedMeaning": "In reverse, the Eight of Swords signifies <b>Release</b> and <b>Clarity</b>, indicating a newfound freedom or understanding of a situation."
        },
        {
            "name": "Nine of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Anxiety", "Despair"],
                "reversed": ["Hope", "Recovery"]
            },
            "meaning": "The Nine of Swords represents <b>Anxiety</b> and <b>Despair</b>, symbolizing worry, fear, or feelings of hopelessness.",
            "reversedMeaning": "In reverse, the Nine of Swords signifies <b>Hope</b> and <b>Recovery</b>, indicating a shift towards optimism and healing."
        },
        {
            "name": "Ten of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Betrayal", "Endings"],
                "reversed": ["Renewal", "Resilience"]
            },
            "meaning": "The Ten of Swords represents <b>Betrayal</b> and <b>Endings</b>, symbolizing a painful conclusion or a sense of being stabbed in the back.",
            "reversedMeaning": "In reverse, the Ten of Swords signifies <b>Renewal</b> and <b>Resilience</b>, indicating a new beginning or the ability to bounce back from adversity."
        },
        {
            "name": "Page of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Curiosity", "Communication"],
                "reversed": ["Gossip", "Haste"]
            },
            "meaning": "The Page of Swords represents <b>Curiosity</b> and <b>Communication</b>, symbolizing a desire to learn and share information.",
            "reversedMeaning": "In reverse, the Page of Swords signifies <b>Gossip</b> and <b>Haste</b>, indicating a tendency to spread rumors or act impulsively."
        },
        {
            "name": "Knight of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Ambition", "Action"],
                "reversed": ["Recklessness", "Impatience"]
            },
            "meaning": "The Knight of Swords represents <b>Ambition</b> and <b>Action</b>, symbolizing a drive to achieve goals and take decisive steps.",
            "reversedMeaning": "In reverse, the Knight of Swords signifies <b>Recklessness</b> and <b>Impatience</b>, indicating a tendency to act without thinking or to rush into situations."
        },
        {
            "name": "Queen of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Wisdom", "Independence"],
                "reversed": ["Coldness", "Manipulation"]
            },
            "meaning": "The Queen of Swords represents <b>Wisdom</b> and <b>Independence</b>, symbolizing a strong, intelligent, and self-reliant individual.",
            "reversedMeaning": "In reverse, the Queen of Swords signifies <b>Coldness</b> and <b>Manipulation</b>, indicating a lack of empathy or a tendency to control others."
        },
        {
            "name": "King of Swords",
            "reversed": false,
            "energy": {
                "upright": ["Authority", "Intellect"],
                "reversed": ["Tyranny", "Rigidity"]
            },
            "meaning": "The King of Swords represents <b>Authority</b> and <b>Intellect</b>, symbolizing a wise, knowledgeable, and fair leader.",
            "reversedMeaning": "In reverse, the King of Swords signifies <b>Tyranny</b> and <b>Rigidity</b>, indicating a harsh ruler or an inflexible approach to situations."
        }
    ]],
    ["Suit of Pentacles", [
        {
            "name": "Ace of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Prosperity", "Opportunity"],
                "reversed": ["Missed opportunity", "Financial loss"]
            },
            "meaning": "The Ace of Pentacles represents <b>Prosperity</b> and <b>Opportunity</b>, symbolizing new financial beginnings or potential success.",
            "reversedMeaning": "In reverse, the Ace of Pentacles signifies <b>Missed opportunity</b> and <b>Financial loss</b>, indicating poor financial decisions or missed chances."
        },
        {
            "name": "Two of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Balance", "Adaptability"],
                "reversed": ["Imbalance", "Overwhelm"]
            },
            "meaning": "The Two of Pentacles represents <b>Balance</b> and <b>Adaptability</b>, symbolizing the ability to juggle multiple responsibilities or adapt to changing circumstances.",
            "reversedMeaning": "In reverse, the Two of Pentacles signifies <b>Imbalance</b> and <b>Overwhelm</b>, indicating difficulty managing responsibilities or feeling overwhelmed."
        },
        {
            "name": "Three of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Teamwork", "Collaboration"],
                "reversed": ["Lack of cooperation", "Disorganization"]
            },
            "meaning": "The Three of Pentacles represents <b>Teamwork</b> and <b>Collaboration</b>, symbolizing the importance of working together and combining skills to achieve success.",
            "reversedMeaning": "In reverse, the Three of Pentacles signifies <b>Lack of cooperation</b> and <b>Disorganization</b>, indicating difficulties in working together or a lack of coordination."
        },
        {
            "name": "Four of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Stability", "Control"],
                "reversed": ["Greed", "Insecurity"]
            },
            "meaning": "The Four of Pentacles represents <b>Stability</b> and <b>Control</b>, symbolizing a strong foundation and the ability to manage resources effectively.",
            "reversedMeaning": "In reverse, the Four of Pentacles signifies <b>Greed</b> and <b>Insecurity</b>, indicating an unhealthy attachment to material possessions or fear of losing control."
        },
        {
            "name": "Five of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Hardship", "Loss"],
                "reversed": ["Recovery", "Hope"]
            },
            "meaning": "The Five of Pentacles represents <b>Hardship</b> and <b>Loss</b>, symbolizing financial or emotional struggles and the need for support.",
            "reversedMeaning": "In reverse, the Five of Pentacles signifies <b>Recovery</b> and <b>Hope</b>, indicating a period of healing and the potential for improvement."
        },
        {
            "name": "Six of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Generosity", "Charity"],
                "reversed": ["Selfishness", "Debt"]
            },
            "meaning": "The Six of Pentacles represents <b>Generosity</b> and <b>Charity</b>, symbolizing the importance of giving and receiving help when needed.",
            "reversedMeaning": "In reverse, the Six of Pentacles signifies <b>Selfishness</b> and <b>Debt</b>, indicating a lack of generosity or financial imbalance."
        },
        {
            "name": "Seven of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Patience", "Growth"],
                "reversed": ["Impatience", "Stagnation"]
            },
            "meaning": "The Seven of Pentacles represents <b>Patience</b> and <b>Growth</b>, symbolizing the need for perseverance and the rewards of hard work.",
            "reversedMeaning": "In reverse, the Seven of Pentacles signifies <b>Impatience</b> and <b>Stagnation</b>, indicating frustration with slow progress or a lack of growth."
        },
        {
            "name": "Eight of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Skill", "Dedication"],
                "reversed": ["Lack of focus", "Perfectionism"]
            },
            "meaning": "The Eight of Pentacles represents <b>Skill</b> and <b>Dedication</b>, symbolizing the importance of honing one's craft and committing to excellence.",
            "reversedMeaning": "In reverse, the Eight of Pentacles signifies <b>Lack of focus</b> and <b>Perfectionism</b>, indicating difficulty concentrating or unrealistic expectations."
        },
        {
            "name": "Nine of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Self-Sufficiency", "Independence"],
                "reversed": ["Financial dependency", "Isolation"]
            },
            "meaning": "The Nine of Pentacles represents <b>Self-Sufficiency</b> and <b>Independence</b>, symbolizing financial success and the ability to enjoy the fruits of one's labor.",
            "reversedMeaning": "In reverse, the Nine of Pentacles signifies <b>Financial dependency</b> and <b>Isolation</b>, indicating reliance on others for support or feelings of loneliness."
        },
        {
            "name": "Ten of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Wealth", "Legacy"],
                "reversed": ["Financial instability", "Family conflict"]
            },
            "meaning": "The Ten of Pentacles represents <b>Wealth</b> and <b>Legacy</b>, symbolizing long-term financial success and the establishment of a strong foundation for future generations.",
            "reversedMeaning": "In reverse, the Ten of Pentacles signifies <b>Financial instability</b> and <b>Family conflict</b>, indicating financial struggles or disagreements within the family."
        },
        {
            "name": "Page of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Ambition", "Learning"],
                "reversed": ["Procrastination", "Lack of progress"]
            },
            "meaning": "The Page of Pentacles represents <b>Ambition</b> and <b>Learning</b>, symbolizing a desire for growth and the pursuit of knowledge.",
            "reversedMeaning": "In reverse, the Page of Pentacles signifies <b>Procrastination</b> and <b>Lack of progress</b>, indicating delays in achieving goals or difficulty acquiring new skills."
        },
        {
            "name": "Knight of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Responsibility", "Persistence"],
                "reversed": ["Laziness", "Stagnation"]
            },
            "meaning": "The Knight of Pentacles represents <b>Responsibility</b> and <b>Persistence</b>, symbolizing a strong work ethic and the determination to see tasks through to completion.",
            "reversedMeaning": "In reverse, the Knight of Pentacles signifies <b>Laziness</b> and <b>Stagnation</b>, indicating a lack of motivation or difficulty making progress."
        },
        {
            "name": "Queen of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Nurturing", "Practicality"],
                "reversed": ["Materialism", "Neglect"]
            },
            "meaning": "The Queen of Pentacles represents <b>Nurturing</b> and <b>Practicality</b>, symbolizing a caring and grounded approach to life and relationships.",
            "reversedMeaning": "In reverse, the Queen of Pentacles signifies <b>Materialism</b> and <b>Neglect</b>, indicating an unhealthy focus on material possessions or a lack of attention to emotional needs."
        },
        {
            "name": "King of Pentacles",
            "reversed": false,
            "energy": {
                "upright": ["Stability", "Abundance"],
                "reversed": ["Greed", "Stubbornness"]
            },
            "meaning": "The King of Pentacles represents <b>Stability</b> and <b>Abundance</b>, symbolizing a strong foundation and the ability to create and maintain wealth.",
            "reversedMeaning": "In reverse, the King of Pentacles signifies <b>Greed</b> and <b>Stubbornness</b>, indicating an unhealthy attachment to wealth or an unwillingness to change."
        }
    ]],
    ["Suit of Svelte", [
        {
            "name": "Simplicity of Svelte",
            "reversed": false,
            "energy": {
                "upright": ["New beginnings", "Inspiration"],
                "reversed": ["Lack of motivation", "Uninspired"]
            },
            "meaning":"The Simplicity of Svelte represents <b>New beginnings</b> and <b>Inspiration</b>, symbolizing the potential for growth and the desire to create something new.",
            "reversedMeaning":"In reverse, the Simplicity of Svelte signifies <b>Lack of motivation</b> and <b>Uninspired</b>, indicating a lack of enthusiasm or difficulty finding inspiration."
        },
        {
            "name": "Optimization of Svelte",
            "reversed": false,
            "energy": {
                "upright": ["Balance", "Harmony"],
                "reversed": ["Unbalance", "Disagreement"]
            },
            "meaning":"The Two of Svelte represents <b>Balance</b> and <b>Harmony</b>, symbolizing the need for cooperation and the importance of maintaining a healthy lifestyle.",
            "reversedMeaning":"In reverse, the Two of Svelte signifies <b>Unbalance</b> and <b>Disagreement</b>, indicating a lack of harmony or difficulty maintaining a healthy lifestyle."
        },
        {
            "name": "Reactivity of Svelte",
            "reversed": false,
            "energy": {
                "upright": ["Flexibility", "Adaptability"],
                "reversed": ["Inflexibility", "Resistance"]
            },
            "meaning":"The Three of Svelte represents <b>Flexibility</b> and <b>Adaptability</b>, symbolizing the ability to adapt to changing circumstances and the importance of maintaining an open mind.",
            "reversedMeaning":"In reverse, the Three of Svelte signifies <b>Inflexibility</b> and <b>Resistance</b>, indicating difficulty adapting to change or an unwillingness to consider new ideas."
        }]
    ]
]);

