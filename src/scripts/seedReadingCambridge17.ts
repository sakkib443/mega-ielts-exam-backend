import mongoose from "mongoose";
import { ReadingTest } from "../app/modules/reading/reading.model";
import { User } from "../app/modules/user/user.model";
import config from "../app/config";

const readingCambridge17Test1 = {
    testId: "READING_CAMBRIDGE_17_1_NEW",
    testNumber: 1701,
    title: "Cambridge IELTS 17 Academic Reading Test 1",
    description: "Official Cambridge IELTS 17 Academic Reading Test 1",
    source: "Cambridge IELTS Book 17 Test 1",
    difficulty: "medium",
    isActive: true,
    duration: 60,
    totalQuestions: 40,
    totalMarks: 40,
    sections: [
        {
            sectionNumber: 1,
            title: "The development of the London Underground railway",
            passage: `In the first half of the 19th century, London's population grew at an astonishing rate, and the central area became increasingly congested. In addition, the expansion of the overground railway network resulted in many thousands of commuters arriving at regional stations on the edges of the city, and it was becoming increasingly difficult to move people and goods across the city.
            
In 1830, a city solicitor named Charles Pearson submitted a proposal for a subterranean railway that would connect the overground railway stations. He argued that this would not only solve the traffic problem but would also allow many of the city's poor people to move to new, healthier housing being built in the suburbs since they could now commute to work by rail. 

Pearson's idea was eventually adopted by a group of businessmen, and the Metropolitan Railway Company was formed in 1854. However, the company had difficulty in raising the funding needed for such a radical project, not least because of the critical articles published by the press. Eventually, construction work on the first 6km of the Metropolitan line began in 1860.

The method used to create the tunnels was known as 'cut and cover'. This involved digging a deep trench, building a brick arch inside it, and then covering it with earth. This technique meant that the route followed existing roads and was therefore relatively shallow.

The Metropolitan line opened on 10 January 1863, and was an immediate hit. However, as the tunnels were filled with smoke and steam from the coal-fired engines, pollution was a major problem. Despite the use of ventilation shafts, many passengers complained of the conditions.

In 1890, the first deep-level electric railway, the City and South London Railway, was opened. This used smaller tunnels and therefore did not require the demolition of buildings above ground. Although the original trains were small and cramped, the venture proved that electric power was the future of underground travel.`,
            instructions: "Complete the notes below.",
            questionGroups: [
                {
                    groupType: "note-completion",
                    startQuestion: 1,
                    endQuestion: 6,
                    mainInstruction: "Complete the notes below.",
                    subInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                    mainHeading: "The London underground railway",
                    notesSections: [
                        {
                            subHeading: "The problem",
                            bullets: [
                                { type: "question", questionNumber: 1, textBefore: "The ", textAfter: " of London increased rapidly between 1800 and 1850", correctAnswer: "population" },
                                { type: "context", text: "The streets were full of horse-drawn vehicles" }
                            ]
                        },
                        {
                            subHeading: "The proposed solution",
                            bullets: [
                                { type: "context", text: "Charles Pearson, a solicitor, suggested building an underground railway" },
                                { type: "question", questionNumber: 2, textBefore: "Building the railway would make it possible to move people to better housing in the ", textAfter: "", correctAnswer: "suburbs" },
                                { type: "question", questionNumber: 3, textBefore: "A number of ", textAfter: " agreed with Pearson's idea", correctAnswer: "businessmen" },
                                { type: "question", questionNumber: 4, textBefore: "The company initially had problems getting the ", textAfter: " needed for the project", correctAnswer: "funding" },
                                { type: "question", questionNumber: 5, textBefore: "Negative articles about the project appeared in the ", textAfter: "", correctAnswer: "press" }
                            ]
                        },
                        {
                            subHeading: "The construction",
                            bullets: [
                                { type: "context", text: "The chosen route did not require many buildings to be pulled down" },
                                { type: "context", text: "The 'cut and cover' method was used to construct the tunnels" },
                                { type: "question", questionNumber: 6, textBefore: "With the completion of the brick arch, the tunnel was covered with ", textAfter: "", correctAnswer: "earth" }
                            ]
                        }
                    ]
                },
                {
                    groupType: "true-false-not-given",
                    startQuestion: 7,
                    endQuestion: 13,
                    mainInstruction: "Do the following statements agree with the information given in the passage?",
                    optionsExplanation: [
                        { label: "TRUE", description: "if the statement agrees with the information" },
                        { label: "FALSE", description: "if the statement contradicts the information" },
                        { label: "NOT GIVEN", description: "if there is no information on this" }
                    ],
                    statements: [
                        { questionNumber: 7, text: "Other countries had built underground railways before the Metropolitan line opened.", correctAnswer: "FALSE" },
                        { questionNumber: 8, text: "More people than predicted travelled on the Metropolitan line on the first day.", correctAnswer: "NOT GIVEN" },
                        { questionNumber: 9, text: "The use of ventilation shafts failed to prevent pollution in the tunnels.", correctAnswer: "TRUE" },
                        { questionNumber: 10, text: "A different approach from the 'cut and cover' technique was required in London's central area.", correctAnswer: "TRUE" },
                        { questionNumber: 11, text: "The windows on City & South London trains were at eye level.", correctAnswer: "FALSE" },
                        { questionNumber: 12, text: "The City & South London Railway was a financial success.", correctAnswer: "FALSE" },
                        { questionNumber: 13, text: "Trains on the 'Tuppenny Tube' nearly always ran on time.", correctAnswer: "NOT GIVEN" }
                    ]
                }
            ],
            questions: [
                { questionNumber: 1, questionType: "note-completion", questionText: "The ......... of London increased rapidly between 1800 and 1850", correctAnswer: "population", marks: 1 },
                { questionNumber: 2, questionType: "note-completion", questionText: "Building the railway would make it possible to move people to better housing in the .........", correctAnswer: "suburbs", marks: 1 },
                { questionNumber: 3, questionType: "note-completion", questionText: "A number of ......... agreed with Pearson's idea", correctAnswer: "businessmen", marks: 1 },
                { questionNumber: 4, questionType: "note-completion", questionText: "The company initially had problems getting the ......... needed for the project", correctAnswer: "funding", marks: 1 },
                { questionNumber: 5, questionType: "note-completion", questionText: "Negative articles about the project appeared in the .........", correctAnswer: "press", marks: 1 },
                { questionNumber: 6, questionType: "note-completion", questionText: "With the completion of the brick arch, the tunnel was covered with .........", correctAnswer: "earth", marks: 1 },
                { questionNumber: 7, questionType: "true-false-not-given", questionText: "Other countries had built underground railways before the Metropolitan line opened.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE", marks: 1 },
                { questionNumber: 8, questionType: "true-false-not-given", questionText: "More people than predicted travelled on the Metropolitan line on the first day.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "NOT GIVEN", marks: 1 },
                { questionNumber: 9, questionType: "true-false-not-given", questionText: "The use of ventilation shafts failed to prevent pollution in the tunnels.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "TRUE", marks: 1 },
                { questionNumber: 10, questionType: "true-false-not-given", questionText: "A different approach from the 'cut and cover' technique was required in London's central area.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "TRUE", marks: 1 },
                { questionNumber: 11, questionType: "true-false-not-given", questionText: "The windows on City & South London trains were at eye level.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE", marks: 1 },
                { questionNumber: 12, questionType: "true-false-not-given", questionText: "The City & South London Railway was a financial success.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE", marks: 1 },
                { questionNumber: 13, questionType: "true-false-not-given", questionText: "Trains on the 'Tuppenny Tube' nearly always ran on time.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "NOT GIVEN", marks: 1 }
            ]
        },
        {
            sectionNumber: 2,
            title: "Stadiums: past, present and future",
            passage: `A Stadiums are among the oldest forms of urban architecture: vast stadiums where the public could watch sporting events were at the centre of western city life as far back as the ancient Greek and Roman Empires, well before the construction of the great medieval cathedrals and the grand 19th- and 20th-century railway stations which dominated urban skylines in later eras. Today, however, stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events such as the Olympic Games or the FIFA World Cup have notably fallen into disuse and disrepair.

B The amphitheatre of Arles in southwest France, with a capacity of 25,000 spectators, is perhaps the best example of just how versatile stadiums can be. Built by the Romans in 90 AD, it became a fortress with four towers after the fifth century, and was then transformed into a village containing more than 200 houses. With the growing interest in conservation during the 19th century, it was converted back into an arena for the staging of bullfights.

C The area in the centre of the Italian town of Lucca, known as the Piazza dell'Anfiteatro, is yet another impressive example of an amphitheatre becoming absorbed into the fabric of the city. The site evolved in a similar way to Arles and was progressively filled with buildings from the Middle Ages until the 19th century, variously used as houses, a salt depot and a prison. But rather than reverting to an arena, it became a market square, designed by Romanticist architect Lorenzo Nottolini. Today, the ruins of the amphitheatre remain embedded in the various shops and residences surrounding the public square.

D There are many similarities between modern stadiums and the ancient amphitheatres intended for games. But some of the flexibility was lost at the beginning of the 20th century, as stadiums were developed using new products such as steel and reinforced concrete, and made use of bright lights for night-time matches.

E But many of today's most innovative architects see scope for the stadium to help improve the city. Among the current strategies, two seem to be having particular success: the stadium as a gateway, and the stadium as urban hub.

F The게이트way strategy was used for the Amsterdam Arena, home of the Ajax football club. The stadium is designed to be part of a larger urban development, with a surrounding area including shops, restaurants, cinemas, and offices. This creates an area which is busy at other times than major sporting events.

G A second approach is to make the stadium itself so useful for non-sporting activities that it acts as a hub for the local community.`,
            instructions: "Questions 14-26",
            questionGroups: [
                {
                    groupType: "matching-information",
                    startQuestion: 14,
                    endQuestion: 17,
                    mainInstruction: "The passage has seven paragraphs, A-G.",
                    subInstruction: "Which section contains the following information?",
                    note: "NB You may use any letter more than once.",
                    paragraphOptions: ["A", "B", "C", "D", "E", "F", "G"],
                    matchingItems: [
                        { questionNumber: 14, text: "a mention of negative attitudes towards stadium building projects", correctAnswer: "A" },
                        { questionNumber: 15, text: "figures demonstrating the environmental benefits of a certain stadium", correctAnswer: "F" },
                        { questionNumber: 16, text: "examples of the wide range of facilities available at some new stadiums", correctAnswer: "E" },
                        { questionNumber: 17, text: "reference to the disadvantages of the stadiums built during a certain era", correctAnswer: "D" }
                    ]
                },
                {
                    groupType: "summary-completion",
                    startQuestion: 18,
                    endQuestion: 22,
                    mainInstruction: "Complete the summary below.",
                    subInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                    mainHeading: "Roman amphitheatres",
                    summarySegments: [
                        { type: "text", content: "The Roman stadium of Europe have proved very versatile. The amphitheatre of Arles, for example, was converted first into a" },
                        { type: "blank", questionNumber: 18, correctAnswer: "fortress" },
                        { type: "text", content: ", then into a residential area and finally into an arena where spectators could watch" },
                        { type: "blank", questionNumber: 19, correctAnswer: "bullfights" },
                        { type: "text", content: ". Meanwhile, the arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where" },
                        { type: "blank", questionNumber: 20, correctAnswer: "opera" },
                        { type: "text", content: "is performed. The site of Lucca's amphitheatre has also been used for many purposes over the centuries, including the storage of" },
                        { type: "blank", questionNumber: 21, correctAnswer: "salt" },
                        { type: "text", content: ". It is now a market square with" },
                        { type: "blank", questionNumber: 22, correctAnswer: "shops" },
                        { type: "text", content: "and homes incorporated into the remains of the Roman amphitheatre." }
                    ]
                },
                {
                    groupType: "choose-two-letters",
                    startQuestion: 23,
                    endQuestion: 26,
                    mainInstruction: "Choose TWO letters, A-E.",
                    questionSets: [
                        {
                            questionNumbers: [23, 24],
                            questionText: "When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention?",
                            options: [
                                { letter: "A", text: "They are less imaginatively designed." },
                                { letter: "B", text: "They are less spacious." },
                                { letter: "C", text: "They are in less convenient locations." },
                                { letter: "D", text: "They are less versatile." },
                                { letter: "E", text: "They are made of less durable materials." }
                            ],
                            correctAnswers: ["C", "D"]
                        },
                        {
                            questionNumbers: [25, 26],
                            questionText: "Which TWO advantages of modern stadium design does the writer mention?",
                            options: [
                                { letter: "A", text: "offering improved amenities for the enjoyment of sports events" },
                                { letter: "B", text: "bringing community life back into the city environment" },
                                { letter: "C", text: "facilitating research into solar and wind energy solutions" },
                                { letter: "D", text: "enabling local residents to reduce their consumption of electricity" },
                                { letter: "E", text: "providing a suitable site for the installation of renewable power generators" }
                            ],
                            correctAnswers: ["B", "E"]
                        }
                    ]
                }
            ],
            questions: [
                { questionNumber: 14, questionType: "matching-information", questionText: "a mention of negative attitudes towards stadium building projects", correctAnswer: "A", marks: 1 },
                { questionNumber: 15, questionType: "matching-information", questionText: "figures demonstrating the environmental benefits of a certain stadium", correctAnswer: "F", marks: 1 },
                { questionNumber: 16, questionType: "matching-information", questionText: "examples of the wide range of facilities available at some new stadiums", correctAnswer: "E", marks: 1 },
                { questionNumber: 17, questionType: "matching-information", questionText: "reference to the disadvantages of the stadiums built during a certain era", correctAnswer: "D", marks: 1 },
                { questionNumber: 18, questionType: "summary-completion", questionText: "The amphitheatre of Arles was converted first into a .........", correctAnswer: "fortress", marks: 1 },
                { questionNumber: 19, questionType: "summary-completion", questionText: "finally into an arena where spectators could watch .........", correctAnswer: "bullfights", marks: 1 },
                { questionNumber: 20, questionType: "summary-completion", questionText: "the arena in Verona is famous today as a venue where ......... is performed.", correctAnswer: "opera", marks: 1 },
                { questionNumber: 21, questionType: "summary-completion", questionText: "including the storage of .........", correctAnswer: "salt", marks: 1 },
                { questionNumber: 22, questionType: "summary-completion", questionText: "It is now a market square with ......... and homes", correctAnswer: "shops", marks: 1 },
                { questionNumber: 23, questionType: "multiple-choice", questionText: "Which TWO negative features does the writer mention?", options: ["A", "B", "C", "D", "E"], correctAnswer: "C", marks: 1 },
                { questionNumber: 24, questionType: "multiple-choice", questionText: "Which TWO negative features does the writer mention?", options: ["A", "B", "C", "D", "E"], correctAnswer: "D", marks: 1 },
                { questionNumber: 25, questionType: "multiple-choice", questionText: "Which TWO advantages of modern stadium design does the writer mention?", options: ["A", "B", "C", "D", "E"], correctAnswer: "B", marks: 1 },
                { questionNumber: 26, questionType: "multiple-choice", questionText: "Which TWO advantages of modern stadium design does the writer mention?", options: ["A", "B", "C", "D", "E"], correctAnswer: "E", marks: 1 }
            ]
        },
        {
            sectionNumber: 3,
            title: "To catch a king",
            passage: `To catch a king
Anna Keay reviews Charles Spencer's book about the hunt for King Charles II during the English Civil War of the seventeenth century

Charles Spencer's latest book, To Catch a King, tells us the story of the hunt for King Charles II in the six weeks after his resounding defeat at the Battle of Worcester in September 1651. And what a story it is. After his father was executed by the Parliamentarians in 1649, the young Charles II sacrificed one of the very principles his father had died for and did a deal with the Scots, thereby accepting Presbyterianism as the national religion in return for being crowned King of Scots. His arrival in Edinburgh prompted the English Parliamentary army to invade Scotland in a pre-emptive strike. This was followed by a Scottish invasion of England. The two sides finally faced one another at Worcester in the west of England in 1651. After being comprehensively defeated on the meadows outside the city by the Parliamentarian army, the 21-year-old king found himself the subject of a national manhunt, with a huge sum offered for his capture. Over the following six weeks he managed, through a series of heart-poundingly close escapes, to evade the Parliamentarians before seeking refuge in France. For the next nine years, the penniless and defeated Charles wandered around Europe with only a small group of loyal supporters.

Years later, after his restoration as king, the 50-year-old Charles II requested a meeting with the writer and diarist Samuel Pepys. His intention when asking Pepys to commit his story to paper was to ensure that this most extraordinary episode was never forgotten. Over two three-hour sittings, the king related to him in great detail his personal recollections of the six weeks he had spent as a fugitive. As the king and secretary settled down (a scene that is surely a gift for a future scriptwriter), Charles commenced his story: 'After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself.'

One of the joys of Spencer's book, a result not least of its use of Charles II's own narrative as well as those of his supporters, is just how close the reader gets to the action. The day-by-day retelling of the fugitives' doings provides delicious details: the cutting of the king's long hair with agricultural shears, the use of walnut leaves to dye his pale skin, and the day Charles spent lying on a branch of the great oak tree in Boscobel Wood as the Parliamentary soldiers scoured the forest floor below. Spencer draws out both the humour – such as the preposterous refusal of Charles's friend Henry Wilmot to adopt disguise on the grounds that it was beneath his dignity – and the emotional tension when the secret of the king's presence was cautiously revealed to his supporters.

Charles's adventures after losing the Battle of Worcester hide the uncomfortable truth that whilst almost everyone in England had been appalled by the execution of his father, they had not welcomed the arrival of his son with the Scots army, but had instead firmly bolted their doors. This was partly because he rode at the head of what looked like a foreign invasion force and partly because, after almost a decade of civil war, people were desperate to avoid it beginning again. This makes it all the more interesting that Charles II himself loved the story so much ever after. As well as retelling it to anyone who would listen, causing eye-rolling among courtiers, he set in train a series of initiatives to memorialise it. There was to be a new order of chivalry, the Knights of the Royal Oak. A series of enormous oil paintings depicting the episode were produced, including a two-metre-wide canvas of Boscobel Wood and a set of six similarly enormous paintings of the king on the run. In 1660, Charles II commissioned the artist John Michael Wright to paint a flying squadron of cherubs carrying an oak tree to the heavens on the ceiling of his bedchamber. It is hard to imagine many other kings marking the lowest point in their life so enthusiastically, or indeed pulling off such an escape in the first place.

Charles Spencer is the perfect person to pass the story on to a new generation. His pacey, readable prose steers deftly clear of modern idioms and elegantly brings to life the details of the great tale. He has even-handed sympathy for both the fugitive king and the fierce republican regime that hunted him, and he succeeds in his desire to explore far more of the background of the story than previous books on the subject have done. Indeed, the opening third of the book is about how Charles II found himself at Worcester in the first place, which for some will be reason alone to read To Catch a King.

The tantalising question left, in the end, is that of what it all meant. Would Charles II have been a different king had these six weeks never happened? The days and nights spent in hiding must have affected him in some way. Did the need to assume disguises, to survive on wit and charm alone, to use trickery and subterfuge to escape from tight corners help form him? This is the one area where the book doesn't quite hit the mark. Instead its depiction of Charles II in his final years as an ineffective, pleasure-loving monarch doesn't do justice to the man (neither is it accurate), or to the complexity of his character. But this one niggle aside, To Catch a King is an excellent read, and those who come to it knowing little of the famous tale will find they have a treat in store.`,
            instructions: "Questions 27-40",
            questionGroups: [
                {
                    groupType: "summary-with-options",
                    startQuestion: 27,
                    endQuestion: 31,
                    mainInstruction: "Complete the summary using the list of phrases, A-J, below.",
                    subInstruction: "Write the correct letter, A-J, in boxes 27-31 on your answer sheet.",
                    mainHeading: "The story behind the hunt for Charles II",
                    phraseList: [
                        { letter: "A", text: "military innovation" },
                        { letter: "B", text: "large reward" },
                        { letter: "C", text: "widespread conspiracy" },
                        { letter: "D", text: "relative safety" },
                        { letter: "E", text: "new government" },
                        { letter: "F", text: "decisive victory" },
                        { letter: "G", text: "political debate" },
                        { letter: "H", text: "strategic alliance" },
                        { letter: "I", text: "popular solution" },
                        { letter: "J", text: "religious conviction" }
                    ],
                    summarySegments: [
                        { type: "text", content: "Charles II's father was executed by the Parliamentarian forces in 1649. Charles II then formed a" },
                        { type: "blank", questionNumber: 27, correctAnswer: "H" },
                        { type: "text", content: "with the Scots, and in order to become King of Scots, he abandoned an important" },
                        { type: "blank", questionNumber: 28, correctAnswer: "J" },
                        { type: "text", content: "that was held by his father and had contributed to his father's death. The opposing sides then met outside Worcester in 1651. The battle led to a" },
                        { type: "blank", questionNumber: 29, correctAnswer: "F" },
                        { type: "text", content: "for the Parliamentarians and Charles had to flee for his life. A" },
                        { type: "blank", questionNumber: 30, correctAnswer: "B" },
                        { type: "text", content: "was offered for Charles's capture, but after six weeks spent in hiding, he eventually managed to reach the" },
                        { type: "blank", questionNumber: 31, correctAnswer: "D" },
                        { type: "text", content: "of continental Europe." }
                    ]
                },
                {
                    groupType: "yes-no-not-given",
                    startQuestion: 32,
                    endQuestion: 35,
                    mainInstruction: "Do the following statements agree with the claims of the writer in the passage?",
                    subInstruction: "In boxes 32-35 on your answer sheet, write",
                    optionsExplanation: [
                        { label: "YES", description: "if the statement agrees with the claims of the writer" },
                        { label: "NO", description: "if the statement contradicts the claims of the writer" },
                        { label: "NOT GIVEN", description: "if it is impossible to say what the writer thinks about this" }
                    ],
                    statements: [
                        { questionNumber: 32, text: "Charles chose Pepys for the task because he considered him to be trustworthy.", correctAnswer: "NOT GIVEN" },
                        { questionNumber: 33, text: "Charles's personal recollection of the escape lacked sufficient detail.", correctAnswer: "NO" },
                        { questionNumber: 34, text: "Charles II was able to identify which of his supporters had helped him escape.", correctAnswer: "NO" },
                        { questionNumber: 35, text: "The speaker's description of the events during the escape is exaggerated.", correctAnswer: "YES" }
                    ]
                },
                {
                    groupType: "multiple-choice-full",
                    startQuestion: 36,
                    endQuestion: 40,
                    mainInstruction: "Choose the correct letter, A, B, C or D.",
                    subInstruction: "Write the correct letter in boxes 36-40 on your answer sheet.",
                    mcQuestions: [
                        {
                            questionNumber: 36,
                            questionText: "What is the reviewer's main purpose in the first paragraph?",
                            options: [
                                { letter: "A", text: "to describe what happened during the Battle of Worcester" },
                                { letter: "B", text: "to give an account of the circumstances leading to Charles II's escape" },
                                { letter: "C", text: "to provide details of the Parliamentarians' political views" },
                                { letter: "D", text: "to compare Charles II's beliefs with those of his father" }
                            ],
                            correctAnswer: "B"
                        },
                        {
                            questionNumber: 37,
                            questionText: "Why does the reviewer include examples of the fugitives' behaviour in the third paragraph?",
                            options: [
                                { letter: "A", text: "to justify the book's expensive price" },
                                { letter: "B", text: "to indicate the author's attention to detail" },
                                { letter: "C", text: "to show how well researched the descriptions are" },
                                { letter: "D", text: "to explain why Charles was eventually caught" }
                            ],
                            correctAnswer: "C"
                        },
                        {
                            questionNumber: 38,
                            questionText: "What point does the reviewer make about Charles II in the fourth paragraph?",
                            options: [
                                { letter: "A", text: "He showed unexpected personal qualities during his escape." },
                                { letter: "B", text: "He had over-valued the importance of his position as king." },
                                { letter: "C", text: "He could admit that he had made mistakes in life." },
                                { letter: "D", text: "He understood the limitations of his father's approach to governing." }
                            ],
                            correctAnswer: "A"
                        },
                        {
                            questionNumber: 39,
                            questionText: "What does the reviewer say about Charles Spencer in the fifth paragraph?",
                            options: [
                                { letter: "A", text: "He was too reliant on existing accounts of the story." },
                                { letter: "B", text: "He made an unwise choice in writing about such a well-known event." },
                                { letter: "C", text: "He thought only about commercial success when he was writing the book." },
                                { letter: "D", text: "He concentrated too much on the least important details of the escape." }
                            ],
                            correctAnswer: "D"
                        },
                        {
                            questionNumber: 40,
                            questionText: "When the reviewer says the book 'doesn't quite hit the mark', she is making the point that",
                            options: [
                                { letter: "A", text: "it overlooks the impact of events on ordinary people." },
                                { letter: "B", text: "it lacks an analysis of prevalent views on monarchy." },
                                { letter: "C", text: "it omits any references to the deceit practised by Charles II during his time in hiding." },
                                { letter: "D", text: "it fails to address whether Charles II's experiences had a lasting influence on him." }
                            ],
                            correctAnswer: "B"
                        }
                    ]
                }
            ],
            questions: [
                { questionNumber: 27, questionType: "summary-completion", questionText: "Charles II then formed a ......... with the Scots", options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], correctAnswer: "H", marks: 1 },
                { questionNumber: 28, questionType: "summary-completion", questionText: "he abandoned an important ......... that was held by his father", options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], correctAnswer: "J", marks: 1 },
                { questionNumber: 29, questionType: "summary-completion", questionText: "The battle led to a ......... for the Parliamentarians", options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], correctAnswer: "F", marks: 1 },
                { questionNumber: 30, questionType: "summary-completion", questionText: "A ......... was offered for Charles's capture", options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], correctAnswer: "B", marks: 1 },
                { questionNumber: 31, questionType: "summary-completion", questionText: "he eventually managed to reach the ......... of continental Europe.", options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], correctAnswer: "D", marks: 1 },
                { questionNumber: 32, questionType: "yes-no-not-given", questionText: "Charles chose Pepys for the task because he considered him to be trustworthy.", options: ["YES", "NO", "NOT GIVEN"], correctAnswer: "NOT GIVEN", marks: 1 },
                { questionNumber: 33, questionType: "yes-no-not-given", questionText: "Charles's personal recollection of the escape lacked sufficient detail.", options: ["YES", "NO", "NOT GIVEN"], correctAnswer: "NO", marks: 1 },
                { questionNumber: 34, questionType: "yes-no-not-given", questionText: "Charles indicated to Pepys that he had planned his escape before the battle.", options: ["YES", "NO", "NOT GIVEN"], correctAnswer: "NO", marks: 1 },
                { questionNumber: 35, questionType: "yes-no-not-given", questionText: "The inclusion of Charles's account is a positive aspect of the book.", options: ["YES", "NO", "NOT GIVEN"], correctAnswer: "YES", marks: 1 },
                { questionNumber: 36, questionType: "multiple-choice", questionText: "What is the reviewer's main purpose in the first paragraph?", options: ["A", "B", "C", "D"], correctAnswer: "B", marks: 1 },
                { questionNumber: 37, questionType: "multiple-choice", questionText: "Why does the reviewer include examples of the fugitives' behaviour in the third paragraph?", options: ["A", "B", "C", "D"], correctAnswer: "C", marks: 1 },
                { questionNumber: 38, questionType: "multiple-choice", questionText: "What point does the reviewer make about Charles II in the fourth paragraph?", options: ["A", "B", "C", "D"], correctAnswer: "A", marks: 1 },
                { questionNumber: 39, questionType: "multiple-choice", questionText: "What does the reviewer say about Charles Spencer in the fifth paragraph?", options: ["A", "B", "C", "D"], correctAnswer: "D", marks: 1 },
                { questionNumber: 40, questionType: "multiple-choice", questionText: "When the reviewer says the book 'doesn't quite hit the mark', she is making the point that", options: ["A", "B", "C", "D"], correctAnswer: "B", marks: 1 }
            ]
        }
    ]
};

async function seedReadingCambridge17() {
    try {
        await mongoose.connect(config.database_url as string);
        const existing = await ReadingTest.findOne({ testId: readingCambridge17Test1.testId });
        if (existing) {
            await ReadingTest.findByIdAndUpdate(existing._id, readingCambridge17Test1);
            console.log("Reading Cambridge 17 Test 1 updated successfully!");
        } else {
            const admin = await User.findOne({ role: "admin" });
            if (!admin) { console.log("Admin not found"); process.exit(1); }
            await ReadingTest.create({ ...readingCambridge17Test1, createdBy: admin._id });
            console.log("Reading Cambridge IELTS 17 Test 1 created successfully!");
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
seedReadingCambridge17();
