import React, { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Input, Dropdown, Menu } from 'semantic-ui-react'
import { UserContext } from './UserContext';

function SearchBar({onChange, source}) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('filename')
  const { files, tags } = useContext(UserContext);

  const timeoutRef = useRef()
  const handleSearchChange = useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    setLoading(true);
    setValue(data.value);

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        setLoading(false)
        setValue('')
        return
      }

      //const result = source.filter(src => src.props.filename.includes(data.value))
      setLoading(false)
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  onChange(value, category)
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const options = [
    { key: 'filename', text: 'Filename', value: 'filename' },
    { key: 'tag', text: 'Tag', value: 'tag' },
    { key: 'person', text: 'Person', value: 'person' },
    { key: 'type', text: 'Type', value: 'type' },
  ]

  //TODO if tag or person or TYPE, multiple select

  // TODO a get all tags and get all people call and add to global state

  useEffect(() => {
    console.log("cat updated", category)
  }, [category])

  return (
    <>
    <Input
        icon='search'
        iconPosition='left'
        action={<Dropdown floating selection basic compact options={options} defaultValue='filename' onChange={(e, { value }) => setCategory(value)} />}
        placeholder='Search...'
        loading={loading}
        size="small"
        onChange={handleSearchChange}
      />
      {category === 'tag' &&
        <div>Showing files with Tag(s): </div>
      }
      {category === 'person' &&
        <div>Showing files with Person Tag(s): </div>
      }
      {category === 'type' &&
      <>
        <h6 style={{margin: "1px"}}>Ex: 'photo', '.gif', 'live', etc.</h6>
        <div>Showing files of Type: </div>
      </>
      }
    </>
  )
}

export default SearchBar
