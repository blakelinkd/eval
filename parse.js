const fs = require('fs')

const inputJSON = fs.readFileSync('./input.json', 'utf8')
const input = JSON.parse(inputJSON)
const in_events = input.data.sporting_events
const in_slate_events = input.data.slate_events
const inputEvents = Object.values(in_events)
const slateEvents = Object.values(in_slate_events)

const isSlateEvent = (id) => {
    slateEvents.forEach((event) => {
        event.iGameCodeGlobalId.forEach((_id) => {
            return id.match(_id)
        })
    })
    return false;
}

const groupBy = (array, key) => {

    return array.reduce((result, currentValue) => {

        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        )

        return result;
    }, {})
}

const getOrdinal = (n) => {
    switch (n) {
        case '2nd Game':
            return 'SecondGame'
        case '3rd Game':
            return 'thirdGame'
        case '4th Game':
            return 'fourthGame'
        case '5th Game':
            return 'fifthGame'
        case '6th Game':
            return 'sixthGame'
        case 'First Two Games':
            return 'First2Games'
        case 'First Three Games':
            return 'First3Games'
        case 'Full Game':
            return 'fullTimeGameEvent'
        default:
            return null;
    }
}

const convertDoc = (input) => {
    const finalEvents = []
    Object.values(input).forEach((value) => {
        console.log(value)
        let output = {
            event: {
                id: value.iGameCodeGlobalId,
                gameType: 18,
                date: new Date(value.date).toISOString(),
                time: value.time,
                gameID: value.iGameCodeGlobalId,
                homeTeam: value.homeTeam,
                homeTeamName: value.homeTeamName,
                homeTeamCity: value.homeTeamCity,
                homeTeamLogoUri: value.homeTeamLogoUri,
                visitingTeam: value.visitingTeam,
                visitingTeamName: value.visitingTeamName,
                visitingTeamCity: value.visitingTeamCity,
                visitingTeamLogoUri: value.visitingTeamLogoUri,
                teams: `${value.homeTeam} @ ${value.visitingTeam}`,
                sp: value.sp,
                section: 'featured',
                segment: value.segment,
                bestOf: value.szGameType.slice(value.szGameType.search(/\d/)),
                gameMode: value.eGameMode,
                assoc: '',
                tournamentDisplayName: value.szTournamentDisplayName,
                segmentKey: getOrdinal(value.segment)

            },
            isSlate: isSlateEvent(value.iGameCodeGlobalId),
            isStacked: '',
            sp: value.sp
        }
        finalEvents.push(output)
    })

    return FinalEvents
}


// first group by teams then by szGameType

const teams = groupBy(inputEvents, 'teams')

Object.keys(teams).forEach((key) => {
    teams[key] = groupBy(teams[key], 'szGameType')
})
// TODO events that cover multiple games need to be pulled out of their current group and put into their own group
const output = teams
fs.writeFileSync('test.json', JSON.stringify(output, null, 2))
console.log('ouput file is test.json')





