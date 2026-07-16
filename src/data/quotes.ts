import type { Lang } from "./i18n";

/* One is chosen at random on each page load.

   Each quote holds both languages so a translation can't drift away from the
   line it renders. The English is itself a translation from the Latin, so the
   Romanian is a translation of a translation — rendered to read naturally
   rather than passed off as the wording of a published Romanian edition. The
   work titles are the real ones. */
type Quote = { text: string; author: string };

const quotes: Record<Lang, Quote>[] = [
	// On the Shortness of Life
	{
		en: {
			text: "It is not that we have a short time to live, but that we waste much of it.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Nu că avem puțin timp de trăit, ci că risipim mult din el.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},
	{
		en: {
			text: "Life is long if you know how to use it.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Viața e lungă dacă știi să o folosești.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},
	{
		en: {
			text: "They lose the day in expectation of the night, and the night in fear of the dawn.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Pierd ziua în așteptarea nopții, și noaptea în teama de zori.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},
	{
		en: {
			text: "The part of life we really live is small. For all the rest of existence is not life, but merely time.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Partea din viață pe care o trăim cu adevărat e mică. Căci tot restul existenței nu e viață, ci doar timp.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},
	{
		en: {
			text: "Putting things off is the biggest waste of life: it snatches away each day as it comes, and denies us the present by promising the future.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Amânarea e cea mai mare risipă a vieții: îți smulge fiecare zi pe măsură ce vine și îți refuză prezentul promițându-ți viitorul.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},
	{
		en: {
			text: "Retire into yourself as much as possible.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Retrage-te în tine însuți cât de mult poți.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},
	{
		en: {
			text: "We are not given a short life but we make it short, and we are not ill-supplied but wasteful of it.",
			author: "Seneca, On the Shortness of Life",
		},
		ro: {
			text: "Nu ni se dă o viață scurtă, ci noi o facem scurtă; nu suntem lipsiți, ci risipitori.",
			author: "Seneca, Despre scurtimea vieții",
		},
	},

	// Letters to Lucilius
	{
		en: {
			text: "While we teach, we learn.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "În timp ce îi învățăm pe alții, învățăm noi înșine.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "He who is everywhere is nowhere.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Cine e peste tot nu e nicăieri.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "We suffer more often in imagination than in reality.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Suferim mai des în imaginație decât în realitate.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "No man was ever wise by chance.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nimeni n-a devenit vreodată înțelept din întâmplare.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Cu viața e ca și cu o poveste: nu contează cât e de lungă, ci cât e de bună.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "He suffers more than is necessary, who suffers before it is necessary.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Suferă mai mult decât e nevoie cel care suferă înainte să fie nevoie.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Begin at once to live, and count each separate day as a separate life.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Începe să trăiești chiar acum și socotește fiecare zi ca pe o viață aparte.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "The first step in a person's salvation is knowledge of their sin.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Primul pas către mântuirea cuiva este cunoașterea păcatului său.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Associate with those who will make a better man of you. Welcome those whom you yourself can improve.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Stai în preajma celor care te fac un om mai bun. Primește-i pe cei pe care tu însuți îi poți face mai buni.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "While we are postponing, life speeds by.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Cât timp amânăm, viața trece în goană.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Philosophy promises, above all else: common sense, humanity, and fellowship.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Filosofia promite, mai presus de orice: bun-simț, omenie și prietenie.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "I shall never be ashamed of citing a bad author if the line is good.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu-mi va fi niciodată rușine să citez un autor prost dacă rândul e bun.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "The mind that is anxious about future events is miserable.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Mintea care se neliniștește pentru cele ce vor veni e nefericită.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Hang on to your youthful enthusiasms — you'll be able to use them better when you're older.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Ține-te de entuziasmele tinereții — le vei putea folosi mai bine la bătrânețe.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "It is not the man who has too little, but the man who craves more, that is poor.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu cel care are prea puțin e sărac, ci cel care râvnește la mai mult.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Be wary of the crowd; be wary of the few; be wary even of yourself.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Ferește-te de mulțime; ferește-te de cei puțini; ferește-te chiar și de tine însuți.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "A gem cannot be polished without friction, nor a man perfected without trials.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "O piatră prețioasă nu se poate șlefui fără frecare, nici omul desăvârși fără încercări.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Do not indulge hope, and you will not know fear.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu-ți hrăni speranța și nu vei cunoaște teama.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Luck is what happens when preparation meets opportunity.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Norocul e ceea ce se întâmplă când pregătirea întâlnește ocazia.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "The time will come when diligent research over long periods will bring to light things which now lie hidden.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Va veni vremea când cercetarea stăruitoare, de-a lungul multor ani, va scoate la lumină lucruri care acum stau ascunse.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Grow old in seeking and discovering. So that if fate cuts you off in mid-course, what you have already traversed has been well spent.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Îmbătrânește căutând și descoperind. Astfel încât, dacă soarta te curmă la mijlocul drumului, ceea ce ai străbătut deja să fi fost bine folosit.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "There is nothing the wise man does reluctantly.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu e nimic ce înțeleptul să facă în silă.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "You ask what is the proper limit to a person's wealth? First, having what is essential, and second, having what is enough.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Mă întrebi care e măsura potrivită a averii cuiva? Întâi, să ai ce e neapărat trebuincios; apoi, să ai cât îți e de ajuns.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Our plans miscarry because they have no aim. When a man does not know what harbor he is making for, no wind is the right wind.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Planurile noastre dau greș fiindcă n-au țintă. Când omul nu știe spre ce port se îndreaptă, niciun vânt nu e vântul potrivit.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "The company of many is harmful.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Tovărășia celor mulți e păgubitoare.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Nothing, Lucilius, is ours except time.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nimic, Luciliu, nu e al nostru în afară de timp.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "It matters not how many books you have, but how good they are.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu contează câte cărți ai, ci cât de bune sunt.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Fate leads the willing and drags along the reluctant.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Soarta îl călăuzește pe cel ce vrea și îl târăște pe cel ce se împotrivește.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},

	// On Anger
	{
		en: {
			text: "The greatest remedy for anger is delay.",
			author: "Seneca, On Anger",
		},
		ro: {
			text: "Cel mai bun leac împotriva mâniei este amânarea.",
			author: "Seneca, Despre mânie",
		},
	},
	{
		en: {
			text: "We should every night call ourselves to account: what infirmity have I mastered today? what passion opposed? what temptation resisted?",
			author: "Seneca, On Anger",
		},
		ro: {
			text: "În fiecare seară ar trebui să ne cerem socoteală: ce slăbiciune am biruit astăzi? cărei patimi m-am împotrivit? cărei ispite i-am stat împotrivă?",
			author: "Seneca, Despre mânie",
		},
	},
	{
		en: {
			text: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.",
			author: "Seneca, On Anger",
		},
		ro: {
			text: "Mânia e un acid care poate face mai mult rău vasului în care e ținut decât lucrului peste care e turnat.",
			author: "Seneca, Despre mânie",
		},
	},

	// On Tranquility of Mind
	{
		en: {
			text: "No man is free who is not master of himself.",
			author: "Seneca, On Tranquility of Mind",
		},
		ro: {
			text: "Nu e liber cel care nu e stăpân pe sine.",
			author: "Seneca, Despre liniștea sufletului",
		},
	},

	// On Providence
	{
		en: {
			text: "The bravest sight in the world is to see a great man struggling against adversity.",
			author: "Seneca, On Providence",
		},
		ro: {
			text: "Cea mai vitejească priveliște din lume e un om mare luptându-se cu restriștea.",
			author: "Seneca, Despre providență",
		},
	},
	{
		en: {
			text: "God does not make a spoiled pet of a good man; He tests him, hardens him, and fits him for His own service.",
			author: "Seneca, On Providence",
		},
		ro: {
			text: "Dumnezeu nu face din omul bun un răsfățat; îl încearcă, îl întărește și îl pregătește pentru slujba Sa.",
			author: "Seneca, Despre providență",
		},
	},
	{
		en: {
			text: "Yield not to adversity; trust not to prosperity; keep before your eyes the full scope of Fortune's power, as if she would surely do whatever is in her power to do.",
			author: "Seneca, On Providence",
		},
		ro: {
			text: "Nu te pleca în fața restriștii; nu te încrede în propășire; ține-ți mereu înaintea ochilor toată întinderea puterii Norocului, ca și cum ar face negreșit tot ce-i stă în putință.",
			author: "Seneca, Despre providență",
		},
	},

	// On the Happy Life
	{
		en: {
			text: "True happiness is to enjoy the present, without anxious dependence upon the future.",
			author: "Seneca, On the Happy Life",
		},
		ro: {
			text: "Adevărata fericire e să te bucuri de prezent, fără să atârni cu neliniște de viitor.",
			author: "Seneca, Despre viața fericită",
		},
	},
	{
		en: {
			text: "The happy man is content with his present lot, no matter what it is, and is reconciled to his circumstances.",
			author: "Seneca, On the Happy Life",
		},
		ro: {
			text: "Omul fericit se mulțumește cu partea lui de acum, oricare ar fi ea, și e împăcat cu împrejurările sale.",
			author: "Seneca, Despre viața fericită",
		},
	},
	{
		en: {
			text: "Seek not that the things which happen should happen as you wish; but wish the things which happen to be as they are, and you will have a tranquil flow of life.",
			author: "Seneca, On the Happy Life",
		},
		ro: {
			text: "Nu căuta ca lucrurile care se întâmplă să se întâmple cum vrei tu; ci vrea ca lucrurile care se întâmplă să fie așa cum sunt, și viața îți va curge liniștită.",
			author: "Seneca, Despre viața fericită",
		},
	},

	// On Benefits
	{
		en: {
			text: "If you wish to be loved, love.",
			author: "Seneca, On Benefits",
		},
		ro: {
			text: "Dacă vrei să fii iubit, iubește.",
			author: "Seneca, Despre binefaceri",
		},
	},
	{
		en: {
			text: "Ingratitude is the greatest of sins.",
			author: "Seneca, On Benefits",
		},
		ro: {
			text: "Nerecunoștința e cel mai mare dintre păcate.",
			author: "Seneca, Despre binefaceri",
		},
	},
	{
		en: {
			text: "A benefit is not what is done or given, but the intention of the giver or doer.",
			author: "Seneca, On Benefits",
		},
		ro: {
			text: "Binefacerea nu e ceea ce se face sau se dă, ci intenția celui care dă sau face.",
			author: "Seneca, Despre binefaceri",
		},
	},

	// On Firmness
	{
		en: {
			text: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu fiindcă lucrurile sunt grele nu îndrăznim; fiindcă nu îndrăznim sunt ele grele.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "To wish to be well is a part of becoming well.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "A voi să te faci bine e o parte din a te face bine.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "A good character is the only guarantee of everlasting, carefree happiness.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Un caracter bun e singura chezășie a unei fericiri veșnice și fără griji.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "Wisdom does not show itself so much in precept as in life — in a firmness of mind and mastery of appetite.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Înțelepciunea nu se arată atât în învățătură, cât în viață — într-o tărie a minții și o stăpânire a poftelor.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},
	{
		en: {
			text: "I am not born for one corner; the whole world is my native land.",
			author: "Seneca, Letters to Lucilius",
		},
		ro: {
			text: "Nu m-am născut pentru un singur colț; lumea întreagă e patria mea.",
			author: "Seneca, Scrisori către Luciliu",
		},
	},

	// Miscellaneous
	{
		en: {
			text: "To err is human.",
			author: "Seneca",
		},
		ro: {
			text: "A greși e omenește.",
			author: "Seneca",
		},
	},
	{
		en: {
			text: "Who is powerful? He who governs himself.",
			author: "Seneca",
		},
		ro: {
			text: "Cine e puternic? Cel care se stăpânește pe sine.",
			author: "Seneca",
		},
	},
	{
		en: {
			text: "Through hardship to the stars.",
			author: "Seneca, Hercules Furens",
		},
		ro: {
			text: "Prin greutăți, către stele.",
			author: "Seneca, Hercule furios",
		},
	},
	{
		en: {
			text: "Everything belongs to others; time alone is ours.",
			author: "Seneca",
		},
		ro: {
			text: "Totul le aparține altora; doar timpul e al nostru.",
			author: "Seneca",
		},
	},
];

export const quotesFor = (lang: Lang): Quote[] => quotes.map((q) => q[lang]);
