/**
 *
 * Test
 *
 */

import React, { useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import makeSelectTest from './selectors';
// import styles from './styles';

function Test() {
  // const glViewRef = useRef();
  // useEffect(() => {
  //   let scene, camera, renderer, cube, frameId;
  //   const init = (gl) => {
  //     scene = new THREE.Scene();
  //     camera = new THREE.PerspectiveCamera(
  //       75,
  //       gl.drawingBufferWidth / gl.drawingBufferHeight,
  //       0.1,
  //       1000,
  //     );
  //     camera.position.z = 5;
  //     renderer = new THREE.WebGLRenderer({ gl });
  //     renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  //     const geometry = new THREE.BoxGeometry();
  //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //     cube = new THREE.Mesh(geometry, material);
  //     scene.add(cube);
  //     const animate = () => {
  //       frameId = requestAnimationFrame(animate);
  //       cube.rotation.x += 0.01;
  //       cube.rotation.y += 0.01;
  //       renderer.render(scene, camera);
  //       gl.endFrameEXP();
  //     };
  //     animate();
  //   };
  //   glViewRef.current.onContextCreate = init;
  //   return () => cancelAnimationFrame(frameId);
  // }, []);
  // return <GLView style={{ flex: 1 }} ref={glViewRef} />;
}

Test.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  test: makeSelectTest(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Test);
