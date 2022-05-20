import { Header, Card } from 'semantic-ui-react'

const MONTHS_MAPPING = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}

// const MONTHS_SHORT = {
//     "01": "Jan",
//     "02": "Feb",
//     "03": "Mar",
//     "04": "Apr",
//     "05": "May",
//     "06": "Jun",
//     "07": "Jul",
//     "08": "Aug",
//     "09": "Sep",
//     "10": "Oct",
//     "11": "Nov",
//     "12": "Dec",
// }

// returns array of objects 
// [
//      {
//          year: XXXX
//          panes: [<ImagePane>, <ImagePane>, ...]
//      }
// ]
// @param img - array of ALL ImagePanes
export const sortByYear = (img) => {
    if (img.length === 0) return null;
    var sorted = [];
    // iterate through img adding each pane to its respective year category
    while (img.length !== 0) {
        const i = img.pop()
        // we have not seen this year yet
        if (!sorted.some(s => s.year === (i.props.date).substring(0, 4))) {
            sorted.push({ year: i.props.date.substring(0, 4), panes: [i] })
        }
        // we have seen this year - add it to its respective object's array
        else {
            sorted.find(s => s.year === (i.props.date).substring(0, 4)).panes.push(i)
        }
    }
    return sorted;
}

// takes in
// {
//    year: XXXX
//        panes: [<ImagePane>, ...]
// }
// sorts and adds a months sub list for every possible month
// and returns
// {
//     year:XXXX
//     months: [
//       {
//         month:XX
//         panes: [<ImagePane>, ...]
//       }
//     ]
// }
export const sortByMonth = (img) => {
    if (!img) return null;
    var sorted = {
        year: img.year,
        months: []
    };
    // iterate through mapping each pane so its respective month
    while (img.panes.length !== 0) {
        const i = img.panes.pop()
        // we have not seen this month yet
        if (!sorted.months.some(s => s.month === (i.props.date).substring(5, 7))) {
            sorted.months.push({ month: i.props.date.substring(5, 7), panes: [i] })
        }
        // we have seen this month - add it to its respective object's array
        else {
            sorted.months.find(s => s.month === (i.props.date).substring(5, 7)).panes.push(i)
        }
    }
    return sorted;
}

// map object to Card.Group with Header
export const mapByYear = (sorted) => {
    return sorted.sort((a, b) => (a.year < b.year) ? 1 : -1).map(group => {
        return <div className='year'>
            <Header as='h2'>{group.year}</Header>
            <>
                {group.months
                    .sort((a, b) => a.month < b.month ? 1 : -1)
                    .map(subgroup => {
                        return <div className='month'>
                            <Header as='h3'>{MONTHS_MAPPING[subgroup.month]}</Header>
                            <Card.Group>
                                {subgroup.panes
                                    .sort((a, b) => new Date(a.props.date) < new Date(b.props.date) ? 1 : -1)
                                    .map(pane => 
                                        <div className='pane-pad'>
                                            {pane}
                                        </div>
                                    )}
                            </Card.Group>
                        </div>
                    })}
            </>
        </div>
    })
}