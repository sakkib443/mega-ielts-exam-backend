const mongoose = require("mongoose");
require("dotenv").config();

async function addReadingTest() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        const adminUser = await db.collection("users").findOne({ role: "admin" });

        const lastReadingTest = await db.collection("readingtests")
            .find({})
            .sort({ testNumber: -1 })
            .limit(1)
            .toArray();

        const nextTestNumber = (lastReadingTest[0]?.testNumber || 0) + 1;
        const nextTestId = `READING_${nextTestNumber.toString().padStart(3, '0')}`;

        const readingTest = {
            testId: nextTestId,
            testNumber: nextTestNumber,
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
                    questions: [
                        {
                            questionNumber: 1,
                            questionType: "true-false-not-given",
                            questionText: "Polar bears suffer from various health problems due to the build-up of fat under their skin.",
                            correctAnswer: "FALSE",
                            mainInstruction: "Do the following statements agree with the information given in the Reading Passage?",
                            subInstruction: "TRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
                            marks: 1
                        },
                        {
                            questionNumber: 2,
                            questionType: "true-false-not-given",
                            questionText: "The hair of polar bears is actually white.",
                            correctAnswer: "NOT GIVEN",
                            marks: 1
                        },
                        {
                            questionNumber: 3,
                            questionType: "true-false-not-given",
                            questionText: "Liu and his colleagues were the first researchers to compare polar bears and brown bears genetically.",
                            correctAnswer: "NOT GIVEN",
                            marks: 1
                        },
                        {
                            questionNumber: 4,
                            questionType: "true-false-not-given",
                            questionText: "Polar bears are able to control their levels of ‘bad’ cholesterol.",
                            correctAnswer: "TRUE",
                            marks: 1
                        },
                        {
                            questionNumber: 5,
                            questionType: "true-false-not-given",
                            questionText: "Female polar bears are able to survive for about six months without food.",
                            correctAnswer: "TRUE",
                            marks: 1
                        },
                        {
                            questionNumber: 6,
                            questionType: "true-false-not-given",
                            questionText: "It was found that the bones of female polar bears were very weak when they came out of their dens in spring.",
                            correctAnswer: "FALSE",
                            marks: 1
                        },
                        {
                            questionNumber: 7,
                            questionType: "true-false-not-given",
                            questionText: "The survival mechanisms of polar bears may one day help astronauts in space.",
                            correctAnswer: "TRUE",
                            marks: 1
                        },
                        {
                            questionNumber: 8,
                            questionType: "note-completion",
                            questionText: "People think of bears as unintelligent and {8}.",
                            correctAnswer: "violent",
                            mainInstruction: "Complete the table below.",
                            subInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                            marks: 1
                        },
                        {
                            questionNumber: 9,
                            questionType: "note-completion",
                            questionText: "In Tennoji Zoo, a bear has been seen using a branch as a {9}.",
                            correctAnswer: "tool",
                            marks: 1
                        },
                        {
                            questionNumber: 10,
                            questionType: "note-completion",
                            questionText: "This allowed him to knock down some {10}.",
                            correctAnswer: "meat",
                            marks: 1
                        },
                        {
                            questionNumber: 11,
                            questionType: "note-completion",
                            questionText: "A wild polar bear worked out a method of reaching a platform where a {11} was located.",
                            correctAnswer: "photographer",
                            marks: 1
                        },
                        {
                            questionNumber: 12,
                            questionType: "note-completion",
                            questionText: "Polar bears have displayed behaviour such as conscious manipulation of objects and activity similar to a {12}.",
                            correctAnswer: "game",
                            marks: 1
                        },
                        {
                            questionNumber: 13,
                            questionType: "note-completion",
                            questionText: "They may make movements suggesting {13} if disappointed when hunting.",
                            correctAnswer: "frustration",
                            marks: 1
                        }
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
                    questions: [
                        {
                            questionNumber: 14,
                            questionType: "matching-headings",
                            questionText: "Paragraph A",
                            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"],
                            correctAnswer: "iv",
                            mainInstruction: "Choose the correct heading for paragraphs from the list of headings below.",
                            subInstruction: "List of Headings\ni The areas and artefacts within the pyramid itself\nii A difficult task for those involved\niii A king who saved his people\niv A single certainty among other less definite facts\nv An overview of the external buildings and areas\nvi A pyramid design that others copied\nvii An idea for changing the design of burial structures\nviii An incredible experience despite the few remains\nix The answers to some unexpected questions",
                            marks: 1
                        },
                        {
                            questionNumber: 15,
                            questionType: "matching-headings",
                            questionText: "Paragraph B",
                            correctAnswer: "vii",
                            marks: 1
                        },
                        {
                            questionNumber: 16,
                            questionType: "matching-headings",
                            questionText: "Paragraph C",
                            correctAnswer: "ii",
                            marks: 1
                        },
                        {
                            questionNumber: 17,
                            questionType: "matching-headings",
                            questionText: "Paragraph D",
                            correctAnswer: "v",
                            marks: 1
                        },
                        {
                            questionNumber: 18,
                            questionType: "matching-headings",
                            questionText: "Paragraph E",
                            correctAnswer: "i",
                            marks: 1
                        },
                        {
                            questionNumber: 19,
                            questionType: "matching-headings",
                            questionText: "Paragraph F",
                            correctAnswer: "viii",
                            marks: 1
                        },
                        {
                            questionNumber: 20,
                            questionType: "matching-headings",
                            questionText: "Paragraph G",
                            correctAnswer: "vi",
                            marks: 1
                        },
                        {
                            questionNumber: 21,
                            questionType: "note-completion",
                            questionText: "The complex that includes the Step Pyramid and its surroundings is considered to be as big as an Egyptian {21} of the past.",
                            correctAnswer: "city",
                            mainInstruction: "The Step Pyramid of Djoser",
                            subInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                            marks: 1
                        },
                        {
                            questionNumber: 22,
                            questionType: "note-completion",
                            questionText: "The area outside the pyramid included accommodation that was occupied by {22}, along with many other buildings and features.",
                            correctAnswer: "priests",
                            marks: 1
                        },
                        {
                            questionNumber: 23,
                            questionType: "note-completion",
                            questionText: "A wall ran around the outside of the complex and a number of false entrances were built into this. In addition, a long {23} encircled the wall.",
                            correctAnswer: "trench",
                            marks: 1
                        },
                        {
                            questionNumber: 24,
                            questionType: "note-completion",
                            questionText: "As a result, any visitors who had not been invited were cleverly prevented from entering the pyramid grounds unless they knew the {24} of the real entrance.",
                            correctAnswer: "location",
                            marks: 1
                        }
                    ]
                }
            ],
            totalQuestions: 40,
            totalMarks: 40,
            difficulty: "medium",
            isActive: true,
            usageCount: 0,
            createdBy: adminUser?._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert into readingtests
        await db.collection("readingtests").insertOne(readingTest);

        // Insert into questionsets for compatibility
        const oldSetFormat = {
            ...readingTest,
            setId: `READING_SET_${readingTest.testNumber.toString().padStart(3, '0')}`,
            setNumber: readingTest.testNumber,
            setType: "READING"
        };
        delete oldSetFormat.testId;
        await db.collection("questionsets").insertOne(oldSetFormat);

        console.log(`✅ Success! Added Reading Test #${nextTestNumber}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

addReadingTest();
