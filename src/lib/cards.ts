export type CollectionCard = {
    name: string;
    reversed?: boolean | false;
    energy: { "upright": string[], reversed: string[] };
    meaning: string;
    reversedMeaning: string;
};

export type CollectionDeck = {
    name: string;
    abbrv: string;
    cards: CollectionCard[];
    available: boolean;
    pack?: string
    exp?: boolean
};

export const cards = new Map<string, CollectionDeck>([
    ["Major Arcana",
        {
            name: "Major Arcana",
            "abbrv": "MA",
            "available": true,
            "cards": [
                {
                    name: "The Fool",
                    energy: {
                        "upright": ["Beginnings", "Innocence", "Spontaneity"],
                        reversed: ["Naivety", "Recklessness", "Irresponsibility"]
                    },
                    meaning: "The Fool represents new beginnings, innocence, and spontaneity. It signifies taking a leap of faith and embracing the unknown, trusting that the universe will guide and support you.",
                    reversedMeaning: "In reverse, The Fool indicates naivety, recklessness, and irresponsibility. It suggests a lack of foresight or consideration for consequences, which may lead to negative outcomes."
                },
                {
                    name: "The Magician",
                    energy: {
                        "upright": ["Manifestation", "Resourcefulness", "Power"],
                        reversed: ["Manipulation", "Deception", "Untapped Potential"]
                    },
                    meaning: "The Magician represents manifestation, resourcefulness, and power. It signifies the ability to harness one's skills and resources to achieve desired outcomes and create positive change.",
                    reversedMeaning: "In reverse, The Magician indicates manipulation, deception, and untapped potential. It suggests that one may be using their abilities for selfish or dishonest purposes or not utilizing their full potential."
                }, {
                    name: "The High Priestess",
                    energy: {
                        "upright": ["Intuition", "Mystery", "Subconscious"],
                        reversed: ["Secrets", "Repressed Emotions", "Lack of Intuition"]
                    },
                    meaning: "The High Priestess represents intuition, mystery, and the subconscious. It signifies the need to trust your inner voice and pay attention to the hidden aspects of a situation.",
                    reversedMeaning: "In reverse, The High Priestess indicates secrets, repressed emotions, and a lack of intuition. It suggests that one may be ignoring their inner wisdom or hiding something important."
                }, {
                    name: "The Empress",
                    energy: {
                        "upright": ["Nurturing", "Abundance", "Creativity"],
                        reversed: ["Dependency", "Smothering", "Creative Block"]
                    },
                    meaning: "The Empress represents nurturing, abundance, and creativity. It signifies the power of creation, growth, and the importance of self-care and nurturing oneself and others.",
                    reversedMeaning: "In reverse, The Empress indicates dependency, smothering, and creative block. It suggests that one may be overly dependent on others or stifling growth and creativity."
                }, {
                    name: "The Emperor",
                    energy: {
                        "upright": ["Authority", "Stability", "Discipline"],
                        reversed: ["Tyranny", "Rigidity", "Lack of Control"]
                    },
                    meaning: "The Emperor represents authority, stability, and discipline. It signifies the importance of structure, order, and leadership in achieving success and maintaining balance.",
                    reversedMeaning: "In reverse, The Emperor indicates tyranny, rigidity, and lack of control. It suggests that one may be abusing their power or struggling to maintain order and stability."
                }, {
                    name: "The Hierophant",
                    energy: {
                        "upright": ["Tradition", "Spirituality", "Guidance"],
                        reversed: ["Dogmatism", "Restriction", "Unconventional"]
                    },
                    meaning: "The Hierophant represents tradition, spirituality, and guidance. It signifies the importance of following established norms and seeking wisdom from trusted sources or mentors.",
                    reversedMeaning: "In reverse, The Hierophant indicates dogmatism, restriction, and unconventional approaches. It suggests that one may be overly rigid in their beliefs or seeking alternative paths outside of traditional norms."
                }, {
                    name: "The Lovers",
                    energy: {
                        "upright": ["Union", "Harmony", "Choices"],
                        reversed: ["Imbalance", "Misalignment", "Indecision"]
                    },
                    meaning: "The Lovers represent union, harmony, and choices. It signifies the importance of relationships, partnerships, and making informed decisions that align with one's values and desires.",
                    reversedMeaning: "In reverse, The Lovers indicate imbalance, misalignment, and indecision. It suggests that one may be struggling to make a choice or experiencing disharmony in their relationships."
                }, {
                    name: "The Chariot",
                    energy: {
                        "upright": ["Determination", "Willpower", "Victory"],
                        reversed: ["Aggression", "Lack of Direction", "Defeat"]
                    },
                    meaning: "The Chariot represents determination, willpower, and victory. It signifies the need to harness one's inner strength and drive to overcome obstacles and achieve success.",
                    reversedMeaning: "In reverse, The Chariot indicates aggression, lack of direction, and defeat. It suggests that one may be using force inappropriately or struggling to find their way forward."
                }, {
                    name: "Strength",
                    energy: {
                        "upright": ["Courage", "Patience", "Compassion"],
                        reversed: ["Insecurity", "Impatience", "Lack of Confidence"]
                    },
                    meaning: "Strength represents courage, patience, and compassion. It signifies the importance of inner strength, resilience, and the ability to face challenges with grace and understanding.",
                    reversedMeaning: "In reverse, Strength indicates insecurity, impatience, and lack of confidence. It suggests that one may be struggling to find their inner strength or acting out of fear and self-doubt."
                }, {
                    name: "The Hermit",
                    energy: {
                        "upright": ["Introspection", "Wisdom", "Solitude"],
                        reversed: ["Isolation", "Loneliness", "Withdrawal"]
                    },
                    meaning: "The Hermit represents introspection, wisdom, and solitude. It signifies the need for self-reflection, personal growth, and seeking inner guidance through quiet contemplation.",
                    reversedMeaning: "In reverse, The Hermit indicates isolation, loneliness, and withdrawal. It suggests that one may be retreating from the world out of fear or avoiding necessary self-examination."
                }, {
                    name: "Wheel of Fortune",
                    energy: {
                        "upright": ["Luck", "Karma", "Destiny"],
                        reversed: ["Misfortune", "Resistance", "Unpredictability"]
                    },
                    meaning: "The Wheel of Fortune represents luck, karma, and destiny. It signifies the cyclical nature of life, the inevitability of change, and the importance of embracing the ups and downs that come our way.",
                    reversedMeaning: "In reverse, The Wheel of Fortune indicates misfortune, resistance, and unpredictability. It suggests that one may be experiencing setbacks or struggling to accept the natural flow of life."
                }, {
                    name: "Justice",
                    energy: {
                        "upright": ["Fairness", "Truth", "Balance"],
                        reversed: ["Injustice", "Dishonesty", "Imbalance"]
                    },
                    meaning: "Justice represents fairness, truth, and balance. It signifies the importance of making objective decisions, seeking the truth, and maintaining equilibrium in all aspects of life.",
                    reversedMeaning: "In reverse, Justice indicates injustice, dishonesty, and imbalance. It suggests that one may be experiencing unfair treatment or struggling to find balance and truth in a situation."
                }, {
                    name: "The Hanged Man",
                    energy: {
                        "upright": ["Surrender", "Perspective", "Sacrifice"],
                        reversed: ["Stagnation", "Resistance", "Indecision"]
                    },
                    meaning: "The Hanged Man represents surrender, perspective, and sacrifice. It signifies the need to let go of control, gain new insights, and make sacrifices for the greater good.",
                    reversedMeaning: "In reverse, The Hanged Man indicates stagnation, resistance, and indecision. It suggests that one may be unwilling to let go or struggling to make necessary changes."
                }, {
                    name: "Death",
                    energy: {
                        "upright": ["Transformation", "Endings", "Renewal"],
                        reversed: ["Resistance", "Stagnation", "Fear of Change"]
                    },
                    meaning: "Death represents transformation, endings, and renewal. It signifies the need to embrace change, let go of the past, and make way for new beginnings and growth.",
                    reversedMeaning: "In reverse, Death indicates resistance, stagnation, and fear of change. It suggests that one may be clinging to the past or avoiding necessary transformations."
                }, {
                    name: "Temperance",
                    energy: {
                        "upright": ["Balance", "Harmony", "Moderation"],
                        reversed: ["Imbalance", "Excess", "Lack of Harmony"]
                    },
                    meaning: "Temperance represents balance, harmony, and moderation. It signifies the importance of finding equilibrium in all aspects of life and maintaining a sense of calm and peace.",
                    reversedMeaning: "In reverse, Temperance indicates imbalance, excess, and lack of harmony. It suggests that one may be overindulging or struggling to find balance in their life."
                }, {
                    name: "The Devil",
                    energy: {
                        "upright": ["Temptation", "Bondage", "Materialism"],
                        reversed: ["Release", "Breaking Free", "Overcoming"]
                    },
                    meaning: "The Devil represents temptation, bondage, and materialism. It signifies the need to confront one's shadow side, overcome unhealthy attachments, and resist the allure of instant gratification.",
                    reversedMeaning: "In reverse, The Devil indicates release, breaking free, and overcoming. It suggests that one may be in the process of breaking free from unhealthy patterns or attachments and finding liberation from their past limitations."
                }, {
                    name: "The Tower",
                    energy: {
                        "upright": ["Sudden Change", "Chaos", "Revelation"],
                        reversed: ["Resistance", "Fear of Change", "Avoiding Disaster"]
                    },
                    meaning: "The Tower represents sudden change, chaos, and revelation. It signifies the need to embrace upheaval and unexpected events, as they often lead to growth and transformation.",
                    reversedMeaning: "In reverse, The Tower indicates resistance, fear of change, and avoiding disaster. It suggests that one may be clinging to the status quo or trying to prevent inevitable change, which may ultimately be detrimental."
                }, {
                    name: "The Star",
                    energy: {
                        "upright": ["Hope", "Inspiration", "Guidance"],
                        reversed: ["Despair", "Disillusionment", "Lack of Faith"]
                    },
                    meaning: "The Star represents hope, inspiration, and guidance. It signifies the need to trust in the universe, maintain a positive outlook, and follow one's inner guidance toward a brighter future.",
                    reversedMeaning: "In reverse, The Star indicates despair, disillusionment, and lack of faith. It suggests that one may be struggling to maintain hope or feeling disconnected from their spiritual path."
                }, {
                    name: "The Moon",
                    energy: {
                        "upright": ["Intuition", "Mystery", "Illusion"],
                        reversed: ["Confusion", "Fear", "Misinterpretation"]
                    },
                    meaning: "The Moon represents intuition, mystery, and illusion. It signifies the need to trust one's instincts, explore the unknown, and navigate through uncertainty with faith and courage.",
                    reversedMeaning: "In reverse, The Moon indicates confusion, fear, and misinterpretation. It suggests that one may be struggling to see the truth or allowing fear to cloud their judgement and intuition."
                }, {
                    name: "The Sun",
                    energy: {
                        "upright": ["Joy", "Success", "Vitality"],
                        reversed: ["Temporary Setback", "Lack of Clarity", "Diminished Joy"]
                    },
                    meaning: "The Sun represents joy, success, and vitality. It signifies the importance of embracing positivity, celebrating achievements, and enjoying the warmth and energy that life has to offer.",
                    reversedMeaning: "In reverse, The Sun indicates temporary setbacks, lack of clarity, and diminished joy. It suggests that one may be experiencing challenges or struggling to see the bright side of a situation."
                }, {
                    name: "Judgement",
                    energy: {
                        "upright": ["Renewal", "Redemption", "Awakening"],
                        reversed: ["Denial", "Stagnation", "Unresolved Issues"]
                    },
                    meaning: "Judgement represents renewal, redemption, and awakening. It signifies the need to face the past, make amends, and embrace the transformative power of forgiveness and self-awareness.",
                    reversedMeaning: "In reverse, Judgement indicates denial, stagnation, and unresolved issues. It suggests that one may be avoiding necessary self-examination or struggling to move forward from past mistakes."
                }, {
                    name: "The World",
                    energy: {
                        "upright": ["Completion", "Wholeness", "Achievement"],
                        reversed: ["Incompletion", "Lack of Closure", "Unresolved"]
                    },
                    meaning: "The World represents completion, wholeness, and achievement. It signifies the culmination of a journey, the realization of goals, and the attainment of a sense of fulfillment and harmony.",
                    reversedMeaning: "In reverse, The World indicates incompletion, lack of closure, and unresolved issues. It suggests that one may be struggling to find resolution or reach a sense of completion in their endeavors."
                }
            ]
        }
    ],
    [
        "Suit of Wands",
        {
            name: "Suit of Wands",
            "abbrv": "Wands",
            "available": false,
            "exp": true,
            "cards": [
                {
                    name: "Ace of Wands",
                    energy: {
                        upright: ["Inspiration", "Creativity", "New Beginnings"],
                        reversed: ["Delays", "Lack of Motivation", "Blocked Creativity"]
                    },
                    meaning: "The Ace of Wands represents inspiration, creativity, and new beginnings. It signifies the spark of an idea, the potential for growth, and the excitement of embarking on a new venture.",
                    reversedMeaning: "In reverse, the Ace of Wands indicates delays, lack of motivation, and blocked creativity. It suggests that one may be struggling to find inspiration or facing obstacles that hinder progress."
                },
                {
                    name: "Two of Wands",
                    energy: {
                        upright: ["Planning", "Progress", "Decisions"],
                        reversed: ["Lack of Planning", "Disorganization", "Bad Decisions"]
                    },
                    meaning: "The Two of Wands represents planning, progress, and decisions. It signifies the need to make choices, set goals, and take action to move forward.",
                    reversedMeaning: "In reverse, the Two of Wands indicates lack of planning, disorganization, and bad decisions. It suggests that one may be struggling to make decisions, failing to plan ahead, or making poor choices."
                },
                {
                    name: "Three of Wands",
                    energy: {
                        upright: ["Progress", "Expansion", "Opportunity"],
                        reversed: ["Obstacles", "Delays", "Frustration"]
                    },
                    meaning: "The Three of Wands represents progress, expansion, and opportunity. It signifies the need to build on past successes, explore new possibilities, and take advantage of opportunities for growth.",
                    reversedMeaning: "In reverse, the Three of Wands indicates obstacles, delays, and frustration. It suggests that one may be facing setbacks, struggling to make progress, or feeling discouraged."
                },
                {
                    name: "Four of Wands",
                    energy: {
                        upright: ["Celebration", "Harmony", "Homecoming"],
                        reversed: ["Disagreement", "Unstable", "Lack of Support"]
                    },
                    meaning: "The Four of Wands represents celebration, harmony, and homecoming. It signifies the need to come together with others, celebrate achievements, and enjoy the fruits of one's labor.",
                    reversedMeaning: "In reverse, the Four of Wands indicates disagreement, instability, and lack of support. It suggests that one may be experiencing conflict, feeling unsettled, or lacking the support of others."
                },
                {
                    name: "Five of Wands",
                    energy: {
                        upright: ["Conflict", "Disagreement", "Competition"],
                        reversed: ["Avoidance", "Resentment", "Conflict Resolution"]
                    },
                    meaning: "The Five of Wands represents conflict, disagreement, and competition. It signifies the need to address conflict, find common ground, and work together towards a shared goal.",
                    reversedMeaning: "In reverse, the Five of Wands indicates avoidance, resentment, and conflict resolution. It suggests that one may be avoiding conflict, holding onto resentment, or attempting to resolve a disagreement."
                },
                {
                    name: "Six of Wands",
                    energy: {
                        upright: ["Victory", "Success", "Recognition"],
                        reversed: ["Failure", "Setbacks", "Lack of Recognition"]
                    },
                    meaning: "The Six of Wands represents victory, success, and recognition. It signifies the need to celebrate achievements, receive recognition for one's efforts, and enjoy the rewards of hard work.",
                    reversedMeaning: "In reverse, the Six of Wands indicates failure, setbacks, and lack of recognition. It suggests that one may be experiencing setbacks, struggling to achieve success, or feeling unappreciated."
                },
                {
                    name: "Seven of Wands",
                    energy: {
                        upright: ["Challenge", "Perseverance", "Defensiveness"],
                        reversed: ["Giving Up", "Exhaustion", "Overwhelm"]
                    },
                    meaning: "The Seven of Wands represents challenge, perseverance, and defensiveness. It signifies the need to stand up for oneself, defend one's beliefs, and overcome obstacles.",
                    reversedMeaning: "In reverse, the Seven of Wands indicates giving up, exhaustion, and overwhelm. It suggests that one may be feeling overwhelmed, giving up on a challenge, or lacking the energy to persevere."
                },
                {
                    name: "Eight of Wands",
                    energy: {
                        upright: ["Action", "Movement", "Fast Paced"],
                        reversed: ["Delays", "Frustration", "Halted Progress"]
                    },
                    meaning: "The Eight of Wands represents action, movement, and fast-paced change. It signifies the need to take action, move forward quickly, and embrace change.",
                    reversedMeaning: "In reverse, the Eight of Wands indicates delays, frustration, and halted progress. It suggests that one may be experiencing delays, feeling frustrated, or struggling to make progress."
                },
                {
                    name: "Nine of Wands",
                    energy: {
                        upright: ["Resilience", "Persistence", "Test of Faith"],
                        reversed: ["Exhaustion", "Fatigue", "Lack of Confidence"]
                    },
                    meaning: "The Nine of Wands represents resilience, persistence, and a test of faith. It signifies the need to keep going, persevere through challenges, and have faith in oneself.",
                    reversedMeaning: "In reverse, the Nine of Wands indicates exhaustion, fatigue, and lack of confidence. It suggests that one may be feeling exhausted, lacking the energy to persevere, or doubting one's abilities."
                },
                {
                    name: "Ten of Wands",
                    energy: {
                        upright: ["Burden", "Responsibility", "Hard Work"],
                        reversed: ["Release", "Relief", "Overwhelm"]
                    },
                    meaning: "The Ten of Wands represents burden, responsibility, and hard work. It signifies the need to take on more responsibility, work hard to achieve goals, and carry a heavy load.",
                    reversedMeaning: "In reverse, the Ten of Wands indicates release, relief, and overwhelm. It suggests that one may be feeling overwhelmed, releasing a burden, or experiencing relief from a heavy load."
                },
                {
                    name: "Page of Wands",
                    energy: {
                        upright: ["Inspiration", "Exploration", "Excitement"],
                        reversed: ["Lack of Direction", "Distraction", "Lack of Commitment"]
                    },
                    meaning: "The Page of Wands represents inspiration, exploration, and excitement. It signifies the need to explore new possibilities, be open to new ideas, and embrace change.",
                    reversedMeaning: "In reverse, the Page of Wands indicates lack of direction, distraction, and lack of commitment. It suggests that one may be lacking direction, easily distracted, or struggling to commit to a path."
                },
                {
                    name: "Knight of Wands",
                    energy: {
                        upright: ["Action", "Adventure", "Fearlessness"],
                        reversed: ["Haste", "Recklessness", "Impulsiveness"]
                    },
                    meaning: "The Knight of Wands represents action, adventure, and fearlessness. It signifies the need to take action, embrace adventure, and be bold in pursuing one's goals.",
                    reversedMeaning: "In reverse, the Knight of Wands indicates haste, recklessness, and impulsiveness. It suggests that one may be acting hastily, taking unnecessary risks, or making impulsive decisions."
                },
                {
                    name: "Queen of Wands",
                    energy: {
                        upright: ["Courage", "Determination", "Independence"],
                        reversed: ["Selfishness", "Jealousy", "Insecurity"]
                    },
                    meaning: "The Queen of Wands represents courage, determination, and independence. It signifies the need to be confident in one's abilities, take charge of one's life, and stand up for oneself.",
                    reversedMeaning: "In reverse, the Queen of Wands indicates selfishness, jealousy, and insecurity. It suggests that one may be acting selfishly, feeling jealous of others, or lacking confidence in oneself."
                },
                {
                    name: "King of Wands",
                    energy: {
                        upright: ["Natural Born Leader", "Visionary", "Entrepreneur"],
                        reversed: ["Impulsiveness", "Hot Temper", "Impatience"]
                    },
                    meaning: "The King of Wands represents a natural born leader, visionary, and entrepreneur. It signifies the need to take charge, have a clear vision, and be confident in one's abilities.",
                    reversedMeaning: "In reverse, the King of Wands indicates impulsiveness, hot temper, and impatience. It suggests that one may be acting impulsively, losing one's temper, or lacking patience."
                }
            ]
        }],
    ["Suit of Cups",
        {
            name: "Suit of Cups",
            "abbrv": "Cups",
            "available": false,
            "exp": true,
            "cards": [
                {
                    name: "Ace of Cups",
                    energy: {
                        "upright": ["Love", "Emotional Fulfillment", "New Beginnings"],
                        reversed: ["Blocked Emotions", "Unrequited Love", "Emotional Loss"]
                    },
                    meaning: "The Ace of Cups represents love, emotional fulfillment, and new beginnings. It signifies the potential for deep emotional connections, the start of new relationships, and the joy of giving and receiving love.",
                    reversedMeaning: "In reverse, the Ace of Cups indicates blocked emotions, unrequited love, and emotional loss. It suggests that one may be struggling to express their feelings or experiencing a lack of emotional connection."
                }, {
                    name: "Two of Cups",
                    energy: {
                        "upright": ["Partnership", "Attraction", "Harmony"],
                        reversed: ["Imbalance", "Miscommunication", "Separation"]
                    },
                    meaning: "The Two of Cups represents partnership, attraction, and harmony. It signifies the importance of emotional connections, mutual understanding, and the joy of sharing love and support with others.",
                    reversedMeaning: "In reverse, the Two of Cups indicates imbalance, miscommunication, and separation. It suggests that one may be experiencing challenges in their relationships or struggling to find common ground with others."
                }, {
                    name: "Three of Cups",
                    energy: {
                        "upright": ["Celebration", "Friendship", "Joy"],
                        reversed: ["Isolation", "Excess", "Lack of Support"]
                    },
                    meaning: "The Three of Cups represents celebration, friendship, and joy. It signifies the importance of social connections, shared happiness, and the pleasure of spending time with loved ones.",
                    reversedMeaning: "In reverse, the Three of Cups indicates isolation, excess, and lack of support. It suggests that one may be feeling disconnected from their social circle or struggling to find balance in their relationships."
                }, {
                    name: "Four of Cups",
                    energy: {
                        "upright": ["Apathy", "Contemplation", "Discontent"],
                        reversed: ["Action", "New Opportunities", "Gratitude"]
                    },
                    meaning: "The Four of Cups represents apathy, contemplation, and discontent. It signifies the need to reflect on one's emotional state, recognize feelings of dissatisfaction, and seek ways to restore balance and happiness.",
                    reversedMeaning: "In reverse, the Four of Cups indicates action, new opportunities, and gratitude. It suggests that one is taking steps to improve their emotional well-being and embracing the positive aspects of their life."
                }, {
                    name: "Five of Cups",
                    energy: {
                        "upright": ["Loss", "Grief", "Regret"],
                        reversed: ["Acceptance", "Forgiveness", "Moving On"]
                    },
                    meaning: "The Five of Cups represents loss, grief, and regret. It signifies the need to process and accept difficult emotions, learn from past mistakes, and find the strength to move forward.",
                    reversedMeaning: "In reverse, the Five of Cups indicates acceptance, forgiveness, and moving on. It suggests that one is finding the courage to let go of past pain and embrace the healing process."
                }, {
                    name: "Six of Cups",
                    energy: {
                        "upright": ["Nostalgia", "Reunion", "Innocence"],
                        reversed: ["Stuck in the Past", "Unrealistic Expectations", "Resistance to Change"]
                    },
                    meaning: "The Six of Cups represents nostalgia, reunion, and innocence. It signifies the importance of cherishing fond memories, reconnecting with loved ones, and embracing the joy of simpler times.",
                    reversedMeaning: "In reverse, the Six of Cups indicates being stuck in the past, unrealistic expectations, and resistance to change. It suggests that one may be struggling to let go of past experiences or refusing to accept the reality of present circumstances."
                }
                , {
                    name: "Seven of Cups",
                    energy: {
                        "upright": ["Choices", "Fantasy", "Daydreaming"],
                        reversed: ["Decision-making", "Clarity", "Focused Goals"]
                    },
                    meaning: "The Seven of Cups represents choices, fantasy, and daydreaming. It signifies the need to explore various options, indulge in imaginative thinking, and consider the potential outcomes of different paths.",
                    reversedMeaning: "In reverse, the Seven of Cups indicates decision-making, clarity, and focused goals. It suggests that one is gaining a clearer understanding of their desires and taking steps to achieve their objectives."
                }, {
                    name: "Eight of Cups",
                    energy: {
                        "upright": ["Departure", "Letting Go", "Emotional Growth"],
                        reversed: ["Fear of Change", "Stagnation", "Clinging to the Past"]
                    },
                    meaning: "The Eight of Cups represents departure, letting go, and emotional growth. It signifies the need to leave behind unfulfilling situations, release emotional baggage, and embrace the journey of self-discovery and growth.",
                    reversedMeaning: "In reverse, the Eight of Cups indicates fear of change, stagnation, and clinging to the past. It suggests that one may be struggling to move forward or resisting the necessary process of growth and transformation."
                }, {
                    name: "Nine of Cups",
                    energy: {
                        "upright": ["Contentment", "Gratitude", "Wishes Fulfilled"],
                        reversed: ["Dissatisfaction", "Greed", "Unfulfilled Desires"]
                    },
                    meaning: "The Nine of Cups represents contentment, gratitude, and wishes fulfilled. It signifies the importance of recognizing and appreciating the blessings in one's life and the joy of achieving personal goals.",
                    reversedMeaning: "In reverse, the Nine of Cups indicates dissatisfaction, greed, and unfulfilled desires. It suggests that one may be focusing on what they lack or allowing materialistic pursuits to overshadow their emotional well-being."
                }, {
                    name: "Ten of Cups",
                    energy: {
                        "upright": ["Happiness", "Harmony", "Family"],
                        reversed: ["Broken Relationships", "Disconnection", "Unhappiness"]
                    },
                    meaning: "The Ten of Cups represents happiness, harmony, and family. It signifies the joy of emotional fulfillment, strong relationships, and the importance of love and support within a community.",
                    reversedMeaning: "In reverse, the Ten of Cups indicates broken relationships, disconnection, and unhappiness. It suggests that one may be experiencing emotional turmoil or struggling to maintain harmony within their relationships."
                }, {
                    name: "Page of Cups",
                    energy: {
                        "upright": ["Creativity", "Intuition", "Emotional Expression"],
                        reversed: ["Blocked Emotions", "Insecurity", "Lack of Inspiration"]
                    },
                    meaning: "The Page of Cups represents creativity, intuition, and emotional expression. It signifies the need to embrace one's imaginative side, trust their instincts, and express their feelings openly and honestly.",
                    reversedMeaning: "In reverse, the Page of Cups indicates blocked emotions, insecurity, and lack of inspiration. It suggests that one may be struggling to express their feelings or experiencing self-doubt and creative blocks."
                }, {
                    name: "Knight of Cups",
                    energy: {
                        "upright": ["Romance", "Chivalry", "Idealism"],
                        reversed: ["Moodiness", "Disillusionment", "Unrealistic Expectations"]
                    },
                    meaning: "The Knight of Cups represents romance, chivalry, and idealism. It signifies the pursuit of love, the importance of emotional connections, and the desire to create a harmonious and fulfilling life.",
                    reversedMeaning: "In reverse, the Knight of Cups indicates moodiness, disillusionment, and unrealistic expectations. It suggests that one may be experiencing emotional instability or struggling to maintain a balanced perspective on their relationships."
                }, {
                    name: "Queen of Cups",
                    energy: {
                        "upright": ["Empathy", "Intuition", "Compassion"],
                        reversed: ["Emotional Instability", "Manipulation", "Insecurity"]
                    },
                    meaning: "The Queen of Cups represents empathy, intuition, and compassion. It signifies the need to nurture emotional well-being, trust one's instincts, and extend kindness and understanding to others.",
                    reversedMeaning: "In reverse, the Queen of Cups indicates emotional instability, manipulation, and insecurity. It suggests that one may be struggling to maintain emotional balance or using their feelings to control or deceive others."
                }
                , {
                    name: "King of Cups",
                    energy: {
                        "upright": ["Emotional Wisdom", "Diplomacy", "Calmness"],
                        reversed: ["Emotional Suppression", "Moodiness", "Manipulation"]
                    },
                    meaning: "The King of Cups represents emotional wisdom, diplomacy, and calmness. It signifies the ability to navigate complex emotional situations, maintain balance, and provide guidance and support to others.",
                    reversedMeaning: "In reverse, the King of Cups indicates emotional suppression, moodiness, and manipulation. It suggests that one may be struggling to express their feelings or using their emotions to control others."
                }
            ]
        }],
    ["Suit of Swords",
        {
            name: "Suit of Swords",
            "abbrv": "Swords",
            "available": false,
            "exp": true,
            "cards": [
                {
                    name: "Ace of Swords",
                    energy: {
                        "upright": ["Clarity", "Breakthrough", "Truth"],
                        reversed: ["Confusion", "Miscommunication", "Blocked Ideas"]
                    },
                    meaning: "The Ace of Swords represents clarity, breakthrough, and truth. It signifies the power of the intellect, the ability to cut through confusion, and the emergence of new ideas and insights.",
                    reversedMeaning: "In reverse, the Ace of Swords indicates confusion, miscommunication, and blocked ideas. It suggests that one may be struggling to find clarity or experiencing obstacles in communication and understanding."
                }, {
                    name: "Two of Swords",
                    energy: {
                        "upright": ["Indecision", "Balance", "Stalemate"],
                        reversed: ["Confusion", "Overwhelm", "Avoidance"]
                    },
                    meaning: "The Two of Swords represents indecision, balance, and stalemate. It signifies the need to weigh options carefully, seek harmony, and find a resolution to conflicting situations.",
                    reversedMeaning: "In reverse, the Two of Swords indicates confusion, overwhelm, and avoidance. It suggests that one may be struggling to make a decision or facing emotional turmoil that prevents them from finding clarity."
                }, {
                    name: "Three of Swords",
                    energy: {
                        "upright": ["Heartbreak", "Sorrow", "Painful Truth"],
                        reversed: ["Healing", "Forgiveness", "Moving On"]
                    },
                    meaning: "The Three of Swords represents heartbreak, sorrow, and painful truth. It signifies the emotional pain that comes from loss, betrayal, or facing difficult realities and the need for healing and acceptance.",
                    reversedMeaning: "In reverse, the Three of Swords indicates healing, forgiveness, and moving on. It suggests that one is in the process of recovering from emotional pain and finding the strength to let go and move forward."
                }, {
                    name: "Four of Swords",
                    energy: {
                        "upright": ["Rest", "Meditation", "Recovery"],
                        reversed: ["Restlessness", "Burnout", "Lack of Progress"]
                    },
                    meaning: "The Four of Swords represents rest, meditation, and recovery. It signifies the need for a period of rest and reflection to recharge and gain perspective after facing challenges or exerting effort.",
                    reversedMeaning: "In reverse, the Four of Swords indicates restlessness, burnout, and lack of progress. It suggests that one may be struggling to find the necessary rest or feeling stuck in a stagnant situation."
                }, {
                    name: "Five of Swords",
                    energy: {
                        "upright": ["Conflict", "Defeat", "Win at All Costs"],
                        reversed: ["Reconciliation", "Learning from Mistakes", "Forgiveness"]
                    },
                    meaning: "The Five of Swords represents conflict, defeat, and a win-at-all-costs mentality. It signifies the potential for tension, disagreements, and the need to consider the consequences of one's actions and choices.",
                    reversedMeaning: "In reverse, the Five of Swords indicates reconciliation, learning from mistakes, and forgiveness. It suggests that one may be finding resolution to conflicts or gaining valuable insights from past experiences."
                }, {
                    name: "Six of Swords",
                    energy: {
                        "upright": ["Transition", "Moving On", "Emotional Healing"],
                        reversed: ["Resistance", "Unresolved Issues", "Stagnation"]
                    },
                    meaning: "The Six of Swords represents transition, moving on, and emotional healing. It signifies the process of leaving behind difficult situations, finding resolution, and moving towards a more positive future.",
                    reversedMeaning: "In reverse, the Six of Swords indicates resistance, unresolved issues, and stagnation. It suggests that one may be struggling to let go of the past or facing obstacles that prevent them from moving forward."
                }, {
                    name: "Seven of Swords",
                    energy: {
                        "upright": ["Deception", "Strategy", "Stealth"],
                        reversed: ["Revealed Secrets", "Accountability", "Honesty"]
                    },
                    meaning: "The Seven of Swords represents deception, strategy, and stealth. It signifies the need to be cautious, as others may be acting dishonestly or attempting to manipulate situations for their own gain.",
                    reversedMeaning: "In reverse, the Seven of Swords indicates revealed secrets, accountability, and honesty. It suggests that hidden truths may be coming to light or that one is taking responsibility for their actions and embracing honesty."
                }, {
                    name: "Eight of Swords",
                    energy: {
                        "upright": ["Restriction", "Trapped", "Self-imposed Limitations"],
                        reversed: ["Freedom", "Self-discovery", "Breaking Free"]
                    },
                    meaning: "The Eight of Swords represents restriction, feeling trapped, and self-imposed limitations. It signifies the need to recognize and overcome mental barriers that prevent personal growth and progress.",
                    reversedMeaning: "In reverse, the Eight of Swords indicates freedom, self-discovery, and breaking free. It suggests that one is in the process of overcoming limitations and finding the courage to explore new possibilities."
                }, {
                    name: "Nine of Swords",
                    energy: {
                        "upright": ["Anxiety", "Worry", "Nightmares"],
                        reversed: ["Overcoming Fear", "Finding Solutions", "Hope"]
                    },
                    meaning: "The Nine of Swords represents anxiety, worry, and nightmares. It signifies the need to confront and address one's fears and concerns, as they may be causing mental distress and sleepless nights.",
                    reversedMeaning: "In reverse, the Nine of Swords indicates overcoming fear, finding solutions, and hope. It suggests that one is in the process of addressing their anxieties and finding ways to cope with challenges."
                }, {
                    name: "Ten of Swords",
                    energy: {
                        "upright": ["Endings", "Betrayal", "Loss"],
                        reversed: ["Recovery", "Resilience", "New Beginnings"]
                    },
                    meaning: "The Ten of Swords represents endings, betrayal, and loss. It signifies the need to accept and process difficult situations, as they often mark the end of a cycle and the beginning of a new chapter.",
                    reversedMeaning: "In reverse, the Ten of Swords indicates recovery, resilience, and new beginnings. It suggests that one is in the process of healing from past wounds and finding the strength to move forward with renewed hope."
                }, {
                    name: "Page of Swords",
                    energy: {
                        "upright": ["Curiosity", "Mental Agility", "Communication"],
                        reversed: ["Gossip", "Hasty Decisions", "Miscommunication"]
                    },
                    meaning: "The Page of Swords represents curiosity, mental agility, and communication. It signifies the need to embrace a thirst for knowledge, think critically, and express oneself clearly and effectively.",
                    reversedMeaning: "In reverse, the Page of Swords indicates gossip, hasty decisions, and miscommunication. It suggests that one may be engaging in harmful or unproductive communication or making impulsive choices without considering the consequences."
                }, {
                    name: "Knight of Swords",
                    energy: {
                        "upright": ["Ambition", "Action", "Assertiveness"],
                        reversed: ["Impulsiveness", "Recklessness", "Aggression"]
                    },
                    meaning: "The Knight of Swords represents ambition, action, and assertiveness. It signifies the need to pursue one's goals with determination, take decisive action, and stand up for one's beliefs.",
                    reversedMeaning: "In reverse, the Knight of Swords indicates impulsiveness, recklessness, and aggression. It suggests that one may be acting without forethought, taking unnecessary risks, or approaching situations with hostility."
                }, {
                    name: "Queen of Swords",
                    energy: {
                        "upright": ["Intelligence", "Independence", "Honesty"],
                        reversed: ["Coldness", "Manipulation", "Harsh Judgement"]
                    },
                    meaning: "The Queen of Swords represents intelligence, independence, and honesty. It signifies the need to embrace one's intellect, self-reliance, and the importance of clear communication and truthfulness.",
                    reversedMeaning: "In reverse, the Queen of Swords indicates coldness, manipulation, and harsh judgement. It suggests that one may be acting insensitively, using their intellect for selfish purposes, or being overly critical of others."
                }, {
                    name: "King of Swords",
                    energy: {
                        "upright": ["Wisdom", "Authority", "Clarity"],
                        reversed: ["Tyranny", "Manipulation", "Ruthlessness"]
                    },
                    meaning: "The King of Swords represents wisdom, authority, and clarity. It signifies the need to use one's intellect and experience to make informed decisions, provide guidance, and maintain a clear vision for the future.",
                    reversedMeaning: "In reverse, the King of Swords indicates tyranny, manipulation, and ruthlessness. It suggests that one may be abusing their power, using their intellect to deceive or control others, or acting without compassion or empathy."
                }
            ]
        }],
    ["Suit of Pentacles",
        {
            name: "Suit of Pentacles",
            "abbrv": "Pentacles",
            "available": false,
            "exp": true,
            cards: [
                {
                    name: "Ace of Pentacles",
                    energy: {
                        "upright": ["Prosperity", "Opportunity", "New Beginnings"],
                        reversed: ["Missed Opportunities", "Financial Loss", "Instability"]
                    },
                    meaning: "The Ace of Pentacles represents prosperity, opportunity, and new beginnings. It signifies the potential for financial success, growth, and the start of new ventures or projects.",
                    reversedMeaning: "In reverse, the Ace of Pentacles indicates missed opportunities, financial loss, and instability. It suggests that one may be experiencing setbacks or failing to capitalize on opportunities for growth and success."
                }, {
                    name: "Two of Pentacles",
                    energy: {
                        "upright": ["Balance", "Adaptability", "Prioritization"],
                        reversed: ["Imbalance", "Overwhelm", "Disorganization"]
                    },
                    meaning: "The Two of Pentacles represents balance, adaptability, and prioritization. It signifies the need to juggle multiple responsibilities, adapt to changing circumstances, and prioritize tasks effectively.",
                    reversedMeaning: "In reverse, the Two of Pentacles indicates imbalance, overwhelm, and disorganization. It suggests that one may be struggling to manage their responsibilities or facing difficulties in maintaining balance in their life."
                }, {
                    name: "Three of Pentacles",
                    energy: {
                        "upright": ["Teamwork", "Collaboration", "Skill"],
                        reversed: ["Lack of Cooperation", "Miscommunication", "Incompetence"]
                    },
                    meaning: "The Three of Pentacles represents teamwork, collaboration, and skill. It signifies the importance of working together, sharing expertise, and combining efforts to achieve success and accomplish goals.",
                    reversedMeaning: "In reverse, the Three of Pentacles indicates a lack of cooperation, miscommunication, and incompetence. It suggests that one may be experiencing difficulties in working with others or facing challenges due to poor communication or lack of skill."
                }, {
                    name: "Four of Pentacles",
                    energy: {
                        "upright": ["Security", "Stability", "Possessiveness"],
                        reversed: ["Greed", "Insecurity", "Materialism"]
                    },
                    meaning: "The Four of Pentacles represents security, stability, and possessiveness. It signifies the need to protect one's resources, maintain a sense of stability, and be mindful of the potential for becoming overly attached to material possessions.",
                    reversedMeaning: "In reverse, the Four of Pentacles indicates greed, insecurity, and materialism. It suggests that one may be overly focused on accumulating wealth or struggling with feelings of insecurity and a lack of control."
                }, {
                    name: "Five of Pentacles",
                    energy: {
                        "upright": ["Hardship", "Loss", "Isolation"],
                        reversed: ["Recovery", "Hope", "Support"]
                    },
                    meaning: "The Five of Pentacles represents hardship, loss, and isolation. It signifies the challenges that come from financial struggle, feelings of abandonment, and the need to persevere through difficult times.",
                    reversedMeaning: "In reverse, the Five of Pentacles indicates recovery, hope, and support. It suggests that one may be finding the strength to overcome challenges, seeking help, and finding hope in the midst of adversity."
                }, {
                    name: "Six of Pentacles",
                    energy: {
                        "upright": ["Generosity", "Charity", "Sharing"],
                        reversed: ["Selfishness", "Debt", "Exploitation"]
                    },
                    meaning: "The Six of Pentacles represents generosity, charity, and sharing. It signifies the importance of giving and receiving, helping others, and fostering a sense of community and support.",
                    reversedMeaning: "In reverse, the Six of Pentacles indicates selfishness, debt, and exploitation. It suggests that one may be acting out of self-interest, struggling with financial obligations, or taking advantage of others."
                }, {
                    name: "Seven of Pentacles",
                    energy: {
                        "upright": ["Patience", "Growth", "Investment"],
                        reversed: ["Impatience", "Lack of Progress", "Wasted Effort"]
                    },
                    meaning: "The Seven of Pentacles represents patience, growth, and investment. It signifies the need to nurture and cultivate one's resources, plan for the future, and patiently await the fruits of one's labor.",
                    reversedMeaning: "In reverse, the Seven of Pentacles indicates impatience, lack of progress, and wasted effort. It suggests that one may be feeling frustrated with slow growth or struggling to see the results of their hard work."
                }, {
                    name: "Eight of Pentacles",
                    energy: {
                        "upright": ["Diligence", "Skill Development", "Perseverance"],
                        reversed: ["Laziness", "Lack of Focus", "Unfinished Work"]
                    },
                    meaning: "The Eight of Pentacles represents diligence, skill development, and perseverance. It signifies the importance of hard work, dedication, and the continuous pursuit of mastery and self-improvement.",
                    reversedMeaning: "In reverse, the Eight of Pentacles indicates laziness, lack of focus, and unfinished work. It suggests that one may be neglecting their responsibilities, failing to develop their skills, or struggling to complete tasks."
                }, {
                    name: "Nine of Pentacles",
                    energy: {
                        "upright": ["Abundance", "Independence", "Luxury"],
                        reversed: ["Financial Dependency", "Materialism", "Loneliness"]
                    },
                    meaning: "The Nine of Pentacles represents abundance, independence, and luxury. It signifies the enjoyment of the fruits of one's labor, financial stability, and the ability to enjoy life's pleasures.",
                    reversedMeaning: "In reverse, the Nine of Pentacles indicates financial dependency, materialism, and loneliness. It suggests that one may be overly focused on wealth, relying on others for support, or feeling isolated despite their success."
                }, {
                    name: "Ten of Pentacles",
                    energy: {
                        "upright": ["Wealth", "Legacy", "Family"],
                        reversed: ["Financial Loss", "Broken Family", "Instability"]
                    },
                    meaning: "The Ten of Pentacles represents wealth, legacy, and family. It signifies the attainment of financial security, the importance of family connections, and the establishment of a lasting legacy.",
                    reversedMeaning: "In reverse, the Ten of Pentacles indicates financial loss, broken family, and instability. It suggests that one may be experiencing setbacks, struggling with family issues, or facing challenges to their sense of security."
                }, {
                    name: "Page of Pentacles",
                    energy: {
                        "upright": ["Ambition", "Learning", "Opportunity"],
                        reversed: ["Procrastination", "Lack of Direction", "Missed Opportunities"]
                    },
                    meaning: "The Page of Pentacles represents ambition, learning, and opportunity. It signifies the need to embrace new experiences, pursue one's goals, and cultivate a sense of curiosity and growth.",
                    reversedMeaning: "In reverse, the Page of Pentacles indicates procrastination, lack of direction, and missed opportunities. It suggests that one may be struggling to take action, lacking focus, or failing to capitalize on potential opportunities."
                }, {
                    name: "Knight of Pentacles",
                    energy: {
                        "upright": ["Responsibility", "Determination", "Steadfastness"],
                        reversed: ["Stagnation", "Laziness", "Resistance to Change"]
                    },
                    meaning: "The Knight of Pentacles represents responsibility, determination, and steadfastness. It signifies the need to approach tasks with diligence, maintain a strong work ethic, and remain committed to one's goals.",
                    reversedMeaning: "In reverse, the Knight of Pentacles indicates stagnation, laziness, and resistance to change. It suggests that one may be struggling to make progress, lacking motivation, or unwilling to adapt to new circumstances."
                }, {
                    name: "Queen of Pentacles",
                    energy: {
                        "upright": ["Nurturing", "Abundance", "Practicality"],
                        reversed: ["Materialism", "Neglect", "Insecurity"]
                    },
                    meaning: "The Queen of Pentacles represents nurturing, abundance, and practicality. It signifies the importance of caring for oneself and others, enjoying the fruits of one's labor, and maintaining a grounded and sensible approach to life.",
                    reversedMeaning: "In reverse, the Queen of Pentacles indicates materialism, neglect, and insecurity. It suggests that one may be overly focused on material possessions, failing to care for themselves or others, or struggling with feelings of inadequacy."
                }, {
                    name: "King of Pentacles",
                    energy: {
                        "upright": ["Prosperity", "Stability", "Leadership"],
                        reversed: ["Greed", "Stubbornness", "Misuse of Power"]
                    },
                    meaning: "The King of Pentacles represents prosperity, stability, and leadership. It signifies the ability to create and maintain wealth, provide for others, and exercise wise and responsible stewardship over material resources.",
                    reversedMeaning: "In reverse, the King of Pentacles indicates greed, stubbornness, and misuse of power. It suggests that one may be overly focused on material gain, unwilling to compromise, or using their resources and influence inappropriately."
                }
            ]
        }],
    // ["Suit of Svelte",
    //     {
    //         name: "Suit of Svelte",
    //         "abbrv": "Svelte",
    //         "available": false,
    //         "cards": [
    //             {
    //                 name: "Simplicity of Svelte",
    //                 reversed: false,
    //                 energy: {
    //                     "upright": ["New beginnings", "Inspiration"],
    //                     reversed: ["Lack of motivation", "Depression"]
    //                 },
    //                 meaning: "The Simplicity of Svelte represents <b>New beginnings</b> and <b>Inspiration</b>, symbolizing the potential for growth and the desire to create something new.",
    //                 reversedMeaning: "In reverse, the Simplicity of Svelte signifies <b>Lack of motivation</b> and <b>Depression</b>, indicating a lack of enthusiasm or difficulty finding inspiration."
    //             },
    //             {
    //                 name: "Experience of Svelte",
    //                 reversed: false,
    //                 energy: {
    //                     "upright": ["Balance", "Harmony"],
    //                     reversed: ["Burden", "Hardship"]
    //                 },
    //                 meaning: "The Experience of Svelte represents <b>Balance</b> and <b>Harmony</b>, symbolizing the need for cooperation and the importance of maintaining a healthy lifestyle.",
    //                 reversedMeaning: "In reverse, the Experience of Svelte signifies <b>Burden</b> and <b>Hardship</b>, indicating a lack of harmony or difficulty maintaining a healthy lifestyle."
    //             },
    //             {
    //                 name: "Reactivity of Svelte",
    //                 reversed: false,
    //                 energy: {
    //                     "upright": ["Creativity", "Adaptability"],
    //                     reversed: ["Restriction", "Resistance"]
    //                 },
    //                 meaning: "The Reactivity of Svelte represents <b>Creativity</b> and <b>Adaptability</b>, symbolizing the ability to adapt to changing circumstances and the importance of maintaining an open mind.",
    //                 reversedMeaning: "In reverse, the Reactivity of Svelte signifies <b>Restriction</b> and <b>Resistance</b>, indicating difficulty adapting to change or an unwillingness to consider new ideas."
    //             }]
    //     }],
    ["Crystal Visions",
        {
            name: "Crystal Visions",
            "abbrv": "Crystal",
            "available": false,
            "cards": [
                {
                    name: "Clear Quartz",
                    energy: {
                        "upright": ["Amplification", "Healing", "Clarity"],
                        reversed: ["Dilution", "Blocked Energy", "Uncertainty"]
                    },
                    meaning: "Clear Quartz represents amplification, healing, and clarity. It signifies the need to magnify positive energies, enhance healing processes, and maintain a clear and focused mindset.",
                    reversedMeaning: "In reverse, Clear Quartz indicates dilution, blocked energy, and uncertainty. It suggests that one may be struggling to harness their full potential or experiencing difficulties in finding clarity and direction."
                },
                {
                    name: "Green Aventurine",
                    energy: {
                        "upright": ["Luck", "Opportunity", "Growth"],
                        reversed: ["Misfortune", "Missed Opportunities", "Stagnation"]
                    },
                    meaning: "Green Aventurine represents luck, opportunity, and growth. It signifies the need to embrace change, seize opportunities, and cultivate personal and spiritual development.",
                    reversedMeaning: "In reverse, Green Aventurine indicates misfortune, missed opportunities, and stagnation. It suggests that one may be experiencing setbacks or struggling to recognize and take advantage of opportunities for growth."
                },
                {
                    name: "Black Tourmaline",
                    energy: {
                        "upright": ["Protection", "Grounding", "Purification"],
                        reversed: ["Vulnerability", "Disconnection", "Negativity"]
                    },
                    meaning: "Black Tourmaline represents protection, grounding, and purification. It signifies the need to shield oneself from negative energies, stay connected to the earth, and cleanse one's aura and environment.",
                    reversedMeaning: "In reverse, Black Tourmaline indicates vulnerability, disconnection, and negativity. It suggests that one may be susceptible to negative influences or struggling to maintain a grounded and purified energy."
                },
                {
                    name: "Sodalite",
                    energy: {
                        "upright": ["Clarity", "Balance", "Rationality"],
                        reversed: ["Confusion", "Imbalance", "Emotional Turmoil"]
                    },
                    meaning: "Sodalite represents clarity, balance, and rationality. It signifies the need to maintain mental and emotional equilibrium, think clearly, and approach situations with logic and reason.",
                    reversedMeaning: "In reverse, Sodalite indicates confusion, imbalance, and emotional turmoil. It suggests that one may be struggling to find clarity or experiencing difficulties in maintaining balance and rationality."
                }, {
                    name: "Rose Quartz",
                    energy: {
                        "upright": ["Love", "Compassion", "Healing"],
                        reversed: ["Heartache", "Indifference", "Unresolved Pain"]
                    },
                    meaning: "Rose Quartz represents love, compassion, and healing. It signifies the need to cultivate self-love, empathy, and emotional healing in oneself and others.",
                    reversedMeaning: "In reverse, Rose Quartz indicates heartache, indifference, and unresolved pain. It suggests that one may be struggling to find love and compassion or experiencing emotional wounds that require healing."
                },
                {
                    name: "Lapis Lazuli",
                    energy: {
                        "upright": ["Wisdom", "Truth", "Self-expression"],
                        reversed: ["Ignorance", "Deception", "Suppression"]
                    },
                    meaning: "Lapis Lazuli represents wisdom, truth, and self-expression. It signifies the need to seek knowledge, embrace honesty, and communicate one's thoughts and feelings openly and authentically.",
                    reversedMeaning: "In reverse, Lapis Lazuli indicates ignorance, deception, and suppression. It suggests that one may be avoiding the truth, engaging in dishonesty, or struggling to express themselves openly."
                },

                {
                    name: "Citrine",
                    energy: {
                        "upright": ["Abundance", "Creativity", "Optimism"],
                        reversed: ["Scarcity", "Blocked Creativity", "Pessimism"]
                    },
                    meaning: "Citrine represents abundance, creativity, and optimism. It signifies the need to embrace a positive mindset, tap into one's creative potential, and attract prosperity and success.",
                    reversedMeaning: "In reverse, Citrine indicates scarcity, blocked creativity, and pessimism. It suggests that one may be struggling to maintain a positive outlook or experiencing obstacles in manifesting abundance and creative expression."
                },
                {
                    name: "Amethyst",
                    energy: {
                        "upright": ["Spirituality", "Calm", "Intuition"],
                        reversed: ["Disconnection", "Restlessness", "Doubt"]
                    },
                    meaning: "Amethyst represents spirituality, calm, and intuition. It signifies the need to connect with one's higher self, find inner peace, and trust in the guidance of the universe.",
                    reversedMeaning: "In reverse, Amethyst indicates disconnection, restlessness, and doubt. It suggests that one may be struggling to maintain a spiritual connection or experiencing uncertainty in their intuitive abilities."
                },
            ],
            pack: "CrystalVisions"
        }],
    ["Lunar Enligtenment",
        {
            name: "Lunar Enlightenment",
            "abbrv": "Moon",
            "available": false,
            "cards": [
                {
                    name: "New Moon",
                    energy: {
                        "upright": ["Beginnings", "Potential", "Manifestation"],
                        reversed: ["Hesitation", "Doubt", "Missed Opportunities"]
                    },
                    meaning: "The New Moon represents beginnings, potential, and manifestation. It signifies the start of new projects, setting intentions, and embracing the energy of growth and change.",
                    reversedMeaning: "In reverse, the New Moon indicates hesitation, doubt, and missed opportunities. It suggests that one may be holding back or struggling to take advantage of the potential for growth and transformation."
                }, {
                    name: "Waxing Crescent",
                    energy: {
                        "upright": ["Expansion", "Determination", "Progress"],
                        reversed: ["Impatience", "Obstacles", "Lack of Direction"]
                    },
                    meaning: "The Waxing Crescent represents expansion, determination, and progress. It signifies the importance of taking action, pushing forward, and embracing the momentum of growth and development.",
                    reversedMeaning: "In reverse, the Waxing Crescent indicates impatience, obstacles, and lack of direction. It suggests that one may be feeling frustrated or struggling to maintain focus and momentum in their endeavors."
                }, {
                    name: "First Quarter",
                    energy: {
                        "upright": ["Decision-making", "Action", "Commitment"],
                        reversed: ["Indecision", "Procrastination", "Inconsistency"]
                    },
                    meaning: "The First Quarter represents decision-making, action, and commitment. It signifies the need to make choices, take decisive steps, and fully commit to one's goals and intentions.",
                    reversedMeaning: "In reverse, the First Quarter indicates indecision, procrastination, and inconsistency. It suggests that one may be struggling to make choices or follow through on their commitments."
                }, {
                    name: "Waxing Gibbous",
                    energy: {
                        "upright": ["Refinement", "Perseverance", "Anticipation"],
                        reversed: ["Doubt", "Burnout", "Lack of Focus"]
                    },
                    meaning: "The Waxing Gibbous represents refinement, perseverance, and anticipation. It signifies the importance of fine-tuning one's efforts, staying persistent, and looking forward to the culmination of one's goals.",
                    reversedMeaning: "In reverse, the Waxing Gibbous indicates doubt, burnout, and lack of focus. It suggests that one may be questioning their path or struggling to maintain the energy and dedication required to achieve their goals."
                }, {
                    name: "Full Moon",
                    energy: {
                        "upright": ["Completion", "Illumination", "Celebration"],
                        reversed: ["Disappointment", "Unfulfilled Expectations", "Overwhelm"]
                    },
                    meaning: "The Full Moon represents completion, illumination, and celebration. It signifies the achievement of goals, the revelation of hidden truths, and the joy of accomplishment and gratitude.",
                    reversedMeaning: "In reverse, the Full Moon indicates disappointment, unfulfilled expectations, and overwhelm. It suggests that one may be feeling let down or struggling to cope with the intensity of their emotions and experiences."
                }, {
                    name: "Waning Gibbous",
                    energy: {
                        "upright": ["Reflection", "Gratitude", "Release"],
                        reversed: ["Regret", "Resentment", "Resistance to Change"]
                    },
                    meaning: "The Waning Gibbous represents reflection, gratitude, and release. It signifies the importance of looking back on one's experiences, appreciating the lessons learned, and letting go of what no longer serves them.",
                    reversedMeaning: "In reverse, the Waning Gibbous indicates regret, resentment, and resistance to change. It suggests that one may be struggling to accept the past or release negative emotions and experiences."
                }, {
                    name: "Third Quarter",
                    energy: {
                        "upright": ["Transition", "Reevaluation", "Adjustment"],
                        reversed: ["Stagnation", "Inflexibility", "Fear of Change"]
                    },
                    meaning: "The Third Quarter represents transition, reevaluation, and adjustment. It signifies the need to reassess one's path, make necessary changes, and adapt to new circumstances and challenges.",
                    reversedMeaning: "In reverse, the Third Quarter indicates stagnation, inflexibility, and fear of change. It suggests that one may be struggling to adapt or resisting the natural flow of life and growth."
                }, {
                    name: "Waning Crescent",
                    energy: {
                        "upright": ["Rest", "Renewal", "Preparation"],
                        reversed: ["Exhaustion", "Resistance to Rest", "Anxiety"]
                    },
                    meaning: "The Waning Crescent represents rest, renewal, and preparation. It signifies the importance of taking time to recharge, reflect on one's experiences, and prepare for the next cycle of growth and change.",
                    reversedMeaning: "In reverse, the Waning Crescent indicates exhaustion, resistance to rest, and anxiety. It suggests that one may be pushing themselves too hard or struggling to find peace and balance in their life."
                }
            ],
            pack: "LunarEnlightenment"
        }
    ]

]);

// Export the name of each  card of each suit as an array
export const cardNames = Array.from(cards.keys()).map(suit => cards.get(suit)?.cards.map(card => card.name));


// let allDecks = [...cards.values()]
// let generateDailyEnergies = () => {

//     let allCards = []
//     for (let i = 0; i < allDecks.length; i++) {
//         allCards.push(...allDecks[i].cards)
//     }
//     // Randomize the order of the cards
//     let shuffledCards = allCards.sort(() => Math.random() - 0.5)

//     // iterate all cards, and pick one from each category, store in 2 arrays, one for upright, one for reversed
//     let uprightCards = []
//     let reversedCards = []
//     for (let i = 0; i < shuffledCards.length; i++) {
//         if (shuffledCards[i].reversed === false) {
//             uprightCards.push(shuffledCards[i])
//         } else {
//             reversedCards.push(shuffledCards[i])
//         }
//     }

//     // console.log(uprightCards)
//     // console.log(reversedCards)
// }

// generateDailyEnergies()

// Returns the deck name of a card
export let getCardsPack = (cardName: string) => {
    for (let [deckName, deck] of cards) {
        for (let card of deck.cards) {
            if (card.name === cardName) {
                return deckName;
            }
        }
    }
}