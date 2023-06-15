import React from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';

import {
  Text,
  Surface,
  RadioButton,
} from 'react-native-paper';

import {
  withSafeHeaderStyles,
  withSafeFooterStyles,
} from 'src/components/safeRegions';

import {
  Variable,
} from 'src/components/variables';

import {
  useInstanceGlobal,
  useInstanceGlobalVariable,
  useInstanceAudio,
  useInstanceAudioSource,
  useInstanceAudioSourceStandardVariable,
  useInstanceAudioSourceVariable,
  useInstanceApi,
} from 'src/hooks/citySkies';

// create a safe header that will bump the content down below the main header
const SafeHeader = withSafeHeaderStyles(View);
const SafeFooter = withSafeFooterStyles(View);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  surface: {
    borderRadius: 10,
    margin: 10,
  },
});

function GlobalVariable({ variableId }) {
  const [info, loading] = useInstanceGlobalVariable(variableId);
  const [, {
    setGlobalVariable,
  }] = useInstanceApi();
  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable
      info={info}
      onChange={(value) => {
        setGlobalVariable(variableId, value)
          .catch(console.error);
      }}
    />
  );
}

function GlobalSettings() {
  const [global, loading] = useInstanceGlobal();

  if (loading === true) {
    return (
      <>
        <SafeHeader />
        <Text>Loading</Text>
      </>
    );
  }

  const {
    variables: {
      ids,
    },
  } = global;

  return (
    <>
      <Text variant="titleMedium">Variables</Text>
      {ids.map((variableId) => (
        <React.Fragment key={variableId}>
          <Surface style={styles.surface}>
            <GlobalVariable variableId={variableId} />
          </Surface>
        </React.Fragment>
      ))}
    </>
  );
}

function AudioSourceStandardVariable({ sourceId, variableId }) {
  const [info, loading] = useInstanceAudioSourceStandardVariable(sourceId, variableId);
  const [, {
    setAudioSourceStandardVariable,
  }] = useInstanceApi();

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable
      info={info}
      onChange={(value) => {
        setAudioSourceStandardVariable(sourceId, variableId, value)
          .catch(console.error);
      }}
    />
  );
}

function AudioSourceVariable({ sourceId, variableId }) {
  const [info, loading] = useInstanceAudioSourceVariable(sourceId, variableId);
  const [, {
    setAudioSourceVariable,
  }] = useInstanceApi();

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable

      info={info}
      onChange={(value) => {
        setAudioSourceVariable(sourceId, variableId, value)
          .catch(console.error);
      }}
    />
  );
}

function AudioSource({ sourceId }) {
  const [source, loading] = useInstanceAudioSource(sourceId);

  console.log(source, loading)

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    variables: {
      ids: variableIds,
      total: variableTotal,
    },
    standardVariables: {
      ids: standardIds,
      total: standardTotal,
    },
  } = source;

  return (
    <View>
      <Text variant="titleMedium">Standard Variables</Text>
      {standardIds.map((variableId) => (
        <React.Fragment key={variableId}>
          <Surface style={styles.surface}>
            <AudioSourceStandardVariable sourceId={sourceId} variableId={variableId} />
          </Surface>
        </React.Fragment>
      ))}

      <Text variant="titleMedium">Variables</Text>
      {variableIds.map((variableId) => (
        <React.Fragment key={variableId}>
          <Surface style={styles.surface}>
            <AudioSourceVariable sourceId={sourceId} variableId={variableId} />
          </Surface>
        </React.Fragment>
      ))}
    </View>
  );
}

function AudioSettings() {
  const [audio, loading] = useInstanceAudio();
  const [, {
    selectAudioSource,
  }] = useInstanceApi();

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    sources: {
      ids,
      selected,
    },
  } = audio;

  return (
    <>
      <Text variant="titleMedium">Sources</Text>

      <Surface style={styles.surface}>
        {ids.map((sourceId) => (
          <React.Fragment key={sourceId}>
            <View style={{ flexDirection: 'row' }}>
              <Text>{sourceId}</Text>
              <RadioButton
                value={sourceId}
                status={(selected === sourceId) ? 'checked' : 'unchecked'}
                onPress={() => {
                  selectAudioSource(sourceId)
                    .catch(console.error);
                }}
              />
            </View>
          </React.Fragment>
        ))}

      </Surface>

      <Text variant="titleMedium">{`Selected Source: ${selected}`}</Text>
      <AudioSource sourceId={selected} />
    </>
  );
}


export default function GlobalPage() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <SafeHeader />

        <Text variant="titleLarge">Global Values</Text>
        <GlobalSettings />

        <Text variant="titleLarge">Audio Control</Text>
        <AudioSettings />

        <SafeFooter />
      </ScrollView>
    </View>
  )
}
