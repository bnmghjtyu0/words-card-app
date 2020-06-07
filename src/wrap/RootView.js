import React, {Component} from 'react';
import {StyleSheet, AppRegistry, View, Text} from 'react-native';

viewRoot = null;

class RootView extends Component {
  constructor(props) {
    super(props);
    console.log('constructor:setToast');
    viewRoot = this;
    this.state = {
      view: null,
    };
  }

  render() {
    console.log('RootView');
    return (
      <View style={styles.rootView} pointerEvents="box-none">
        {this.state.view}
      </View>
    );
  }

  static setView = (view) => {
    //此处不能使用this.setState
    viewRoot.setState({view: view});
  };
}

const originRegister = AppRegistry.registerComponent;

AppRegistry.registerComponent = (appKey, component) => {
  return originRegister(appKey, function () {
    const OriginAppComponent = component();

    return class extends Component {
      render() {
        return (
          <View style={styles.container}>
            <OriginAppComponent />
            <RootView />
          </View>
        );
      }
    };
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  rootView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
export default RootView;
