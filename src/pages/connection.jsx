import React, { useState } from 'react';
import { Text, TextInput } from 'react-native';

const defaultIpAddr = '192.168.4.31';
const port = 1337;

export default function Connection() {
  const [ipaddr, setIpAddr] = useState(defaultIpAddr);
  const host = `${ipaddr}:${port}`;

  return (
    <>
      <Text>Connection Page</Text>
      <TextInput onChange={(e) => setIpAddr(e.target.value)} value={ipaddr} />
      <Text>{host}</Text>
    </>
  );
}
