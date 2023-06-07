/* eslint-disable */

export default function App() {
  const [ipaddr, setIpAddr] = useState(default_ipaddr);

  const port = 1337;
  const host = `${ipaddr}:${port}`;

  return (
    <View style={styles.container}>
      {/* modal for adding a new layer */}
      <Modal visible={getView() === 'add-layer'}>
        <View style={styles.centeredView}>
          <Text>Choose A Program:</Text>

          {/* avaialble programs */}
          {shard_uuids.map((name, idx) => (
            <React.Fragment key={`add-layer.shard.${idx}(${name})`}>
              <TouchableNativeFeedback
                onPress={() => {
                  setSelectedShard(idx);
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 15,
                    margin: 5,
                    backgroundColor: 'whitesmoke',
                  }}
                >
                  {selected_shard === idx && <Text>✅</Text>}
                  <Text>{name}</Text>
                </View>
              </TouchableNativeFeedback>
            </React.Fragment>
          ))}

          <Button
            onPress={async () => {
              await addLayer(
                host,
                '/stacks/active',
                shard_uuids[selected_shard],
              );
              popView();
            }}
            title="okay"
          />
        </View>
      </Modal>

      <SafeAreaView style={styles.main}>
        <expoStatusBar.StatusBar style="auto" />

        {/* connection setup */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text>Enter IP Address: </Text>
              <TextInput
                value={ipaddr}
                onChangeText={(value) => setIpAddr(value)}
                placeholder="ip address"
              />
            </View>

            <Button title="refresh" onPress={refreshState} />
            <Text>{host}</Text>
          </View>
        </View>

        {/* global variables */}
        <View style={styles.globalVariablesContainer}>
          <Text>Global Variables:</Text>
          {state.globals.variables.map((variable, idx) => (
            <React.Fragment key={`globals.variable.${idx}(${variable.name})`}>
              <Variable host={host} variable={variable} />
            </React.Fragment>
          ))}
        </View>

        {/* layers */}
        <Button
          onPress={() => {
            pushView('add-layer');
          }}
          title="add layer"
        />
        <View style={styles.activeLayersContainer}>
          <Text>Active Layers:</Text>
          {state.stacks.active.layers.map((layer, idx) => (
            <React.Fragment key={`stacks.active.layer.${id}(${idx})`}>
              <View style={styles.activeLayer}>
                <Text>
                  Layer ID:
                  {layer.id}
                </Text>
                <Text>
                  Layer Index:
                  {layer.info.index}
                </Text>
                <Text>
                  Shard:
                  {layer.info.shard_uuid}
                </Text>
                <Text>
                  Local Palette:
                  {' '}
                  {layer.info.use_local_palette ? 'true' : 'false'}
                </Text>

                <Button
                  onPress={async () => {
                    const use_local_palette = !layer.info.use_local_palette;
                    await updateActiveLayerInfo(host, layer.id, {
                      use_local_palette,
                    });
                  }}
                  title="toggle local palette"
                />
              </View>
            </React.Fragment>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
