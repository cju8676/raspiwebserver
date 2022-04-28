import React from 'react'
import { Search, /*Grid, Header, Segment*/ } from 'semantic-ui-react'


const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

function SearchBar(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state
  const { onChange, source } = props;

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const result = source.filter(src => src.props.filename.includes(data.value))
      // const guy = source[0]
      // console.log(guy)

      dispatch({
        type: 'FINISH_SEARCH',
        results: result.map(res => {
          return { "title": res.props.filename, "image": res.props.picture }
        }
        ),
      })
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  onChange(value)
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    // <Grid>
    //   <Grid.Column width={6}>
    <Search
      loading={loading}
      placeholder='Search...'
      onResultSelect={(e, data) =>
        dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
      }
      onSearchChange={handleSearchChange}
      results={results}
      value={value}
      onFocus={() => {console.log("focus")}}
    />
    //   </Grid.Column>

    //   <Grid.Column width={10}>
    // <Segment>
    //   <Header>State</Header>
    //   <pre style={{ overflowX: 'auto' }}>
    // {JSON.stringify({ loading, results, value }, null, 2)}
    //   </pre>
    // </Segment>
    //   </Grid.Column>
    // </Grid>
  )
}

export default SearchBar
