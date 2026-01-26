const mongoose = require("mongoose");
require("dotenv").config();

async function updateReadingTestFinal() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        const filter = { title: "Cambridge IELTS 16 Academic Reading Test 1", setType: "READING" };

        const fullTest = {
            title: "Cambridge IELTS 16 Academic Reading Test 1",
            description: "Full Academic Reading Test from Cambridge 16",
            source: "Cambridge IELTS 16",
            duration: 60,
            sections: [
                {
                    sectionNumber: 1,
                    title: "Why we need to protect polar bears",
                    passage: `Polar bears are being increasingly threatened by the effects of climate change, but their disappearance could have far-reaching consequences. They are uniquely adapted to the extreme conditions of the Arctic Circle, where temperatures can reach —40°C. One reason for this is that they have up to 11 centimetres of fat underneath their skin. Humans with comparative levels of adipose tissue would be considered obese and would be likely to suffer from diabetes and heart disease. Yet the polar bear experiences no such consequences.

A 2014 study by Shi Ping Liu and colleagues sheds light on this mystery. They compared the genetic structure of polar bears with that of their closest relatives from a warmer climate, the brown bears. This allowed them to determine the genes that have allowed polar bears to survive in one of the toughest environments on Earth. Liu and his colleagues found the polar bears had a gene known as APoB, which reduces levels of low-density lipoproteins (LDLs) – a form of ‘bad’ cholesterol. In humans, mutations of this gene are associated with increased risk of heart disease. Polar bears may therefore be an important study model to understand heart disease in humans.

The genome of the polar bear may also provide the solution for another condition, one that particularly affects our older generation: osteoporosis. This is a disease where bones show reduced density, usually caused by insufficient exercise, reduced calcium intake or food starvation. Bone tissue is constantly being remodelled, meaning that bone is added or removed, depending on nutrient availability and the stress that the bone is under. Female polar bears, however, undergo extreme conditions during every pregnancy. Once autumn comes around, these females will dig maternity dens in the snow and will remain there throughout the winter, both before and after the birth of their cubs. This process results in about six months of fasting, where the female bears have to keep themselves and their cubs alive, depleting their own calcium and calorie reserves. Despite this, their bones remain strong and dense.

Physiologists Alanda Lennox and Allen Goodship found an explanation for this paradox in 2008. They discovered that pregnant bears were able to increase the density of their bones before they started to build their dens. In addition, six months later, when they finally emerged from the den with their cubs, there was no evidence of significant loss of bone density. Hibernating brown bears do not have this capacity and must therefore resort to major bone reformation in the following spring. If the mechanism of bone remodelling in polar bears can be understood, many bedridden humans, and even astronauts, could potentially benefit.

The medical benefits of the polar bear for humanity certainly have their importance in our conservation efforts, but these should not be the only factors taken into consideration. We tend to want to protect animals we think are intelligent and possess emotions, such as elephants and primates. Bears, on the other hand, seem to be perceived as stupid and in many cases violent. And yet anecdotal evidence from the field challenges those assumptions, suggesting for example that polar bears have good problem-solving abilities. A male bear called GoGo in Tennoji Zoo, Osaka, has even been observed making use of a tool to manipulate his environment. The bear used a tree branch on multiple occasions to dislodge a piece of meat hung out of his reach. Problem-solving ability has also been witnessed in wild polar bears, although not as obviously as with GoGo. A calculated move by a male bear involved running and jumping onto barrels in an attempt to get to a photographer standing on a platform four metres high.

In other studies, such as one by Alison Annes in 2008, polar bears showed deliberate and focussed manipulation. For example, Annes observed bears putting objects in piles and then knocking them over in what appeared to be a game. The study demonstrates that bears are capable of agile and thought-out behaviours. These examples suggest bears have greater creativity and problem-solving abilities than previously thought.

As for emotions while the evidence is once again anecdotal, many bears have been seen to hit out at ice and snow — seemingly out of frustration — when they have just missed out on a kill. Moreover, polar bears can form unusual relationships with other species, including playing with the dogs used to pull sleds in the Arctic. Remarkably, one hand-raised polar bear called Agee has formed a close relationship with her owner Mark Dumas to the point where they even swim together. This is even more astonishing since polar bears are known to actively hunt humans in the wild.

If climate change were to lead to their extinction, this would mean not only the loss of potential breakthroughs in human medicine, but more importantly, the disappearance of an intelligent, majestic animal.`,
                    questionGroups: [
                        {
                            groupType: "true-false-not-given",
                            startQuestion: 1,
                            endQuestion: 7,
                            mainInstruction: "Do the following statements agree with the information given in the Reading Passage?",
                            subInstruction: "In boxes 1-7 on your answer sheet, write TRUE/FALSE/NOT GIVEN",
                            statements: [
                                { questionNumber: 1, text: "Polar bears suffer from various health problems due to the build-up of fat under their skin." },
                                { questionNumber: 2, text: "The hair of polar bears is actually white." },
                                { questionNumber: 3, text: "Liu and his colleagues were the first researchers to compare polar bears and brown bears genetically." },
                                { questionNumber: 4, text: "Polar bears are able to control their levels of ‘bad’ cholesterol." },
                                { questionNumber: 5, text: "Female polar bears are able to survive for about six months without food." },
                                { questionNumber: 6, text: "It was found that the bones of female polar bears were very weak when they came out of their dens in spring." },
                                { questionNumber: 7, text: "The survival mechanisms of polar bears may one day help astronauts in space." }
                            ]
                        },
                        {
                            groupType: "note-completion",
                            startQuestion: 8,
                            endQuestion: 13,
                            mainInstruction: "Complete the table below.",
                            subInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                            mainHeading: "Reasons why polar bears should be protected",
                            passage: `People think of bears as unintelligent and 8 __________ .
However, this may not be correct. For example:
- In Tennoji Zoo, a bear has been seen using a branch as a 9 __________ . This allowed him to knock down some 10 __________ .
- A wild polar bear worked out a method of reaching a platform where a 11 __________ was located.
- Polar bears have displayed behaviour such as conscious manipulation of objects and activity similar to a 12 __________ .

Bears may also display emotions. For example:
- They may make movements suggesting 13 __________ if disappointed when hunting.`
                        }
                    ],
                    questions: [
                        { questionNumber: 1, correctAnswer: "FALSE" },
                        { questionNumber: 2, correctAnswer: "NOT GIVEN" },
                        { questionNumber: 3, correctAnswer: "NOT GIVEN" },
                        { questionNumber: 4, correctAnswer: "TRUE" },
                        { questionNumber: 5, correctAnswer: "TRUE" },
                        { questionNumber: 6, correctAnswer: "FALSE" },
                        { questionNumber: 7, correctAnswer: "TRUE" },
                        { questionNumber: 8, correctAnswer: "violent" },
                        { questionNumber: 9, correctAnswer: "tool" },
                        { questionNumber: 10, correctAnswer: "meat" },
                        { questionNumber: 11, correctAnswer: "photographer" },
                        { questionNumber: 12, correctAnswer: "game" },
                        { questionNumber: 13, correctAnswer: "frustration" }
                    ]
                },
                {
                    sectionNumber: 2,
                    title: "The Step Pyramid of Djoser",
                    passage: `A.
The pyramids are the most famous monuments of ancient Egypt and still hold enormous interest for people in the present day. These grand, impressive tributes to the memory of the Egyptian kings have become linked with the country even though other cultures, such as the Chinese and Mayan, also built pyramids. The evolution of the pyramid form has been written and argued about for centuries. However, there is no question that, as far as Egypt is concerned, it began with one monument to one king designed by one brilliant architect: the Step Pyramid of Djoser at Saqqara.
B.
Djoser was the first king of the Third Dynasty of Egypt and the first to build in stone. Prior to Djoser’s reign, tombs were rectangular monuments made of dried clay brick, which covered underground passages where the deceased person was buried. For reasons which remain unclear, Djoser’s main official, whose name was Imhotep, conceived of building a taller, more impressive tomb for his king by stacking stone slabs on top of one another, progressively making them smaller, to form the shape now known as the Step Pyramid. Djoser is thought to have reigned for 19 years, but some historians and scholars attribute a much longer time for his rule, owing to the number and size of the monuments he built.
C.
The Step Pyramid has been thoroughly examined and investigated over the last century, and it is now known that the building process went through many different stages. Historian Marc Van de Mieroop comments on this, writing ‘Much experimentation was involved, which is especially clear in the construction of the pyramid in the center of the complex. It had several plans … before it became the first Step Pyramid in history, piling six levels on top of one another … The weight of the enormous mass was a challenge for the builders, who placed the stones at an inward incline in order to prevent the monument breaking up.’
D.
When finally completed, the Step Pyramid rose 62 meters high and was the tallest structure of its time. The complex in which it was built was the size of a city in ancient Egypt and included a temple, courtyards, shrines, and living quarters for the priests. It covered a region of 16 hectares and was surrounded by a wall 10.5 meters high. The wall had 13 false doors cut into it with only one true entrance cut into the south-east corner; the entire wall was then ringed by a trench 750 meters long and 40 meters wide. The false doors and the trench were incorporated into the complex to discourage unwanted visitors. If someone wished to enter, he or she would have needed to know in advance how to find the location of the true opening in the wall. Djoser was so proud of his accomplishment that he broke the tradition of having only his own name on the monument and had Imhotep’s name carved on it as well.
E.
The burial chamber of the tomb, where the king’s body was laid to rest, was dug beneath the base of the pyramid, surrounded by a vast maze of long tunnels that had rooms off them to discourage robbers. One of the most mysterious discoveries found inside the pyramid was a large number of stone vessels. Over 40,000 of these vessels, of various forms and shapes, were discovered in storerooms of the pyramid’s underground passages. They are inscribed with the names of rulers from the First and Second Dynasties of Egypt and made from different kinds of stone. There is no agreement among scholars and archaeologists on why the vessels were placed in the tomb of Djoser or what they were supposed to represent. The archaeologist Jean-Philippe Lauer, who excavated most of the pyramid and complex, believes they were originally stored and then given a ‘proper burial’ by Djoser in his pyramid to honor his predecessors. There are other historians, however, who claim the vessels were dumped into the shafts as yet another attempt to prevent grave robbers from getting to the king’s burial chamber.
F.
Unfortunately, all of the precautions and intricate design of the underground network did not prevent ancient robbers from finding a way in. Djoser’s grave goods, and even his body, were stolen at some point in the past and all archaeologists found were a small number of his valuables overlooked by the thieves. There was enough left throughout the pyramid and its complex, however, to astonish and amaze the archaeologists who excavated it.
G.
Egyptologist Miroslav Verner writes, ‘Few monuments hold a place in human history as significant as that of the Step Pyramid in Saqqara … It can be said without exaggeration that this pyramid complex constitutes a milestone in the evolution of monumental stone architecture in Egypt and in the world as a whole.’ The Step Pyramid was a revolutionary advance in architecture and became the archetype which all the other great pyramid builders of Egypt would follow.`,
                    questionGroups: [
                        {
                            groupType: "matching-information",
                            startQuestion: 14,
                            endQuestion: 20,
                            mainInstruction: "Reading Passage has seven paragraphs, A-G.",
                            subInstruction: "Choose the correct heading for paragraphs from the list of headings below. Write the correct number, i-ix.",
                            paragraphOptions: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"],
                            note: "NB You may use any letter more than once.",
                            matchingItems: [
                                { questionNumber: 14, text: "Paragraph A" },
                                { questionNumber: 15, text: "Paragraph B" },
                                { questionNumber: 16, text: "Paragraph C" },
                                { questionNumber: 17, text: "Paragraph D" },
                                { questionNumber: 18, text: "Paragraph E" },
                                { questionNumber: 19, text: "Paragraph F" },
                                { questionNumber: 20, text: "Paragraph G" }
                            ]
                        },
                        {
                            groupType: "note-completion",
                            startQuestion: 21,
                            endQuestion: 24,
                            mainInstruction: "The Step Pyramid of Djoser",
                            subInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                            passage: `The complex that includes the Step Pyramid and its surroundings is considered to be as big as an Egyptian 21 __________ of the past. The area outside the pyramid included accommodation that was occupied by 22 __________ , along with many other buildings and features.
A wall ran around the outside of the complex and a number of false entrances were built into this. In addition, a long 23 __________ encircled the wall. As a result, any visitors who had not been invited were cleverly prevented from entering the pyramid grounds unless they knew the 24 __________ of the real entrance.`
                        },
                        {
                            groupType: "choose-two-letters",
                            startQuestion: 25,
                            endQuestion: 26,
                            mainInstruction: "Choose TWO letters, A-E.",
                            questionSets: [
                                {
                                    questionNumbers: [25, 26],
                                    questionText: "Which TWO of the following points does the writer make about King Djoser?",
                                    options: [
                                        { letter: "A", text: "The designs of his burial rooms copied those of earlier kings." },
                                        { letter: "B", text: "He was the first Egyptian father-to-son ruler to build a stone pyramid." },
                                        { letter: "C", text: "There is disagreement about the length of his reign." },
                                        { letter: "D", text: "He failed to appreciate Imhotep's contribution to high buildings." },
                                        { letter: "E", text: "A few of his possessions were still in his tomb when it was opened." }
                                    ]
                                }
                            ]
                        }
                    ],
                    questions: [
                        { questionNumber: 14, correctAnswer: "iv" },
                        { questionNumber: 15, correctAnswer: "vii" },
                        { questionNumber: 16, correctAnswer: "ii" },
                        { questionNumber: 17, correctAnswer: "v" },
                        { questionNumber: 18, correctAnswer: "i" },
                        { questionNumber: 19, correctAnswer: "viii" },
                        { questionNumber: 20, correctAnswer: "vi" },
                        { questionNumber: 21, correctAnswer: "city" },
                        { questionNumber: 22, correctAnswer: "priests" },
                        { questionNumber: 23, correctAnswer: "trench" },
                        { questionNumber: 24, correctAnswer: "location" },
                        { questionNumber: 25, correctAnswer: "C" },
                        { questionNumber: 26, correctAnswer: "E" }
                    ]
                },
                {
                    sectionNumber: 3,
                    title: "The future of work",
                    passage: `According to a leading business consultancy, 3—14% of the global workforce will need to switch to a different occupation within the next 10—15 years, and all workers will need to adapt as their occupations evolve alongside increasingly capable machines. Automation — or ‘embodied artificial intelligence (AI) — is one aspect of the disruptive effects of technology on the labour market. ‘Disembodied AI’, like the algorithms running in our smartphones, is another.

Dr Stella Pachidi from Cambridge Judge Business School believes that some of the most fundamental changes are happening as a result of the ‘algorithmication’ of jobs that are dependent on data rather than on production — the so-called knowledge economy. Algorithms are capable of learning from data to undertake tasks that previously needed human judgement, such as reading legal contracts, analysing medical scans and gathering market intelligence.

‘In many cases, they can outperform humans,’ says Pachidi. ‘Organisations are attracted to using algorithms because they want to make choices based on what they consider is “perfect information”, as well as to reduce costs and enhance productivity.’

‘But these enhancements are not without consequences,’ says Pachidi. ‘If routine cognitive tasks are taken over by AI, how do professions develop their future experts?’ she asks. ‘One way of learning about a job is “legitimate peripheral participation”— a novice stands next to experts and learns by observation. If this isn’t happening, then you need to find new ways to learn.’

Another issue is the extent to which the technology influences or even controls the workforce. For over two years, Pachidi monitored a telecommunications company. ‘The way telecoms salespeople work is through personal and frequent contact with clients, using the benefit of experience to assess a situation and reach a decision. However, the company had started using a[n] … algorithm that defined when account managers should contact certain customers about which kinds of campaigns and what to offer them.’

The algorithm — usually built by external designers — often becomes the keeper of knowledge, she explains. In cases like this, Pachidi believes, a short-sighted view begins to creep into working practices whereby workers learn through the ‘algorithm’s eyes’ and become dependent on its instructions. Alternative explorations — where experimentation and human instinct lead to progress and new ideas — are effectively discouraged.

Pachidi and colleagues even observed people developing strategies to make the algorithm work to their own advantage. ‘We are seeing cases where workers feed the algorithm with false data to reach their targets,’ she reports.

It’s scenarios like these that many researchers are working to avoid. Their objective is to make AI technologies more trustworthy and transparent, so that organisations and individuals understand how AI decisions are made. In the meantime, says Pachidi, ‘We need to make sure we fully understand the dilemmas that this new world raises regarding expertise, occupational boundaries and control.’

Economist Professor Hamish Low believes that the future of work will involve major transitions across the whole life course for everyone: ‘The traditional trajectory of full-time education followed by full-time work followed by a pensioned retirement is a thing of the past,’ says Low. Instead, he envisages a multistage employment life: one where retraining happens across the life course, and where multiple jobs and no job happen by choice at different stages.

On the subject of job losses, Low believes the predictions are founded on a fallacy: ‘It assumes that the number of jobs is fixed. If in 30 years, half of 100 jobs are being carried out by robots, that doesn’t mean we are left with just 50 jobs for humans. The number of jobs will increase: we would expect there to be 150 jobs.’

Dr Ewan McGaughey, at Cambridge’s Centre for Business Research and King’s College London, agrees that ‘apocalyptic’ views about the future of work are misguided. ‘It’s the laws that restrict the supply of capital to the job market, not the advent of new technologies that causes unemployment.’

His recently published research answers the question of whether automation, AI and robotics will mean a ‘jobless future’ by looking at the causes of unemployment. ‘History is clear that change can mean redundancies. But social policies can tackle this through retraining and redeployment.’

He adds: ‘If there is going to be change to jobs as a result of AI and robotics then I’d like to see governments seizing the opportunity to improve policy to enforce good job security. We can “reprogramme” the law to prepare for a fairer future of work and leisure.’ McGaughey’s findings are a call to arms to leaders of organisations, governments and banks to pre-empt the coming changes with bold new policies that guarantee full employment, fair incomes and a thriving economic democracy.

‘The promises of these new technologies are astounding. They deliver humankind the capacity to live in a way that nobody could have once imagined,’ he adds. ‘Just as the industrial revolution brought people past subsistence agriculture, and the corporate revolution enabled mass production, a third revolution has been pronounced. But it will not only be one of technology. The next revolution will be social.’`,
                    questionGroups: [
                        {
                            groupType: "multiple-choice-full",
                            startQuestion: 27,
                            endQuestion: 30,
                            mainInstruction: "Choose the correct letter, A, B, C or D.",
                            mcQuestions: [
                                {
                                    questionNumber: 27,
                                    questionText: "The writer says that 'embodied AI' is helpfully used by",
                                    options: [
                                        { letter: "A", text: "some business consultancies." },
                                        { letter: "B", text: "some smartphone users." },
                                        { letter: "C", text: "some workforce managers." },
                                        { letter: "D", text: "some machine operators." }
                                    ]
                                },
                                {
                                    questionNumber: 28,
                                    questionText: "What is Stella Pachidi's opinion on the 'knowledge economy'?",
                                    options: [
                                        { letter: "A", text: "It is already highlighting a decline in data-production." },
                                        { letter: "B", text: "It is causing a fundamental change in the way data is handled." },
                                        { letter: "C", text: "It is becoming dependent on the judgment of people in legal professions." },
                                        { letter: "D", text: "It is ensuring that human judgment is no longer required in medical scans." }
                                    ]
                                },
                                {
                                    questionNumber: 29,
                                    questionText: "What is Stella Pachidi's concern about 'peripheral participation'?",
                                    options: [
                                        { letter: "A", text: "It will be replaced by a different kind of training." },
                                        { letter: "B", text: "It will soon be less popular in most professions." },
                                        { letter: "C", text: "It will be ignored by professional experts." },
                                        { letter: "D", text: "It will lead to a decrease in innovation." }
                                    ]
                                },
                                {
                                    questionNumber: 30,
                                    questionText: "What does Pachidi believe is a result of using algorithms in the telecommunications company?",
                                    options: [
                                        { letter: "A", text: "People are no longer learning through the benefit of experience." },
                                        { letter: "B", text: "External designers are being used to make the algorithm more efficient." },
                                        { letter: "C", text: "Managers are discouraged from contacting customers about campaigns." },
                                        { letter: "D", text: "Workers are refusing to feed the algorithm with false data." }
                                    ]
                                }
                            ]
                        },
                        {
                            groupType: "summary-with-options",
                            startQuestion: 31,
                            endQuestion: 34,
                            mainInstruction: "Complete the summary using the list of words, A-G, below.",
                            subInstruction: "Write the correct letter, A-G, in boxes 31-34 on your answer sheet.",
                            mainHeading: "The 'algorithmication' of jobs",
                            phraseList: [
                                { letter: "A", text: "pressure" }, { letter: "B", text: "satisfaction" }, { letter: "C", text: "intuition" },
                                { letter: "D", text: "promotion" }, { letter: "E", text: "reliance" }, { letter: "F", text: "confidence" },
                                { letter: "G", text: "information" }
                            ],
                            summarySegments: [
                                { type: "text", content: "Stella Pachidi of Cambridge Judge Business School has been focusing on the ‘algorithmication’ of jobs which rely not on production but on" },
                                { type: "blank", questionNumber: 31 },
                                { type: "text", content: ". While monitoring a telecommunications company, Pachidi observed a growing" },
                                { type: "blank", questionNumber: 32 },
                                { type: "text", content: "on the recommendations made by AI, as workers begin to learn through the ‘algorithm’s eyes’. Meanwhile, staff are deterred from experimenting and using their own" },
                                { type: "blank", questionNumber: 33 },
                                { type: "text", content: ", and are therefore prevented from achieving innovation. To avoid the kind of situations which Pachidi observed, researchers are trying to make AI’s decision-making process easier to comprehend, and to increase users’" },
                                { type: "blank", questionNumber: 34 },
                                { type: "text", content: "with regard to the technology." }
                            ]
                        },
                        {
                            groupType: "matching-information", // Using for Match People
                            startQuestion: 35,
                            endQuestion: 40,
                            mainInstruction: "Look at the following statements and the list of people below.",
                            subInstruction: "Match each statement with the correct person, A, B or C.",
                            paragraphOptions: ["A", "B", "C"],
                            note: "NB You may use any letter more than once.",
                            matchingItems: [
                                { questionNumber: 35, text: "Greater levels of automation will not result in fewer jobs." },
                                { questionNumber: 36, text: "AI applications can lead to a reduction in the variety of work that is being done." },
                                { questionNumber: 37, text: "There is a potential for technology to result in a better work-life balance." },
                                { questionNumber: 38, text: "Many people have an overly pessimistic view of how AI will affect our lives." },
                                { questionNumber: 39, text: "It is important to understand that the lifetime of a job is no longer predictable." },
                                { questionNumber: 40, text: "The number of working hours per week should be reduced as a result of AI." }
                            ],
                            optionsExplanation: [
                                { label: "A", description: "Stella Pachidi" },
                                { label: "B", description: "Hamish Low" },
                                { label: "C", description: "Ewan McGaughey" }
                            ]
                        }
                    ],
                    questions: [
                        { questionNumber: 27, correctAnswer: "C" },
                        { questionNumber: 28, correctAnswer: "B" },
                        { questionNumber: 29, correctAnswer: "D" },
                        { questionNumber: 30, correctAnswer: "A" },
                        { questionNumber: 31, correctAnswer: "G" },
                        { questionNumber: 32, correctAnswer: "E" },
                        { questionNumber: 33, correctAnswer: "C" },
                        { questionNumber: 34, correctAnswer: "F" },
                        { questionNumber: 35, correctAnswer: "B" },
                        { questionNumber: 36, correctAnswer: "A" },
                        { questionNumber: 37, correctAnswer: "C" },
                        { questionNumber: 38, correctAnswer: "C" },
                        { questionNumber: 39, correctAnswer: "B" },
                        { questionNumber: 40, correctAnswer: "C" }
                    ]
                }
            ],
            totalQuestions: 40,
            totalMarks: 40,
            updatedAt: new Date(),
            setType: "READING"
        };

        // Update in both collections
        const result1 = await db.collection("readingtests").updateOne(
            { title: filter.title },
            { $set: fullTest }
        );

        const result2 = await db.collection("questionsets").updateOne(
            { title: filter.title },
            { $set: fullTest }
        );

        console.log(`✅ Reading Test Final Fix! Result1: ${result1.modifiedCount}, Result2: ${result2.modifiedCount}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

updateReadingTestFinal();
