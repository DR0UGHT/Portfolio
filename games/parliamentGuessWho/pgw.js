var mpFliips = 0;
var showLiberals = true;
var showConservatives = true;
var showNDP = true;
var showGreen = true;
var showBloc = true;
var showIndependents = true;
var showFlipped = true;
var showPoliticalColor = true;


let liberals = [
    'AlghabraOmar',
    'AliShafqat',
    'AnandAnita',
    'AnandasangareeGary',
    'ArseneaultRené',
    'AryaChandra',
    'AtwinJenica',
    'BadaweyVance',
    'BainsParm',
    'BakerYvan',
    'BattisteJaime',
    'BeechTerry',
    'BendayanRachel',
    'BibeauMarieClaude',
    'BittleChris',
    'BlairBill',
    'BloisKody',
    'BoissonnaultRandy',
    'BradfordValerie',
    'BrièreÉlisabeth',
    'CarrBen',
    'CaseySean',
    'ChaggerBardish',
    'ChahalGeorge',
    'ChampagneFrançoisPhilippe',
    'ChatelSophie',
    'ChenShaun',
    'ChiangPaul',
    'CollinsChad',
    'CormierSerge',
    'CoteauMichael',
    'DabrusinJulie',
    'DamoffPam',
    'DhaliwalSukh',
    'DhillonAnju',
    'DiabLenaMetlege',
    'DrouinFrancis',
    'DubourgEmmanuel',
    'DuclosJeanYves',
    'DuguidTerry',
    'DuncanKirsty',
    'DzerowiczJulie',
    'EhsassiAli',
    'ElKhouryFayçal',
    'ErskineSmithNathaniel',
    'FergusGreg',
    'FillmoreAndy',
    'FisherDarren',
    'FonsecaPeter',
    'FortierMona',
    'FragiskatosPeter',
    'FraserSean',
    'FreelandChrystia',
    'FryHedy',
    'GaheerIqwinder',
    'GaineyAnna',
    'GerretsenMark',
    'GouldKarina',
    'GuilbeaultSteven',
    'HajduPatty',
    'HanleyBrendan',
    'HardieKen',
    'HepfnerLisa',
    'HollandMark',
    'HousefatherAnthony',
    'HussenAhmed',
    'HutchingsGudie',
    'IaconoAngelo',
    'IenMarci',
    'JaczekHelena',
    'JolyMélanie',
    'JonesYvonne',
    'JowhariMajid',
    'KayabagaArielle',
    'KellowayMike',
    'KhalidIqra',
    'KheraKamal',
    'KoutrakisAnnie',
    'KusmierczykIrek',
    'LalondeMarieFrance',
    'LambropoulosEmmanuella',
    'LamoureuxKevin',
    'LapointeViviane',
    'LattanzioPatricia',
    'LauzonStéphane',
    'LeBlancDominic',
    'LebouthillierDiane',
    'LightboundJoël',
    'LongWayne',
    'LongfieldLloyd',
    'LouisTim',
    'MacAulayLawrence',
    'MacDonaldHeath',
    'MacKinnonSteven',
    'MaloneyJames',
    'MartinezFerradaSoraya',
    'MayBryan',
    'McDonaldKen',
    'McGuintyDavid',
    'McKayJohn',
    'McKinnonRon',
    'McLeodMichael',
    'MendèsAlexandra',
    'MendicinoMarco',
    'MiaoWilson',
    'MillerMarc',
    'MorrisseyRobert',
    'MurrayJoyce',
    'NaqviYasir',
    'NgMary',
    'NoormohamedTaleeb',
    'OConnellJennifer',
    'OReganSeamus',
    'OliphantRobert',
    'PetitpasTaylorGinette',
    'PowlowskiMarcus',
    'QualtroughCarla',
    'RobillardYves',
    'RodriguezPablo',
    'RogersChurence',
    'RomanadoSherry',
    'RotaAnthony',
    'SahotaRuby',
    'SajjanHarjit',
    'SaksYaara',
    'SamsonDarrell',
    'SaraiRandeep',
    'ScarpaleggiaFrancis',
    'SchiefkePeter',
    'SerréMarc',
    'SgroJudyA',
    'ShanahanBrenda',
    'SheehanTerry',
    'SidhuManinder',
    'SidhuSonia',
    'SorbaraFrancesco',
    'SousaCharles',
    'StOngePascale',
    'SuddsJenna',
    'TassiFilomena',
    'TaylorRoyLeah',
    'ThompsonJoanne',
    'TrudeauJustin',
    'TurnbullRyan',
    'ValdezRechie',
    'VanBynenTony',
    'VanKoeverdenAdam',
    'VandalDan',
    'VandenbeldAnita',
    'ViraniArif',
    'WeilerPatrick',
    'WilkinsonJonathan',
    'YipJean',
    'ZahidSalma',
    'ZuberiSameer'
]

let conservatives = [
    'AboultaifZiad',
    'AitchisonScott',
    'AlbasDan',
    'AllisonDean',
    'ArnoldMel',
    'BaldinelliTony',
    'BarlowJohn',
    'BarrettMichael',
    'BertholdLuc',
    'BezanJames',
    'BlockKelly',
    'BragdonRichard',
    'BrassardJohn',
    'BrockLarry',
    'CalkinsBlaine',
    'CaputoFrank',
    'CarrieColin',
    'ChambersAdam',
    'ChongMichael',
    'CooperMichael',
    "dEntremontChris",
    'DaltonMarc',
    'DanchoRaquel',
    'DavidsonScot',
    'DeltellGérard',
    'DohertyTodd',
    'DowdallTerry',
    'DreeshenEarl',
    'DuncanEric',
    'EllisStephen',
    'EppDave',
    'FalkRosemarie',
    'FalkTed',
    'FastEd',
    'FerreriMichelle',
    'FindlayKerryLynne',
    'GallantCheryl',
    'GénéreuxBernard',
    'GenuisGarnett',
    'GladuMarilyn',
    'GodinJoël',
    'GoodridgeLaila',
    'GourdeJacques',
    'GrayTracy',
    'HallanJasrajSingh',
    'HobackRandy',
    'JenerouxMatt',
    'JivaniJamil',
    'KellyPat',
    'KhannaArpan',
    'KitchenRobert',
    'KmiecTom',
    'KramMichael',
    'KrampNeumanShelby',
    'KurekDamien',
    'KusieStephanie',
    'LakeMike',
    'LantsmanMelissa',
    'LawrencePhilip',
    'LehouxRichard',
    'LeslieBranden',
    'LewisChris',
    'LewisLeslyn',
    'LiepertRon',
    'LloydDane',
    'LobbBen',
    'MaguireLarry',
    'MajumdarShuvaloy',
    'MartelRichard',
    'MazierDan',
    'McCauleyKelly',
    'McLeanGreg',
    'MelilloEric',
    'MooreRob',
    'MorantzMarty',
    'MorrisonRob',
    'MotzGlen',
    'MuysDan',
    'NaterJohn',
    'PatzerJeremy',
    'PaulHusPierre',
    'PerkinsRick',
    'PoilievrePierre',
    'RedekoppBrad',
    'ReidScott',
    'RempelGarnerMichelle',
    'RichardsBlake',
    'RobertsAnna',
    'RoodLianne',
    'RuffAlex',
    'ScheerAndrew',
    'SchmaleJamie',
    'SeebackKyle',
    'ShieldsMartin',
    'ShipleyDoug',
    'SmallClifford',
    'SorokaGerald',
    'SteinleyWarren',
    'StewartDon',
    'StewartJake',
    'StrahlMark',
    'StubbsShannon',
    'ThomasRachael',
    'TochorCorey',
    'TolmieFraser',
    'UppalTim',
    'VanPoptaTako',
    'VecchioKaren',
    'VidalGary',
    'VienDominique',
    'ViersenArnold',
    'VisBrad',
    'WagantallCathay',
    'WarkentinChris',
    'WaughKevin',
    'WebberLen',
    'WilliamsRyan',
    'WilliamsonJohn',
    'ZimmerBob'
]

let NDP = [
    'AngusCharlie',
    'AshtonNiki',
    'BachrachTaylor',
    'BarronLisaMarie',
    'BlaneyRachel',
    'BoulericeAlexandre',
    'CanningsRichard',
    'CollinsLaurel',
    'DaviesDon',
    'DesjarlaisBlake',
    'GarrisonRandall',
    'GazanLeah',
    'GreenMatthew',
    'HughesCarol',
    'IdloutLori',
    'JohnsGord',
    'JulianPeter',
    'KwanJenny',
    'MacGregorAlistair',
    'MasseBrian',
    'MathyssenLindsay',
    'McPhersonHeather',
    'SinghJagmeet',
    'ZarrilloBonita'
]

let bloc = [
    'BarsalouDuvalXavier',
    'BeaulieuMario',
    'BergeronStéphane',
    'BérubéSylvie',
    'BlanchetYvesFrançois',
    'BlanchetteJoncasMaxime',
    'BrunelleDuceppeAlexis',
    'ChabotLouise',
    'ChampouxMartin',
    'DeBellefeuilleClaude',
    'DesbiensCaroline',
    'DesiletsLuc',
    'FortinRhéalÉloi',
    'GaronJeanDenis',
    'GaudreauMarieHélène',
    'GillMarilène',
    'LaroucheAndréanne',
    'LemireSébastien',
    'MichaudKristina',
    'NormandinChristine',
    'PauzéMonique',
    'PerronYves',
    'PlamondonLouis',
    'SavardTremblaySimonPierre',
    'SimardMario',
    'SinclairDesgagnéNathalie',
    'SteMarieGabriel',
    'ThériaultLuc',
    'TherrienAlain',
    'TrudelDenis',
    'VignolaJulie',
    'VillemureRené'
]

let independents = [
    'RayesAlain',
    'DongHan',
    'VuongKevin'
]

let green = [
    'MayElizabeth',
    'MorriceMike'
]

let memberLoadOrder = [
    "AboultaifZiad",
    "AitchisonScott",
    "AlbasDan",
    "AlghabraOmar",
    "AliShafqat",
    "AllisonDean",
    "AnandAnita",
    "AnandasangareeGary",
    "AngusCharlie",
    "ArnoldMel",
    "ArseneaultRené",
    "AryaChandra",
    "AshtonNiki",
    "AtwinJenica",
    "BachrachTaylor",
    "BadaweyVance",
    "BainsParm",
    "BakerYvan",
    "BaldinelliTony",
    "BarlowJohn",
    "BarrettMichael",
    "BarronLisaMarie",
    "BarsalouDuvalXavier",
    "BattisteJaime",
    "BeaulieuMario",
    "BeechTerry",
    "BendayanRachel",
    "BergeronStéphane",
    "BertholdLuc",
    "BérubéSylvie",
    "BezanJames",
    "BibeauMarieClaude",
    "BittleChris",
    "BlairBill",
    "BlanchetteJoncasMaxime",
    "BlanchetYvesFrançois",
    "BlaneyRachel",
    "BlockKelly",
    "BloisKody",
    "BoissonnaultRandy",
    "BoulericeAlexandre",
    "BradfordValerie",
    "BragdonRichard",
    "BrassardJohn",
    "BrièreÉlisabeth",
    "BrockLarry",
    "BrunelleDuceppeAlexis",
    "CalkinsBlaine",
    "CanningsRichard",
    "CaputoFrank",
    "CarrBen",
    "CarrieColin",
    "CaseySean",
    "ChabotLouise",
    "ChaggerBardish",
    "ChahalGeorge",
    "ChambersAdam",
    "ChampagneFrançoisPhilippe",
    "ChampouxMartin",
    "ChatelSophie",
    "ChenShaun",
    "ChiangPaul",
    "ChongMichael",
    "CollinsChad",
    "CollinsLaurel",
    "CooperMichael",
    "CormierSerge",
    "CoteauMichael",
    "DabrusinJulie",
    "DaltonMarc",
    "DamoffPam",
    "DanchoRaquel",
    "DavidsonScot",
    "DaviesDon",
    "DeBellefeuilleClaude",
    "DeltellGérard",
    "dEntremontChris",
    "DesbiensCaroline",
    "DesiletsLuc",
    "DesjarlaisBlake",
    "DhaliwalSukh",
    "DhillonAnju",
    "DiabLenaMetlege",
    "DohertyTodd",
    "DongHan",
    "DowdallTerry",
    "DreeshenEarl",
    "DrouinFrancis",
    "DubourgEmmanuel",
    "DuclosJeanYves",
    "DuguidTerry",
    "DuncanEric",
    "DuncanKirsty",
    "DzerowiczJulie",
    "EhsassiAli",
    "ElKhouryFayçal",
    "EllisStephen",
    "EppDave",
    "ErskineSmithNathaniel",
    "FalkRosemarie",
    "FalkTed",
    "FastEd",
    "FergusGreg",
    "FerreriMichelle",
    "FillmoreAndy",
    "FindlayKerryLynne",
    "FisherDarren",
    "FonsecaPeter",
    "FortierMona",
    "FortinRhéalÉloi",
    "FragiskatosPeter",
    "FraserSean",
    "FreelandChrystia",
    "FryHedy",
    "GaheerIqwinder",
    "GaineyAnna",
    "GallantCheryl",
    "GaronJeanDenis",
    "GarrisonRandall",
    "GaudreauMarieHélène",
    "GazanLeah",
    "GénéreuxBernard",
    "GenuisGarnett",
    "GerretsenMark",
    "GillMarilène",
    "GladuMarilyn",
    "GodinJoël",
    "GoodridgeLaila",
    "GouldKarina",
    "GourdeJacques",
    "GrayTracy",
    "GreenMatthew",
    "GuilbeaultSteven",
    "HajduPatty",
    "HallanJasrajSingh",
    "HanleyBrendan",
    "HardieKen",
    "HepfnerLisa",
    "HobackRandy",
    "HollandMark",
    "HousefatherAnthony",
    "HughesCarol",
    "HussenAhmed",
    "HutchingsGudie",
    "IaconoAngelo",
    "IdloutLori",
    "IenMarci",
    "JaczekHelena",
    "JenerouxMatt",
    "JivaniJamil",
    "JohnsGord",
    "JolyMélanie",
    "JonesYvonne",
    "JowhariMajid",
    "JulianPeter",
    "KayabagaArielle",
    "KellowayMike",
    "KellyPat",
    "KhalidIqra",
    "KhannaArpan",
    "KheraKamal",
    "KitchenRobert",
    "KmiecTom",
    "KoutrakisAnnie",
    "KramMichael",
    "KrampNeumanShelby",
    "KurekDamien",
    "KusieStephanie",
    "KusmierczykIrek",
    "KwanJenny",
    "LakeMike",
    "LalondeMarieFrance",
    "LambropoulosEmmanuella",
    "LamoureuxKevin",
    "LantsmanMelissa",
    "LapointeViviane",
    "LaroucheAndréanne",
    "LattanzioPatricia",
    "LauzonStéphane",
    "LawrencePhilip",
    "LeBlancDominic",
    "LebouthillierDiane",
    "LehouxRichard",
    "LemireSébastien",
    "LeslieBranden",
    "LewisChris",
    "LewisLeslyn",
    "LiepertRon",
    "LightboundJoël",
    "LloydDane",
    "LobbBen",
    "LongfieldLloyd",
    "LongWayne",
    "LouisTim",
    "MacAulayLawrence",
    "MacDonaldHeath",
    "MacGregorAlistair",
    "MacKinnonSteven",
    "MaguireLarry",
    "MajumdarShuvaloy",
    "MaloneyJames",
    "MartelRichard",
    "MartinezFerradaSoraya",
    "MasseBrian",
    "MathyssenLindsay",
    "MayBryan",
    "MayElizabeth",
    "MazierDan",
    "McCauleyKelly",
    "McDonaldKen",
    "McGuintyDavid",
    "McKayJohn",
    "McKinnonRon",
    "McLeanGreg",
    "McLeodMichael",
    "McPhersonHeather",
    "MelilloEric",
    "MendèsAlexandra",
    "MendicinoMarco",
    "MiaoWilson",
    "MichaudKristina",
    "MillerMarc",
    "MooreRob",
    "MorantzMarty",
    "MorriceMike",
    "MorrisonRob",
    "MorrisseyRobert",
    "MotzGlen",
    "MurrayJoyce",
    "MuysDan",
    "NaqviYasir",
    "NaterJohn",
    "NgMary",
    "NoormohamedTaleeb",
    "NormandinChristine",
    "OConnellJennifer",
    "OliphantRobert",
    "OReganSeamus",
    "PatzerJeremy",
    "PaulHusPierre",
    "PauzéMonique",
    "PerkinsRick",
    "PerronYves",
    "PetitpasTaylorGinette",
    "PlamondonLouis",
    "PoilievrePierre",
    "PowlowskiMarcus",
    "QualtroughCarla",
    "RayesAlain",
    "RedekoppBrad",
    "ReidScott",
    "RempelGarnerMichelle",
    "RichardsBlake",
    "RobertsAnna",
    "RobillardYves",
    "RodriguezPablo",
    "RogersChurence",
    "RomanadoSherry",
    "RoodLianne",
    "RotaAnthony",
    "RuffAlex",
    "SahotaRuby",
    "SajjanHarjit",
    "SaksYaara",
    "SamsonDarrell",
    "SaraiRandeep",
    "SavardTremblaySimonPierre",
    "ScarpaleggiaFrancis",
    "ScheerAndrew",
    "SchiefkePeter",
    "SchmaleJamie",
    "SeebackKyle",
    "SerréMarc",
    "SgroJudyA",
    "ShanahanBrenda",
    "SheehanTerry",
    "ShieldsMartin",
    "ShipleyDoug",
    "SidhuManinder",
    "SidhuSonia",
    "SimardMario",
    "SinclairDesgagnéNathalie",
    "SinghJagmeet",
    "SmallClifford",
    "SorbaraFrancesco",
    "SorokaGerald",
    "SousaCharles",
    "SteinleyWarren",
    "SteMarieGabriel",
    "StewartDon",
    "StewartJake",
    "StOngePascale",
    "StrahlMark",
    "StubbsShannon",
    "SuddsJenna",
    "TassiFilomena",
    "TaylorRoyLeah",
    "ThériaultLuc",
    "TherrienAlain",
    "ThomasRachael",
    "ThompsonJoanne",
    "TochorCorey",
    "TolmieFraser",
    "TrudeauJustin",
    "TrudelDenis",
    "TurnbullRyan",
    "UppalTim",
    "ValdezRechie",
    "VanBynenTony",
    "VandalDan",
    "VandenbeldAnita",
    "VanKoeverdenAdam",
    "VanPoptaTako",
    "VecchioKaren",
    "VidalGary",
    "VienDominique",
    "ViersenArnold",
    "VignolaJulie",
    "VillemureRené",
    "ViraniArif",
    "VisBrad",
    "VuongKevin",
    "WagantallCathay",
    "WarkentinChris",
    "WaughKevin",
    "WebberLen",
    "WeilerPatrick",
    "WilkinsonJonathan",
    "WilliamsonJohn",
    "WilliamsRyan",
    "YipJean",
    "ZahidSalma",
    "ZarrilloBonita",
    "ZimmerBob",
    "ZuberiSameer"
]

document.addEventListener('DOMContentLoaded', function() {
    var cards = document.querySelectorAll('.item');
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', function() {
            var card = this;
            
            ShrinkCard(card, 100, 0);

            setTimeout(function() {
                FlipCard(card);
                GrowCard(card, 0, 100);
            }, 950);
        });
    }

    loadImages();
    
});

function loadImages(){
    //add liberals and conservatives and NDP and green and bloc and independents

    let numMembers = 0;
    let numToLoadAtOnce = 16;
    let thisInt = setInterval(() => {
        for(let i = 0; i < numToLoadAtOnce; i++){
            if(numMembers == memberLoadOrder.length){
                clearInterval(thisInt);
                return;
            }

            var currentID = this.document.getElementById(memberLoadOrder[numMembers] + 'NL');
            var newID = currentID.id.substring(0, currentID.id.length - 2);
            currentID.id = newID;
            numMembers++;
        }
    }, 200);
    
}

function GrowCard(theCard, fromSize, toSize){
    let currSize = fromSize;
    var interval = setInterval(function() {
        currSize += 2;
        theCard.style.transform = 'scale(' + currSize / 100 + ')';
        if (currSize >= toSize) {
            clearInterval(interval);
        }
    }, 10);
}

function ShrinkCard(theCard, fromSize, toSize){
    let currSize = fromSize;
    var interval = setInterval(function() {
        currSize -= 2;
        theCard.style.transform = 'scale(' + currSize / 100 + ')';
        if (currSize <= toSize) {
            clearInterval(interval);
        }
    }, 10);
}

function FlipCard(theCard){
    if(theCard.id != "flipped"){
        //get the child of card with the class of "card" and hide it
        theCard.querySelector('.card').style.display = 'none';
        //get the child of card with the class of "itemTitle" and hide it
        theCard.querySelector('.itemTitle').style.display = 'none';
        if(showPoliticalColor) theCard.style.color = theCard.style.backgroundColor;
        theCard.style.background = 'url(https://www.gg.ca/sites/default/files/styles/pubreg_main_image/public/elementimages/v235_19950040_badge_commons.jpg?itok=Gk0Bq3iI) no-repeat center center';
        theCard.style.backgroundSize = 'cover';
        theCard.id = "flipped";
        mpFliips++;
    }else{
        theCard.querySelector('.card').style.display = '';
        theCard.querySelector('.itemTitle').style.display = '';
        //remove background image
        if(showPoliticalColor){
            theCard.style.background = theCard.style.color;
        }else{
            theCard.style.background = '1f1f1fa3';
        }
        theCard.id = "";
        mpFliips--;
    }
    UpdateFlipCounter();
    changeFlipped(false);
}

function UpdateFlipCounter(){
    document.getElementById('numFlip').innerHTML = mpFliips;
}

function ResetCards(){
    var cards = document.querySelectorAll('.item');
    for (var i = 0; i < cards.length; i++) {
        if(cards[i].id == "flipped"){
            ResetCard(cards[i]);     
        }
    }
}

function ResetCard(theCard){
    ShrinkCard(theCard, 100, 0);
    
    setTimeout(function() {
        FlipCard(theCard);
        GrowCard(theCard, 0, 100);
    }, 950);
}

function HideLiberals(){
    for(var i = 0; i < liberals.length; i++){
        var card = document.getElementById(liberals[i]).parentElement;
        card.style.display = 'none';
    }
}

function ShowLiberals(){
    for(var i = 0; i < liberals.length; i++){
        var card = document.getElementById(liberals[i]).parentElement;
        card.style.display = '';
    }        
}


function changeLiberals(){
    if(showLiberals){
        HideLiberals();
        showLiberals = false;
    }else{
        ShowLiberals();
        showLiberals = true;
    }

    console.log("ShowLiberals");
}

function ShowConservatives(){
    for(var i = 0; i < conservatives.length; i++){
        var card = document.getElementById(conservatives[i]).parentElement;
        card.style.display = '';
    }
}

function HideConservatives(){
    for(var i = 0; i < conservatives.length; i++){
        if(document.getElementById(conservatives[i]) == null) console.log(conservatives[i]);
        var card = document.getElementById(conservatives[i]).parentElement;
        card.style.display = 'none';
    }
}

function changeConservatives(){
    if(showConservatives){
        HideConservatives();
        showConservatives = false;
    }else{
        ShowConservatives();
        showConservatives = true;
    }
}

function ShowNDP(){
    for(var i = 0; i < NDP.length; i++){
        var card = document.getElementById(NDP[i]).parentElement;
        card.style.display = '';
    }
}

function HideNDP(){
    for(var i = 0; i < NDP.length; i++){
        var card = document.getElementById(NDP[i]).parentElement;
        card.style.display = 'none';
    }
}

function changeNDP(){
    if(showNDP){
        HideNDP();
        showNDP = false;
    }else{
        ShowNDP();
        showNDP = true;
    }
}

function ShowGreen(){
    for(var i = 0; i < green.length; i++){
        var card = document.getElementById(green[i]).parentElement;
        card.style.display = '';
    }
}

function HideGreen(){
    for(var i = 0; i < green.length; i++){
        var card = document.getElementById(green[i]).parentElement;
        card.style.display = 'none';
    }
}

function changeGreen(){
    if(showGreen){
        HideGreen();
        showGreen = false;
    }else{
        ShowGreen();
        showGreen = true;
    }
}

function ShowBloc(){
    for(var i = 0; i < bloc.length; i++){
        var card = document.getElementById(bloc[i]).parentElement;
        card.style.display = '';
    } 
}

function HideBloc(){
    for(var i = 0; i < bloc.length; i++){
        if(document.getElementById(bloc[i]) == null) console.log(bloc[i]);
        var card = document.getElementById(bloc[i]).parentElement;
        card.style.display = 'none';
    }
}

function changeBloc(){
    if(showBloc){
        HideBloc();
        showBloc = false;
    }else{
        ShowBloc();
        showBloc = true;
    }
}

function ShowIndependents(){
    for(var i = 0; i < independents.length; i++){
        var card = document.getElementById(independents[i]).parentElement;
        card.style.display = '';
    }   
}

function HideIndependents(){
    for(var i = 0; i < independents.length; i++){
        var card = document.getElementById(independents[i]).parentElement;
        card.style.display = 'none';
    }
}

function changeIndependent(){
    if(showIndependents){
        HideIndependents();
        showIndependents = false;
    }else{
        ShowIndependents();
        showIndependents = true;
    }
}

function ShowFlipped(){
    let cards = document.querySelectorAll('.item');
    for (var i = 0; i < cards.length; i++) {
        if(cards[i].id == "flipped"){
            cards[i].style.display = '';
        }
    } 
}

function HideFlipped(){
    let cards = document.querySelectorAll('.item');
    for (var i = 0; i < cards.length; i++) {
        if(cards[i].id == "flipped"){
            cards[i].style.display = 'none';
        }
    } 
}

function changeFlipped(update){
    if(update){
        if(showFlipped){
            HideFlipped();
            showFlipped = false;
        }else{
            ShowFlipped();
            showFlipped = true
        }
    }else{
        if(showFlipped){
            ShowFlipped();
        }else{
            HideFlipped();
        }
    }
}


function nameSearch(){
    let search = document.getElementById('search').value;
    if(search == ""){
        if(!showLiberals) HideLiberals();
        else ShowLiberals();

        if(!showConservatives) HideConservatives();
        else ShowConservatives();

        if(!showNDP) HideNDP();
        else ShowNDP();

        if(!showGreen) HideGreen();
        else ShowGreen();

        if(!showBloc) HideBloc();
        else ShowBloc();

        if(!showIndependents) HideIndependents();
        else ShowIndependents();

        if(!showFlipped) HideFlipped();
        else ShowFlipped();

        return;
    }
            
    let cards = document.querySelectorAll('.item');
    for (var i = 0; i < cards.length; i++) {
        let name = cards[i].querySelector('.itemTitle').querySelector('.itemName').innerHTML.replace(' ', '');
        if(name.toLowerCase().includes(search.toLowerCase())){
            cards[i].style.display = '';
        }else{
            cards[i].style.display = 'none';
        }
    }
}

function ShowPoliticalColor(){
    let itemsAlreadyColored = document.getElementById(liberals[0]).parentElement.style.backgroundColor == "rgba(255, 0, 0, 0.682)";
    
    for(let i = 0; i < liberals.length; i++){
        let card = document.getElementById(liberals[i]);

        if(card == null){
            console.log(liberals[i]);
            continue;
        }

        if(card.parentElement.id == "flipped"){
            card.parentElement.style.color = itemsAlreadyColored ? "#1f1f1fa3" : "#ff0000ae";
        }else{
            card.parentElement.style.backgroundColor = itemsAlreadyColored ? "#1f1f1fa3" : "#ff0000ae";
        }
    }

    for(let i = 0; i < conservatives.length; i++){
        let card = document.getElementById(conservatives[i]);

        if(card == null){
            console.log(conservatives[i]);
            continue;
        }

        if(card.parentElement.id == "flipped"){
            card.parentElement.style.color = itemsAlreadyColored ? "#1f1f1fa3" : "#0000ffae";
        }else{
            card.parentElement.style.backgroundColor = itemsAlreadyColored ? "#1f1f1fa3" : "#0000ffae";
        }
    }

    for(let i = 0; i < NDP.length; i++){
        let card = document.getElementById(NDP[i]);

        if(card == null){
            console.log(NDP[i]);
            continue;
        }

        if(card.parentElement.id == "flipped"){
            card.parentElement.style.color = itemsAlreadyColored ? "#1f1f1fa3" : "#ff6505e2";
        }else{
            card.parentElement.style.backgroundColor = itemsAlreadyColored ? "#1f1f1fa3" : "#ff6505e2";
        }
    }

    for(let i = 0; i < green.length; i++){
        let card = document.getElementById(green[i]);

        if(card == null){
            console.log(green[i]);
            continue;
        }

        if(card.parentElement.id == "flipped"){
            card.parentElement.style.color = itemsAlreadyColored ? "#1f1f1fa3" : "#198b19e2";
        }else{
            card.parentElement.style.backgroundColor = itemsAlreadyColored ? "#1f1f1fa3" : "#198b19e2";
        }
    }

    for(let i = 0; i < bloc.length; i++){
        let card = document.getElementById(bloc[i]);

        if(card == null){
            console.log(bloc[i]);
            continue;
        }

        if(card.parentElement.id == "flipped"){
            card.parentElement.style.color = itemsAlreadyColored ? "#1f1f1fa3" : "#16dbd4e2";
        }else{
            card.parentElement.style.backgroundColor = itemsAlreadyColored ? "#1f1f1fa3" : "#16dbd4e2";
        }
    }

    for(let i = 0; i < independents.length; i++){
        let card = document.getElementById(independents[i]);

        if(card == null){
            console.log(independents[i]);
            continue;
        }

        if(card.parentElement.id == "flipped"){
            card.parentElement.style.color = itemsAlreadyColored ? "#1f1f1fa3" : "#798888e2";
        }else{
            card.parentElement.style.backgroundColor = itemsAlreadyColored ? "#1f1f1fa3" : "#798888e2";
        }
    }

}

//reload image if there was an image error
function tryAgain(img){
    setTimeout(() => {
        console.log("try again on " + img.id);
        var src = img.src;
        img.src = src;
    }, 50);
}