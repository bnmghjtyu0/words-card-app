import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text, Animated} from 'react-native';

const {width, height} = Dimensions.get('window');
const viewHeight = 35;

class ToastView extends Component {
  dismissHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      message: props.message !== undefined ? props.message : '',
    };
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="none">
        <Animated.View style={[styles.textContainer]}>
          <Text style={styles.defaultText}>{this.state.message}</Text>
        </Animated.View>
      </View>
    );
  }
  componentDidMount() {
    this.timingDismiss();
  }

  componentWillUnmount() {
    clearTimeout(this.dismissHandler);
  }

  timingDismiss = () => {
    this.dismissHandler = setTimeout(() => {
      this.onDismiss();
    }, 1000);
  };

  onDismiss = () => {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  };
}

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderRadius: 8,
    padding: 10,
    bottom: height / 8,
    maxWidth: width / 2,
    alignSelf: 'flex-end',
  },
  defaultText: {
    color: '#FFF',
    fontSize: 15,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
export default ToastView;
