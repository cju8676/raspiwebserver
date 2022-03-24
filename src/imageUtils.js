import { Header, Card } from 'semantic-ui-react'

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
            sorted.push({year: i.props.date.substring(0, 4), panes: [i]})
        }
        // we have seen this year - add it to its respective object
        else {
            sorted.find(s => s.year === (i.props.date).substring(0, 4)).panes.push(i)
        }
    }
    return sorted;
}

// map object to Card.Group with Header
export const mapByYear = (sorted) => {
    return sorted.sort((a, b) => (a.year < b.year) ? 1 : -1).map(category => {
        return <div className='year'>
            <Header as='h2'>{category.year}</Header>
            <Card.Group>
                {category.panes
                    .sort((a, b) => new Date(a.props.date) < new Date(b.props.date) ? 1 : -1)
                    .map(pane => pane)}
            </Card.Group>
        </div>
    })
}