import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import {
	View,
	Text,
	Animated,
	Dimensions,
	SafeAreaView,
	TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const WINDOW = Dimensions.get('window');

const MoreInfo = forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false);
	const [data, setData] = useState(null);
	const [failed, setFailed] = useState(false);

	const slideAnimation = useRef(new Animated.Value(-WINDOW.width)).current;

	useImperativeHandle(ref, () => ({
		show(item) {
			setVisible(true);

			Animated.timing(slideAnimation, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start();

			setData(item);

			fetch(item.image).then(res => {
				console.log(res);
				console.log(item.image);
				if (res.url.substring(res.url.length - 3, res.url.length) === '404') {
					setFailed(true);
				} else {
					setFailed(false);
				}
			});
		},
	}));

	dismiss = () => {
		Animated.timing(slideAnimation, {
			toValue: -WINDOW.width,
			duration: 200,
			useNativeDriver: false,
		}).start(() => {
			setVisible(false);
		});
	};

	const loadText = (prefix, text) => {
		return (
			<Text>
				{`${prefix}: ${text}`}
			</Text>
		);
	};



	if (!visible) return null;

	if (data !== null) {
		const source = failed ? require('../assets/popup.png') : {uri: data.image};

		return (
			<Animated.View
				style={{
					width: WINDOW.width,
					height: WINDOW.height,
					position: 'absolute',
					backgroundColor: 'red',
					right: slideAnimation,
				}}
			>
				<SafeAreaView
					style={{
						height: '100%',
						width: '100%',
						backgroundColor: '#fff',
					}}
				>
					<View
						style={{
							height: '60%',
							width: '100%',
						}}
					>
						<FastImage style={{ height: '100%', width: '100%' }} defaultSource={require('../assets/popup.png')} source={source}  />
						<TouchableOpacity
							style={{
								position: 'absolute',
								height: 50,
								width: 50,
								alignItems: 'center',
								justifyContent: 'center',
							}}
							activeOpacity={0.8}
							onPress={() => dismiss()}
						>
							<View
								style={{
									height: 20,
									width: 5,
									borderRadius: 100,
									backgroundColor: '#fff',
									position: 'absolute',
									transform: [
										{
											rotateZ: '45deg'
										}
									]
								}}
							/>
							<View
								style={{
									height: 20,
									width: 5,
									borderRadius: 100,
									backgroundColor: '#fff',
									position: 'absolute',
									transform: [
										{
											rotateZ: '-45deg'
										}
									]
								}}
							/>
						</TouchableOpacity>
					</View>
					<View
						style={{
							paddingHorizontal: 10,
							marginTop: 10,
						}}
					>
						{loadText('ID', data.id)}
						{loadText('Phone Number', data.phoneNumber)}
						{loadText('Other Number', data.otherNumber)}
						{loadText('OwnershipCD', data.ownershipcd)}
						{loadText('CameraLabel', data.cameraLabel)}
						{loadText('ImageURL', data.image)}
						{loadText('VideoURL', data.video)}
						{loadText('WebSite', data.url)}
						{loadText('Latitude', data.latlon.lat)}
						{loadText('Longitude', data.latlon.lon)}
						{loadText('Distance (meters)', data.distance)}
						{loadText('Distance (miles)', data.milage)}
					</View>
				</SafeAreaView>
			</Animated.View>
		);
	}
});

export default MoreInfo;
