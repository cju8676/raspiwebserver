import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Dropdown, Label } from 'semantic-ui-react'

function SearchBar({ onChange, source, shownTags }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('filename')
  const [mobile, setMobile] = useState(false)

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

  const handleMobile = () => {
    if (window.innerWidth < 560) setMobile(true)
    else setMobile(false)
  }

  useEffect(() => {
    window.addEventListener('resize', handleMobile)
    return () => {
      clearTimeout(timeoutRef.current)
      window.removeEventListener('resize', handleMobile)
    }
  }, [])

  const options = [
    { key: 'filename', text: mobile ? '' : 'Filename', content: 'Filename', value: 'filename' },
    { key: 'tag', text: mobile ? '' : 'Tag', content: 'Tag', value: 'tag' },
    { key: 'person', text: mobile ? '' : 'Person', content: 'Person', value: 'person' },
    { key: 'type', text: mobile ? '' : 'Type', content: 'Type', value: 'type' },
  ]

  return (
    <>
      <Input
        icon='search'
        iconPosition='left'
        action={<Dropdown floating selection compact options={options} defaultValue='filename' onChange={(e, { value }) => setCategory(value)} header="Category:"/>}
        placeholder='Search...'
        loading={loading}
        size="small"
        onChange={handleSearchChange}
      />
      {(category === 'tag' || category === 'person') &&
        <div className='search'>
          <div>
            {`Showing files with ${category === 'person' ? 'Person' : ''} Tag(s):`}
          </div>
          <div>
            {shownTags.map(shown => <Label color={shown.color}>{shown.name}</Label>)}
          </div>
        </div>
      }
      {category === 'type' &&
        <>
          <h6 style={{ margin: "1px" }}>Ex: 'photo', '.gif', 'live', etc.</h6>
          <div>Showing files of Type: </div>
        </>
      }
    </>
  )
}

export default SearchBar
