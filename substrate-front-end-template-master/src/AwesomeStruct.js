import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentNumber, setNumber] = useState(0);
  const [formNumber, setFormNumber] = useState(0);

  const [currentText, setText] = useState('');
  const [formText, setFromText] = useState('');

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.structData(newValue => {
      console.log(newValue);
      // The storage value is an Option<u32>
      // So we have to check whether it is None first
      // There is also unwrapOr
      if (newValue.isNone) {
        setNumber('<None>');
        setText('');
      } else {
        setNumber(newValue.super_number.toNumber());
        setText(newValue.super_text.toHuman());
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={8}>
      <h1>AwesomeStruct</h1>
      <Card centered>
        <Card.Content textAlign='center'>
          <Statistic
            label='Current Number'
            value={currentNumber}
          />
             <Statistic
            label='Current Text'
            value={currentText}
          />
        </Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Input
            label='New Number'
            state='newNumber'
            type='number'
            onChange={(_, { value }) => setFormNumber(value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='New Text'
            state='newText'
            type='text'
            onChange={(_, { value }) => setFromText(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Store Awesome struct'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'storeAwesomeStruct',
              inputParams: [{"super_number":formNumber,"super_text":formText}],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function TemplateModule (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule && api.query.templateModule.structData
    ? <Main {...props} /> : null);
}
