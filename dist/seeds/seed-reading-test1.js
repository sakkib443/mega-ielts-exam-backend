"use strict";
/**
 * Seed Script: Cambridge IELTS Test 1 - Reading Questions
 *
 * This script adds a complete IELTS Reading test with 3 passages (40 questions)
 * to the database.
 *
 * Run with: npx ts-node src/seeds/seed-reading-test1.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const reading_model_1 = require("../app/modules/reading/reading.model");
// Load environment variables
dotenv.config();
// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';
function seedReadingTest1() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            console.log('🔌 Connecting to MongoDB...');
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('✅ Connected to MongoDB');
            // Check if this test already exists
            const existingTest = yield reading_model_1.ReadingTest.findOne({
                title: { $regex: /Cambridge.*Test.*1.*Reading/i }
            });
            if (existingTest) {
                console.log('⚠️ Reading Test 1 already exists in database');
                return {
                    success: true,
                    testId: existingTest.testId,
                    message: 'Reading test already exists'
                };
            }
            // Get next test number
            const lastTest = yield reading_model_1.ReadingTest.findOne().sort({ testNumber: -1 });
            const testNumber = lastTest ? lastTest.testNumber + 1 : 1;
            const testId = `READING_${String(testNumber).padStart(3, '0')}`;
            console.log(`📖 Creating Reading Test: ${testId}`);
            // Create admin user reference
            const adminId = new mongoose_1.default.Types.ObjectId('507f1f77bcf86cd799439011');
            // Reading Test Data
            const readingTest = new reading_model_1.ReadingTest({
                testId,
                testNumber,
                title: 'Cambridge IELTS Test 1 - Reading',
                description: 'Cambridge IELTS Academic Reading Test with 3 passages covering various question types.',
                testType: 'academic',
                // 3 Passages
                passages: [
                    // ============================================
                    // PASSAGE 1: The development of the London underground railway (Questions 1-13)
                    // ============================================
                    {
                        passageNumber: 1,
                        title: 'The development of the London underground railway',
                        content: `In the first half of the 1800s, London's population grew at an astonishing rate, and the central area became increasingly congested. In addition, the expansion of the overground railway network resulted in more and more passengers arriving in the capital. However, in 1846, a Royal Commission decided that the railways should not be allowed to enter the City, the capital's historic and business centre. The result was that the overground railway stations formed a ring around the City. The area within consisted of poorly built, overcrowded slums and the streets were full of horse-drawn traffic. Crossing the City became a nightmare. It could take an hour and a half to travel 8 km by horse-drawn carriage or bus. Numerous schemes were proposed to resolve these problems, but few succeeded.

Amongst the most vocal advocates for a solution to London's traffic problems was Charles Pearson, who worked as a solicitor for the City of London. He saw both social and economic advantages in building an underground railway that would link the overground railway stations together and clear London slums at the same time. His idea was to relocate the poor workers who lived in the inner-city slums to newly constructed suburbs, and to provide cheap rail travel for them to get to work. Pearson's ideas gained support amongst some businessmen and in 1851 he submitted a plan to Parliament. It was rejected, but coincided with a proposal from another group for an underground connecting line, which Parliament passed.

The two groups merged and established the Metropolitan Railway Company in August 1854. The company's plan was to construct an underground railway line from the Great Western Railway's (GWR) station at Paddington to the edge of the City at Farringdon Street — a distance of almost 5 km. The organisation had difficulty in raising the funding for such a radical and expensive scheme, not least because of the critical articles printed by the press. Objectors argued that the tunnels would collapse under the weight of traffic overhead, buildings would be shaken and passengers would be poisoned by the emissions from the train engines. However, Pearson and his partners persisted.

The GWR, aware that the new line would finally enable them to run trains into the heart of the City, invested almost £250,000 in the scheme. Eventually, over a five-year period, £1m was raised. The chosen route ran beneath existing main roads to minimise the expense of demolishing buildings. Originally scheduled to be completed in 21 months, the construction of the underground line took three years. It was built just below street level using a technique known as 'cut and cover'. A trench about ten metres wide and six metres deep was dug, and the sides temporarily held up with timber beams. Brick walls were then constructed, and finally a brick arch was added to create a tunnel. A two-metre-deep layer of soil was laid on top of the tunnel and the road above rebuilt.

The Metropolitan line, which opened on 10 January 1863, was the world's first underground railway. On its first day, almost 40,000 passengers were carried between Paddington and Farringdon, the journey taking about 18 minutes. By the end of the Metropolitan's first year of operation, 9.5 million journeys had been made.

Even as the Metropolitan began operation, the first extensions to the line were being authorised; these were built over the next five years, reaching Moorgate in the east of London and Hammersmith in the west. The original plan was to pull the trains with steam locomotives, using firebricks in the boilers to provide steam, but these engines were never introduced. Instead, the line used specially designed locomotives that were fitted with water tanks in which steam could be condensed. However, smoke and fumes remained a problem, even though ventilation shafts were added to the tunnels.

Despite the extension of the underground railway, by the 1880s, congestion on London's streets had become worse. The problem was partly that the existing underground lines formed a circuit around the centre of London and extended to the suburbs, but did not cross the capital's centre. The 'cut and cover' method of construction was not an option in this part of the capital. The only alternative was to tunnel deep underground.

Although the technology to create these tunnels existed, steam locomotives could not be used in such a confined space. It wasn't until the development of a reliable electric motor, and a means of transferring power from the generator to a moving train, that the world's first deep-level electric railway, the City & South London, became possible. The line opened in 1890, and ran from the City to Stockwell, south of the River Thames. The trains were made up of three carriages and driven by electric engines. The carriages were narrow and had tiny windows just below the roof because it was thought that passengers would not want to look out at the tunnel walls. The line was not without its problems, mainly caused by an unreliable power supply. Although the City & South London Railway was a great technical achievement, it did not make a profit. Then, in 1900, the Central London Railway, known as the 'Tuppenny Tube', began operation using new electric locomotives. It was very popular and soon afterwards new railways and extensions were added to the growing tube network. By 1907, the heart of today's Underground system was in place.`,
                        questionGroups: [
                            {
                                groupNumber: 1,
                                questionType: 'note-completion',
                                instructions: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
                                startQuestion: 1,
                                endQuestion: 6,
                                passage: `The London underground railway

The problem
• The population of London increased rapidly between 1800 and 1850
• The streets were full of horse-drawn vehicles

The proposed solution
• Charles Pearson, a solicitor, suggested building an underground railway
• Building the railway would make it possible to move people to better housing in the 2 __________
• A number of 3 __________ agreed with Pearson's idea
• The company initially had problems getting the 4 __________ needed for the project
• Negative articles about the project appeared in the 5 __________

The construction
• The chosen route did not require many buildings to be pulled down
• The 'cut and cover' method was used to construct the tunnels
• With the completion of the brick arch, the tunnel was covered with 6 __________`,
                                questions: [
                                    {
                                        questionNumber: 1,
                                        questionType: 'note-completion',
                                        questionText: 'The __________ of London increased rapidly between 1800 and 1850',
                                        correctAnswer: 'population',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 2,
                                        questionType: 'note-completion',
                                        questionText: 'Building the railway would make it possible to move people to better housing in the __________',
                                        correctAnswer: 'suburbs',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 3,
                                        questionType: 'note-completion',
                                        questionText: 'A number of __________ agreed with Pearson\'s idea',
                                        correctAnswer: 'businessmen',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 4,
                                        questionType: 'note-completion',
                                        questionText: 'The company initially had problems getting the __________ needed for the project',
                                        correctAnswer: 'funding',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 5,
                                        questionType: 'note-completion',
                                        questionText: 'Negative articles about the project appeared in the __________',
                                        correctAnswer: 'press',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 6,
                                        questionType: 'note-completion',
                                        questionText: 'With the completion of the brick arch, the tunnel was covered with __________',
                                        correctAnswer: 'soil',
                                        marks: 1
                                    }
                                ]
                            },
                            {
                                groupNumber: 2,
                                questionType: 'true-false-ng',
                                instructions: 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.',
                                startQuestion: 7,
                                endQuestion: 13,
                                questions: [
                                    {
                                        questionNumber: 7,
                                        questionType: 'true-false-ng',
                                        questionText: 'Other countries had built underground railways before the Metropolitan line opened.',
                                        correctAnswer: 'FALSE',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 8,
                                        questionType: 'true-false-ng',
                                        questionText: 'More people than predicted travelled on the Metropolitan line on the first day.',
                                        correctAnswer: 'NOT GIVEN',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 9,
                                        questionType: 'true-false-ng',
                                        questionText: 'The use of ventilation shafts failed to prevent pollution in the tunnels.',
                                        correctAnswer: 'TRUE',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 10,
                                        questionType: 'true-false-ng',
                                        questionText: 'A different approach from the \'cut and cover\' technique was required in London\'s central area.',
                                        correctAnswer: 'TRUE',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 11,
                                        questionType: 'true-false-ng',
                                        questionText: 'The windows on City & South London trains were at eye level.',
                                        correctAnswer: 'FALSE',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 12,
                                        questionType: 'true-false-ng',
                                        questionText: 'The City & South London Railway was a financial success.',
                                        correctAnswer: 'FALSE',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 13,
                                        questionType: 'true-false-ng',
                                        questionText: 'Trains on the \'Tuppenny Tube\' nearly always ran on time.',
                                        correctAnswer: 'NOT GIVEN',
                                        marks: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // ============================================
                    // PASSAGE 2: Stadiums: past, present and future (Questions 14-26)
                    // ============================================
                    {
                        passageNumber: 2,
                        title: 'Stadiums: past, present and future',
                        content: `A Stadiums are among the oldest forms of urban architecture: vast stadiums where the public could watch sporting events were at the centre of western city life as far back as the ancient Greek and Roman Empires, well before the construction of the great medieval cathedrals and the grand 19th- and 20th-century railway stations which dominated urban skylines in later eras. Today, however, stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events such as the Olympic Games or the FIFA World Cup have notably fallen into disuse and disrepair.

But this need not be the case. History shows that stadiums can drive urban development and adapt to the culture of every age. Even today, architects and planners are finding new ways to adapt the mono-functional sports arenas which became emblematic of modernisation during the 20th century.

B The amphitheatre of Arles in southwest France, with a capacity of 25,000 spectators, is perhaps the best example of just how versatile stadiums can be. Built by the Romans in 90 AD, it became a fortress with four towers after the fifth century, and was then transformed into a village containing more than 200 houses. With the growing interest in conservation during the 19th century, it was converted back into an arena for the staging of bullfights, thereby returning the structure to its original use as a venue for public spectacles.

Another example is the imposing arena of Verona in northern Italy, with space for 30,000 spectators, which was built 60 years before the Arles amphitheatre and 40 years before Rome's famous Colosseum. It has endured the centuries and is currently considered one of the world's prime sites for opera, thanks to its outstanding acoustics.

C The area in the centre of the Italian town of Lucca, known as the Piazza dell' Anfiteatro, is yet another impressive example of an amphitheatre becoming absorbed into the fabric of the city. The site evolved in a similar way to Arles and was progressively filled with buildings from the Middle Ages until the 19th century, variously used as houses, a salt depot and a prison. But rather than reverting to an arena, it became a market square, designed by Romanticist architect Lorenzo Nottolini. Today, the ruins of the amphitheatre remain embedded in the various shops and residences surrounding the public square.

D There are many similarities between modern stadiums and the ancient amphitheatres intended for games. But some of the flexibility was lost at the beginning of the 20th century, as stadiums were developed using new products such as steel and reinforced concrete, and made use of bright lights for night-time matches.

Many such stadiums are situated in suburban areas, designed for sporting use only and surrounded by parking lots. These factors mean that they may not be as accessible to the general public, require more energy to run and contribute to urban heat.

But many of today's most innovative architects see scope for the stadium to help improve the city. Among the current strategies, two seem to be having particular success: the stadium as an urban hub, and as a power plant.

E There's a growing trend for stadiums to be equipped with public spaces and services that serve a function beyond sport, such as hotels, retail outlets, conference centres, restaurants and bars, children's playgrounds and green space. Creating mixed-use developments such as this reinforces compactness and multi-functionality, making more efficient use of land and helping to regenerate urban spaces.

This opens the space up to families and a wider cross-section of society, instead of catering only to sportspeople and supporters. There have been many examples of this in the UK: the mixed-use facilities at Wembley and Old Trafford have become a blueprint for many other stadiums in the world.

F The phenomenon of stadiums as power stations has arisen from the idea that energy problems can be overcome by integrating interconnected buildings by means of a smart grid, which is an electricity supply network that uses digital communications technology to detect and react to local changes in usage, without significant energy losses. Stadiums are ideal for these purposes, because their canopies have a large surface area for fitting photovoltaic panels and rise high enough (more than 40 metres) to make use of micro wind turbines.

Freiburg Mage Solar Stadium in Germany is the first of a new wave of stadiums as power plants, which also includes the Amsterdam Arena and the Kaohsiung Stadium. The latter, inaugurated in 2009, has 8,844 photovoltaic panels producing up to 1.14 GWh of electricity annually. This reduces the annual output of carbon dioxide by 660 tons and supplies up to 80 percent of the surrounding area when the stadium is not in use. This is proof that a stadium can serve its city, and have a decidedly positive impact in terms of reduction of CO2 emissions.

G Sporting arenas have always been central to the life and culture of cities. In every era, the stadium has acquired new value and uses: from military fortress to residential village, public space to theatre and most recently a field for experimentation in advanced engineering. The stadium of today now brings together multiple functions, thus helping cities to create a sustainable future.`,
                        questionGroups: [
                            {
                                groupNumber: 3,
                                questionType: 'matching-headings',
                                instructions: 'Reading Passage 2 has seven sections, A-G. Which section contains the following information? You may use any letter more than once.',
                                startQuestion: 14,
                                endQuestion: 17,
                                questions: [
                                    {
                                        questionNumber: 14,
                                        questionType: 'matching-headings',
                                        questionText: 'a mention of negative attitudes towards stadium building projects',
                                        correctAnswer: 'A',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 15,
                                        questionType: 'matching-headings',
                                        questionText: 'figures demonstrating the environmental benefits of a certain stadium',
                                        correctAnswer: 'F',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 16,
                                        questionType: 'matching-headings',
                                        questionText: 'examples of the wide range of facilities available at some new stadiums',
                                        correctAnswer: 'E',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 17,
                                        questionType: 'matching-headings',
                                        questionText: 'reference to the disadvantages of the stadiums built during a certain era',
                                        correctAnswer: 'D',
                                        marks: 1
                                    }
                                ]
                            },
                            {
                                groupNumber: 4,
                                questionType: 'summary-completion',
                                instructions: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
                                startQuestion: 18,
                                endQuestion: 22,
                                passage: `Roman amphitheatres

The Roman stadiums of Europe have proved very versatile. The amphitheatre of Arles, for example, was converted first into a 18 __________, then into a residential area and finally into an arena where spectators could watch 19 __________. Meanwhile, the arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where 20 __________ is performed. The site of Lucca's amphitheatre has also been used for many purposes over the centuries, including the storage of 21 __________. It is now a market square with 22 __________ and homes incorporated into the remains of the Roman amphitheatre.`,
                                questions: [
                                    {
                                        questionNumber: 18,
                                        questionType: 'summary-completion',
                                        questionText: 'The amphitheatre of Arles was converted first into a __________',
                                        correctAnswer: 'fortress',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 19,
                                        questionType: 'summary-completion',
                                        questionText: 'An arena where spectators could watch __________',
                                        correctAnswer: 'bullfights',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 20,
                                        questionType: 'summary-completion',
                                        questionText: 'Famous today as a venue where __________ is performed',
                                        correctAnswer: 'opera',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 21,
                                        questionType: 'summary-completion',
                                        questionText: 'Including the storage of __________',
                                        correctAnswer: 'salt',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 22,
                                        questionType: 'summary-completion',
                                        questionText: 'A market square with __________ and homes',
                                        correctAnswer: 'shops',
                                        marks: 1
                                    }
                                ]
                            },
                            {
                                groupNumber: 5,
                                questionType: 'multiple-choice-multi',
                                instructions: 'Choose TWO letters, A-E.',
                                startQuestion: 23,
                                endQuestion: 24,
                                passage: 'When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention?\nA. They are less imaginatively designed.\nB. They are less spacious.\nC. They are in less convenient locations.\nD. They are less versatile.\nE. They are made of less durable materials.',
                                questions: [
                                    {
                                        questionNumber: 23,
                                        questionType: 'multiple-choice-multi',
                                        questionText: 'Negative features of 20th century stadiums (First answer)',
                                        options: ['A. They are less imaginatively designed.', 'B. They are less spacious.', 'C. They are in less convenient locations.', 'D. They are less versatile.', 'E. They are made of less durable materials.'],
                                        correctAnswer: 'C',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 24,
                                        questionType: 'multiple-choice-multi',
                                        questionText: 'Negative features of 20th century stadiums (Second answer)',
                                        options: ['A. They are less imaginatively designed.', 'B. They are less spacious.', 'C. They are in less convenient locations.', 'D. They are less versatile.', 'E. They are made of less durable materials.'],
                                        correctAnswer: 'D',
                                        marks: 1
                                    }
                                ]
                            },
                            {
                                groupNumber: 6,
                                questionType: 'multiple-choice-multi',
                                instructions: 'Choose TWO letters, A-E.',
                                startQuestion: 25,
                                endQuestion: 26,
                                passage: 'Which TWO advantages of modern stadium design does the writer mention?\nA. offering improved amenities for the enjoyment of sports events\nB. bringing community life back into the city environment\nC. facilitating research into solar and wind energy solutions\nD. enabling local residents to reduce their consumption of electricity\nE. providing a suitable site for the installation of renewable power generators',
                                questions: [
                                    {
                                        questionNumber: 25,
                                        questionType: 'multiple-choice-multi',
                                        questionText: 'Advantages of modern stadium design (First answer)',
                                        options: ['A. offering improved amenities for the enjoyment of sports events', 'B. bringing community life back into the city environment', 'C. facilitating research into solar and wind energy solutions', 'D. enabling local residents to reduce their consumption of electricity', 'E. providing a suitable site for the installation of renewable power generators'],
                                        correctAnswer: 'B',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 26,
                                        questionType: 'multiple-choice-multi',
                                        questionText: 'Advantages of modern stadium design (Second answer)',
                                        options: ['A. offering improved amenities for the enjoyment of sports events', 'B. bringing community life back into the city environment', 'C. facilitating research into solar and wind energy solutions', 'D. enabling local residents to reduce their consumption of electricity', 'E. providing a suitable site for the installation of renewable power generators'],
                                        correctAnswer: 'E',
                                        marks: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // ============================================
                    // PASSAGE 3: To Catch a King (Questions 27-40)
                    // ============================================
                    {
                        passageNumber: 3,
                        title: 'To Catch a King',
                        content: `Anna Keay reviews Charles Spencer's book about the hunt for King Charles II during the English Civil War of the seventeenth century

Charles Spencer's latest book, To Catch a King, tells us the story of the hunt for King Charles II in the six weeks after his resounding defeat at the Battle of Worcester in September 1651. And what a story it is. After his father was executed by the Parliamentarians in 1649, the young Charles II sacrificed one of the very principles his father had died for and did a deal with the Scots, thereby accepting Presbyterianism as the national religion in return for being crowned King of Scots. His arrival in Edinburgh prompted the English Parliamentary army to invade Scotland in a pre-emptive strike. This was followed by a Scottish invasion of England. The two sides finally faced one another at Worcester in the west of England in 1651. After being comprehensively defeated on the meadows outside the city by the Parliamentarian army, the 21-year-old king found himself the subject of a national manhunt, with a huge sum offered for his capture. Over the following six weeks he managed, through a series of heart-poundingly close escapes, to evade the Parliamentarians before seeking refuge in France. For the next nine years, the penniless and defeated Charles wandered around Europe with only a small group of loyal supporters.

Years later, after his restoration as king, the 50-year-old Charles II requested a meeting with the writer and diarist Samuel Pepys. His intention when asking Pepys to commit his story to paper was to ensure that this most extraordinary episode was never forgotten. Over two three-hour sittings, the king related to him in great detail his personal recollections of the six weeks he had spent as a fugitive. As the king and secretary settled down (a scene that is surely a gift for a future scriptwriter), Charles commenced his story: 'After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself.'

One of the joys of Spencer's book, a result not least of its use of Charles II's own narrative as well as those of his supporters, is just how close the reader gets to the action. The day-by-day retelling of the fugitives' doings provides delicious details: the cutting of the king's long hair with agricultural shears, the use of walnut leaves to dye his pale skin, and the day Charles spent lying on a branch of the great oak tree in Boscobel Wood as the Parliamentary soldiers scoured the forest floor below. Spencer draws out both the humour — such as the preposterous refusal of Charles's friend Henry Wilmot to adopt disguise on the grounds that it was beneath his dignity — and the emotional tension when the secret of the king's presence was cautiously revealed to his supporters.

Charles's adventures after losing the Battle of Worcester hide the uncomfortable truth that whilst almost everyone in England had been appalled by the execution of his father, they had not welcomed the arrival of his son with the Scots army, but had instead firmly bolted their doors. This was partly because he rode at the head of what looked like a foreign invasion force and partly because, after almost a decade of civil war, people were desperate to avoid it beginning again. This makes it all the more interesting that Charles II himself loved the story so much ever after. As well as retelling it to anyone who would listen, causing eye-rolling among courtiers, he set in train a series of initiatives to memorialise it. There was to be a new order of chivalry, the Knights of the Royal Oak. A series of enormous oil paintings depicting the episode were produced, including a two-metre-wide canvas of Boscobel Wood and a set of six similarly enormous paintings of the king on the run. In 1660, Charles II commissioned the artist John Michael Wright to paint a flying squadron of cherubs carrying an oak tree to the heavens on the ceiling of his bedchamber. It is hard to imagine many other kings marking the lowest point in their life so enthusiastically, or indeed pulling off such an escape in the first place.

Charles Spencer is the perfect person to pass the story on to a new generation. His pacey, readable prose steers deftly clear of modern idioms and elegantly brings to life the details of the great tale. He has even-handed sympathy for both the fugitive king and the fierce republican regime that hunted him, and he succeeds in his desire to explore far more of the background of the story than previous books on the subject have done. Indeed, the opening third of the book is about how Charles II found himself at Worcester in the first place, which for some will be reason alone to read To Catch a King.

The tantalising question left, in the end, is that of what it all meant. Would Charles II have been a different king had these six weeks never happened? The days and nights spent in hiding must have affected him in some way. Did the need to assume disguises, to survive on wit and charm alone, to use trickery and subterfuge to escape from tight corners help form him? This is the one area where the book doesn't quite hit the mark. Instead its depiction of Charles II in his final years as an ineffective, pleasure-loving monarch doesn't do justice to the man (neither is it accurate), or to the complexity of his character. But this one niggle aside, To Catch a King is an excellent read, and those who come to it knowing little of the famous tale will find they have a treat in store.`,
                        questionGroups: [
                            {
                                groupNumber: 7,
                                questionType: 'summary-completion',
                                instructions: 'Complete the summary using the list of phrases, A-J, below.',
                                startQuestion: 27,
                                endQuestion: 31,
                                passage: `The story behind the hunt for Charles II

Charles II's father was executed by the Parliamentarian forces in 1649. Charles II then formed a 27 __________ with the Scots, and in order to become King of Scots, he abandoned an important 28 __________ that was held by his father and had contributed to his father's death. The opposing sides then met outside Worcester in 1651. The battle led to a 29 __________ for the Parliamentarians and Charles had to flee for his life. A 30 __________ was offered for Charles's capture, but after six weeks spent in hiding, he eventually managed to reach the 31 __________ of continental Europe.

Options:
A. military innovation B. large reward C. widespread conspiracy
D. relative safety E. new government F. decisive victory
G. political debate H. strategic alliance I. popular solution
J. religious conviction`,
                                questions: [
                                    {
                                        questionNumber: 27,
                                        questionType: 'summary-completion',
                                        questionText: 'Charles II then formed a __________ with the Scots',
                                        options: ['A. military innovation', 'B. large reward', 'C. widespread conspiracy', 'D. relative safety', 'E. new government', 'F. decisive victory', 'G. political debate', 'H. strategic alliance', 'I. popular solution', 'J. religious conviction'],
                                        correctAnswer: 'H',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 28,
                                        questionType: 'summary-completion',
                                        questionText: 'He abandoned an important __________ that was held by his father',
                                        options: ['A. military innovation', 'B. large reward', 'C. widespread conspiracy', 'D. relative safety', 'E. new government', 'F. decisive victory', 'G. political debate', 'H. strategic alliance', 'I. popular solution', 'J. religious conviction'],
                                        correctAnswer: 'J',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 29,
                                        questionType: 'summary-completion',
                                        questionText: 'The battle led to a __________ for the Parliamentarians',
                                        options: ['A. military innovation', 'B. large reward', 'C. widespread conspiracy', 'D. relative safety', 'E. new government', 'F. decisive victory', 'G. political debate', 'H. strategic alliance', 'I. popular solution', 'J. religious conviction'],
                                        correctAnswer: 'F',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 30,
                                        questionType: 'summary-completion',
                                        questionText: 'A __________ was offered for Charles\'s capture',
                                        options: ['A. military innovation', 'B. large reward', 'C. widespread conspiracy', 'D. relative safety', 'E. new government', 'F. decisive victory', 'G. political debate', 'H. strategic alliance', 'I. popular solution', 'J. religious conviction'],
                                        correctAnswer: 'B',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 31,
                                        questionType: 'summary-completion',
                                        questionText: 'He eventually managed to reach the __________ of continental Europe',
                                        options: ['A. military innovation', 'B. large reward', 'C. widespread conspiracy', 'D. relative safety', 'E. new government', 'F. decisive victory', 'G. political debate', 'H. strategic alliance', 'I. popular solution', 'J. religious conviction'],
                                        correctAnswer: 'D',
                                        marks: 1
                                    }
                                ]
                            },
                            {
                                groupNumber: 8,
                                questionType: 'yes-no-ng',
                                instructions: 'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
                                startQuestion: 32,
                                endQuestion: 35,
                                questions: [
                                    {
                                        questionNumber: 32,
                                        questionType: 'yes-no-ng',
                                        questionText: 'Charles chose Pepys for the task because he considered him to be trustworthy.',
                                        correctAnswer: 'NOT GIVEN',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 33,
                                        questionType: 'yes-no-ng',
                                        questionText: 'Charles\'s personal recollection of the escape lacked sufficient detail.',
                                        correctAnswer: 'NO',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 34,
                                        questionType: 'yes-no-ng',
                                        questionText: 'Charles indicated to Pepys that he had planned his escape before the battle.',
                                        correctAnswer: 'NO',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 35,
                                        questionType: 'yes-no-ng',
                                        questionText: 'The inclusion of Charles\'s account is a positive aspect of the book.',
                                        correctAnswer: 'YES',
                                        marks: 1
                                    }
                                ]
                            },
                            {
                                groupNumber: 9,
                                questionType: 'multiple-choice',
                                instructions: 'Choose the correct letter, A, B, C or D.',
                                startQuestion: 36,
                                endQuestion: 40,
                                questions: [
                                    {
                                        questionNumber: 36,
                                        questionType: 'multiple-choice',
                                        questionText: 'What is the reviewer\'s main purpose in the first paragraph?',
                                        options: ['A. to describe what happened during the Battle of Worcester', 'B. to give an account of the circumstances leading to Charles II\'s escape', 'C. to provide details of the Parliamentarians\' political views', 'D. to compare Charles II\'s beliefs with those of his father'],
                                        correctAnswer: 'B',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 37,
                                        questionType: 'multiple-choice',
                                        questionText: 'Why does the reviewer include examples of the fugitives\' behaviour in the third paragraph?',
                                        options: ['A. to explain how close Charles II came to losing his life', 'B. to suggest that Charles II\'s supporters were badly prepared', 'C. to illustrate how the events of the six weeks are brought to life', 'D. to argue that certain aspects are not as well known as they should be'],
                                        correctAnswer: 'C',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 38,
                                        questionType: 'multiple-choice',
                                        questionText: 'What point does the reviewer make about Charles II in the fourth paragraph?',
                                        options: ['A. He chose to celebrate what was essentially a defeat.', 'B. He misunderstood the motives of his opponents.', 'C. He aimed to restore people\'s faith in the monarchy.', 'D. He was driven by a desire to be popular.'],
                                        correctAnswer: 'A',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 39,
                                        questionType: 'multiple-choice',
                                        questionText: 'What does the reviewer say about Charles Spencer in the fifth paragraph?',
                                        options: ['A. His decision to write the book comes as a surprise.', 'B. He takes an unbiased approach to the subject matter.', 'C. His descriptions of events would be better if they included more detail.', 'D. He chooses language that is suitable for a twenty-first-century audience.'],
                                        correctAnswer: 'B',
                                        marks: 1
                                    },
                                    {
                                        questionNumber: 40,
                                        questionType: 'multiple-choice',
                                        questionText: 'When the reviewer says the book \'doesn\'t quite hit the mark\', she is making the point that',
                                        options: ['A. it overlooks the impact of events on ordinary people.', 'B. it lacks an analysis of prevalent views on monarchy.', 'C. it omits any references to the deceit practised by Charles II during his time in hiding.', 'D. it fails to address whether Charles II\'s experiences had a lasting influence on him.'],
                                        correctAnswer: 'D',
                                        marks: 1
                                    }
                                ]
                            }
                        ]
                    }
                ],
                // Metadata
                totalQuestions: 40,
                totalMarks: 40,
                duration: 60,
                difficulty: 'medium',
                // Status
                isActive: true,
                usageCount: 0,
                // Admin reference
                createdBy: adminId
            });
            // Save to database
            yield readingTest.save();
            console.log(`✅ Reading Test created successfully: ${testId}`);
            return {
                success: true,
                testId,
                message: 'Reading test seeded successfully'
            };
        }
        catch (error) {
            console.error('❌ Error seeding reading test:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
        finally {
            // Disconnect from MongoDB
            yield mongoose_1.default.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
    });
}
// Run the seed function
seedReadingTest1()
    .then((result) => {
    console.log('\n📊 Seed Result:', result);
    process.exit(result.success ? 0 : 1);
})
    .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
