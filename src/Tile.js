import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const WINDOW = Dimensions.get('window');

const Tile = (props) => {
	const [failed, setFailed] = useState(false);

	const source = failed ? require('../assets/popup.png') : {uri: props.imageUrl};

	const distance = props.type ? `${Math.ceil(props.distance)} m` : `${Math.ceil(props.milage)} mi`;

	return (
		<TouchableOpacity
			style={{
				height: 270,
				width: WINDOW.width * 0.5 - 10,
				marginRight: 10,
				marginBottom: 10,
				borderRadius: 10,
				overflow: 'hidden',
			}}
			activeOpacity={0.8}
			onPress={props.onPress}
		>
			<FastImage style={{ height: '100%', width: '100%' }} defaultSource={require('../assets/popup.png')} onError={() => { setFailed(true) }} source={source}  />
			<View
				style={{
					position: 'absolute',
					backgroundColor: 'rgba(29, 32, 34, 0.6)',
					bottom: 0,
					width: '100%',
					padding: 10,
					height: '34%',
					justifyContent: 'center',
				}}
			>
				<Text
					style={{
						color: '#fff',
					}}
				>
					{props.label}
				</Text>
				<Text
					style={{
						color: '#fff',
						marginTop: 5,
					}}
				>
					{distance}
				</Text>
			</View>
		</TouchableOpacity>
	)
}

export default Tile;
