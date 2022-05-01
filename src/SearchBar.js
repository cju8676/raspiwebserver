import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Dropdown } from 'semantic-ui-react'

function SearchBar(props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false);
  const { onChange, source } = props;

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
  onChange(value)
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

  return (
    <Input
      icon='search'
      iconPosition='left'
      action={<Dropdown floating selection basic compact options={options} defaultValue='filename' />}
      placeholder='Search...'
      loading={loading}
      size="small"
      onChange={handleSearchChange}
    />
  )
}

export default SearchBar
