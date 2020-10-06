import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Switch,
  StatusBar,
  Dimensions,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import Tile from './Tile';
import MoreInfo from './MoreInfo';

const WINDOW = Dimensions.get('window');

const DATA = require('../assets/rows.json');

const InfoPage = () => {
	const [data, setData] = useState([]);
	const [latlon, setLatLon] = useState({ lat: 0, lon: 0 });
	const [type, setType] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const moreInfo = useRef();

	useEffect(() => {
    Geolocation.requestAuthorization('whenInUse');
		getLocationUser();
	}, []);

	useEffect(() => {
		const temp = DATA.data;
		const list = [];

		for (item of temp) {
			const distance = getDistance(item[14], item[13]);
			const milage = convertMeterToMile(distance);

			const listData = {
				key: item[0],
				id: item[1],
				phoneNumber: item[3],
				otherNumber: item[5],
				ownershipcd: item[8],
				cameraLabel: item[9],
				image: item[10][0],
				video: item[11],
				url: item[12],
				latlon: {
					lat: item[14],
					lon: item[13],
				},
				distance,
				milage,
			};

			list.push(listData);
		}

		// console.log('list: ', list);

		list.sort((x, y) => x.milage > y.milage);

		setData(list);

		setRefreshing(false);
	}, [latlon]);

	getLocationUser = () => {
		Geolocation.getCurrentPosition(
		      position => {
		        const {latitude, longitude} = position.coords;
		        setLatLon({
		        	lat: latitude,
		        	lon: longitude,
		        });

            console.log(position);
		      },
		      error => {
		         console.log(error);
		      },
		    );
  };

  getDistance = (endLat, endLon) => {
  	const R = 6371; // Radius of the earth
  	const latDistance = toRadians(endLat) - toRadians(latlon.lat);
    const lonDistance = toRadians(endLon) - toRadians(latlon.lon);
    const a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
            + Math.cos(toRadians(latlon.lat)) * Math.cos(toRadians(endLat))
            * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000; // convert to meters
  };

  convertMeterToMile = (value) => {
  	return value * 0.00062137;
  };

  toRadians = (degrees) => {
  	return degrees * (Math.PI/180);
  };

  viewMoreInfo = (item) => {
  	moreInfo.current.show(item);
  };

  return (
    <View>
    	    <SafeAreaView>
    				<StatusBar backgroundColor="blue" barStyle={'dark-content'} />
    				<View
    					style={{
    						flexDirection: 'row',
    						alignItems: 'center',
    						marginBottom: 10,
    						justifyContent: 'space-between',
    					}}
    				>
    					<View
    						style={{
    							flexDirection: 'row',
    							alignItems: 'center',
    						}}
    					>
    						<Text
    						style={{
    							marginHorizontal: 5,
    							fontWeight: !type ? 'bold' : 'normal',
    						}}
    					>
    						Mile
    					</Text>
    					<Switch
    						trackColor={{ false: "#767577", true: "#81b0ff" }}
    		        thumbColor={type ? "#fff" : "#fff"}
    		        ios_backgroundColor="#3e3e3e"
    		        onValueChange={() => { setType(!type) }}
    		        value={type}
    					/>
    					<Text
    						style={{
    							marginHorizontal: 5,
    							fontWeight: type ? 'bold' : 'normal',
    						}}
    					>
    						Meter
    					</Text>
    					</View>

    					<View
    						style={{
    							flexDirection: 'row',
    						}}
    					>
    						<Text>
    							{`Lat: ${latlon.lat}`}
    						</Text>
    						<Text
    							style={{
    								marginHorizontal: 5,
    							}}
    						>
    							{`Lon: ${latlon.lon}`}
    						</Text>
    					</View>
    				</View>
    				<FlatList
    					style={{
    						height: WINDOW.height,
    						width: WINDOW.width,
    					}}
    					contentInset={{ bottom: 70, }}
    					contentContainerStyle={{
    						paddingLeft: 5,
    					}}
    					onRefresh={() => {
    						setRefreshing(true);
    						getLocationUser();
    					}}
    					refreshing={refreshing}
    					numColumns={2}
    					data={data}
    					renderItem={({ item, index }) => {
    						return (
    							<Tile
    								imageUrl={item.image}
    								label={item.cameraLabel}
    								distance={item.distance}
    								milage={item.milage}
    								type={type}
    								onPress={() => {viewMoreInfo(item)}}
    							/>
    						);
    					}}
    				/>
    	    </SafeAreaView>
    	    <MoreInfo
    	    	ref={moreInfo}
    	    />
    </View>
  );
};

export default InfoPage;
