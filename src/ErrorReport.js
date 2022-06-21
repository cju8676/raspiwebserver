import React from 'react'
import { Segment, Header, Divider, Button, TextArea, Form } from 'semantic-ui-react'

const ErrorReport = ({ message }) => {
  return (
    <div className='segment-pad'>
      <Segment>
        <Header>
          <Button color='orange' size='large' href='#home'>Back</Button>
          Error 404 - Not Found
        </Header>
      </Segment>
      <Divider />
      <Form
        action="https://formspree.io/f/mzboqdaz"
        method="POST"
      >
        <Segment>
          <TextArea
            name="error"
          >
            {message ? message : "Unexpected Error Occured"}
          </TextArea>
        </Segment>
        <Segment>
          <Button color='orange' size='large' type="submit">Submit Error Report</Button>
        </Segment>
      </Form>
    </div>
  )
}

export default ErrorReport